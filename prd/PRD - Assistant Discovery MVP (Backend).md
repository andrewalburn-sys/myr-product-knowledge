---
kb_id: assistant-discovery-backend-mvp
title: PRD — Assistant Discovery MVP (Backend)
authority: release
status: draft-engineering-scoping
owner: Andrew Alburn
audience:
  - product
  - backend-engineering
  - qa
applies_to:
  - q4-release
  - production
last_reviewed: 2026-09-30
supersedes: []
superseded_by: null
related_code:
  - src/assistant/discovery
  - src/assistant/semanticPlanner.ts
related_docs:
  - prd/PRD - MyRecipes Assistant.md
  - prd/Assistant Discovery MVP - App Requirements.md
  - prd/PRD - Assistant Semantic Query Planner.md
  - prd/Assistant Discovery - Golden Sequences.csv
---

# PRD — Assistant Discovery MVP (Backend)

**Status:** Draft for engineering scoping
**Audience:** Dale, Jessica, and the Food Search & Discovery backend team
**Author:** Andrew Alburn
**Release:** Q4 — one quarter, app only
**Scope of this document:** what the services have to do. App-side requirements are in `Assistant Discovery MVP - App Requirements.md` — you shouldn't need to read it.
**Parent:** `PRD - MyRecipes Assistant.md`
**Companion specs:** `Assistant Follow-Up Suggestions - Relevance Rules.md` · `PRD - Assistant Semantic Query Planner.md`
**Golden sequences:** `Assistant Discovery - Golden Sequences.csv`
**Informed by:** the September 18 backend conversation


---

## 1. What we're building

Two things, both about finding recipes, both in the MyRecipes app.

**Discovery** — someone describes what they want in their own words and gets a small set of real recipes back. Including a shortcut for "what's for dinner tonight."

**Searching saves** — someone asks a question about recipes they've already saved and gets a usable answer.



---

## 2. Flow 1 — A request on Home

The baseline. Every other discovery flow varies from this one.

### Receives

- A natural language string: **"quick chicken dinner"**
- Which screen it came from: Home
- A session identifier, and any constraints already active in that session

### Must determine

| Element | Classification | Effect |
|---|---|---|
| chicken | Ingredient the user wants | Required in results |
| dinner | Meal type | Required — dinner mains only |
| quick | Quality judgment | Ranks results, never filters. See §9.3 |


### Must return

- **2 or 3 recipes** from live retrieval against existing search.
- Enough about each recipe for the app to render a full card without a second call — identity, title, image, rating, review count, total time, source brand.
- Follow-up candidates that have already passed evidence and viability checks.
- Whatever the next turn needs to continue the conversation.

### When it can't

| Condition                        | What comes back                                                                           |
| -------------------------------- | ----------------------------------------------------------------------------------------- |
| Retrieval returns nothing        | An explicit miss with the reason. Not an empty result set the app has to interpret.       |
| Only one result clears the bar   | One result, flagged as the only match. No backfill.                                       |
| The request can't be interpreted | A statement that we didn't understand, and a prompt to rephrase. Never a plausible guess. |
| A model call times out           | A failure response and a retryable state. Never partial results presented as complete.    |
| A model provider is unavailable  | Falls back per §9.6. The response is indistinguishable to the user.                       |

---

## 4. Flow 2 — The dinner shortcut

### Receives

**First:** a signal that the user tapped the "what's for dinner tonight" shortcut. 

**Optionally, after results:** ingredients the user explicitly wants to include in the next set.

### Must determine

- Which recipes qualify as a dinner main. This depends on course metadata, and a recipe we can't classify is excluded rather than guessed at.
- Which dinners this user is likely to want, using the Data Science Flavor Profile.
	- Inclusive of which dinners Data Science believes the user could plausibly make tonight. Makability is inferred from the behavior Data Science can actually observe — including what the user commonly saves or engages with, plus any reliable cook signal if one becomes available — and the ingredients that behavior suggests they are likely to have.

### Must return

- Results immediately after the tap. No intake question before the first set.
- Results ranked by both likely taste and inferred makability, while respecting every known hard constraint.
- Structured evidence from Data Science explaining the strongest signals behind each selection, including whether makability was based on strong or limited evidence. 
- An optional post-result prompt asking whether there are ingredients the user would like to include in a refinement.

### If the user gives us ingredients

- Ingredients selected in response to "anything you'd like to include?" are requirements. Every qualifying recipe in the next set must contain all of them.
- Free-text language matters. "I'd like to use chicken and broccoli," "with chicken and broccoli," and "must use the chicken" create ingredient requirements. "I have chicken and broccoli" supplies availability context unless the user also asks to use them.
- Explicit ingredient requirements hold for the rest of the conversation until the user changes or removes them.
- The refined set still uses taste, quality, inferred makability, and every other active constraint. It isn't reduced to ingredient matching.

### The product promise

The first set should be good enough that the user doesn't have to answer a question before getting value. Inferred makability is what makes that possible. Asking about ingredients afterward gives the user control when our inference is incomplete or when they have something specific they want to use.

---

## 5. Flow 3 — Refining a result set

The multi-turn case, and where most of what can go wrong does.

### Receives

A new string in an existing session, with prior turns and active constraints attached.

Worked example:

| Turn | User says                   | Active after this turn                                                 |
| ---- | --------------------------- | ---------------------------------------------------------------------- |
| 1    | quick chicken dinner        | chicken, dinner, quick                                                 |
| 2    | no mushrooms                | chicken, dinner, quick, **exclude mushrooms**                          |
| 3    | under 30 minutes            | chicken, dinner, exclude mushrooms, **time ≤ 30**                      |
| 4    | actually make it vegetarian | **vegetarian**, dinner, exclude mushrooms, time ≤ 30 — chicken is gone |

### Must determine

Whether the new turn **adds**, **replaces**, or **modifies** — and this needs a written rule, not emergent behavior.

**Examples:**

- An explicit ingredient or diet replaces the same kind of thing from an earlier turn. Turn 4 removes chicken rather than searching for vegetarian chicken.
- Anything stated negatively is additive and persists until reversed by name. Turn 3 still honors "no pork."
- Quality words stack rather than replace. "Make it cheaper" on top of "comforting" keeps both.

### Must return

- A set honoring every constraint still active, including ones the user didn't repeat.
- Results visibly different from the previous turn. A refinement returning the same three recipes reads as broken even when it's technically correct.
- Updated state so the next turn continues correctly.

### When it can't

| Condition                                   | What comes back                                                                                         |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Accumulated constraints match nothing       | The specific constraint that emptied the set, and an offer to drop that one. Never a silent relaxation. |
| The refinement produces the same recipes    | A statement that there's nothing else matching, rather than re-showing the set.                         |
| The conversation has wandered across topics | See §9.5. Context has to expire or results degrade.                                                     |


---

## 6. Flow 4 — Generating follow-up suggestions

Follow-up suggestions are a backend feature, not supporting copy. After returning recipes, the service has to decide which next actions would be useful, specific to this result set, and guaranteed to lead somewhere.

Full selection rules live in `Assistant Follow-Up Suggestions - Relevance Rules.md`. This flow defines the service responsibility for the MVP.

### Receives

- The interpreted request and every active constraint.
- The recipes just returned, including the attributes that distinguish them.
- Conversation history: refinements already tried, suggestions already shown, and recipes already excluded or displayed.
- The pre-generated suggestion pool.

### Must determine

1. **Which dimensions are already resolved.** "Quick chicken dinner" has already settled meal type, protein, and a time preference. Suggestions shouldn't ask for those again.
2. **Which dimensions are still open.** Cuisine, cooking method, servings, or cost may still be useful ways forward.
3. **Which pooled candidates fit this specific context.** Semantic matching narrows the pre-generated pool; it doesn't decide what reaches the user.
4. **Whether each candidate is viable.** We know it will return a usable result set before offering it.
5. **Whether it has already been tried, declined, or made redundant by another stronger suggestion.**

### Must return

- Up to three validated suggestions, ranked by usefulness to this request.
- Fewer — including zero — when fewer qualify. The service never pads the response with generic options.
- Suggestions that issue complete next requests when selected, carrying every active constraint forward.
- Short user-language labels from the pre-generated pool, such as **"under 30 minutes"** or **"something Thai."**
- At most one pivot to a different direction, and only when the original request was exploratory rather than precise.

Suggestions must be ready without delaying the recipes they accompany. If generation isn't complete when the recipes are ready, results come first.

### How this is powered

| Layer | Responsibility |
|---|---|
| Pre-generated pool | Supplies concise candidate refinements organized by dimension and intent |
| Semantic matching | Narrows the pool to candidates that may fit the request and results |
| Evidence gate | Rejects anything generic, unsupported, or already resolved |
| Viability gate | Rejects anything that would return no usable results |
| Ranking and selection | Chooses a diverse set of up to three |

A large pool without the gates is not the feature. It would produce fluent, plausible, dead-end suggestions quickly.

### When it can't

| Condition                                                  | What comes back                                                                                                       |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| No candidate clears the quality threshold                  | No suggestions. Zero is a valid response.                                                                             |
| Viability can't be checked cheaply enough                  | Only suggestions that can be validated from the existing result set, such as tightening or showing different recipes. |
| The library is too small for meaningful refinement         | No suggestions. Narrowing a small saves list adds friction rather than value.                                         |
| No unshown alternatives remain                             | "Show me different ones" is suppressed rather than offered and allowed to fail.                                       |

---

## 7. Flow 5 — An abstract request

This flow decides whether the product feels intelligent or like a search box with extra latency.

### Receives

**"I need to make snacks for my son's soccer team after practice."**

### Must determine

The situation behind the words, not the words:

| Signal | Reading |
|---|---|
| soccer team | A crowd, of kids |
| after practice | Fast, portable, no utensils, eaten standing up |
| snacks | Not a meal |

None of these become hard filters. Kid-friendly shapes ranking; it doesn't exclude every recipe that lacks the tag.

### Must return

Recipes that are snack-appropriate, crowd-scaled, kid-friendly, and portable. And a statement of what we understood, because this is the flow where a misread is most likely and most correctable.

### On transparency

**Internally, always inspectable.** For any request we can retrieve what was understood, what retrieval strategies came out of it, what was excluded and why, and what drove the ranking. 

**Externally, a short line is worth it.** "Looking for crowd-friendly snacks kids will eat." It costs little and it converts a wrong answer into a wrong answer the user can fix in one turn. See §9.

### When it can't

| Condition | What comes back |
|---|---|
| The situation is misread | Nothing at the service level — the interpretation statement is what makes it recoverable. |
| Interpretation is right, retrieval has nothing good | An honest miss. Not a loose set of vaguely related recipes. |
| Too vague to interpret at all | One clarifying question. Never two, never a form. See §9.4. |

---

## 8. Ingredient requirements

### Flow 6 — Requiring ingredients

Site search already indexes structured ingredient lists and uses ingredient matches in ranking. Keyword and semantic ingredient boosts are active, but both are soft signals: they can lift a recipe without guaranteeing that it contains every ingredient the user requested.

This flow closes the gap between **ingredient matching** and **ingredient requirement enforcement**.

#### Receives

**"I want to make a casserole with mushrooms, rice and cheese."**

#### Must determine

The request contains concepts doing different jobs:

| Concept | Role | Effect |
|---|---|---|
| casserole | Primary dish | Establishes what the recipe is fundamentally about |
| mushrooms | Required ingredient | Must be present in every qualifying result |
| rice | Required ingredient | Must be present in every qualifying result |
| cheese | Required ingredient category | Must be satisfied by cheese or a normalized equivalent, such as Parmesan |

The service has to separate the primary dish from required ingredients before retrieval. Simply sending all three terms to search with higher ingredient boosts is not enough: long ingredient lists can elevate recipes that contain the words but are poor interpretations of the dish.

#### Must return

- Recipes that are relevant interpretations of the primary dish **and contain every required ingredient**.
- Required ingredients normalized to canonical ingredient concepts, so a subtype can satisfy its parent category where appropriate.
- Complete matches ranked using dish relevance, ingredient centrality, title, taxonomy, quality, popularity, freshness, and the other available ranking signals.
- Enough interpretation detail to show which concept was treated as the dish and which were enforced as ingredients.

**Presence is the gate; centrality is a ranking signal.** A recipe qualifies when mushrooms, rice, and cheese are all present. Among qualifying casseroles, one where all three ingredients are central to the dish should outrank one where any appears incidentally.

#### Controlled fallback

If too few complete matches exist, partial matches may come back only as a separate fallback:

- Complete matches always come first.
- A partial match is never presented as satisfying the original request.
- Each partial match identifies which required ingredient is missing.
- The service never mixes partial matches invisibly into the qualifying set to reach a target count.

**My position:** this fallback belongs in the contract even if the first implementation returns only complete matches. It gives us an honest way to recover from a thin catalog without weakening ingredient requirements.

#### When it can't

| Condition                                                             | What comes back                                                                                    |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| The service can't distinguish the dish from the requested ingredients | One clarifying question, rather than enforcing the wrong structure.                                |
| An ingredient category can't be normalized reliably                   | The unresolved ingredient is surfaced. It is never silently treated as a soft term.                |
| No recipe contains every required ingredient                          | An explicit complete-match miss, followed by separately identified partial matches when available. |


#### What changes from search today

The current ingredient boosts remain useful for ranking and can help retrieve candidates. They do not satisfy this flow on their own. The new capability is all-of enforcement: after the request has been structured and ingredients normalized, a recipe cannot qualify unless it contains every required ingredient. 

---

### Flow 7 — Excluding an ingredient

#### Receives

**"pasta dinner, no mushrooms"** — a request carrying an exclusion.

#### Must determine

Whether the excluded term resolves to an ingredient identifier. If it does, exclude on that. If it doesn't, fall back to matching on words — and the fallback has to handle these:

| Input       | Wrong                                 | Required                              |
| ----------- | ------------------------------------- | ------------------------------------- |
| no dairy    | Excludes a recipe tagged "dairy-free" | Negated forms don't match             |
| no tomato   | Recipes with "tomatoes" survive       | Singular and plural are one exclusion |
| no corn     | Excludes cornstarch and peppercorn    | Word boundaries respected             |

#### Must return

Results containing none of the excluded ingredient — and when anything was dropped or couldn't be handled, that fact has to travel with the response. 

#### When it can't

| Condition                                | What comes back                                                        |
| ---------------------------------------- | ---------------------------------------------------------------------- |
| The excluded term can't be interpreted   | The specific term we couldn't handle, stated plainly.                  |
| Exclusion empties the set                | What emptied it. Never a quiet drop of the exclusion to fill the page. |


---

## 9. Rules that apply across every flow

### 8.1 Which constraints are absolute


| Tier                         | Examples                                                                                             | Behavior                                                                       |
| ---------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Always absolute              | Explicit exclusions ("no mushrooms"); explicitly requested ingredients ("with mushrooms and cheese") | Filter. Never relaxed, never ranked, never traded for a fuller qualifying set. |
| Absolute when stated plainly | "vegetarian," "gluten-free," "dairy-free"                                                            | Filter when stated flatly. Hedged forms drop to tier three.                    |
| Never absolute               | "quick," "easy," "cheap," "healthy"                                                                  | Rank only — unless the user gives a number, which then filters.                |

One consequence, worth working through:

**"Quick" is relative to the dish.** Quick for Thanksgiving and quick for a Tuesday are different numbers, so "quick" can never filter. A number can: "Thanksgiving dinner under two hours" is a hard 120 minutes.



### 8.2 Failing honestly

- Name what couldn't be satisfied, specifically. Not "no results."
- Never quietly drop a constraint to fill a page.
- Two good results beat three where the third is weak.
- Never assert something we don't know. "Uses a few things you said you have" is fine. "You already have everything for this" is not.

### 8.3 Personalization

The Data Science Flavor Profile and inferred makability inform ranking.  Inferred makability is a prediction, not inventory. It may help us choose recipes a user can plausibly make, but it never supports copy such as "you have everything for this." Ingredients the user explicitly provides are stronger evidence than inference.


### 8.5 When context expires

A conversation wandering across unrelated requests gets worse, not better.

**My position:** allergies and dietary restrictions survive a topic change. Everything else resets with the subject. A session ends on an agreed boundary — window closed, app backgrounded, signed out — and the next one starts clean.

The tension is real: people shouldn't repeat themselves, and context shouldn't pile up forever. Where that line sits is a judgment call worth making deliberately.

### 8.6 Speed, cost, and failure

Engineering named operationalizing as the hardest part and cost as a live concern. Both are requirements.

**Latency — to be filled in:**

| Interaction | Target | Unacceptable above |
|---|---|---|
| Simple request, no exclusions | | |
| Request with ingredient exclusions | | |
| Refinement on an existing set | | |
| Saves query | | |
| Follow-up suggestions ready | | |

From the product side: people tolerate more delay here than in site search, but not much more, and eight seconds is well past it. Suggestions must never delay the results they accompany.

**Cost.** Pre-generated content and cached interpretations beat live model calls wherever the result is the same. A simple unambiguous request shouldn't need the same machinery as a complicated one — if there's a fast path that skips the model, I'd like it considered rather than routing everything through the expensive path by default.

**Failure.** Every model-dependent step needs a written fallback including provider outage. The user can't tell which model answered. A timeout returns an honest failure, never a partial result.

### 8.7 Observability

Every conversation is reconstructable after the fact — what was understood, what was enforced, what was excluded and why, what ranked. When someone reports the assistant did something strange, we can pull that session and see it. 

---

## 10. What we keep between conversations

Nothing that affects results. Say "I'm vegetarian" today and you'll say it again tomorrow. That's a real cost and it's deliberate — storing what someone said in a chat raises questions about what we capture and how they correct it, and those deserve a proper answer.

One thing happens in the background: readable signals from conversations — ingredients mentioned, recurring constraints, time of day — captured so there's history to build from later. Auditable, changes nothing a user sees this quarter, and documented before collection starts. 

If there's an existing profile we could cheaply write a few values to, that changes this and makes the product noticeably better.

---

## 11. What a response has to carry

Scattered across the flows above, collected here because it's the actual contract and Xmartlabs is blocked on it. This is the information that has to be present:

| For every response                                                                                    | Why                                                                         |
| ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| The results, with enough recipe detail to render a card without a second call                         | -                                                                           |
| What the request was understood to mean                                                               | Lets the user catch a misread; drives the interpretation line in Flow 5     |
| Which constraints were enforced as hard, including required ingredients                               | The app and QA both need to distinguish filtered from ranked                |
| Which required ingredients each result satisfies                                                      | Flow 6 depends on all-of enforcement being inspectable                      |
| Whether a result is a complete or partial ingredient match, and what's missing                        | Partial fallback must never look like a qualifying result                   |
| What was excluded and why, when anything was                                                          | Flow 7 depends on this being visible rather than silent                     |
| What couldn't be done, when something couldn't                                                        | Honest failure is a response, not an empty result                           |
| Validated follow-up candidates, including an optional ingredient-refinement prompt for dinner results | Already gated on evidence and viability — see Flow 4 and its companion spec |
| Whatever the next turn needs                                                                          | Multi-turn refinement is the core of Flow 3                                 |
| Which path and model answered                                                                         | Debugging only, never displayed                                             |

One constraint on all of it: a response saying "I couldn't" is a normal response, not an error. The app should never have to infer failure from an empty list.

---

## 12. Known gaps

**No cook tracking.** Two of the best saves questions are unanswerable. Not ours, and the value accrues with time.

**Uneven metadata.** Course in particular has gaps, and conservative exclusion converts a coverage gap directly into thinner results. We should know the numbers before launch rather than inferring them from complaints.

**Inferred makability can be wrong.** Common behavior is evidence, not proof of what's in someone's kitchen today. We need Data Science to return enough confidence or evidence to control how strongly the signal affects ranking and what the product can honestly say.

**We don't currently know what someone commonly makes.** Until a reliable cook signal exists, Data Science has to infer from saves and other behavioral proxies. The product and evaluation should describe that honestly rather than treating proxy behavior as confirmed cooking.

**Cold start.** A user with little history gives Data Science less basis for taste or makability. The first set still has to be useful without either.

---

## 13. Decisions before ticketing

1. **What exactly will Data Science return for inferred makability?** We need ranked recipes plus enough evidence or confidence to use the signal honestly and debug it.
2. **How does the dinner recommender fall back for a user with little or no history?** Quality and stated constraints need to carry the result.
3. **Does controlled partial fallback ship in the MVP, or does the first version return complete matches only?** Either is honest; invisibly mixing them is not.
4. **Ingredient ID coverage on terms people actually include or exclude?** Determines how much of both ingredient flows rests on word matching.
5. **Latency targets and a cost ceiling.** The table in §9.6.
6. **Where does context expire, and what ends a session?** §9.5.
7. **Which saves questions launch?**
8. **Is there a fast path that skips the model for simple requests?** 
9. **Does background signal capture start now?** §10.
10. **Can Data Science tell us why a recipe was selected, not just that it ranked?**

---

