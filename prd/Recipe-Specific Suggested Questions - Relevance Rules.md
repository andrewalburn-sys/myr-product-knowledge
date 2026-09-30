---
kb_id: recipe-specific-suggested-questions
title: Recipe-Specific Suggested Questions — Relevance Rules
authority: canonical
status: draft-v1
owner: Andrew Alburn
audience:
  - product
  - design
  - engineering
  - qa
applies_to:
  - production
  - demo
last_reviewed: 2026-09-30
supersedes: []
superseded_by: null
related_code:
  - src/assistant/smartRecipeSuggestions.ts
related_docs:
  - prd/PRD - MyRecipes Assistant.md
  - prd/Assistant Follow-Up Suggestions - Relevance Rules.md
---

# Recipe-Specific Suggested Questions — Relevance Rules

**Status:** Draft v1  
**Parent PRD:** `poc/PRD - Agentic Recipe Assistant.md`  
**Last updated:** July 24, 2026

---

## 1. Purpose

This document defines how the MyRecipes Assistant chooses suggested questions on a recipe page.

The goal is not to fill a fixed number of suggestion slots. The goal is to offer a small set of questions that are demonstrably useful for the recipe currently in view. Every suggestion must be supported by evidence in that recipe's ingredients, directions, equipment, timing, yield, or other available metadata.

This specification refines FR4 and FR7 of the parent PRD. The parent PRD remains the source of truth for the overall assistant experience.

## 2. Core Principle

**No evidence, no suggestion.**

A suggested question may appear only when the system can identify the recipe detail that made the question relevant. Generic categories such as substitution, technique, scaling, or make-ahead are candidate families—not permission to display a generic prompt.

It is better to show one or two strong questions than three weak ones. The interface must never pad the list with irrelevant suggestions merely to reach a target count.

## 3. Recipe Signals

Before generating questions, the system creates a structured set of signals from the recipe.

| Signal group | What to inspect | Examples |
|---|---|---|
| Ingredients | Distinctive, restrictive, expensive, uncommon, or easily substituted ingredients | bourbon, buttermilk, fresh herbs, active dry yeast |
| Techniques | Methods that require judgment or are unfamiliar to many cooks | proofing dough, tempering eggs, searing, broiling |
| Failure points | Places where timing, temperature, texture, or sequence materially affects the result | overcooking salmon, curdling a sauce, dense rolls |
| Equipment | Tools that may not be universally available | air fryer, Dutch oven, stand mixer, food processor |
| Timing | Long rests, marinades, chilling, thawing, or make-ahead opportunities | overnight rise, 30-minute marinade |
| Doneness and safety | Reliable cues for completion where the recipe benefits from them | internal temperature, visual doneness, texture |
| Dietary constraints | Actual ingredients that block a common dietary need | butter or milk for dairy-free; meat for vegetarian |
| Yield and portions | A stated serving or yield that can be meaningfully changed | 12 rolls, serves 4 |
| Storage and leftovers | Components or finished dishes whose quality changes when stored or reheated | fried coatings, dressed salads, baked bread |
| Recipe metadata | Title, description, tags, cuisine, time, and author notes | weeknight, no-bake, freezer-friendly |

Signals must come from the recipe payload. The system must not infer that an ingredient or technique is present solely because it is common in similar recipes.

## 4. Candidate Question Rules

The system generates a pool of candidates from the extracted signals. Each candidate records the rule that created it and its supporting evidence.

### 4.1 Ingredient substitution

Generate only for an ingredient explicitly present in the ingredient list.

Prefer ingredients that are:

- uncommon or unlikely to be in a typical pantry;
- expensive or seasonal;
- alcohol-based;
- a common allergen or dietary blocker;
- structurally important but known to have workable alternatives.

Avoid substitution questions for water, salt, or another trivial staple unless the ingredient has a special function in the recipe.

Example: if bourbon appears in a maple-bourbon glaze, suggest “What can I use instead of bourbon?” Do not suggest a sour cream substitution unless sour cream is present.

### 4.2 Dietary adaptation

Generate only when:

- the recipe contains a specific ingredient that conflicts with the dietary goal; and
- a plausible adaptation exists without misrepresenting the dish.

The question and its evidence must name the blocking ingredient or ingredients internally, even if the user-facing copy is shorter.

Example: “Can I make this dairy-free?” is eligible when butter or milk is present. It is not eligible merely because dairy-free is a popular request.

### 4.3 Technique and failure prevention

Generate when a direction contains a technique with a meaningful judgment point or likely failure mode.

Useful question patterns include:

- “How do I know when the dough has risen enough?”
- “How do I keep the salmon from drying out?”
- “What should the sauce look like before I add the cream?”

Prefer questions tied to a specific step over broad prompts such as “Any cooking tips?”

### 4.4 Doneness

Generate when doneness is consequential and the recipe supplies or supports a reliable cue.

Prefer the safest and most useful cue available: temperature when appropriate, then texture or visual indicators. Do not fabricate food-safety thresholds.

### 4.5 Equipment alternatives

Generate when the recipe requires a specialized appliance or tool and there is a credible alternative method.

Example: an air-fryer recipe may support “Can I make this in the oven?” A standard skillet does not normally justify “What can I use instead of a skillet?”

### 4.6 Timing, prep, and make-ahead

Generate when the recipe contains a long wait, marinade, proof, chill, thaw, or a component that can reasonably be prepared in advance.

Questions should be specific to the actual timing decision:

- “Can the dough rise overnight in the refrigerator?”
- “Can I make the glaze ahead?”
- “Do I need to thaw the salmon first?”

Do not offer a generic “Can I make this ahead?” when the recipe provides no meaningful make-ahead opportunity.

### 4.7 Scaling

Generate only when the recipe has a reliable serving or yield value and the ingredient quantities can be scaled meaningfully.

Prefer a likely target based on the current yield, such as doubling a small recipe or halving a large one. Avoid arbitrary fixed targets that may be nonsensical for the recipe.

Scaling should rank below a recipe-specific technique or failure-prevention question unless the user has expressed a household-size preference.

### 4.8 Storage and reheating

Generate when storage or reheating could materially affect texture, safety, or preparation planning.

Prefer a specific question such as “How do I reheat these without drying them out?” over “How do I store this?”

## 5. Hard Eligibility Checks

Every candidate must pass all of these checks before scoring:

1. **Evidence exists:** The cited ingredient, direction, equipment item, yield, or timing detail appears in the recipe data.
2. **Recipe-specific:** The question would not be equally relevant to almost every recipe.
3. **Answerable:** The assistant has enough recipe context to produce a useful answer or can conservatively state a limitation.
4. **No contradiction:** The question does not assume an ingredient, method, or condition that conflicts with the recipe.
5. **Not already answered:** The recipe does not clearly and fully answer the question in its directions or notes.
6. **Real decision or risk:** The answer can change what the cook buys, prepares, does, or watches for.
7. **Actionable:** The answer can provide a concrete next step, cue, quantity, or alternative.
8. **Safe:** The suggestion does not invite an unsupported food-safety or dietary claim.
9. **Nonredundant:** It does not substantially duplicate another higher-quality candidate.

A failure on any hard check removes the candidate. A low score cannot be rescued by fluent wording.

## 6. Relevance Scoring

Candidates that pass the hard checks receive a relevance score:

`score = specificity + likely difficulty + outcome impact + actionability + evidence confidence + user fit - obviousness - redundancy`

Use a 0–3 scale for each positive factor and penalty:

| Factor | High-score meaning |
|---|---|
| Specificity | Names or clearly targets a distinctive ingredient, step, or decision in this recipe |
| Likely difficulty | Addresses a technique or judgment point many cooks may struggle with |
| Outcome impact | The answer could prevent failure or materially improve the result |
| Actionability | The answer leads to a concrete action, substitution, cue, or measurement |
| Evidence confidence | Support is explicit and unambiguous in the recipe |
| User fit | Matches known session context or preferences without violating recipe evidence |
| Obviousness penalty | The answer is already obvious from the recipe or common UI data |
| Redundancy penalty | Another candidate serves nearly the same user need |

Only candidates above the configured quality threshold may appear. Select up to three highest-scoring candidates while maintaining diversity of user need. Do not show multiple substitutions or multiple versions of the same technique question when a stronger mix is available.

## 7. Candidate Record

For debugging and evaluation, every displayed suggestion should be traceable to a record like:

```ts
type RecipeQuestionCandidate = {
  question: string;
  run: string;
  rule:
    | "ingredient_substitution"
    | "dietary_adaptation"
    | "technique"
    | "failure_prevention"
    | "doneness"
    | "equipment"
    | "timing"
    | "scaling"
    | "storage";
  evidence: {
    source: "ingredient" | "step" | "equipment" | "yield" | "metadata";
    value: string;
  }[];
  scores: {
    specificity: number;
    likelyDifficulty: number;
    outcomeImpact: number;
    actionability: number;
    evidenceConfidence: number;
    userFit: number;
    obviousnessPenalty: number;
    redundancyPenalty: number;
  };
  relevanceScore: number;
};
```

This record is for internal inspection and analytics; only the polished question is shown to the user.

## 8. Selection Pipeline

1. Normalize the full recipe payload.
2. Extract recipe signals.
3. Generate candidates from evidence-bound rules.
4. Apply hard eligibility checks.
5. Score the remaining candidates.
6. Remove semantic duplicates.
7. Select a diverse set of up to three candidates above the threshold.
8. Polish wording without changing the candidate's meaning or evidence.
9. Validate the final wording against the recipe one last time.
10. Display fewer suggestions if fewer candidates pass.

An LLM may help re-rank or polish candidates, but it must not invent candidates without recipe evidence. The deterministic evidence and eligibility layer remains authoritative.

## 9. Safe Fallback Behavior

If the available recipe payload is too thin to support strong questions:

- show fewer suggestions;
- offer a grounded action such as “Scale this recipe” only when yield data supports it;
- invite the user to ask their own question; or
- show no suggested questions.

Never fall back to a static list of ingredient, dietary, or technique prompts.

## 10. Examples

### Air Fryer Salmon with Maple-Bourbon Glaze

Strong candidates:

- “Do I need to thaw the salmon first?” — supported when the recipe discusses frozen or thawed salmon.
- “What can I use instead of bourbon?” — supported by bourbon in the glaze.
- “How do I know when the salmon is done without drying it out?” — supported by the air-frying step and doneness risk.
- “Can I make the glaze ahead?” — supported by a separately prepared glaze.

Weak candidates:

- “What can I use instead of sour cream?” — sour cream is not present.
- “Can I make this vegetarian?” — changes the defining ingredient and is unlikely to preserve the recipe's identity.
- “Any tips?” — not specific enough.

### Classic Dinner Rolls

Strong candidates:

- “Can I use active dry yeast instead of RapidRise yeast?” — supported when RapidRise yeast is listed.
- “How do I know when the dough has doubled?” — supported by a proofing step.
- “Can I let the dough rise overnight?” — supported by the rise schedule.
- “Why isn’t my dough rising?” — supported by yeast and proofing as a likely failure point.

Weak candidates:

- “How do I make this dairy-free?” — eligible only if dairy is actually present and a credible adaptation exists.
- “Scale to 6 servings” — weak if the recipe is expressed as a roll yield and six servings is ambiguous.

## 11. Evaluation and Acceptance Criteria

The system is ready when:

- 100% of displayed questions have inspectable supporting recipe evidence.
- No question refers to an ingredient, method, or tool absent from the recipe.
- The system shows fewer than three questions when fewer than three pass the threshold.
- Questions are not already fully answered by visible recipe instructions or notes.
- Selected questions cover distinct user needs when multiple strong needs exist.
- Reviewers judge the majority of displayed questions as useful before beginning the recipe, while cooking it, or when planning substitutions or timing.
- A regression set includes recipes with sparse data, unusual ingredients, specialized equipment, dietary blockers, multi-stage techniques, and simple recipes where no suggestions may be the correct outcome.

## 12. Product Guardrails

- Suggestions assist; they do not interrupt or auto-open the assistant.
- User-visible answers remain labeled AI-generated in v1, per FR7.
- The full recipe is passed into the cooking Q&A tool.
- Dietary and safety claims follow the parent PRD's conservative-failure standard.
- Suggestion quality is measured by relevance and utility, not by the number displayed.
