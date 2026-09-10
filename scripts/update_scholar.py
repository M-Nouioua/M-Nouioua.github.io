#!/usr/bin/env python3
"""Refresh src/data/scholar.json from the Google Scholar profile.

The site renders whatever is in that JSON file, so this script is the only thing
that needs to know how Scholar's HTML is shaped.

Google Scholar has no public API and rate-limits/CAPTCHAs datacenter IP ranges,
which is what GitHub Actions runners use. That is handled deliberately: if the
profile does not come back in a shape we recognise, the script leaves the
existing JSON untouched and exits 0. A skipped run is therefore a no-op that
keeps the last known-good numbers on the site, never a failure that breaks the
build and never a partial overwrite with worse data.

Usage:
    python scripts/update_scholar.py            # refresh if Scholar responds
    python scripts/update_scholar.py --check    # fetch and report, write nothing
"""

from __future__ import annotations

import argparse
import html
import json
import os
import re
import sys
import urllib.error
import urllib.request
from datetime import date
from pathlib import Path

USER_ID = "tEKyL0UAAAAJ"
PROFILE = "https://scholar.google.com/citations?user=" + USER_ID + "&hl=en"
OUT_PATH = Path(__file__).resolve().parent.parent / "src" / "data" / "scholar.json"

# how many cards the Publications grid shows: the newest papers, then the
# most-cited ones to fill out the rest (matching how the section was curated by
# hand before this script existed)
N_RECENT = 10
N_TOP_CITED = 9

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
)

# long journal names, shortened to keep the cards to a couple of lines
ABBREVIATIONS = {
    "The International Journal of Advanced Manufacturing Technology":
        "Int. J. of Advanced Manufacturing Technology",
    "Proceedings of the Institution of Mechanical Engineers, Part C: Journal of Mechanical Engineering Science":
        "Proc. IMechE Part C: J. Mechanical Engineering Science",
    "Journal of the Brazilian Society of Mechanical Sciences and Engineering":
        "J. Brazilian Soc. of Mechanical Sciences and Engineering",
}

# a floor on what counts as a plausible profile, so a CAPTCHA page or a
# half-rendered response can never be written out as real data
MIN_CITATIONS = 500
MIN_PUBLICATIONS = 15

# The headline publication count is the peer-reviewed record, not Scholar's raw
# row count. Scholar carries a handful of extra rows for the same profile:
# entries with no venue at all (duplicate or unpublished records) plus abstract
# books and internal reports. Excluding those is what makes this number agree
# with the count on the CV.
EXCLUDE_VENUE = re.compile(r"Book of Abstracts|Laboratoire", re.I)


def is_publication(row: dict) -> bool:
    venue = row["journal"].strip()
    return bool(venue) and not EXCLUDE_VENUE.search(venue)


def fetch(url: str, timeout: int = 45) -> str:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": UA,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        },
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read().decode("utf-8", errors="replace")


def strip_tags(fragment: str) -> str:
    return html.unescape(re.sub(r"<[^>]+>", "", fragment)).strip()


def parse_stats(page: str) -> dict[str, int]:
    """Pull the All-column values out of the citation-metrics table."""
    cells = re.findall(r'class="gsc_rsb_std">([\d,]+)</td>', page)
    # the table is Citations / h-index / i10-index, each with All and Since columns
    if len(cells) < 6:
        raise ValueError(f"metrics table not found (got {len(cells)} numeric cells)")
    values = [int(c.replace(",", "")) for c in cells]
    return {"citations": values[0], "hIndex": values[2], "i10Index": values[4]}


def parse_rows(page: str) -> list[dict]:
    """Pull one record per publication row out of a profile listing."""
    rows = []
    for chunk in page.split('class="gsc_a_tr"')[1:]:
        cid = re.search(r"citation_for_view=" + USER_ID + r":([A-Za-z0-9_-]+)", chunk)
        title = re.search(r'class="gsc_a_at"[^>]*>(.*?)</a>', chunk, re.S)
        greys = re.findall(r'class="gs_gray">(.*?)</div>', chunk, re.S)
        cites = re.search(r'class="gsc_a_ac[^"]*"[^>]*>([^<]*)</a>', chunk)
        year = re.search(r'class="gsc_a_h[^"]*"[^>]*>([^<]*)</span>', chunk)
        if not (cid and title and len(greys) >= 2):
            continue

        venue = strip_tags(greys[-1])
        # Scholar appends the year to the venue line; the card shows it separately
        venue = re.sub(r",?\s*\d{4}\s*$", "", venue).strip()
        for long_name, short in ABBREVIATIONS.items():
            venue = venue.replace(long_name, short)

        count = strip_tags(cites.group(1)) if cites else ""
        rows.append({
            "title": strip_tags(title.group(1)),
            "journal": venue,
            "year": (year.group(1).strip() if year else ""),
            "authors": strip_tags(greys[0]),
            # 'New' makes the card render a year badge instead of a citation count
            "citations": count if count.isdigit() and int(count) > 0 else "New",
            "link": (
                "https://scholar.google.com/citations?view_op=view_citation"
                "&hl=en&user=" + USER_ID + "&citation_for_view=" + USER_ID + ":" + cid.group(1)
            ),
            "_id": cid.group(1),
            "_cites": int(count) if count.isdigit() else 0,
        })
    return rows


def build() -> dict:
    # default sort is by citation count, so this gives the most-cited papers
    by_citations = fetch(PROFILE + "&view_op=list_works&pagesize=100")
    stats = parse_stats(by_citations)
    top_cited = parse_rows(by_citations)

    by_date = parse_rows(fetch(PROFILE + "&view_op=list_works&sortby=pubdate&pagesize=100"))

    if stats["citations"] < MIN_CITATIONS:
        raise ValueError(f"implausible citation count: {stats['citations']}")
    if len(top_cited) < MIN_PUBLICATIONS:
        raise ValueError(f"only {len(top_cited)} publications parsed")

    # newest first, then the most-cited papers that are not already shown
    selected = by_date[:N_RECENT]
    seen = {p["_id"] for p in selected}
    for pub in top_cited:
        if len(selected) >= N_RECENT + N_TOP_CITED:
            break
        if pub["_id"] not in seen:
            selected.append(pub)
            seen.add(pub["_id"])

    stats["publications"] = sum(1 for row in top_cited if is_publication(row))
    for pub in selected:
        pub.pop("_id", None)
        pub.pop("_cites", None)

    return {
        "updatedAt": date.today().isoformat(),
        "source": "Google Scholar",
        "profileUrl": "https://scholar.google.com/citations?user=" + USER_ID,
        "stats": stats,
        "publications": selected,
    }


def write_run_summary(data: dict) -> None:
    """Surface the numbers on the Actions run page, when running in Actions."""
    path = os.environ.get("GITHUB_STEP_SUMMARY")
    if not path:
        return
    s = data["stats"]
    with open(path, "a", encoding="utf-8") as fh:
        fh.write(
            f"### Scholar data refreshed\n\n"
            f"| Metric | Value |\n| --- | --- |\n"
            f"| Citations | {s['citations']} |\n"
            f"| h-index | {s['hIndex']} |\n"
            f"| i10-index | {s['i10Index']} |\n"
            f"| Publications | {s['publications']} |\n\n"
            f"{len(data['publications'])} cards, as of {data['updatedAt']}.\n"
        )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true",
                        help="fetch and report without writing the file")
    args = parser.parse_args()

    try:
        data = build()
    except (urllib.error.URLError, urllib.error.HTTPError) as exc:
        print(f"::warning::Scholar unreachable ({exc}); keeping existing data")
        return 0
    except ValueError as exc:
        print(f"::warning::Scholar response not usable ({exc}); keeping existing data")
        return 0

    s = data["stats"]
    print(f"citations={s['citations']} h={s['hIndex']} i10={s['i10Index']} "
          f"works={s['publications']} cards={len(data['publications'])}")

    if args.check:
        print("--check given, nothing written")
        return 0

    rendered = json.dumps(data, indent=2, ensure_ascii=False) + "\n"

    if OUT_PATH.exists():
        previous = json.loads(OUT_PATH.read_text(encoding="utf-8"))
        # updatedAt alone changing is not a content change worth deploying for
        if {k: v for k, v in previous.items() if k != "updatedAt"} == \
           {k: v for k, v in data.items() if k != "updatedAt"}:
            print("no change")
            return 0

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(rendered, encoding="utf-8")
    write_run_summary(data)
    print("wrote src/data/scholar.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())
