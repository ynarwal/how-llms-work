#!/usr/bin/env -S uv run
# /// script
# requires-python = ">=3.11"
# dependencies = ["openai"]
# ///
"""
LLM Council — fact-checks index.html using multiple models via OpenRouter.
Each model independently reviews the content and flags inaccuracies.
A final model synthesises the verdicts into a report.

Usage:
    export OPENROUTER_API_KEY=sk-or-...
    uv run council.py
"""

import os
import json
import re
import datetime
from html.parser import HTMLParser
from openai import OpenAI

API_KEY = os.environ.get("OPENROUTER_API_KEY")
if not API_KEY:
    raise SystemExit("Set OPENROUTER_API_KEY environment variable first.")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=API_KEY,
)

COUNCIL = [
    ("GPT-4.1",          "openai/gpt-4.1"),
    ("Gemini 2.5 Pro",   "google/gemini-2.5-pro-preview-05-06"),
    ("Llama 4 Maverick", "meta-llama/llama-4-maverick"),
]

SYNTHESISER = ("Claude Opus 4.7", "anthropic/claude-opus-4-7")

# ── Extract readable text from HTML ──────────────────────────────────────────

class TextExtractor(HTMLParser):
    SKIP_TAGS = {"script", "style", "noscript"}

    def __init__(self):
        super().__init__()
        self.chunks = []
        self._skip = 0

    def handle_starttag(self, tag, attrs):
        if tag in self.SKIP_TAGS:
            self._skip += 1

    def handle_endtag(self, tag):
        if tag in self.SKIP_TAGS and self._skip:
            self._skip -= 1

    def handle_data(self, data):
        if not self._skip:
            stripped = data.strip()
            if stripped:
                self.chunks.append(stripped)

def extract_text(html: str) -> str:
    p = TextExtractor()
    p.feed(html)
    text = "\n".join(p.chunks)
    # Collapse excessive blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


# ── Prompts ───────────────────────────────────────────────────────────────────

REVIEWER_PROMPT = """\
You are a rigorous fact-checker reviewing an educational web guide about how \
large language models work. The guide is aimed at a technical but general audience.

Your job: read the content below and identify any factual inaccuracies, \
misleading claims, outdated figures, or oversimplifications that cross into \
being wrong. Do NOT flag things that are intentionally simplified for teaching.

For each issue you find, return a JSON array like:
[
  {{
    "claim": "exact quote or close paraphrase of the claim",
    "verdict": "wrong | misleading | outdated | unverifiable",
    "explanation": "brief explanation of what is incorrect and what the truth is"
  }}
]

If you find no issues, return an empty array: []
Return ONLY the JSON array, no other text.

--- CONTENT START ---
{content}
--- CONTENT END ---
"""

SYNTHESISER_PROMPT = """\
You are synthesising fact-check reports from {n} different LLMs that each \
independently reviewed the same educational guide about how LLMs work.

Here are their findings:

{reports}

Your task:
1. Identify claims flagged by multiple models (higher confidence issues).
2. Note claims flagged by only one model (lower confidence, worth reviewing).
3. Dismiss any flags that look like over-pedantic misreadings of intentional \
   simplification.
4. Produce a clean markdown report with sections:
   - ## High Confidence Issues  (flagged by 2+ models)
   - ## Lower Confidence / Worth Reviewing  (flagged by 1 model)
   - ## Summary  (one paragraph overall assessment)

Be concise. Each issue should be one bullet point.
"""


# ── Core logic ────────────────────────────────────────────────────────────────

def call(model_id: str, prompt: str, label: str) -> str:
    print(f"  → Calling {label}...", flush=True)
    resp = client.chat.completions.create(
        model=model_id,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )
    return resp.choices[0].message.content.strip()


def parse_json_array(text: str) -> list:
    # Strip markdown code fences if present
    text = re.sub(r"^```[a-z]*\n?", "", text.strip())
    text = re.sub(r"\n?```$", "", text.strip())
    try:
        result = json.loads(text)
        return result if isinstance(result, list) else []
    except json.JSONDecodeError:
        return []


def main():
    html_path = os.path.join(os.path.dirname(__file__), "index.html")
    with open(html_path, encoding="utf-8") as f:
        html = f.read()

    print("Extracting text from index.html...")
    content = extract_text(html)
    print(f"  {len(content):,} characters extracted.\n")

    prompt = REVIEWER_PROMPT.format(content=content)

    reviews = {}
    print("Convening the council:")
    for label, model_id in COUNCIL:
        raw = call(model_id, prompt, label)
        issues = parse_json_array(raw)
        reviews[label] = issues
        print(f"     {label}: {len(issues)} issue(s) flagged")

    # Build report section for synthesiser
    reports_text = ""
    for label, issues in reviews.items():
        reports_text += f"\n### {label}\n"
        if issues:
            for issue in issues:
                reports_text += (
                    f"- **Claim:** {issue.get('claim','?')}\n"
                    f"  **Verdict:** {issue.get('verdict','?')}\n"
                    f"  **Explanation:** {issue.get('explanation','?')}\n"
                )
        else:
            reports_text += "- No issues found.\n"

    synth_prompt = SYNTHESISER_PROMPT.format(
        n=len(COUNCIL), reports=reports_text
    )

    print(f"\nSynthesising with {SYNTHESISER[0]}...")
    synthesis = call(SYNTHESISER[1], synth_prompt, SYNTHESISER[0])

    # Write report
    report_path = os.path.join(os.path.dirname(__file__), "council_report.md")
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    council_names = ", ".join(l for l, _ in COUNCIL)
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(f"# LLM Council Fact-Check Report\n")
        f.write(f"**Generated:** {timestamp}  \n")
        f.write(f"**Council:** {council_names}  \n")
        f.write(f"**Synthesised by:** {SYNTHESISER[0]}\n\n---\n\n")
        f.write(synthesis)
        f.write("\n\n---\n\n## Raw Findings by Model\n")
        f.write(reports_text)

    print(f"\nDone. Report written to council_report.md")


if __name__ == "__main__":
    main()
