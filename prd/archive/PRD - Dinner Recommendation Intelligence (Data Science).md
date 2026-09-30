# PRD — Dinner Recommendation Intelligence (Data Science)

**Status:** Draft v0.1 — Data Science discovery handoff  
**Product owner:** Andrew Alburn  
**Data Science lead:** Mike Olson  
**Last updated:** September 22, 2026  
**User-facing entry point:** “What’s for dinner tonight?”  
**Parent experience:** [[PRD - Dinner Decision Engine]] (`poc/PRD - Dinner Decision Engine.md`)

**Related:** `poc/PRD - Dinner Decision Engine.md` · `poc/PRD - User Recommendation Preferences.md` · `poc/PRD - Photo-Based Recipe Discovery.md` · `poc/PRD - Agentic Recipe Assistant.md` · `PRD - Assistant Semantic Query Planner.md` · `08_MyRecipes_AI_Strategy_Synthesis.md` · `07A_Moments_of_Truth_Synthesis.md`

---

## 1. Purpose

This document defines the problem, required behavior, inputs, outputs, evaluation framework, and product guardrails for the recommendation intelligence behind **“What’s for dinner tonight?”** It is a handoff to the Data Science team, not a prescribed modeling solution.

Data Science owns proposing how to retrieve, score, rank, and evaluate candidates. This PRD defines what the system must accomplish for the product promise to be credible.

The broader Dinner Decision Engine PRD defines the user experience: the Assistant returns three recipes, explains why each was selected, and lets the user refresh or refine the result. This document focuses on the production intelligence required to make the **first three recipes** strong enough that the user should not need to refresh or refine them.

---

## 2. Terminology

The recommendation system uses two complementary sources of preference data. They must remain distinct in implementation and discussion.

### 2.1 Data Science Flavor Profile

The **Data Science Flavor Profile** is the existing Data Science capability that uses a user’s saved recipes to infer the kinds of recipes that user may like. The internal technique, representation, and inputs are owned by Data Science and are intentionally not prescribed here.

This PRD refers to that capability by name rather than describing it as a specific vector implementation.

### 2.2 User Recommendation Preferences

**User Recommendation Preferences** is the user-editable product feature defined in `poc/PRD - User Recommendation Preferences.md`. It contains explicit information such as:

- dietary restrictions;
- disliked ingredients;
- favorite cuisines and flavors;
- cooking-style preferences;
- pantry staples.

These explicit inputs could complement the inferred Data Science Flavor Profile in a later release. They are not required for the first version of the dinner shortcut, which must return useful results without an intake or a stored preference profile.

### 2.3 Inferred Ingredient Availability

**Inferred ingredient availability** is Data Science's estimate of which ingredients a user is likely to have on hand, based on the behavior it can reliably observe — including what the user commonly saves or engages with, plus any reliable cook signal if one becomes available.

It is evidence, not inventory. The product must never describe an inferred ingredient as something the user definitely has.

### 2.4 Explicit Ingredients

**Explicit ingredients** are ingredients the user names after seeing the first recommendation set because they want the next set to include them.

When the product asks what the user would like to include, selected ingredients are requirements: every qualifying recipe in the refined set must contain all of them. In free text, phrases such as "with chicken" or "I'd like to use chicken" have the same effect. A statement of availability without an inclusion request — "I have chicken" — is context rather than automatically a hard filter.

### 2.5 Makability

**Makability** is the system’s confidence that a user could realistically make a recipe tonight, based initially on inferred ingredient availability and, after refinement, any explicit ingredients the user provides.

Makability is not the same as predicted taste. A user may love a recipe and still be unable to make it tonight.

---

## 3. Problem Alignment

### 3.1 Problem

The existing Data Science Flavor Profile can help answer:

> What recipes is this user likely to like?

“What’s for dinner tonight?” requires the product to answer a harder question:

> What are three high-quality dinners this user is likely to like **and is realistically able to make tonight**?

A taste-only recommender can produce appealing recipes that require too many missing ingredients, do not fit the user’s practical situation, repeat the same type of meal, or violate an explicit constraint. Those recommendations fail the promise of the button even if their predicted affinity is high.

The first response matters disproportionately. This is a reliability-gated product moment: repeated misses teach the user that MyRecipes cannot be trusted with the dinner decision.

### 3.2 Opportunity

MyRecipes can combine three advantages:

1. An existing Data Science Flavor Profile inferred from a user’s saved recipes.
2. Inferred ingredient availability based on what the user commonly saves or otherwise demonstrates through observable behavior.
3. A large catalog of trusted, tested recipes with structured ingredient, course, time, effort, equipment, dietary, and quality metadata.

Together, these create the opportunity to recommend dinners that are not merely relevant, but actionable tonight.

### 3.3 User Job

> When I do not know what to make for dinner tonight, give me three appealing options that fit my tastes, respect my needs, and make meaningful use of ingredients I have, so I can choose quickly and start cooking.

### 3.4 Product Promise

After the user taps **“What’s for dinner tonight?”**, the Assistant returns three distinct recipes. Every recipe should:

- be an appropriate dinner main;
- satisfy every known hard constraint;
- clear a minimum quality threshold;
- reflect inferred makability when Data Science has enough evidence to assess it;
- be a strong fit for the user when a reliable Data Science Flavor Profile exists;
- contribute to a meaningfully varied set;
- include structured, evidence-backed reasons for its selection.

The system should optimize the initial three. Refresh and refinement are useful recovery and control mechanisms, not substitutes for a strong first result.

---

## 4. What the Team Has to Work With

The intent is not to ask Data Science to create every input needed by this experience. The team will have several complementary signals available and should determine how best to use them together.

### Taste and preference signals

- The existing **Data Science Flavor Profile**, based today on the user’s saved recipes.
- Explicit cuisines, flavors, cooking preferences, dietary restrictions, and disliked ingredients from **User Recommendation Preferences**.
- Over time, Data Science may recommend incorporating other behavioral signals such as recipe views, opens, dismissals, or repeated engagement.

### Ingredient availability

The first recommendation set will not wait for the user to provide ingredients. Data Science should infer ingredient availability from the behavioral signals it considers reliable, including what a user commonly saves or engages with.

Today we cannot reliably observe what someone commonly cooks. Until a cook signal exists, saves and other behavior are proxies rather than proof. The model, evidence returned, and product language should preserve that distinction.

After the first set, the user may provide ingredients they explicitly want to include. Those requirements should be enforced before Data Science ranks the qualifying candidates by taste, quality, inferred makability, and diversity.

Data Science should define how confidence in inferred availability affects ranking and what evidence can be returned so the product can use the signal honestly.

### Recipe intelligence

The catalog includes structured data for ingredients, course, total time, effort, equipment, dietary attributes, cuisine, flavor, and recipe quality. This gives the team the raw material to reason about both preference fit and whether a recipe is practical tonight.

### Signals we do not have yet

Today, we cannot reliably say that a user cooked a recipe. We also do not yet have complete session-refinement, time-of-day, or cook-recency signals. These should not block an initial approach, but this work is an opportunity for Data Science to recommend which new signals would be most valuable to collect next.

---

## 5. What the Recommendation Must Accomplish

The challenge for Data Science is to determine how to combine the available signals into a trustworthy shortlist. Product is intentionally not prescribing a model, formula, weighting scheme, threshold, or service architecture.

What must be true of the result:

1. **Every recipe is a credible dinner.** Breakfast, dessert, sides, drinks, and non-recipe content do not belong in the set.
2. **Hard constraints are never traded away.** Dietary restrictions, disliked ingredients, explicit exclusions, and stated time limits must be respected before preference ranking.
3. **Makability materially affects the first answer.** The initial set should account for what the user is likely to have without requiring intake first. After the user names ingredients, the refined set should make meaningful use of them and leave a reasonable missing-ingredient burden. A recipe should not win on taste alone if the user is unlikely to be able to make it.
4. **Taste still matters.** A technically makeable recipe is not a good recommendation if the user is unlikely to want it. The opportunity is to find the intersection of taste, feasibility, and quality.
5. **The three work as a set.** Return the strongest recommendations after accounting for redundancy. The options should be meaningfully different without sacrificing relevance simply to manufacture variety.
6. **The reasoning is grounded.** For each recipe, the product needs structured evidence explaining the strongest reasons it was selected—such as preference fit, ingredient overlap, effort fit, or quality. The Assistant will turn that evidence into user-facing language.
7. **Missing signals do not break the experience.** When the system lacks enough history to infer taste or makability reliably, it should fall back honestly to recipe quality and stated constraints. Low-confidence inference should influence ranking less, not create confident pantry claims.

Data Science should define what makability means in practice, how confident the system needs to be, and how it should trade off against taste and quality. Those decisions should be guided by whether the resulting recommendations help users make dinner—not by any prescribed implementation in this document.

---

## 6. How We Will Know It Works

The true outcome is simple:

> The user made one of the recommended recipes that same day.

We cannot measure that reliably today. Part of this effort is identifying the lowest-friction way to establish that ground truth, whether through an explicit “I made this” action, a lightweight follow-up, or behavioral proxies validated against direct confirmation.

Until that signal exists, opens, saves, refreshes, refinements, and negative feedback are useful directional measures—but none proves that dinner happened. They should help us diagnose the system, not become accidental substitutes for the real outcome.

Before launch, we should evaluate complete three-recipe sets with real user profiles and ingredient scenarios. The core review questions are:

- Would this user plausibly want to eat these recipes?
- Could they realistically make each one with what they told us they have?
- Are all explicit constraints respected?
- Are the three meaningfully different and worth making?
- Is the evidence behind each recommendation accurate and understandable?
- Would this set help the user stop browsing and start cooking?

Data Science should propose how to evaluate these qualities offline, what we can learn in an online test, and which instrumentation is needed to connect early behaviors to confirmed cooking over time.

---

## 7. The Ask of Data Science

Mike Olson’s team owns recommending the solution. The immediate ask is to come back with a point of view on:

1. How to build on the existing Data Science Flavor Profile while inferring which ingredients a user is likely to have from behavioral history.
2. How to define and assess makability in a way that reflects ingredient importance, confidence in inferred availability, and the burden of what is missing—not just raw ingredient overlap.
3. How to balance taste, makability, recipe quality, and shortlist diversity.
4. How to rank candidates after explicit ingredient requirements have been enforced, without reducing the refined set to ingredient matching alone.
5. How the system should behave when user history is limited.
6. What confidence and evidence the recommender can return so the Assistant can explain each choice without presenting inference as fact.
7. How to evaluate the first version and what new data or instrumentation would most improve it.

The goal is not to produce a recommender that generates three plausible recipe IDs. It is to create a decision capability worthy of the question **“What’s for dinner tonight?”** If we solve that well, MyRecipes moves from helping users browse recipes to helping dinner actually happen.
