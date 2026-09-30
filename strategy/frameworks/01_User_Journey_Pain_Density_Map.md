# 01 User Journey Pain Density Map

## Purpose

Identify where AI matters most by mapping the cooking journey, then scoring each stage by how painful, frequent, high-stakes, and underserved it is.

## Why It Matters Here

MyRecipes has pain points that span the full cooking journey, not just recipe discovery. This framework prevents a broad "AI everywhere" strategy and instead reveals the stages where intelligence can materially change user outcomes.

## How To Use It

1. Break the journey into stages.
2. For each persona, document the most important pain points in each stage.
3. Score each stage across a shared set of dimensions.
4. Compare scores across personas and across the total audience.
5. Translate the highest-density areas into product priorities.

## Inputs

- Persona motivations, pain points, and AI trust levels
- Journey stages from discovery through execution
- Current opportunity set
- Known alternative behaviors and tools used today

## Evaluation Lens

Score each stage from `1` to `5` on:

- `Pain intensity`: how frustrating the stage is
- `Frequency`: how often the problem occurs
- `Failure cost`: how disruptive failure is
- `Emotional stakes`: how stressful or confidence-damaging failure feels
- `Alternative weakness`: how poorly current tools solve it

Optional:

- `Audience weight`: how much of the total audience this pain affects
- `AI fit`: how well AI can improve the outcome versus conventional product design

## MyRecipes Application

### Recommended Journey Stages

Use these stages for MyRecipes:

1. Discover
2. Decide
3. Plan
4. Shop
5. Prep
6. Cook / Execute
7. Recover
8. Reflect / Save / Learn

### Persona-Level Pain Summary

| Persona | Highest-density stages | Why |
| --- | --- | --- |
| Established Home Cook | Discover, Decide | Needs meaningful novelty without disruption; trust is fragile |
| Weeknight Reducer | Decide, Plan, Recover | Decision collapse, feasibility anxiety, and dinner failure risk |
| Enthusiast | Discover, Decide | Inspiration is abundant, conviction is scarce |
| System Thinker | Plan, Shop, Recover | Weekly planning and disruption management are the product |

### MyRecipes Scoring Table

| Journey stage | Pain intensity | Frequency | Failure cost | Emotional stakes | Alternative weakness | Overall density | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Discover | 3 | 5 | 2 | 3 | 3 | Medium | Constant activity, but not always the point of failure |
| Decide | 5 | 5 | 4 | 5 | 4 | Very high | This is where "too many options" becomes actual friction |
| Plan | 5 | 4 | 4 | 4 | 5 | Very high | Highest leverage for Weeknight Reducer and System Thinker |
| Shop | 4 | 4 | 4 | 4 | 4 | High | Weak handoff from planning to real-world execution |
| Prep | 2 | 4 | 2 | 2 | 2 | Low | Less differentiated versus the rest of the journey |
| Cook / Execute | 4 | 5 | 5 | 5 | 4 | Very high | Static recipes break under real-life conditions |
| Recover | 5 | 3 | 5 | 5 | 5 | Very high | Existing tools rarely help when the plan breaks |
| Reflect / Save / Learn | 3 | 3 | 2 | 2 | 3 | Medium | Important for long-term personalization and the core loop |

### What This Says About MyRecipes

The highest-density zones are:

1. `Decide`
2. `Plan`
3. `Cook / Execute`
4. `Recover`
5. `Shop`

This means the product opportunity is larger than recipe discovery. The winning strategy is not better browsing alone; it is reducing friction from "what should I make?" to "dinner happened."

## Strategic Implications

- Discovery should not be treated as the whole product.
- Decision and recovery deserve top billing because they carry both high pain and high emotional stakes.
- Planning and shopping are major differentiators for the System Thinker and Weeknight Reducer, not secondary utilities.
- Reflect / learn matters because it powers future personalization, even if it is not the top acute pain point today.

## Decision Prompts

- Where is the user's stress highest, not just their activity highest?
- Which stages fail often enough to change behavior or cause churn?
- Which pain points are still being solved manually across other tools?
- Where can AI collapse complexity, not just summarize options?

## Output Artifact

A prioritized journey map that identifies where MyRecipes should over-invest in AI and where conventional product design is sufficient.
