# PRD — Agentic Recipe Assistant (Persistent Companion)

**Status:** Draft v1 — for alignment and to seed a build sequence
**Working name:** MyRecipes Assistant (naming TBD — see §9)
**Author:** Andrew Alburn
**Last updated:** August 27, 2026
**Related:** `MYR_Intent-Driven_UI_Guiding_Principles.md` · `08_MyRecipes_AI_Strategy_Synthesis.md` · `06_Platform_vs_Feature_AI_Architecture.md` · `recipe-intelligence/overview.md` · `MyRecipes_Meal_Planner_Build_Brief.md` · `PRD - Intent Parsing & Constraint Enforcement.md` · `../Recipe-Specific Suggested Questions - Relevance Rules.md` · `PRD - Dinner Decision Engine.md` · `PRD - Catch a Vibe.md`

---

## 1. Overview

### 1.1 Feature Summary

The Agentic Recipe Assistant is a persistent, context-aware companion that travels with the user across the MyRecipes experience. It's always one tap away — on the homepage, on a recipe, in your saves, in the meal planner — and when it opens, it already knows what you're looking at. You can ask it a question or ask it to do something, and it responds in the context of that moment: recommending dinner tonight on the homepage, answering a substitution question on a recipe (or firing the voice companion to walk you through it hands-free), surfacing your most-cooked recipes in your saves, or generating — and saving — a week of meals it thinks you'll like.

The interaction model is Notion's assistant, adapted for cooking: a consistent entry point on every surface, context pre-loaded so you never re-explain yourself, contextual suggestions you can tap instead of typing, and responses that come back as usable product output — recipe cards, a plan, a labeled answer — not just a wall of text.

Underneath, the assistant is an **orchestration layer**. It doesn't reinvent recommendations, search, planning, or cooking knowledge. It interprets what the user wants, calls the right existing capability as a tool, and renders the result inline. This PRD scopes a **demo-quality v1** built on top of the current vibe-coded prototype: real enough to prove the interaction pattern end to end, honest about what's mocked.

### 1.2 The Bet, and Why Now

Two of our own strategy documents point in different directions, and this PRD deliberately splits the difference rather than pretending the tension doesn't exist.

- The **Intent-Driven UI Guiding Principles** describe exactly this: a persistent, context-aware companion that goes everywhere and reduces the distance between "what should I cook?" and a confident choice.
- The **AI Strategy Synthesis (doc 08)** argues, as its headline conclusion, that there should be *no single persistent visible AI assistant as the default experience* — because the Established Home Cook (~50% of the audience) experiences an overt, always-on chatbot as intrusive. Its model is a shared intelligence layer expressed through context-specific surfaces, invisible by default.

**The reconciliation this PRD commits to:** build the persistent companion, but make it *low-profile and opt-in* — available everywhere, never in the way. The entry point is consistent and always present, but quiet. The product still works completely without ever opening it. The assistant is not a chatbot demanding attention; it's a capability the user reaches for when they have a question or a job to do. This respects the Established Home Cook (who can ignore it entirely) while giving the Weeknight Reducer, Enthusiast, and System Thinker a single, learnable way to get help.

The strategic urgency is real and time-bounded (12–18 months per doc 08): LLMs are becoming a direct substitute for our core "what should I make?" job. Our defensible edge is trusted, tested, community-validated content plus personalization — a companion that's *grounded in our catalog and knows you* is the expression of that edge inside the product.

### 1.3 Business Goals & KPIs

**North-star ladder (unchanged):** Saves per session → MAU. Search success rate for search-adjacent behavior.

**What this feature is trying to move:**
- Shorten the path from intent to a confident, saved choice (reduce decision fatigue)
- Make the product feel like it knows the user, increasing return frequency
- Create a single, legible way to get help across the journey, deepening engagement beyond one-shot recipe lookups

**Primary KPI (production intent):** Saves per session, with assistant-attributed saves as the leading indicator.

**Leading indicators / how we'll know the pattern works (appropriate to a demo v1):**
- Assistant open rate per session, and repeat-open rate
- Query completion rate (user gets a usable answer, not a dead end)
- Recommendation acceptance (click-through / save from assistant-surfaced results)
- Plan generation completion (user generates and keeps a week plan)
- Qualitative: does it *feel* context-aware and trustworthy in usability testing

> Note: hard numeric targets are deferred to a production release. The v1 goal is to validate the interaction model and the orchestration architecture, not to hit a conversion number on mocked personalization.

### 1.4 Scope & Non-Scope (v1)

**In scope — surfaces (v1):**
- **Homepage / lean-back discovery** — "what's for dinner tonight?", inspiration-mode help
- **Recipe detail page** — questions about the recipe in view (substitutions, technique, scaling, dietary swaps), and launching the voice cooking companion
- **Saves / collections** — querying the user's own library ("my most-cooked", "quickest to make", "the chicken ones")
- **Meal planning** — a **Meal Plans** space (reached from Saves) with curated *recommended* plans on top and the user's own plans below; a meal plan is a **collection of recipes with a week focus**, generated by the assistant or built manually
- **Voice cooking mode** — the existing, already-built voice assistant that walks the user through a recipe hands-free, integrated so it's launchable from a recipe

**In scope — capabilities (v1):**
- **Contextual recommendations** — personalized "what should I make" grounded in (mocked) taste/history and (mocked) pantry
- **Library querying** — answering questions about the user's own saved/cooked recipes
- **Week meal-plan generation** — producing a pool of meals the user is likely to want, and **saving it as a plan** (a collection with a week focus — see write-actions below)
- **Meal plans as collections** — a meal plan reuses the collection primitive (create, name, add/remove recipes); MVP is a week-focused folder of recipes with no day/slot assignment
- **Recommended meal plans** — a curated/mocked set of starter plans the user can **preview and adopt** (fork an editable copy) so they never start from a blank slate
- **In-recipe cooking Q&A** — substitutions, technique, scaling, make-ahead, answered via the **OpenAI API**, labeled AI-generated (the Recipe Intelligence POC is not callable from the prototype in v1 — see §1.5)
- **Voice cooking walkthrough** — integrating the existing voice assistant so the user can fire it on a recipe and be guided through it hands-free
- **One write-action: save the generated plan** — the assistant can persist a generated week plan on explicit user confirmation (the minimum action that turns generation into a usable loop)

**Explicitly NOT in scope (v1):**
- **Replacing the search bar** — the Intent-Driven UI vision of "the companion *is* search" is a deliberate future step. v1 is **additive**: the existing search bar stays and continues to behave like traditional search. The assistant sits alongside it, not in place of it. This also keeps the assistant low-profile for the Established Home Cook.
- **Write-actions beyond meal plans** — the assistant does not, in v1, persist individual recipe saves or build/modify a shopping list on the user's behalf. In-scope writes are all **plan-scoped**: save a generated plan, add recipes to a plan (`add_to_plan`), and edit a plan (rename / remove recipes / delete) via the shared Collections edit mode. Broader actions are the most likely next extension (§7).
- **Grounded, cited cooking answers** — deferred until the Recipe Intelligence POC is reachable; v1 answers cooking questions via the OpenAI API, clearly labeled as AI-generated.
- **Cross-session long-term memory** — session-scoped context only in v1 (see §3.4).
- **Real personalization/ML** — v1 uses a single mocked preference/pantry persona (see §4).

**Future (tracked, not now):** search absorption, broader write-actions, grounded/cited cooking answers via Recipe Intelligence, real personalization model, cross-session memory, multi-brand grounding depth. See §7.

### 1.5 Assumptions & Dependencies

**Assumptions:**
- The prototype is a web app with a real recipe catalog (metadata: title, image, rating/reviews, time, ingredients, tags/cuisine/method) but **thin or mocked** user personalization, cook history, and pantry.
- The prototype **already** returns recipe results dynamically for a query and pulls in that recipe's ingredient and directions data on demand. This retrieval pipeline is real and wired — v1 taps directly into it rather than mocking recipe results or recipe content.
- Demo-quality is acceptable for v1: where a real capability doesn't exist yet, a scripted/mocked-but-realistic tool response is fine, provided the *interaction and orchestration* are real (see §4).
- An LLM is available to the prototype for intent interpretation, response synthesis, and labeled fallback.

**Dependencies (as tools the orchestrator calls — reused, not rebuilt):**
- **Existing dynamic recipe retrieval (already built)** — the prototype's query → recipe-results pipeline, including on-demand ingredient and directions data. v1 taps this directly for recommendations, library results, plan generation, recipe context for cooking Q&A, and the voice companion's step data.
- **Recommendation / retrieval intelligence** — Search 2.0 intent parsing + constraint enforcement (`PRD - Intent Parsing & Constraint Enforcement.md`) for turning natural language into constraint-reliable queries against that retrieval pipeline.
- **Meal planning** — the meal planner's constraint-reliable recommendation engine and week-pool output model (`MyRecipes_Meal_Planner_Build_Brief.md`).
- **Cooking Q&A** — the **OpenAI API**, labeled AI-generated, in v1. The Recipe Intelligence POC (`recipe-intelligence/overview.md`) is **not callable from the prototype** yet; grounded, cited answers are a future swap behind the same tool interface.
- **Voice cooking companion** — an **existing, already-built** voice assistant that walks a user through a recipe hands-free. v1 integrates it as a launchable capability rather than rebuilding it.
- **User signals** — saves, cook history, ratings, and pantry state (mocked as a single persona in v1; real in production).

> Where a dependency isn't production-ready, v1 stubs it behind a stable tool interface so the assistant's architecture doesn't change when the real capability lands. This applies specifically to cooking Q&A: v1 uses the OpenAI API today, and swaps to Recipe Intelligence later without changing the orchestrator or UI.

---

## 2. Users & Context

### 2.1 Personas & AI Posture

The assistant must behave differently for different users. From doc 08, the posture per persona:

| Persona | What they need | Assistant posture in v1 |
|---|---|---|
| **Established Home Cook** (~50%) | Relevance and trust, no disruption | Present but quiet. Never auto-opens, never nags. Fully ignorable. The product works without it. |
| **Weeknight Reducer** | One good answer, fast, feasibility confirmed | The lead use case: "what's for dinner tonight?" → 2–3 strong, constraint-aware options. |
| **Enthusiast** | Conviction, technique confidence, taste expansion | In-recipe Q&A (labeled AI answers in v1), knowledgeable recommendations, and hands-free voice walkthrough while cooking. |
| **System Thinker** | Whole-week planning, resilient replanning | Week-plan generation; refinement without re-stating constraints. |

**The hard visibility rule (from doc 08):** if opening the assistant were removed, the Established Home Cook's experience should be unchanged. That's the test for "low-profile."

### 2.2 What "Context-Aware" Means

When the assistant opens, it receives a **context object** describing the user's current situation, so the user never re-explains. Minimum context by surface:

| Surface | Context passed on open |
|---|---|
| Homepage / discovery | Persona (mocked), time of day, recent activity, active homepage modules |
| Recipe detail | The full recipe in view (title, ingredients, steps, tags, time, rating); voice-companion launch available |
| Saves / collections | The user's saved set (+ mocked cook-history and rating signals), current collection/filter |
| Meal planning | Current plan state — active constraints and already-selected meals |
| Voice cooking mode | The recipe being cooked (title, ingredients, steps); handed off to the existing voice assistant |

Context-awareness shows up in three places: (1) the **opening state** reflects what you're looking at, (2) **suggested prompts** are specific to the moment, and (3) the assistant's **answers** assume the current context without being told.

---

## 3. Product Requirements

### 3.1 Core Interaction Model

**FR1 — Persistent, low-profile entry point**
- **User story:** As a user, I can open the assistant from anywhere in the product without hunting for it, and ignore it completely if I don't want it.
- **Behavior:** A consistent, low-profile trigger present on every in-scope surface (e.g., a floating action button on mobile / anchored affordance on desktop — exact treatment is a design exploration). It never auto-opens and never interrupts.
- **Acceptance criteria:**
  - The entry point is present and visually consistent across Home, Recipe, Saves, and Planning.
  - The assistant only opens on explicit user action.
  - With the assistant closed, every in-scope surface is fully functional.

**FR2 — Non-blocking surface (drawer / sheet)**
- **User story:** As a user, I can consult the assistant while still seeing what I was looking at.
- **Behavior:** The assistant opens as a side drawer (desktop) or bottom sheet (mobile) that overlays without replacing the underlying content. The user can reference the recipe or results while it's open.
- **Acceptance criteria:**
  - Underlying content remains visible/scrollable while the assistant is open.
  - Dismissing the assistant returns the user to their exact prior state.

**FR3 — Context-loaded opening state**
- **User story:** As a user, when I open the assistant it already understands my situation.
- **Behavior:** On open, the assistant renders an opening state that reflects the current context object (§2.2) and shows 3–5 context-specific suggested prompts. No blank slate.
- **Acceptance criteria:**
  - Opening state and suggested prompts differ by surface and reflect the actual content in view.
  - On a recipe page, the user can ask "can I swap the butter?" without naming the recipe.

**FR4 — Contextual clickable suggestions (first-class, always present)**
- **User story:** As a user, I should rarely *have* to type. The assistant shows me relevant things I can tap, appropriate to where I am and what I'm doing.
- **Behavior:** Typing is always available, but it is never the only path. Every opening state presents 3–5 **contextually aware, tappable suggestions** (e.g., "What's for dinner tonight?" on the homepage) as a primary, not decorative, element. Suggestions are specific to the moment and rotate with context — never a static list reused across surfaces. After a response, follow-up suggestions are generated from the current result/intent state (e.g., "quicker", "vegetarian", "more like the second one"), consistent with the meal planner's dynamic-chip logic — not pre-set.
- **Recipe-page relevance rules:** Recipe-detail suggestions must follow `../Recipe-Specific Suggested Questions - Relevance Rules.md`: every displayed question requires inspectable evidence from the recipe, must pass the hard eligibility checks and relevance threshold, and must not be added merely to fill a fixed number of slots.
- **Acceptance criteria:**
  - Every surface's opening state shows clickable suggestions mapped to that surface's primary jobs (§3.2), with zero typing required to run a core flow.
  - Tapping a suggestion runs it immediately.
  - Suggestions differ by surface and reflect the actual content in view; follow-up suggestions reflect the last result, not a fixed set.
  - A specific-enough request that's already well-resolved shows no noise-adding follow-ups (per the meal planner chip rule).

**FR5 — Conversational continuity (session-scoped)**
- **Behavior:** The assistant handles multi-turn follow-ups within a session ("make it quicker", "no mushrooms", "more like the second one"), carrying prior turns as context. Continuity persists as the user navigates between surfaces within the session.
- **Acceptance criteria:** A follow-up that omits previously stated constraints still respects them. Navigating surfaces mid-session does not reset the conversation.

### 3.2 Functional Requirements by Surface

Each surface reuses the same shell (§3.1) but with a different opening state, prompts, and default tools.

**FR6 — Homepage / discovery: "what's for dinner tonight?"**
- **Detailed feature specification:** [[PRD - Dinner Decision Engine]]
- **Typed-query semantic planning specification:** [[PRD - Assistant Semantic Query Planner]]
- **Photo-to-vibe recommendation specification:** [[PRD - Catch a Vibe]]
- **User story:** As a Weeknight Reducer on the homepage, I ask what to make tonight and get a few strong, feasible options grounded in what I like and (roughly) have.
- **Behavior:** Interprets the ask → calls the recommendation tool with taste/history + pantry signals (mocked) + any stated constraints → returns **2–3 strong options** (not a forced single answer, per doc 08) as recipe cards with conviction signals (rating, review count, time, a differentiating "why this").
- **Acceptance criteria:**
  - Returns 2–3 options by default; each is a real catalog recipe with rating and time.
  - Stated constraints (e.g., "quick", "no pork") are respected literally (see §3.6).
  - Suggested prompts include at least: "What's for dinner tonight?", "Something quick with what I have", "Surprise me with something new".

**FR7 — Recipe detail: in-recipe Q&A**
- **User story:** As a user on a recipe, I ask a question about *this* recipe and get a helpful, clearly-labeled answer.
- **Behavior:** With the recipe in context, answers cooking questions (substitution, technique, scaling, make-ahead, dietary swap) via the **OpenAI API**, passing the recipe as context. Answers are **clearly labeled as AI-generated** in v1. (The Recipe Intelligence grounded/cited path is a future swap behind the same tool interface — see §1.5, §7.)
- **Suggested-question quality:** Candidate generation, evidence checks, scoring, deduplication, and fallback behavior are defined in `../Recipe-Specific Suggested Questions - Relevance Rules.md`. If fewer than three candidates meet the threshold, the assistant shows fewer than three rather than padding with generic prompts.
- **Acceptance criteria:**
  - Answers are clearly labeled as AI-generated.
  - The recipe in view is passed as context; the user never has to name the recipe.
  - Clickable suggestions include recipe-specific asks (e.g., "Can I make this dairy-free?", "Scale to 6 servings", "What can I use instead of [ingredient]?").
  - When the model can't answer confidently, it says so rather than fabricating (conservative failure, §3.6).

**FR7a — Launch the voice cooking companion**
- **User story:** As a user ready to cook, I can start the voice assistant that walks me through this recipe hands-free.
- **Behavior:** From a recipe (and from the assistant on a recipe), the user can launch the **existing, already-built voice cooking companion**, handing off the current recipe as context. This is an integration of an existing capability, not a rebuild.
- **Acceptance criteria:**
  - A clear, low-profile way to start voice cooking mode exists on the recipe surface.
  - The current recipe is passed to the voice companion on launch (no re-selection).
  - Exiting voice mode returns the user to the recipe in its prior state.

**FR8 — Saves / collections: query my library**
- **User story:** As a user in my saves, I ask questions about my own recipes and get answers over my library, not the whole catalog.
- **Behavior:** Scopes retrieval to the user's saved set (+ mocked cook-history/ratings). Handles ranking/filtering asks: "my most-cooked", "quickest to make", "the chicken ones", "what haven't I made in a while".
- **Acceptance criteria:**
  - Results are drawn only from the user's library.
  - Ranking/sort asks (most-cooked, quickest) return correctly ordered results from the (mocked) history signals.
  - Suggested prompts include: "My most-cooked recipes", "Quickest to make", "Something I saved but never made".

**FR9 — Meal planning: generate my week**
- **User story:** As a System Thinker, I ask for a week of meals and get a constraint-reliable pool I'm likely to want.
- **Behavior:** Generates a **week-pool** (not rigid named slots) of catalog recipes matching stated + inferred constraints, rendered as evaluation cards. Follows the meal planner's core rule: **the plan view is the output; the chat is the input.** Refinements ("more budget-friendly", "swap the third one") update the plan with a brief confirmation, not a prose essay.
- **Acceptance criteria:**
  - Output is a set of real catalog recipes as cards, with constraint-match tags.
  - Refinements carry full plan context (user never re-states active constraints).
  - The response is the updated plan + a one-line confirmation — never a long prose block.
  - The user can **save the generated plan** on explicit confirmation (the one v1 write-action, FR9a).

**FR9a — Save the generated plan (v1 write-action)**
- **User story:** As a user, once I like a generated week, I can save it so it's actually mine — not just a throwaway view.
- **Behavior:** The assistant can persist the current generated plan on an explicit user action ("Save this plan"). This is the single write-action permitted in v1. It never fires implicitly. The plan is persisted **as a collection** (kind = plan), landing in the user's Meal Plans space (FR9c).
- **Acceptance criteria:**
  - Saving requires an explicit user tap/confirmation; the assistant never persists a plan on its own.
  - After saving, the plan is retrievable in the **Meal Plans space** as one of "your plans" (a collection record).
  - Save success/failure is confirmed to the user in one line (per FR15 labeling / FR14 failure rules).

**FR9b — Meal plans are collections (unified model)**
- **User story:** As a user, my meal plans live alongside my collections and behave the same way — they're just focused on a week.
- **Behavior:** A meal plan is a **collection of recipes** with a plan discriminator and a lightweight **"Week of…" label**. It reuses the collection primitive (create, name, add/remove recipes, describe) and the **same persistence store**. v1 does **not** assign recipes to days or enforce ordering — a plan is a week-focused folder of recipes. Day/slot assignment, ordering, and shopping lists are future (§7).
- **Acceptance criteria:**
  - A saved, generated, or adopted plan is a collection record (kind = plan), **editable via the same Collections edit mode** — rename (Edit details), remove recipes (× + undo + confirm), and delete — plus the shared empty state.
  - The assistant can also **add recipes to the plan in view** (`add_to_plan`) and tweak it in place (`refine`); manual add/remove uses the standard Collections UI.
  - Plans may carry an optional "Week of…" label; no day/slot assignment in v1.

**FR9c — Meal Plans space: recommended + yours (off Saves)**
- **User story:** As a user, I open a Meal Plans space from Saves and see plans recommended for me at the top and my own plans below, so I never start from a blank slate.
- **Behavior:** A dedicated **Meal Plans** surface reached from the Saves page, with two zones: (1) **Recommended for you** — a small set of curated/personalized starter plans (**mocked** in v1), and (2) **Your meal plans** — plans the user created, generated with the assistant, or adopted. Recommended plans are **previewable before adopting**: the user can open a plan to see its recipes, and adopt it via an explicit **"+ Add to your plans"** affordance on the plan card (and on the preview), which **forks an editable copy** into their plans. Collections and meal plans share one data model but are surfaced separately (plans have the recommended zone + week focus).
- **Acceptance criteria:**
  - The Meal Plans space is reachable from Saves and shows a Recommended zone above a "Your plans" zone.
  - A recommended plan can be **previewed** (its recipes viewed) without adding it.
  - Adopting is explicit (a "+" / "Add to your plans" affordance) and creates an **editable copy** in the user's plans; it never auto-adds.
  - Recommended plans in v1 are a curated/mocked set (consistent with §4).

### 3.3 Agent / Orchestration Architecture

**FR10 — Intent routing + tool orchestration**
- **Detailed semantic-planning specification:** [[PRD - Assistant Semantic Query Planner]]
- **User story (system):** Turn a natural-language request plus context into the right capability call, then render the result.
- **Behavior:** The assistant is a thin orchestrator with a small, well-defined **tool catalog** (see Appendix B). Flow: interpret intent (reusing Search 2.0's structured intent object, extended with surface context) → select tool(s) → call → render result as an inline component → support follow-up. The orchestrator holds no domain logic of its own; capability logic lives in the tools.
- **Acceptance criteria:**
  - Each in-scope capability (§1.4) maps to a defined tool with a stable interface.
  - Swapping a mocked tool for a real one requires no change to the orchestrator or UI.
  - Intent that matches no tool returns a graceful "here's what I can help with" rather than a hallucinated answer.

**Why orchestrator-first:** it keeps one intelligence system with multiple UX roles (doc 08 principle #7 — avoid a fragmented intelligence stack), lets each real capability mature independently, and means the demo's mocks are swappable without rework.

### 3.4 Context & Intent Object

**FR11 — Extend the intent object with context and session state**
- **Behavior:** Reuse the structured intent object from `PRD - Intent Parsing & Constraint Enforcement.md` (ingredient constraints, tag constraints, semantic signals, unresolved, metadata) and add: `surface_context` (what the user is looking at, §2.2) and `session_state` (prior turns / active constraints within the session).
- **Acceptance criteria:**
  - Constraints parsed in an earlier turn persist across follow-ups and surface changes within the session.
  - The object is inspectable internally (debuggable), consistent with the Search 2.0 approach.
- **v1 boundary:** session-scoped only; no cross-session long-term memory. Persistent preference memory is a production dependency, not a v1 build.

See Appendix A for an illustrative object.

### 3.5 Response & Component Model

**FR12 — Intent shapes the response format**
- **User story:** As a user, I get answers as usable product output, not paragraphs I have to parse.
- **Behavior:** Responses render as **inline UI components** chosen by intent: a set of recipe cards (recommendation/discovery), a single labeled answer (recipe Q&A), a ranked/filtered list (library query), an editable plan view (planning). Text is the connective tissue, not the payload.
- **Acceptance criteria:**
  - Recommendation and library results render as cards, not text lists.
  - Planning renders the plan view as the primary output with a one-line confirmation.
  - No capability returns a long prose response where a component is the right answer (explicit anti-pattern from the meal planner brief).

### 3.6 Trust & Failure Modes

Trust is the product thesis (content-as-moat, "trust over cleverness"). These are non-negotiable.

**FR13 — Respect explicit constraints literally**
- Exclusions ("no mushrooms", "without eggs") are hard-enforced, never post-filtered away. Consistent with the Search 2.0 constraint-enforcement PRD.
- **Acceptance criteria:** Results violating an explicit exclusion are never shown.

**FR14 — Conservative failure**
- When the system can't confidently satisfy a request, it says so ("I couldn't find a match for that") and offers a next step — rather than returning a "close enough" wrong answer. Constraint conflicts surface a clarifying follow-up ("I heard X, I wasn't sure about Y — does this look right?").
- **Acceptance criteria:** Zero silent constraint violations. Unresolvable asks produce an honest miss + a path forward, not a fabricated result.

**FR15 — Label AI-generated cooking answers (v1)**
- In v1, cooking answers come from the OpenAI API and must be **clearly labeled as AI-generated**. When the model can't answer confidently, it says so rather than fabricating. (Future: grounded, cited answers via Recipe Intelligence carry a real citation; that path swaps in behind the same tool interface.)
- **Acceptance criteria:** Every cooking answer is visibly labeled as AI-generated; no fabricated citations or sources are presented as grounded.

**FR16 — Plan-scoped write-actions; no other side effects (v1)**
- v1 write-actions are **scoped to meal plans**: saving a generated week plan (FR9a), **adding recipes to a plan** (`add_to_plan`), and **editing a plan** (rename / remove recipes / delete) via the shared Collections edit mode. All are explicit user actions. The assistant does not persist individual recipe saves or build/modify a shopping list on the user's behalf.
- **Acceptance criteria:** Every plan write is an explicit user action (tap/confirm) — the assistant never persists implicitly. No assistant action changes other persisted user data (individual saves, shopping lists) without an explicit commit through standard product UI.

### 3.7 Non-Functional Requirements

- **Latency:** Responses should feel conversational. Where a real tool is slow or mocked, show an intentional "thinking" state; never a silent hang.
- **Resilience:** Tool/parse failures degrade gracefully to an honest message with a retry or alternative — never a crash or an empty response.
- **Legibility:** The orchestrator, tool interfaces, and intent mapping must be documented and understandable (not a black box), so the internal team can extend them. (Consistent with the meal planner legibility requirement.)
- **Platform:** Works on the prototype's primary platform (assumed web); layout adapts between desktop drawer and mobile sheet.

---

## 4. What's Real vs. Mocked in v1

Given demo ambition + real recipes / thin personalization, we're explicit about the seams so the build stays honest and the architecture stays production-shaped.

| Layer | v1 approach | Production path |
|---|---|---|
| Recipe retrieval + content (query results, ingredients, directions) | **Real** — the prototype's existing dynamic pipeline, tapped directly | Same |
| Intent interpretation / routing | **Real** (LLM + intent object) | Same, hardened |
| Orchestration + tool interfaces | **Real** (stable contracts) | Same |
| In-recipe cooking Q&A | **Real via OpenAI API, labeled AI-generated** (Recipe Intelligence not callable in v1) | Recipe Intelligence grounded/cited corpus (swap behind same interface) |
| Voice cooking companion | **Real** — integrate the already-built voice assistant | Deeper native, step-aware integration |
| Recommendations / retrieval | Real catalog query; **ranking personalization mocked** (single fixed persona) | Search 2.0 + preference model |
| User signals (saves, cook history, ratings, pantry) | **Mocked** — a single believable persona profile | Real behavioral signals + pantry capture |
| Week-plan generation | Real catalog retrieval + constraint filtering; **personalization mocked** | Meal planner engine |
| Recommended meal plans | **Curated / mocked** starter plans (single persona) | Personalized plan recommendations |
| Meal-plan storage | **Real** — reuses the collections store (a plan = a collection, kind = plan) | Same, + day/slot & shopping-list metadata |
| Memory | **Session-scoped only** | Persistent preference memory |
| Write-actions | **Plan-scoped** (explicit): save a generated plan, `add_to_plan`, and edit/rename/remove/delete a plan via Collections edit mode; create/adopt via product UI | Full action set (individual saves, shopping list) |

**Principle:** mock the *personalization depth*, never the *interaction, architecture, or recipe content*. Recipe retrieval and content (results, ingredients, directions) are real via the existing pipeline; what's mocked is who the user is and what they've cooked. The demo should let someone experience the persistent, context-aware companion for real, while we're honest that "knows what I like" is a single fixed persona until the preference model exists.

---

## 5. MVP Definition

v1 is successful when, on the prototype, a user can:

1. Open a **low-profile, persistent** assistant from Home, Recipe, Saves, and Planning — and ignore it with zero cost.
2. On every surface, run a core flow **entirely from clickable, context-aware suggestions** without typing (typing is available, not required).
3. On the **homepage**, ask "what's for dinner tonight?" and get **2–3 real, constraint-respecting** options as cards.
4. On a **recipe**, ask a substitution/technique/scaling question and get a **clearly-labeled AI answer** without naming the recipe — and **launch the voice cooking companion** hands-free.
5. In **saves**, ask for "most-cooked" / "quickest" and get correctly ranked results **from their own library**.
6. In **planning**, open a **Meal Plans** space (from Saves) with **recommended** plans (previewable, adopt with one tap → editable copy) above **your** plans; generate a **week-pool** of real recipes with the assistant, refine it without re-stating constraints (plan as the output, not prose), and **save it as a plan** (a collection with a "Week of…" label).
7. Experience real **context-awareness, session continuity, and conservative failure** throughout — no silent constraint violations.

If those hold together in one coherent shell, the interaction model and orchestration architecture are validated.

---

## 6. Out of Scope (v1) — restated for clarity

Search-bar replacement · write-actions beyond saving a plan · grounded/cited cooking answers (Recipe Intelligence) · real personalization model · cross-session memory · multi-brand grounding depth · numeric KPI targets.

---

## 7. Future Enhancements

- **Broader write-actions** (most likely next step): beyond saving/editing plans, let the assistant save individual recipes and build a shopping list — each with explicit confirmation. This is what fully turns the assistant from an answer engine into an action loop.
- **Grounded, cited cooking answers:** swap the OpenAI-backed cooking Q&A for Recipe Intelligence (grounded quote + citation + source link) behind the same tool interface, once the POC is callable. This is the trust upgrade for the cooking-help path.
- **Deeper voice integration:** evolve the already-integrated voice companion toward step-aware, in-context guidance as recipes become native.
- **Search absorption:** the companion becomes the primary discovery input, per the Intent-Driven UI vision (deferred to protect the Established Home Cook and de-risk v1).
- **Real personalization + persistent memory:** swap the single mocked persona for the shared intelligence layer (doc 08 Phase 1).
- **Proactive moments:** the assistant offering help at high-value moments (still opt-in, still respecting the EHC).

---

## 8. Open Questions

1. **Demo audience:** is v1 primarily for internal leadership alignment (Kevin/Rich), user testing, or both? (Shapes how much polish vs. instrumentation.)

**Resolved (from scoping):**
- ~~Recipe Intelligence reachability~~ → RI POC is **not callable**; v1 answers cooking questions via the **OpenAI API**, labeled AI-generated.
- ~~Mocked profile fidelity~~ → **single persona** for v1.
- ~~Week-plan persistence~~ → **yes**, include the save-plan write-action (FR9a).

**Resolved (from the prototype build — see Appendix D):**
- ~~Prototype stack & platform~~ → **Expo / React Native**, running as an **Expo web** build for v1 (the WebRTC voice mode and the Metro dev-server proxy are web-only). The assistant surface is implemented as a **bottom sheet**; a desktop side-drawer is deferred.
- ~~Voice companion integration~~ → the existing **cook-mate** voice assistant (OpenAI **Realtime API** over WebRTC) was ported into the prototype and now **docks onto the live recipe page** as an overlay rather than a separate screen. The recipe in view is handed off on launch, and exiting returns to it in its prior state.
- ~~Entry-point treatment~~ → **Variant A: a low-profile "Mr. Hearty" companion button**, rendered **inline in each surface's bottom bar** (the Home/Saves/Planning nav and the recipe action bar) so placement stays consistent on the mobile-only breakpoint. It never auto-opens.

---

## 9. Naming Note

Doc 08 cautions against a branded AI character or persistent named chatbot. Recommend keeping v1 unbranded ("Assistant") and low-key, and treating naming as a separate decision once the interaction pattern is validated.

---

## Appendix A — Illustrative Context + Intent Object (non-binding)

Extends the Search 2.0 intent object with surface context and session state. Conceptual, not an API contract.

```json
{
  "request": "something quick for the kids, no mushrooms",
  "ingredient_constraints": { "exclusions": ["mushrooms"], "inclusions": [] },
  "tag_constraints": { "time": "<30m", "audience": "kid-friendly" },
  "semantic_signals": [],
  "unresolved": [],
  "surface_context": {
    "surface": "homepage",
    "time_of_day": "evening",
    "persona": "weeknight_reducer",
    "recipe_in_view": null,
    "library_scope": null,
    "plan_state": null
  },
  "session_state": {
    "prior_constraints": ["no pork"],
    "prior_turns": 2
  },
  "metadata": { "confidence": "high", "route": "recommendation_tool" }
}
```

## Appendix B — v1 Tool Catalog (orchestrator interface)

| Tool | Purpose | Backing capability (v1) | Returns |
|---|---|---|---|
| `recommend_recipes` | Personalized "what to make" | Existing retrieval pipeline + constraint enforcement; **mocked** ranking personalization (single persona) | 2–3 recipe cards + "why this" |
| `query_library` | Answer questions over the user's own saves | User library (real set) + **mocked** cook-history/ratings | ranked/filtered recipe list |
| `generate_week_plan` | Produce a week-pool of meals | Existing retrieval pipeline + constraint filtering; **mocked** personalization | plan view (evaluation cards) |
| `save_plan` | Persist the current generated plan as a plan-collection (v1 write-action) | Prototype **collections store** (a plan = a collection, kind = plan); **explicit user confirmation required** | save confirmation (1 line) |
| `add_to_plan` | Add recipes to the plan in view (in-plan surface) | Existing retrieval + persona/constraints; appends the chosen recipe to the plan in view | recipe cards with an "Add" action |
| `answer_cooking_question` | In-recipe cooking Q&A | **OpenAI API**, recipe passed as context, **labeled AI-generated** (RI swap later) | labeled answer |
| `launch_voice_companion` | Start hands-free voice cooking mode | **Existing voice assistant**, current recipe handed off | voice session on the recipe |
| `refine` | Apply a follow-up to the last result | Re-invokes the relevant tool with full session context | updated component + 1-line confirmation |

## Appendix C — Example Flows

**Homepage — dinner tonight**
> User (homepage): "what's for dinner tonight?"
> Assistant: renders 2–3 cards — each a real recipe with rating, time, and a one-line "why this fits" — grounded in the (mocked) taste profile. Suggested follow-ups: "quicker", "vegetarian", "use what I have".

**Recipe — substitution (v1)**
> User (on a recipe): "can I use Greek yogurt instead of sour cream?"
> Assistant: an answer from the OpenAI API with the recipe passed as context, **labeled AI-generated**, scoped to this recipe; no need to name it. (Future: grounded quote + citation via Recipe Intelligence.)

**Recipe — start cooking (voice)**
> User (on a recipe): taps "Cook with voice" (a clickable suggestion).
> Assistant: hands the recipe to the existing voice companion, which walks the user through it hands-free. Exiting returns to the recipe.

**Saves — library query**
> User (in saves): "which of my recipes are quickest to make?"
> Assistant: ranked list drawn only from the user's saved set, sorted by total time.

**Planning — build and save my week**
> User (in planner): "plan me 5 dinners for the week, nothing with pork"
> Assistant: renders a 5-recipe week-pool as evaluation cards with constraint-match tags + one-line confirmation. Follow-up "make the week cheaper" updates the plan in place — no re-stating "no pork". "Save this plan" persists it (the v1 write-action).

## Appendix D — Prototype Implementation Status (as of Jul 24, 2026)

Built in the `myrecipes-poc` prototype (**Expo / React Native**, run as an **Expo web** build). This maps the v1 spec to what is actually working today so the PRD and the demo stay in sync.

**Architecture**
- **Orchestrator + tool catalog:** built (`src/assistant/orchestrator.ts`, `src/assistant/tools/*`). Every Appendix B tool exists behind a stable interface; the orchestrator holds no domain logic (FR10).
- **Intent object + session state:** built (`src/assistant/types.ts`, `session.ts`). Constraints parsed in one turn persist across follow-ups and surface changes within the session (FR5, FR11).
- **Recipe retrieval + content:** **real** — the lead dev's `site_search` MCP (live, Keycloak-authed via a Metro proxy) with an offline local corpus fallback (`src/services/recipeSearch/*`). Template-level results carry ingredients + directions inline.

**Tool catalog (Appendix B) → status**

| Tool | Status in prototype |
|---|---|
| `recommend_recipes` | Built — real retrieval + constraint enforcement; **mocked** persona ranking; variety/no-repeat logic so results don't repeat |
| `query_library` | Built — scoped to a **mocked** saved set with cook-history/rating signals; ranking asks (most-cooked, quickest) work |
| `generate_week_plan` | Built — week-pool of real catalog recipes + constraint filtering, rendered as evaluation cards |
| `save_plan` | Built — in-memory plan store, **explicit confirmation** only; saved plans surface on a Planning screen |
| `answer_cooking_question` | Built — **OpenAI API** (model `gpt-5.6-terra`), recipe passed as context, **labeled AI-generated** |
| `launch_voice_companion` | Built — **docked voice overlay** on the live recipe (cook-mate port) |
| `refine` | Built — re-invokes the last tool with merged constraints, in-place update + one-line confirmation |

**Surfaces**
- **Home, Recipe, Saves, Planning:** assistant entry present, context wired, opening state + tappable suggestions per surface (FR1–FR4, FR6–FR9a).
- **Search + Collections:** assistant intentionally **absent** (not in-scope surfaces); Search has its own default landing state (trending searches + tappable categories).
- Non-blocking **bottom sheet** overlays content and returns to prior state on dismiss (FR2).

**Notable deltas / notes**
- The entry point is rendered **inline in each bottom bar** (not a free-floating FAB) so the button never overlaps other controls on the mobile-only breakpoint.
- **Voice cooking is web-only** (WebRTC) and runs against the OpenAI **Realtime API** via a Metro dev-server token/SDP proxy; it now docks onto the recipe rather than opening a separate screen.
- **Metadata enrichment** (diet / cuisine / course) joins a taxonomy sidecar onto live results to **hard-enforce dietary constraints** (FR13); dietary asks fall back to a diet-word seed when a dish seed filters to empty.
- **Figma interaction mockups** (groups A–E, including the docked voice-on-recipe flow) live in a separate private file for design exploration.
- **Meal Plans (spec update, Jul 24 — not yet built):** the PRD now unifies meal plans into the **collections model** with a Recommended + Your-plans space off Saves, previewable recommended plans, and adopt-as-fork (FR9b/FR9c). The prototype currently uses a separate in-memory plan store and a minimal Planning screen; unifying plans into the collections store and building the two-zone Meal Plans space is the next planning-surface build.
