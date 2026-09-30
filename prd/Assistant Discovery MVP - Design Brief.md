# Assistant Discovery MVP — Design Brief

**Status:** Draft for design kickoff  
**Audience:** People Inc product design  
**Author:** Andrew Alburn  
**Release:** Q4 — MyRecipes mobile app  
**Backend counterpart:** `PRD - Assistant Discovery MVP (Backend).md`  
**App requirements:** `Assistant Discovery MVP - App Requirements.md`  
**Detailed follow-up logic:** `Assistant Follow-Up Suggestions - Relevance Rules.md`

---


## Design Needs Overview

- how someone discovers and enters the assistant;
- how they understand what the assistant is searching and what it understood;
- how recipe results and conversation work together;
- how suggested follow-ups appear
- how ingredient requirements, exclusions, partial matches, and honest misses are communicated;
- how searching all recipes differs from searching saves;
- every loading, empty, error, and recovery state needed to hand off the MVP.


---

## 4. Use case — Open discovery

### Scenario

A user opens the assistant from Home and asks:

> quick chicken dinner

The assistant returns a set of chicken dinner recipes. "Quick" influences ranking but is not treated as a strict time cutoff.

### What the user needs

- Enough standard recipe information to compare the options.
- A clear sense of what the assistant understood.
- An obvious next action: open a recipe, save it through the existing behavior, refine the set, or ask for different options.

### Design must account for

- Recipe result sets.
- Recipe cards retaining image, title, rating, review count, total time, and source brand.
- Results arriving before follow-up suggestions are ready.
- No follow-up suggestions at all when none are useful.
- A request the assistant cannot interpret.
- A request that produces no results.
- A provider timeout or retryable failure.


---

## 5. Use case — Dinner Tonight

### Scenario

A user taps **What's For Dinner Tonight?** and receives recommendations immediately.

The recipes are ranked using likely taste, inferred makability, recipe quality, and known constraints. The product may infer ingredients the user is likely to have from behavioral signals, but it does not know their pantry.

After the first set, the assistant may ask:

> Any ingredients you'd like to include?

The user enters chicken and broccoli. The next set requires both ingredients.

### What the user needs

- Immediate value from the first tap.
- A way to improve the recommendations when they have something specific to use.

### Design must account for

- First results with no intake step.
- The optional ingredient prompt appearing after results, not blocking them.
- Ingredient input
- A cold-start user with little behavioral history.
- A dinner request that returns fewer than three viable results.


---

## 6. Use case — Multi-turn refinement

### Scenario

The conversation develops:

1. **quick chicken dinner**
2. **no mushrooms**
3. **under 30 minutes**
4. **actually make it vegetarian**

By the fourth turn, the active request is vegetarian dinner under 30 minutes, excluding mushrooms. Chicken has been replaced.

### What the user needs

- Confidence that constraints remain active without being repeated.
- A way to understand what changed and what stayed.
- A way to remove or reverse something the assistant carried forward.
- New results rather than the same set rearranged.

### Design must account for

- Additive requirements, replacements, and reversals.
- A constraint that empties the result set.
- A long conversation where earlier context should stop applying.
- Returning to the assistant after dismissing it within the same session.

### Design question

How do we make active context visible without turning the experience into a control panel full of filters and chips?

---

## 7. Use case — Contextual follow-up suggestions

### Scenario

After returning quick chicken dinners, the assistant offers:

- **under 30 minutes**
- **something Thai**
- **for a crowd**

These are selected because they are relevant to the current request and known to produce usable results. Generic suggestions such as "healthy recipes" do not appear without evidence.

### What the user needs

- Suggestions that feel like natural next thoughts, not a static menu.
- Confidence that tapping one will lead somewhere.

### Design must account for

- Zero through (three?) suggestions.
- A label short enough to act as a control.


---

## 8. Use case — An abstract request

### Scenario

A user asks:

> I need to make snacks for my son's soccer team after practice.

The assistant interprets this as portable, crowd-friendly snacks for children, not a literal keyword search.

### What the user needs

- Confidence that the situation was understood.
- A quick way to correct the assistant if it was not.
- Results that reflect the occasion without turning every inferred quality into a strict filter.

### Design must account for

- A short interpretation statement, such as "Looking for crowd-friendly snacks kids will eat."
- Correctable misinterpretation.
- One clarifying question when the request is too vague to act on.
- An interpretation that is sound but cannot produce good catalog results.


---

## 9. Use case — Required ingredients

### Scenario

A user asks:

> I want to make a casserole with mushrooms, rice and cheese.

The assistant treats casserole as the primary dish and mushrooms, rice, and cheese as requirements. Parmesan can satisfy cheese through ingredient normalization.

### What the user needs

- Confidence that every complete match contains all three required ingredients.
- Results that are genuinely casseroles, not unrelated recipes whose ingredient lists happen to contain the same words.
- A clear distinction between complete and partial matches.

### Design must account for

- Complete matches returned alone.
- Partial matches shown only as a separately identified fallback.
- Every partial match naming the required ingredient it is missing.
- A request where the primary dish and required ingredients are ambiguous enough to require a clarifying question.


---

## 10. Use case — Ingredient exclusion

### Scenario

A user asks:

> pasta dinner, no mushrooms

Every qualifying recipe excludes mushrooms.

### What the user needs

- Confidence that the exclusion was understood and applied.
- A visible warning if the system could not interpret the excluded ingredient.
- No silent relaxation when the exclusion leaves too few results.

### Design must account for

- A successful exclusion.
- An exclusion that produces one or zero results.
- An ingredient term the system cannot interpret.
- Multiple simultaneous exclusions.



---

## 11. Use case — Search my saves

### Scenario

A user opens the assistant from Saves and asks:

> my quickest chicken recipes

They get only recipes they have saved, correctly ordered by total time.

A second user opens from Home and asks:

> show me chicken recipes from my saves

The explicit request overrides the screen they started from.

### What the user needs

- A clear understanding of whether the assistant is searching saves or all recipes.
- A way to change that scope without learning special phrasing.
- Confidence that no catalog recipe is being presented as one of their saves.
- Honest handling of questions the product cannot yet answer.

### Design must account for

- Entering from Saves with saves as the default scope.
- Explicitly searching saves from Home.
- Explicitly searching all recipes from Saves.
- An empty saves library.
- A query that finds nothing in saves, with an option to search all recipes.


---

## 12. Information the experience has to communicate

The design can decide where and how. The user needs access to:

- the recipes and their normal trust signals;
- what the assistant understood when interpretation matters;
- whether the search covers all recipes or saves;
- active hard requirements and exclusions when they affect later turns;
- whether a result is a complete or partial ingredient match;
- what a partial match is missing;
- what could not be satisfied;
- follow-up suggestions that are ready to run;
- enough continuity to understand the next response.


---



