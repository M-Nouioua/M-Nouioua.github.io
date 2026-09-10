#!/usr/bin/env python3
"""Refresh the Publications grid in src/data/research.json.

Which papers are mine comes from the ORCID record, which is curated by hand and
is therefore authoritative. How often each one is cited comes from OpenAlex,
looked up by DOI.

That split is deliberate. OpenAlex's *author* record for this ORCID has a second
Mourad Nouioua merged into it -- a data-mining researcher whose work shows up
under the same author id -- so its author-level metrics and work list are both
inflated. Going DOI by DOI from ORCID sidesteps the bad merge entirely: every
paper here is one the profile owner has claimed.

This script never touches the "stats" block. The headline citation count,
h-index and i10-index are Google Scholar figures, which are higher than
OpenAlex's because Scholar indexes more citing sources, and Scholar has no API
and blocks datacenter IPs so it cannot be read from CI. Those four numbers stay
under manual control; only the card list is automated.

Usage:
    python scripts/update_publications.py            # refresh the card list
    python scripts/update_publications.py --check    # fetch and report only
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import date
from pathlib import Path

ORCID = "0000-0003-0439-2112"
ORCID_API = f"https://pub.orcid.org/v3.0/{ORCID}/works"
OPENALEX_API = "https://api.openalex.org/works"
CONTACT = "mourad.nouioua@kfupm.edu.sa"
DATA_PATH = Path(__file__).resolve().parent.parent / "src" / "data" / "research.json"

# the grid shows the newest papers first, then the most-cited ones, which is how
# the section was curated before it was automated
N_RECENT = 10
N_TOP_CITED = 9

# refuse to publish a suspiciously short list rather than gut the grid
MIN_PAPERS = 20

# long journal names, shortened to keep each card to a couple of lines
ABBREVIATIONS = {
    "The International Journal of Advanced Manufacturing Technology":
        "Int. J. of Advanced Manufacturing Technology",
    "Proceedings of the Institution of Mechanical Engineers Part C Journal of Mechanical Engineering Science":
        "Proc. IMechE Part C: J. Mechanical Engineering Science",
    "Proceedings of the Institution of Mechanical Engineers, Part C: Journal of Mechanical Engineering Science":
        "Proc. IMechE Part C: J. Mechanical Engineering Science",
    "Journal of the Brazilian Society of Mechanical Sciences and Engineering":
        "J. Brazilian Soc. of Mechanical Sciences and Engineering",
}

# preprint servers and code/data deposits are not journal articles
REPOSITORY = re.compile(
    r"zenodo|arxiv|ssrn|research\s*square|biorxiv|medrxiv|preprints?\.org|figshare|techrxiv",
    re.I,
)


def get_json(url: str, headers: dict[str, str], timeout: int = 60):
    request = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


def orcid_dois() -> list[str]:
    """Every DOI on the ORCID record: the authoritative list of my papers."""
    payload = get_json(ORCID_API, {"Accept": "application/json"})
    dois = []
    for group in payload.get("group", []):
        for external in (group.get("external-ids") or {}).get("external-id", []):
            if external.get("external-id-type") == "doi":
                dois.append(external["external-id-value"].strip().lower())
                break
    return sorted(set(dois))


def openalex_works(dois: list[str]) -> list[dict]:
    """Look the DOIs up in OpenAlex, in batches, for venue and citation counts."""
    headers = {"User-Agent": f"m-nouioua.github.io publication sync ({CONTACT})"}
    fields = ("doi,title,display_name,publication_year,publication_date,type,"
              "cited_by_count,primary_location,authorships")
    works: list[dict] = []
    for i in range(0, len(dois), 25):
        batch = dois[i:i + 25]
        doi_filter = "doi:" + "|".join("https://doi.org/" + d for d in batch)
        url = (f"{OPENALEX_API}?per-page=200&select={fields}"
               f"&filter={urllib.parse.quote(doi_filter, safe=':|/.')}")
        works.extend(get_json(url, headers).get("results", []))
    return works


def venue_of(work: dict) -> str:
    source = (work.get("primary_location") or {}).get("source") or {}
    name = (source.get("display_name") or "").strip()
    for long_name, short in ABBREVIATIONS.items():
        name = name.replace(long_name, short)
    return name


def initials(full_name: str) -> str:
    """'Ahmed Aly Diaa Sarhan' -> 'AAD Sarhan', matching the existing cards."""
    parts = [p for p in re.split(r"\s+", full_name.strip()) if p]
    if len(parts) < 2:
        return full_name.strip()
    given, surname = parts[:-1], parts[-1]
    return "".join(p[0].upper() for p in given if p[0].isalpha()) + " " + surname


def authors_of(work: dict, limit: int = 5) -> str:
    names = [initials((a.get("author") or {}).get("display_name") or "")
             for a in work.get("authorships", [])]
    names = [n for n in names if n]
    if len(names) > limit:
        return ", ".join(names[:limit]) + ", et al."
    return ", ".join(names)


def to_card(work: dict) -> dict:
    cited = work.get("cited_by_count") or 0
    doi = (work.get("doi") or "").strip()
    return {
        "title": (work.get("title") or work.get("display_name") or "").strip(),
        "journal": venue_of(work),
        "year": str(work.get("publication_year") or ""),
        "authors": authors_of(work),
        # 'New' makes the card show a year badge instead of a citation count
        "citations": str(cited) if cited > 0 else "New",
        "link": doi if doi.startswith("http") else f"https://doi.org/{doi}",
    }


def build_cards() -> list[dict]:
    dois = orcid_dois()
    if not dois:
        raise ValueError("ORCID record returned no DOIs")

    works = openalex_works(dois)
    matched = {(w.get("doi") or "").replace("https://doi.org/", "").lower()
               for w in works if w.get("doi")}
    for missing in sorted(set(dois) - matched):
        print(f"::notice::{missing} is on the ORCID record but not in OpenAlex; skipped")

    # journal articles only: no preprints, datasets or software deposits
    papers = [w for w in works
              if w.get("type") == "article"
              and venue_of(w)
              and not REPOSITORY.search(venue_of(w))]
    if len(papers) < MIN_PAPERS:
        raise ValueError(f"only {len(papers)} journal articles resolved")

    # full date, not just year: 14 of these papers share 2026, and sorting by
    # year alone left that group in whatever order the API returned
    newest = sorted(papers, key=lambda w: (w.get("publication_date") or ""), reverse=True)
    most_cited = sorted(papers, key=lambda w: (w.get("cited_by_count") or 0), reverse=True)

    selected, seen = [], set()
    for work in newest[:N_RECENT]:
        selected.append(work)
        seen.add(work["doi"])
    for work in most_cited:
        if len(selected) >= N_RECENT + N_TOP_CITED:
            break
        if work["doi"] not in seen:
            selected.append(work)
            seen.add(work["doi"])

    return [to_card(w) for w in selected]


def write_run_summary(cards: list[dict], total_changed: bool) -> None:
    path = os.environ.get("GITHUB_STEP_SUMMARY")
    if not path:
        return
    with open(path, "a", encoding="utf-8") as fh:
        fh.write(f"### Publications {'refreshed' if total_changed else 'unchanged'}\n\n")
        fh.write(f"{len(cards)} cards, from the ORCID record with OpenAlex citation counts.\n\n")
        fh.write("| Year | Cites | Paper |\n| --- | --- | --- |\n")
        for c in cards[:10]:
            title = c["title"][:70].replace("|", r"\|")
            fh.write(f"| {c['year']} | {c['citations']} | {title} |\n")
        fh.write("\nHeadline stats are Google Scholar figures and are not touched by this job.\n")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true",
                        help="fetch and report without writing the file")
    args = parser.parse_args()

    try:
        cards = build_cards()
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as exc:
        print(f"::warning::ORCID/OpenAlex unreachable ({exc}); keeping existing data")
        return 0
    except (ValueError, KeyError, json.JSONDecodeError) as exc:
        print(f"::warning::response not usable ({exc}); keeping existing data")
        return 0

    print(f"resolved {len(cards)} cards "
          f"({sum(1 for c in cards if c['citations'] == 'New')} uncited)")
    for card in cards[:5]:
        print(f"  {card['year']}  {card['citations']:>5}  {card['title'][:62]}")

    if args.check:
        print("--check given, nothing written")
        return 0

    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    changed = data.get("publications") != cards
    if not changed:
        print("no change")
        write_run_summary(cards, False)
        return 0

    # stats stay exactly as they are: those are manually maintained Scholar figures
    data["publications"] = cards
    data["publicationsUpdatedAt"] = date.today().isoformat()
    DATA_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n",
                         encoding="utf-8")
    write_run_summary(cards, True)
    print("wrote src/data/research.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())
