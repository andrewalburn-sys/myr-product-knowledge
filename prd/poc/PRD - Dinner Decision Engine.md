# PRD — Dinner Decision Engine (“What’s for Dinner Tonight?”)

**Status:** Draft v1 — POC/demo specification  
**Parent PRD:** [[PRD - Agentic Recipe Assistant]]  
**Author:** Andrew Alburn  
**Last updated:** July 27, 2026  
**Working feature name:** Dinner Decision Engine  
**User-facing entry point:** “What’s for dinner tonight?”

**Related:** `PRD - Agentic Recipe Assistant.md` · `07A_Moments_of_Truth_Synthesis.md` · `08_MyRecipes_AI_Strategy_Synthesis.md` · `02A_Magical_vs_Mechanical_Synthesis.md` · `PRD - Intent Parsing & Constraint Enforcement.md` · `PRD - Top Picks For You (MLEP Backend).md`

---

## 1. Overview

### 1.1 Feature Summary

The Dinner Decision Engine is a focused experience within the MyRecipes Assistant that helps a user answer one high-frequency, high-friction question:

> What should I make for dinner tonight?

When the user taps “What’s for dinner tonight?”, the assistant returns a confident shortlist of three dinner recipes that fit the user’s likely situation. It does not return a broad search result set or ask the user to complete a long preference form. It reduces the decision space to three viable choices and explains, in one line per recipe, why each choice was selected.

The launch experience is intentionally a **shortlist, not a single forced answer**. Strategy work establishes that the minimum reliable bar for this moment is two to three strong, well-matched options. “One dinner tonight” remains the end-state expression; “three strong options that all fit” is the launch product.

### 1.2 Relationship to the Agentic Recipe Assistant

This is a feature-specific child specification of [[PRD - Agentic Recipe Assistant]].

The master PRD defines:

- the persistent assistant shell;
- surface context and session continuity;
- intent routing and tool orchestration;
- shared recipe-card, suggestion-chip, loading, and input components;
- trust and constraint-enforcement rules.

This PRD defines the behavior, ranking logic, UI states, POC data, and success criteria for the assistant’s homepage “What’s for dinner tonight?” flow.

### 1.3 Product Bet

Users do not need more dinner ideas. They need fewer, better choices they can trust.

The feature is successful when it creates a meaningful improvement in:

- **Confidence:** every recommended dinner feels worth making;
- **Speed:** the user reaches a viable choice materially faster;
- **Cognitive load:** the user evaluates three differentiated options instead of browsing an open-ended feed.

### 1.4 Strategic Guardrail

The engine must not imply knowledge it does not have.

In particular, full pantry-aware certainty is a future capability gated by reliable pantry data. At launch, the feature may use inferred or explicitly mocked ingredient familiarity, likely pantry staples, saved-recipe patterns, and lightweight stated constraints. It must not claim “you have everything for this” unless the underlying data supports that claim.

Use language such as:

- “Uses ingredients you cook with often”
- “Mostly pantry staples”
- “Similar to recipes you’ve saved”

Avoid:

- “You already have every ingredient”
- “No shopping needed”
- “Uses what is in your refrigerator”

unless a real, current pantry signal exists.

---

## 2. Goals and Non-Goals

### 2.1 Goals

- Reduce the effort required to choose tonight’s dinner.
- Return only dinner-appropriate main dishes.
- Present three distinct but individually strong choices.
- Make personalization legible through concise “why this fits” explanations.
- Support rapid refinement without asking the user to restate the original request.
- Demonstrate the intended production capability in a believable POC, even when personalization data is hard-coded.
- Use real recipes and real recipe metadata from the connected recipe corpus.
- Reuse the existing MyRecipes recipe cards, assistant sheet, suggestion chips, buttons, loading treatment, and typography.

### 2.2 Non-Goals

- Replacing general search.
- Returning a comprehensive set of all possible dinners.
- Building a complete pantry inventory system.
- Guaranteeing that the user owns every ingredient.
- Generating recipes or altering editorial recipe content.
- Automatically saving a recipe, adding it to a plan, or creating a shopping list without an explicit user action.
- Requiring production-grade personalization or ML for the POC.
- Forcing the user to select one option before leaving the assistant.

---

## 3. Target User and Job to Be Done

### 3.1 Primary Persona

**Weeknight Reducer**

The user is hungry, time-constrained, and trying to reach a sufficiently good decision without researching dinner as a project.

### 3.2 Core Job

> When I need to decide what to make tonight, help me quickly choose a dinner that feels realistic, appealing, and suited to me, so I can stop browsing and start cooking.

### 3.3 Secondary Users

- **Established Home Cook:** wants familiar, credible recipes without overt AI theater.
- **Enthusiast:** values one option that expands the repertoire without becoming impractical.
- **System Thinker:** may use the shortlist as an entry point into a meal plan or saved collection.

---

## 4. Experience Principles

### 4.1 Collapse the Decision, Not the User’s Agency

Return three strong choices. Do not manufacture false certainty by presenting one answer when the system cannot reliably determine a single best dinner.

### 4.2 Every Option Must Be Viable

The third option is not filler. If only two recommendations clear the quality threshold, show two.

### 4.3 Differentiate the Choices

The shortlist should help the user compare meaningful paths, not show three near-duplicates.

Recommended default roles:

1. **Safest bet** — strongest fit to known tastes and familiar cooking behavior.
2. **Easy with your usuals** — strong feasibility or ingredient-familiarity fit.
3. **A little different** — controlled novelty that still fits the user’s taste and effort range.

These roles guide ranking and diversity. They should not require a new card type or visually heavy badge system. The user-facing UI should prioritize the recipe, standard metadata, and a concise reason.

### 4.4 Explain, Don’t Over-Explain

Each recipe gets one short, evidence-backed “why this fits” line. The explanation should help the user decide, not describe the ranking system.

Good examples:

- “Similar to the lemony chicken recipes you save.”
- “One pan and vegetables you cook with often.”
- “A new flavor direction that still fits your 30-minute weeknights.”
- “A repeat-cook favorite you haven’t made recently.”

### 4.5 Ask Only When It Changes the Answer

Do not begin with a questionnaire. Use known context and make an initial recommendation when confidence is adequate.

Ask one lightweight clarification only when:

- a hard constraint is unresolved;
- confidence is too low to produce viable options;
- two interpretations would produce materially different shortlists.

### 4.6 Refinement Must Feel Instant

Follow-ups such as “make it faster” or “no chicken” should update the current shortlist while preserving all earlier constraints.

---

## 5. Core User Flow

### 5.1 Entry

1. User opens the MyRecipes Assistant from the homepage.
2. Opening state includes the suggestion “What’s for dinner tonight?”
3. User taps the suggestion.

### 5.2 Recommendation

1. The assistant acknowledges the request in a user query bubble.
2. If the shortlist is not immediately available, the assistant shows the established recommendation loading state.
3. The engine returns two or three dinner recipes.
4. Each recipe is shown with:
   - recipe image;
   - title;
   - rating and review count;
   - total time;
   - source;
   - favorite affordance where the standard recipe card includes one;
   - one concise “why this fits” line.
5. The assistant offers relevant refinement suggestions.

### 5.3 Evaluation

The user can:

- open a recipe;
- save through the standard product affordance;
- request three more;
- make the set faster;
- exclude an ingredient or protein;
- ask to use more familiar ingredients;
- request something more adventurous;
- provide lightweight negative feedback.

### 5.4 Refinement

The assistant preserves the active intent and prior constraints, then returns an updated shortlist using the same card pattern.

Example:

> User: “Make it faster.”  
> Assistant: updates the shortlist so every recipe is under the new time threshold.

### 5.5 Feedback

If a recommendation misses, the user can provide a low-effort reason:

- Too much work
- Missing ingredients
- Not in the mood
- Had that recently

The selected reason immediately becomes a refinement signal for the next shortlist.

---

## 6. Functional Requirements

### FR1 — Dinner-Only Eligibility

Every returned item must be a dinner-appropriate main dish.

Exclude:

- breakfast and brunch;
- desserts and baked sweets;
- beverages;
- snacks and appetizers without main-dish intent;
- sauces, dressings, and condiments;
- side dishes presented as a complete dinner;
- editorial list pages, roundups, and non-recipe articles.

When classification is uncertain, the recipe should not be shown.

### FR2 — Default Result Count

- Return three options by default.
- Return two if only two meet the quality threshold.
- Never add a weak third option to fill the layout.
- A user requesting “three more” receives a new set that excludes the recipes currently shown and recent prior sets.

### FR3 — Hard Constraint Enforcement

Explicit user constraints are literal requirements.

Examples:

- “under 30 minutes”
- “no pork”
- “vegetarian”
- “nothing spicy”

A result violating a hard constraint must never be shown. When the engine cannot satisfy all constraints, it returns an honest miss and asks which constraint the user wants to relax.

### FR4 — Personalization Inputs

The production engine should consider, when available:

- saved recipes;
- repeat cooks and cooking frequency;
- recipe ratings or explicit feedback;
- recently viewed recipes;
- recency of last cook;
- cuisines, flavors, proteins, and techniques the user prefers;
- typical weeknight time and effort;
- household and dietary constraints;
- ingredient familiarity;
- current session constraints;
- time of day and day-of-week context;
- negative signals, including dismissals and “not interested” reasons.

POC behavior is defined in §9.

### FR5 — Candidate Source Hierarchy

**Production** should build the candidate pool in this order:

1. Strong matches from the user’s saves and cook history.
2. Similar recipes from the broader live recipe index.
3. Controlled-novelty recipes adjacent to demonstrated tastes.

Do not remain trapped in the saved library when it lacks three good options. Do not reach broadly into the corpus when a strong known favorite is already a good fit.

**POC (current):** every Dinner Decision ask is a **fresh retrieval** through the app’s recipe search service:

1. When authenticated — live `site_search` MCP results (real site recipes + metadata).
2. When offline / unauthenticated — the same search API backed by the local recipe corpus.

Static prevalidated shortlist tables are **not** the primary candidate source. Session exclusions and varied query seeds keep repeated taps from returning the same three recipes.

### FR6 — Fit Scoring

Each candidate receives an inspectable fit score. The exact production model may change, but the score must represent:

| Dimension | Purpose |
|---|---|
| Dinner eligibility | Ensures the item is a main-dish dinner |
| Constraint match | Hard gate for explicit requirements |
| Taste affinity | Matches saved/cooked flavors, cuisine, protein, and technique |
| Effort fit | Matches typical time, complexity, equipment, and cleanup |
| Ingredient familiarity | Uses ingredients the user often cooks with |
| Quality/conviction | Uses rating, review volume, editorial quality, or equivalent trust signals |
| Recency | Avoids recipes cooked or shown too recently |
| Novelty | Supports controlled variety without abandoning relevance |

Hard gates run before weighted ranking.

### FR7 — Shortlist Diversity

The final set must be meaningfully differentiated.

Avoid:

- three recipes with the same protein, cuisine, and technique;
- multiple versions of effectively the same dish;
- recipes with near-identical images or titles;
- three recommendations selected for the same reason.

At least two of the following should vary across the shortlist:

- protein or plant-based base;
- cuisine or flavor direction;
- cooking method;
- time/effort profile;
- familiarity versus novelty.

### FR8 — “Why This Fits”

Every recipe must include one concise reason derived from **that recipe’s returned metadata** (title, description, ingredients, total time, method/protein cues) plus deliberately mocked persona signals (taste tags, pantry familiarity).

The reason must:

- be specific to the recipe currently shown (not a static pool string keyed only by doc id);
- use only signals the product actually has or intentionally simulates in the POC;
- name the decision-relevant benefit;
- fit on one or two short lines;
- differ across the shortlist.

Do not expose internal scores or use vague copy such as “recommended for you.”
Do not reuse canned “whyOptions” that ignore the live recipe payload.

### FR9 — Conviction Signals

Every recommendation card must retain the product’s standard trust information:

- rating;
- review count;
- total time;
- recognizable recipe source;
- image;
- standard title and favorite behavior.

The feature should not remove useful standard metadata in order to appear more “AI.”

### FR10 — Follow-Up Refinements

After the initial result, show a small set of context-aware refinements selected from:

- Show me three more
- Make it faster
- Use more of what I have
- No [dominant ingredient/protein]
- Vegetarian
- Something different
- More like the first/second/third

Only show refinements that make sense for the current shortlist.

### FR11 — Negative Feedback

The feedback sheet must:

- use the standard assistant sheet and button/chip patterns;
- require no typing;
- allow dismissal;
- apply the selected feedback to the next result;
- avoid implying permanent preference learning in the POC.

Production may persist the signal to the user profile after consent and data-governance review.

### FR12 — Variety and Repeat Protection

- Do not show duplicate recipes within a shortlist.
- Do not repeat a recipe in the immediately following “three more” request.
- Avoid recipes displayed in the last three generated sets when a sufficient pool exists.
- Rotate among multiple valid shortlist compositions.
- Preserve a stable quality floor; variety never outranks fit.

### FR13 — Loading State

If recommendations are not ready when the response view opens:

- show the established assistant recommendation loading state;
- use copy specific to the task, such as “Finding a few good options…”;
- show recipe-card skeletons that match the final card geometry;
- never display generic fallback recommendations before replacing them with personalized results.

The loading state should prevent visible content swapping.

### FR14 — Conservative Failure

When the engine cannot produce at least two viable dinner options:

1. say what prevented a confident shortlist;
2. preserve the user’s existing constraints;
3. offer one useful clarification or relaxation path.

Example:

> “I couldn’t find two highly rated vegetarian dinners under 15 minutes. Would you rather allow up to 25 minutes or include recipes with some prep-ahead time?”

### FR15 — Native Component Reuse

The flow must use the existing:

- assistant bottom sheet;
- sheet header and contextual subtitle;
- query bubble;
- grid recipe card;
- rating and cook-time metadata;
- “why this fits” supporting text;
- suggestion chips;
- primary, secondary, and ghost pill buttons;
- assistant input;
- loading skeleton pattern.

Do not introduce a parallel recommendation-card language, custom role-card system, or feature-specific navigation.

---

## 7. Recommendation Logic

### 7.1 Processing Sequence

1. Parse the request and merge it with session constraints.
2. Apply the dinner-only eligibility classifier.
3. Apply hard dietary, ingredient, time, and household constraints.
4. Assemble candidates using the source hierarchy in FR5.
5. Score candidates across fit dimensions.
6. Apply quality threshold.
7. Apply repeat protection.
8. Construct a diverse shortlist.
9. Generate one evidence-backed fit reason per recipe.
10. Return recipe cards and context-aware refinements.

### 7.2 Illustrative Scoring Model

The POC may use deterministic weights:

```text
fit_score =
  0.25 taste_affinity
  + 0.20 effort_fit
  + 0.15 ingredient_familiarity
  + 0.20 quality_confidence
  + 0.10 recency_fit
  + 0.10 controlled_novelty
```

Hard constraints and dinner eligibility are gates, not weighted preferences.

This formula is illustrative, inspectable, and replaceable. It is not a production ML requirement.

### 7.3 Shortlist Assembly

Recommended POC assembly:

- Slot 1: highest-confidence familiar fit.
- Slot 2: highest feasibility/ingredient-familiarity fit that is sufficiently different from slot 1.
- Slot 3: highest controlled-novelty fit that remains above the quality threshold.

If the third slot fails the threshold, return two.

---

## 8. UX and Content Requirements

### 8.1 Initial Response

Recommended structure:

1. Assistant header and homepage context.
2. User query bubble.
3. Heading: “Three dinners for tonight.”
4. One-line framing copy.
5. Horizontal carousel of existing recipe cards.
6. One “why this fits” line beneath each card.
7. Refinement chips.
8. Persistent assistant input.

### 8.2 Card Copy

Keep the standard recipe title and metadata hierarchy. Fit explanations should be plain, specific, and credible.

Avoid decorative AI labels or role badges that compete with the recipe.

### 8.3 Refinement Response

When a refinement is applied:

- show the refinement as a user query bubble;
- optionally show a small neutral filter chip such as “Under 25 min”;
- keep the same heading and recipe-card structure;
- update the fit reasons to reflect the new constraint.

### 8.4 Feedback Response

Feedback opens in the standard bottom-sheet pattern over the current recommendations. The previous shortlist remains visible behind the light scrim so the feedback remains anchored to what the user just saw.

### 8.5 Tone

The assistant should sound decisive but not omniscient.

Use:

- “Here are three strong fits for tonight.”
- “These all stay under 25 minutes.”
- “This one matches the bright, lemony dinners you save.”

Avoid:

- “I know exactly what you want.”
- “This is the perfect dinner.”
- “You definitely have these ingredients.”

---

## 9. POC / Demo Specification

### 9.1 POC Principle

The POC should demonstrate the optimal intended experience. It does not need production personalization infrastructure, but it must use realistic, internally consistent data.

Mock the personalization depth, not the interaction or recipe content.

### 9.2 Fixed Demo Persona

Use one stable persona with enough detail to make the explanations believable:

```yaml
name: Andrew
persona: Weeknight Reducer with Enthusiast tendencies
typical_weeknight_time: 20–40 minutes
preferred_flavors:
  - lemon
  - garlic
  - Mediterranean
  - savory
  - mild-to-medium heat
preferred_methods:
  - sheet pan
  - skillet
  - one pot
frequent_ingredients:
  - chicken
  - pasta
  - tomatoes
  - garlic
  - lemons
  - olives
  - leafy greens
saved_patterns:
  - chicken dinners
  - quick pasta
  - salmon
  - tacos
controlled_novelty:
  - Asian-inspired savory dishes
  - new sauces on familiar proteins
```

### 9.3 Live Retrieval (POC)

Every Dinner Decision Engine request performs a **fresh search** via the app’s `searchRecipes` path:

| Condition | Source |
|---|---|
| User authenticated (bearer token) | Live `site_search` MCP — real Dotdash Meredith recipes |
| Not signed in, or live search unavailable | Local offline corpus with the same search contract |

Rules:

- Scope for this milestone: homepage **“What’s for dinner tonight?”** and its follow-ups (`Show me three more`, `Make it faster`, `No chicken`). Other home chips and free-text remain on existing assistant routing until a follow-up milestone.
- Query seeds vary by invocation and mode (e.g. `weeknight dinner`, persona proteins/methods) so repeated taps are not identical.
- After retrieval, apply hard gates: dinner-appropriate mains, time caps, ingredient exclusions (including no chicken), session recent-doc exclusions, and persona dislikes.
- Return **2–3** recipes; never pad a weak third.
- Prefer live MCP when available; local corpus is an acceptable offline demo fallback.

A historical curated dinner pool / prevalidated shortlist table may remain in code for regression fixtures but is **not** the happy path.

### 9.4 Variety Without Static Sets

For a varied demo without prevalidated shortlists:

- rotate among dinner query seeds by session/invocation count;
- exclude recipes shown in the current and recent shortlists (especially on “three more”);
- soft-rank with mocked persona affinity after hard gates;
- keep all recipes real and all why-lines derived from the shown recipe metadata + mocked persona.

Random shuffle of an already-gated pool is acceptable for “surprise / something different”; do not invent recipes.

### 9.5 POC Refinement Matrix

| User action | POC response |
|---|---|
| Initial tap | Fresh live (or offline) dinner search; return 2–3; vary seeds so repeats feel fresh |
| Show me three more | New search with the same session constraints; exclude recent shortlist recipe ids |
| Make it faster | Re-search with under-25-minute constraint; show **Under 25 min** filter chip + faster heading |
| No chicken | Re-search with chicken excluded (title / ingredients / exclude constraint); zero chicken recipes |
| Use more of what I have | Re-search prioritizing frequent-ingredient / pantry-affinity seeds; careful inferred language |
| Something different | Re-search with novelty-oriented seeds; preserve active time / exclude constraints |
| Too much work | Tighten time / effort via re-search |
| Missing ingredients | Prioritize ingredient-familiar seeds |
| Not in the mood | Replace flavor/cuisine seed direction |
| Had that recently | Add the shown recipe to the session exclusion list and re-search |

Refinements preserve prior session constraints (time, no chicken, diet) unless the user explicitly relaxes them.

### 9.6 POC Honesty

The demo may present fit explanations as product UI without repeatedly labeling every signal as mocked. Internal documentation, demos, and stakeholder readouts must clearly state:

- recipes and recipe metadata are real (live MCP when authed; local corpus offline);
- the demo persona and behavior history are simulated;
- ranking after retrieval is rules-based / mocked-persona affinity;
- pantry state is inferred/mocked, not a live inventory.

---

## 10. Data and Service Contract

### 10.1 Inputs

```json
{
  "user_id": "demo-andrew",
  "surface": "homepage",
  "request": "What's for dinner tonight?",
  "constraints": {
    "max_time_minutes": null,
    "diet": [],
    "include_ingredients": [],
    "exclude_ingredients": []
  },
  "session_exclusions": [],
  "max_results": 3
}
```

### 10.2 Output

```json
{
  "heading": "Three dinners for tonight",
  "recipes": [
    {
      "recipe_id": "canonical-id",
      "title": "Lemon Herb Chicken",
      "url": "https://example.com/recipe",
      "image": "https://example.com/image.jpg",
      "source": "Food & Wine",
      "rating": 4.8,
      "review_count": 1783,
      "total_time_minutes": 30,
      "fit_role": "safest_bet",
      "why_this_fits": "Uses five ingredients you cook with often.",
      "evidence": ["ingredient_familiarity", "taste_affinity"]
    }
  ],
  "follow_ups": [
    "Show me three more",
    "Make it faster",
    "No chicken"
  ],
  "metadata": {
    "route": "dinner_decision_engine",
    "persona_mode": "mocked",
    "confidence": "high"
  }
}
```

### 10.3 Inspectability

For internal debugging, the system should expose:

- parsed constraints;
- candidates rejected by hard gates;
- fit score by dimension;
- shortlist diversity decisions;
- repeat exclusions;
- evidence used to generate each explanation.

This information is not displayed to the user.

---

## 11. Measurement

### 11.1 Primary Production Metric

**Recommendation acceptance rate:** percentage of Dinner Decision Engine sessions in which the user opens or saves one of the recommended recipes.

### 11.2 Supporting Metrics

- Time from feature tap to recipe open/save.
- Percentage of sessions ending in a recipe open.
- Save rate from recommended recipe views.
- “Show me three more” rate.
- Refinement usage rate.
- Negative-feedback rate by reason.
- Repeat invocation rate.
- Constraint-violation rate.
- Shortlist-to-cook proxy, when available.

### 11.3 POC Evaluation

Use moderated testing to answer:

- Do the three recipes all feel like dinner?
- Does each option feel viable?
- Do users understand why each was chosen?
- Does the shortlist feel personalized rather than arbitrary?
- Can users refine without learning a new interaction model?
- Does the feature reduce browsing and decision effort?
- Do the explanations create confidence without overclaiming?

---

## 12. Acceptance Criteria

The POC is ready to demonstrate when:

1. Tapping “What’s for dinner tonight?” returns two or three real dinner recipes from a **fresh search** (live MCP when authenticated).
2. When not signed in, the same flow returns dinners from the local corpus without crashing.
3. No breakfast, dessert, side, beverage, roundup, or non-recipe content can appear.
4. Every recipe uses the standard recipe-card component and includes rating, reviews, time, source, and a fit reason derived from that recipe’s metadata.
5. The shortlist contains differentiated choices rather than near-duplicates.
6. “Show me three more” returns a non-overlapping set via a new search + session exclusions.
7. “Make it faster” returns only recipes under the displayed threshold.
8. “No chicken” returns zero chicken recipes.
9. Loading never shows generic recommendations that visibly swap after personalized results arrive.
10. Explicit constraints are never silently violated.
11. Pantry-related explanations do not imply live inventory certainty.
12. The flow uses the existing assistant sheet, recipe cards, chips, buttons, input, and loading components.
13. The demo can produce multiple credible result sets rather than repeating the same three recipes every time.
14. Other homepage chips (“Something quick…”, “Surprise me…”) and free-text may still use prior routing until a follow-up milestone; they are out of scope for this acceptance pass.

---

## 13. Dependencies

- MyRecipes Assistant shell and session state.
- Real recipe retrieval through live `site_search` MCP when authenticated, else the local corpus.
- Search 2.0 intent parsing and hard constraint enforcement.
- Recipe classification and semantic metadata for course, cuisine, technique, time, and ingredients.
- Flavor Profile / Top Picks personalization service for the production path.
- Saved-recipe and cook-history signals.
- Standard recipe-card, assistant-sheet, suggestion-chip, button, and loading components.

---

## 14. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Results are not actually dinner | Dinner-only hard gate and regression set |
| Three options feel arbitrary | Evidence-backed fit scoring and explanations |
| Recommendations repeat | Session exclusions, varied query seeds, and fresh retrieval per ask |
| Personalization feels creepy | Use practical, minimal explanations; avoid exposing sensitive inference |
| Pantry language overpromises | Use ingredient-familiarity language until live pantry data exists |
| The UI feels like a separate product | Reuse existing MyRecipes components and assistant shell |
| A third weak option lowers trust | Return two rather than pad |
| Live MCP unavailable | Fall back to local corpus with the same hard gates and UI |
| Hard-coded shortlists go stale | Prefer live search; keep corpus only as offline fallback |
| High latency causes visible content swapping | Show the final-card skeleton state until recommendations are ready |

---

## 15. Open Questions

1. What minimum save count or behavior threshold is required before production personalization is considered reliable?
2. Which signals may be referenced explicitly in user-facing fit explanations?
3. Should negative feedback persist beyond the current session?
4. What production definition distinguishes a dinner main from a side or lunch recipe?
5. What maximum response latency can still feel instant with the recommendation loading state?
6. Should recipe saves from this experience feed the Flavor Profile immediately or after a later batch update?
7. When pantry data matures, what confidence threshold permits stronger “you have this” language?
8. When should the remaining homepage chips and free-text assistant input move fully onto the same live-MCP retrieval path?

---

## Appendix A — Example Initial Shortlist

**Heading:** Three dinners for tonight  
**Framing:** Good fits for your usual effort, flavors, and pantry.

| Recipe | Why this fits |
|---|---|
| Lemon Herb Chicken | Uses five ingredients you cook with often. |
| Sheet-Pan Chicken Souvlaki | One pan and the bright flavors you save most. |
| Miso Corn Dumpling Stir-Fry | A new idea that still matches your savory favorites. |

**Follow-ups:** Show me three more · Make it faster · No chicken

## Appendix B — Example Faster Shortlist

**Applied refinement:** Under 25 min  
**Heading:** Fast dinners that still fit you

| Recipe | Why this fits |
|---|---|
| Sweet & Spicy Chicken | Your go-to flavors in one quick skillet. |
| Salmon & Asparagus | One pan and the bright flavors you save. |
| Quick Shrimp Scampi | Garlic, lemon, and pasta are familiar staples. |

**Follow-ups:** Use what I have · Something different

## Appendix C — Required Regression Set

The test set must include:

- highly rated breakfast recipes;
- desserts with “dinner” in editorial copy;
- side dishes that resemble mains;
- recipe roundups and list pages;
- duplicate recipes from different sources;
- three near-identical chicken recipes;
- recipes that violate explicit dietary constraints;
- recipes with missing time or course metadata;
- recipes shown in the immediately previous set;
- a request whose constraints leave only one valid result;
- a request whose constraints leave no valid results.
