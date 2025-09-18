from __future__ import annotations

import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE_PATH = ROOT / "thesis" / "Pitch_Comparisons_New_Scores.txt"
OUTPUT_DIR = ROOT / "thesis" / "data"
OUTPUT_PATH = OUTPUT_DIR / "pista_winds2ventures_scores.csv"

NAME_PATTERN = re.compile(r"^[A-Za-z][A-Za-z0-9& ]+$")
SKIP_TITLES = {
    "Pista Scores",
    "Pista Score",
    "Winds2Ventures’s Scores",
    "Winds2Ventures's Scores",
    "Winds2Ventures Scores",
    "WindsVentures Score",
    "WindsVentures Scores",
    "WindsVentures’s Score",
    "Pista",
}


def parse_scores(text: str) -> list[tuple[str, float, float]]:
    current_name: str | None = None
    pista_score: float | None = None
    scores: list[tuple[str, float, float]] = []

    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue

        if line in {"Contents", "These pitches were taken from a student pitches competition.", "Pitch Comparisons between my system(Pista)", "1", "2", "3"}:
            continue

        if line.isdigit():
            # page markers and numbering
            continue

        if NAME_PATTERN.match(line) and line not in SKIP_TITLES and "Score" not in line and "Transcript" not in line:
            current_name = line
            pista_score = None
            continue

        if line.startswith("• Overall Score:") and current_name:
            value = line.split(":", 1)[1].split("/", 1)[0].strip()
            pista_score = float(value)
            continue

        if line.startswith("• Investibility:") and current_name and pista_score is not None:
            value = line.split(":", 1)[1].split("/", 1)[0].strip()
            w2v_score = float(value)
            scores.append((current_name, pista_score, w2v_score))
            current_name = None
            pista_score = None

    return scores


def main() -> None:
    text = SOURCE_PATH.read_text(encoding="utf-8")
    extracted = parse_scores(text)

    if not extracted:
        raise SystemExit("No pitch scores found; please check source format.")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    with OUTPUT_PATH.open("w", newline="", encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["Pitch", "PistaOverall", "Winds2VenturesInvestibility"])
        writer.writerows(extracted)

    print(f"Extracted {len(extracted)} pitches to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
