# How LLMs Actually Work

A visual, interactive guide to how large language models are built — from raw internet text to a conversational assistant.

**Live site:** https://ynarwal.github.io/how-llms-work/

Based on Andrej Karpathy's [Intro to Large Language Models](https://www.youtube.com/watch?v=zjkBMFhNj_g) lecture.

---

## What's inside

- **Data Collection** — how the web is scraped and filtered into training data (Common Crawl, FineWeb)
- **Tokenization** — how text is broken into subword tokens via Byte Pair Encoding (BPE)
- **Neural Network Training** — the loss function, gradient descent, and what a forward pass looks like
- **Inference & Sampling** — how the model generates text token by token, and how temperature works
- **The Base Model** — what a model knows after pre-training and what it can't do yet
- **Post-Training** — RLHF, instruction tuning, and how a base model becomes an assistant
- **LLM Psychology** — hallucinations, context windows, and how to think about what models "know"
- **RAG** — retrieval-augmented generation: embeddings, vector search, and context injection
- **Full Pipeline Summary** — end-to-end visual of every stage

---

## Files

| File | Description |
|------|-------------|
| `index.html` | Main site (v2 redesign) |
| `v1.html` | Original dark-theme version |
| `transcript.txt` | Full Karpathy lecture transcript |
| `council.py` | LLM council fact-checker (runs via `uv run council.py`) |
| `report.html` | Latest council fact-check report |

---

## Vibe check

The code and content in this repo is mostly LLM-generated (Claude via Claude Code). The ideas, direction, and editorial decisions are mine — the implementation was largely written by AI. The council fact-checker exists precisely because of this: automated content warrants automated verification.
