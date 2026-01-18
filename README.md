# WikiWarfare

Forensic analysis of narrative risk in Wikipedia articles for AI training safety

---

## The Wikipedia-AI Pipeline

Wikipedia is a primary source for training nearly every large language model today. From GPT to Gemini to Claude, virtually all frontier AI systems ingest Wikipedia as foundational training data.

More critically, Wikipedia serves as a **truth anchor** for AI systems. When models encounter conflicting information, Wikipedia's apparent neutrality and encyclopedic authority causes it to be weighted as ground truth. This makes Wikipedia uniquely powerful in shaping what AI systems believe to be factual.

> This creates a critical vulnerability: biased or manipulated Wikipedia articles don't just misinform human readers. They systematically embed those biases into the AI systems that billions of people rely on for information.

## What This Project Does

WikiWarfare performs forensic analysis of Wikipedia articles for **narrative risk**: the potential for article content to embed biased, one-sided, or manipulative framings into AI training data.

We compare **Primary** articles (topics of geopolitical sensitivity or active information conflict) against **Baseline** articles (similar topics with more balanced coverage) to identify systematic patterns of narrative manipulation.

Each article is scored across six dimensions that capture different ways editorial choices can bias AI training outcomes. These aren't measures of factual accuracy, they measure how article structure and language choices affect what models learn.

## How Analysis Works

Each Wikipedia article is analyzed using **GPT-5.2** with a specialized evaluation prompt. The complete article text is provided to the model along with strict instructions for forensic narrative analysis.

Key instructions from the prompt:

> *"You are an analytical evaluator of Wikipedia articles with the explicit goal of identifying AI training–relevant narrative risk, not general bias criticism or moral judgment."*

> *"Think like a compiler or forensic analyst. Be precise, restrained, and literal."*

The model outputs a structured JSON with scores (1-5) for each of the six metrics, exact quoted evidence from the article, and brief explanations.

## A Proposal: Narrative Risk Indicators for Wikipedia

Wikipedia already enforces content policies like NPOV, but these are applied retroactively through human review. We propose a **Narrative Risk Indicator** system: a visible, standardized metric displayed on every article, similar to how NutriScore labels help consumers quickly assess food products.

**How it would work:**

1. **Continuous Analysis**: Each Wikipedia article is automatically analyzed against narrative risk metrics, producing a simple visual indicator that readers can see at a glance.

2. **Edit-Time Guardrails**: When an editor submits changes that would significantly increase any risk metric, the edit is automatically flagged for peer review. The higher the potential risk increase, the more reviewers required for approval.

3. **Transparency**: Readers gain immediate insight into an article's editorial balance, while editors receive real-time feedback on how their contributions affect narrative risk.

This shifts Wikipedia's quality control from purely reactive moderation to proactive, metric-driven oversight, protecting both human readers and the AI systems trained on Wikipedia's content.

## The Six Risk Metrics

Each metric is scored from 1 (minimal risk) to 5 (severe risk). Higher scores indicate greater potential for the article to embed problematic patterns into AI training.

### NPOV Deviation

Measures departure from Wikipedia's Neutral Point of View policy. High scores indicate the article presents contested claims as settled facts, or frames narratives from a particular viewpoint rather than maintaining editorial neutrality.

### Emotive Language

Detects dense, high-valence moral language and vivid harm descriptors that create strong emotional responses. Even when attributed, such language creates 'sticky tokens' that models may reproduce without preserving attribution boundaries.

### Certainty Inflation

Identifies narrator-voice declaratives that compress legal, scientific, or evidentiary uncertainty into categorical claims. Models trained on this style learn to present contested conclusions as default facts rather than hypotheses.

### Attribution Balance

Evaluates whether multiple perspectives receive symmetric treatment. Imbalanced attribution stacks institutional voices on one side while summarizing opposition in single clauses, teaching models to weight sources asymmetrically.

### Source Asymmetry

Assesses the diversity of the evidentiary ecosystem. Heavy reliance on NGOs, advocacy-aligned commentary, or single epistemic 'lanes' creates monoculture risk where models absorb one narrative as the sole authoritative account.

### Dehumanization Cues

Flags group-characterization tokens, collective attributions, and essentializing framings. Even when used critically, repeated exposure to such language is a pathway for model contamination into generalized 'group guilt' patterns.

## Overall Narrative Risk

The **Overall Narrative Risk** score is the arithmetic mean of all six metric scores. This provides a single summary measure of an article's aggregate potential to contaminate AI training with biased framings. Articles scoring 4-5 represent extreme cases where contested characterizations are encoded as settled facts, creating systematic bias in any model trained on the content.

| Score | Risk Level |
|-------|------------|
| 1 | Low Risk |
| 2 | Moderate |
| 3 | Elevated |
| 4 | High |
| 5 | Severe |
