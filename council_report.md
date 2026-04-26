# LLM Council Fact-Check Report
**Generated:** 2026-04-26 10:51  
**Council:** GPT-4.1, Gemini 2.5 Pro, Llama 4 Maverick  
**Synthesised by:** Claude Opus 4.7 (reviewed anonymised inputs)

---

# Fact-Check Synthesis Report

## High Confidence Issues (flagged by 2+ models)

- **Common Crawl "2.7 billion pages by 2024"** (Reviewers A, C): Misrepresents the scale. The 2.7B figure corresponds to a single crawl dump (likely the one processed for FineWeb), not the cumulative archive since 2007, which is vastly larger.
- **GPT-4 vocabulary of 100,277 tokens** (Reviewers A, B): OpenAI has not officially confirmed GPT-4's vocabulary size. The 100,277 figure is the `cl100k_base` tokenizer size associated with GPT-3.5/GPT-4 era models, but attributing it specifically to GPT-4 is unverified.
- **Llama 3: 405B params, 15T tokens** (Reviewers A, B): Reviewer B claims only 70B was public as of mid-2024, though Llama 3.1 405B was in fact released publicly in July 2024 with a 15T-token training set — so this claim is actually **correct** and the flags appear to be outdated on the reviewers' part. Worth verifying but likely defensible.
- **GPT-2 training cost (~$40K) and "same quality for ~$100" today** (Reviewers A, C): The $100 figure is a dramatic underestimate unless referring to a reduced-scale reproduction (e.g., Karpathy's nanoGPT runs). Needs clarification that this refers to small-scale reproductions, not full GPT-2 quality.
- **"Imitating a skilled developer-labeler"** (Reviewers A, C): Misleading framing — coding ability comes primarily from pre-training, not from SFT labelers. SFT shapes style/behavior, not underlying skill.

## Lower Confidence / Worth Reviewing (flagged by 1 model)

- **44TB FineWeb = 15T tokens** (Reviewer C): FineWeb is reportedly ~15T tokens in its standard release; Reviewer C's "22 trillion" claim may itself be inaccurate. Worth verifying against HuggingFace's published figures.
- **GPT-2 trained on 100B tokens** (Reviewer C): Original GPT-2 (WebText, ~40GB) is typically estimated at 20–30B tokens, so 100B does appear overstated.
- **Embedding size "~1,000–4,000"** (Reviewer B): Range is narrow; frontier models often exceed 8,000. Reasonable to broaden the range.
- **PII removal including "named individuals"** (Reviewer C): Legitimate clarification — full removal of all named persons is infeasible and not what filtering pipelines actually do.
- **SFT duration "hours not months"** (Reviewer B): Reasonable simplification for pedagogy; borderline over-pedantic.
- **RLHF producing "more honest" outputs** (Reviewer B): Valid concern — RLHF optimizes for preferred responses, not truthfulness, and can reinforce sycophancy/hallucination.

## Dismissed as Over-Pedantic

- Reviewer A's flag on "model doesn't think" — this is a standard, accepted pedagogical simplification.
- Reviewer A's flag on "learning grammar, facts, reasoning patterns implicitly" — appropriately hedged in the original.
- Reviewer A's "modern frontier models" flag — the claim is intentionally general and accurate.

## Summary

The guide is largely sound as an educational overview, but several specific numerical claims need correction or clarification. The most serious issues are the **GPT-2-to-$100 cost comparison** (needs context about scale), the **Common Crawl page count** (conflates a single dump with the full archive), and the **"imitating a developer-labeler" framing** (understates pre-training's role). The GPT-4 tokenizer and Llama 3 specs are defensible but should be sourced. Several reviewer flags target intentional simplifications appropriate for an educational context and can be dismissed. Overall, the guide would benefit from tightening ~5 specific factual claims while retaining its pedagogical framing.

---

## Raw Findings by Model

### GPT-4.1 (was Reviewer B)
- **Claim:** Llama 3: 405B params, 15T tokens.
  **Verdict:** misleading
  **Explanation:** As of June 2024, the largest publicly disclosed Llama 3 model has 70B parameters. There is no public evidence that a 405B parameter Llama 3 model exists. The 405B figure may refer to a rumored or internal model, but this is not confirmed.
- **Claim:** GPT-4 uses a vocabulary of 100,277 tokens, built via the Byte Pair Encoding (BPE) algorithm.
  **Verdict:** misleading
  **Explanation:** GPT-4's tokenizer is based on a variant of Byte Pair Encoding called 'Byte-level BPE' or 'Unigram Language Model' depending on the implementation, and the exact vocabulary size and algorithm details are not publicly confirmed by OpenAI. The 100,277 figure is accurate for GPT-3.5's 'cl100k_base' tokenizer, but it's not officially confirmed for GPT-4.
- **Claim:** Each token ID maps to a learned vector of ~1,000–4,000 numbers called its embedding.
  **Verdict:** misleading
  **Explanation:** While embedding sizes vary, most large LLMs (e.g., GPT-3, GPT-4, Llama 2/3) use embedding sizes in the range of 2,048 to 8,192. The lower bound of 1,000 is plausible, but 4,000 is not a typical upper bound for current frontier models; some use much larger embeddings. The range is too narrow and may mislead about actual model configurations.
- **Claim:** The model is learning grammar, facts, reasoning patterns — all implicitly from token prediction.
  **Verdict:** misleading
  **Explanation:** While LLMs do learn to model grammar and can encode some factual and reasoning patterns, their ability to perform reasoning is limited and often brittle. The statement may overstate the degree to which LLMs learn robust reasoning abilities from next-token prediction alone.
- **Claim:** Supervised Fine-Tuning (SFT)... Duration: hours (not months).
  **Verdict:** misleading
  **Explanation:** While SFT is much faster than pre-training, for very large models and large datasets, SFT can take days, not just hours. The claim that it takes only hours is an oversimplification and could be misleading for large-scale models.
- **Claim:** RLHF... The language model is optimized via reinforcement learning to score higher — producing responses that are more helpful, better structured, and more honest.
  **Verdict:** misleading
  **Explanation:** RLHF can improve helpfulness and structure, but it does not guarantee more honesty. RLHF can sometimes reinforce plausible-sounding but incorrect or biased outputs if those are preferred by raters or the reward model. The claim overstates the reliability of RLHF for honesty.

### Gemini 2.5 Pro (was Reviewer C)
- **Claim:** Common Crawl have been crawling the web since 2007 — indexing 2.7 billion pages by 2024.
  **Verdict:** misleading
  **Explanation:** This figure refers to the number of pages in a single 2023 Common Crawl dump that was processed for the FineWeb dataset. It is not the total number of pages indexed by Common Crawl since 2007, which is a vastly larger and unstated number. The claim misrepresents the scale of the full Common Crawl archive.
- **Claim:** After aggressive filtering, you end up with about 44 terabytes — roughly 10 consumer hard drives worth of text — representing ~15 trillion tokens.
  **Verdict:** wrong
  **Explanation:** The 44TB FineWeb dataset contains approximately 22 trillion tokens, not 15 trillion. The 15 trillion token figure is the size of the training dataset for Meta's Llama 3 model. The guide incorrectly conflates the size of the public FineWeb dataset with the proprietary Llama 3 training mix.
- **Claim:** PII Removal ... find ... and named individuals.
  **Verdict:** misleading
  **Explanation:** This claim overstates the capabilities of PII removal. While systems attempt to remove sensitive information, removing all 'named individuals' is technically infeasible and would damage the dataset's utility. The process is imperfect and focuses on PII patterns (like names next to addresses), not the wholesale removal of all proper names.
- **Claim:** GPT-2 (2019): 1.6B params, 100B tokens, ~$40K to train.
  **Verdict:** wrong
  **Explanation:** The original GPT-2 was trained on the WebText dataset, which contained about 40GB of text. This corresponds to an estimated 20-30 billion tokens, not 100 billion. The 100B token figure is a significant overstatement of GPT-2's training data size.
- **Claim:** Today: same quality [as GPT-2] for ~$100.
  **Verdict:** wrong
  **Explanation:** Training a 1.5B parameter model from scratch to GPT-2's quality still costs thousands of dollars on modern hardware, not ~$100. This figure is a dramatic underestimate and may be a misinterpretation of the cost to train a much smaller, 'toy' model, not one equivalent to the original large GPT-2.
- **Claim:** ChatGPT is a statistical simulation of the human labelers OpenAI hired... When it answers a coding question, it's imitating what a skilled developer-labeler would write.
  **Verdict:** misleading
  **Explanation:** This framing significantly downplays the role of pre-training. The model's core knowledge and skills (e.g., coding ability) are learned during pre-training on vast internet data. The Supervised Fine-Tuning (SFT) stage primarily teaches the model to behave like an assistant and adopt a specific style; it does not create the underlying skill from scratch.

### Llama 4 Maverick (was Reviewer A)
- **Claim:** Organizations like Common Crawl have been crawling the web since 2007 — indexing 2.7 billion pages by 2024.
  **Verdict:** outdated
  **Explanation:** Common Crawl has been crawling the web since 2007, but the exact number of pages indexed by 2024 is not verifiable. However, Common Crawl's own statistics show they have been releasing regular crawls, with the number of pages indexed growing over time. The figure 2.7 billion might be an underestimation or an outdated number.
- **Claim:** GPT-4 uses a vocabulary of 100,277 tokens
  **Verdict:** outdated
  **Explanation:** The exact vocabulary size of GPT-4 is not publicly disclosed by OpenAI. The figure 100,277 is likely referring to an earlier model or an approximation.
- **Claim:** GPT-2 (2019): 1.6B params, 100B tokens, ~$40K to train. Today: same quality for ~$100.
  **Verdict:** misleading
  **Explanation:** The cost to train a model to the same quality as GPT-2 has decreased significantly, but stating it now costs ~$100 is an oversimplification. The actual cost depends on various factors including hardware, electricity costs, and the specific model architecture.
- **Claim:** Llama 3: 405B params, 15T tokens.
  **Verdict:** unverifiable
  **Explanation:** The specific details about Llama 3 (e.g., its parameter count and training data size) are not publicly confirmed by the creators. While the claim might be based on available information, it cannot be verified without an official statement.
- **Claim:** Modern frontier models: hundreds of billions of parameters, trillions of tokens.
  **Verdict:** unverifiable
  **Explanation:** While it's true that many recent large language models have hundreds of billions of parameters and are trained on trillions of tokens, the exact numbers for 'modern frontier models' can vary and are not always publicly disclosed.
- **Claim:** The model doesn't 'think' about what to say. It computes a probability distribution over all possible next tokens and samples from it.
  **Verdict:** misleading
  **Explanation:** This statement is a simplification that is generally considered accurate in the context of explaining how LLMs work. However, it could be seen as misleading if taken to imply that the model has no internal processes or representations. The model does process and transform the input through complex neural network layers.
- **Claim:** When it answers a coding question, it's imitating what a skilled developer-labeler would write.
  **Verdict:** misleading
  **Explanation:** While the model is trained on data that includes outputs from skilled developers, saying it 'imitates' them might not fully capture the complexity of how it generates code. The model generates text based on patterns learned from its training data, which includes a wide range of coding examples.
