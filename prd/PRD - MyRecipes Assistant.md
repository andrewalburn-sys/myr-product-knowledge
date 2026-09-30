---
kb_id: assistant-product-prd
title: PRD — MyRecipes Assistant
authority: canonical
status: draft-engineering-review
owner: Andrew Alburn
audience:
  - product
  - design
  - engineering
applies_to:
  - production
last_reviewed: 2026-09-30
supersedes:
  - prd/poc/PRD - Agentic Recipe Assistant.md
superseded_by: null
related_code: []
related_docs:
  - prd/PRD - Assistant Discovery MVP (Backend).md
  - prd/Assistant Conversation and Interaction Behavior.md
  - prd/PRD - Assistant Semantic Query Planner.md
---

# PRD — MyRecipes Assistant

**Status:** Draft for engineering review
**Author:** Andrew Alburn
**Audience:** Food Search & Discovery engineering
**Supersedes:** `poc/PRD - Agentic Recipe Assistant.md` (retained as the prototype record)
**Last updated:** September 18, 2026

**What this is:** the product definition for the MyRecipes Assistant — what it does, who it's for, and how we'll know it worked. It deliberately does not describe architecture, services, or sequencing. Those live in `Assistant Backend Capability Map.md` and `Build Plan - MyRecipes Assistant.md`.

**First release:** `PRD - Assistant Discovery MVP (Backend).md` — Q4 scope is features 1 and 3 (Conversational Discovery and My Library, Queryable), app only.

**Feature detail lives in:** `PRD - Assistant Semantic Query Planner.md` · `Assistant Follow-Up Suggestions - Relevance Rules.md` · `Recipe-Specific Suggested Questions - Relevance Rules.md`

**POC specs, until rewritten:** `poc/PRD - Dinner Decision Engine.md` · `poc/PRD - Photo-Based Recipe Discovery.md` · `poc/PRD - User Recommendation Preferences.md`

---



# Problem Alignment

## Goals

1. **Shorten the path from "I don't know" to a confident choice.** This is the core job. Measured by saves per session and signals the user cooked it.
2. **Make the product feel like it knows the user,** so it's worth coming back to. Measured by return frequency and repeat assistant use.
3. **Answer cooking questions from our own content, with a real citation** — the thing a general model can't replicate. Measured by grounded-answer rate and honest-miss rate.
4. **Give users one learnable way to get help** across discovery, cooking, and planning, rather than a scatter of unrelated AI features.
5. **Never violate a stated constraint.** Trust is the product. A single "vegetarian" result with chicken in it costs more than ten good recommendations earn.

---



# Solution Alignment



## What the assistant is

A single, consistent companion available across the MyRecipes experience. It's always one tap away, it already knows what the user is looking at when it opens, and it answers in the format the question deserves — recipe cards for a recommendation, a cited answer for a cooking question, a plan for a week of meals. It is never a wall of text.

Two things define its character:

**It's context-aware, so the user never re-explains.** On a recipe, "can I swap the butter?" works without naming the recipe. In saves, "the chicken ones" means the user's chicken recipes, not the catalog's. Constraints stated once hold for the rest of the conversation.

**It's low-profile and completely optional.** Roughly half our audience — the Established Home Cook — experiences an always-on AI presence as intrusive. The test: if we deleted the assistant entry point, their experience should be unchanged. The assistant never auto-opens, never interrupts, and the product works fully without it.

## Who it's for


| Persona                          | What they need                                    | What the assistant does for them                                                         |
| -------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Established Home Cook** (~50%) | Relevance and trust, no disruption                | Present but quiet. Fully ignorable. Never in the way.                                    |
| **Weeknight Reducer**            | One good answer, fast, feasible                   | The lead use case — "what's for dinner tonight" into two or three strong options.        |
| **Enthusiast**                   | Conviction, technique confidence, taste expansion | Cited cooking answers, knowledgeable recommendations, hands-free guidance while cooking. |
| **System Thinker**               | Whole-week planning, resilient replanning         | Plan generation and refinement without restating constraints.                            |




## Key Features

In rough priority order by contribution to the north star. **This ordering is a proposal — it's the thing in this document I'd most expect to be corrected.**

### 1. Conversational Discovery

Natural-language recipe discovery, including the flagship "What's for dinner tonight?" — a confident shortlist instead of an open-ended feed. Detail in `poc/PRD - Dinner Decision Engine.md` (POC spec, until rewritten) and `PRD - Assistant Semantic Query Planner.md`.

*User story:* As a hungry, time-constrained cook, I describe what I want in my own words and get a few strong options I can act on, not a page of results to sort through.

*Why it matters:* This is the job at risk and the one that ladders most directly to saves per session.

*Must be true:*

- Returns two or three options by default, never a padded set. If only two clear the bar, show two.
- Every recommendation carries one short, specific reason it fits, derived from that recipe and what we know about the user. Never "recommended for you."
- Options are meaningfully different from each other — not three versions of the same dish.
- When the user asks for dinner, every result is a dinner main. No breakfast, dessert, sides, or roundups.
- The assistant understands intent, not keywords. "Food for the whole soccer team" is a crowd-serving need. "Things for picky eaters" means familiar and approachable, not a literal search for that phrase.
- Follow-ups like "make it faster" or "no chicken" return a new set that preserves every earlier constraint.
- Asking again returns genuinely different options, not the same three.

*Outcome measure:* Recommendation acceptance rate — the share of discovery sessions where the user opens or saves a recommended recipe. Supporting: time from ask to save.

### 2. Grounded Recipe Answers

Cooking questions — substitutions, technique, scaling, make-ahead, dietary adaptation — answered from People Inc editorial content with a real citation, and answered honestly when we can't.

*User story:* As someone cooking, I ask a question about the recipe in front of me and get a trustworthy answer I can see the source of.

*Why it matters:* The clearest expression of what makes us different. Anyone can wrap a general model. Only we can answer from tested, licensed, brand-trusted content and show the receipt.

*Must be true:*

- The recipe in view is always the context. The user never names it.
- When we can answer from our content, the answer carries a visible citation and source link.
- When we can't, we say so plainly rather than fabricating. An honest miss is an acceptable outcome; a confident wrong answer is not.
- If we fall back to a general model, that answer is clearly labeled as AI-generated. No fabricated citations, ever.
- Suggested questions on a recipe are specific to that recipe and backed by something actually in it. We show fewer than three rather than padding with generic prompts.

*Outcome measure:* Grounded-answer rate (share answered from our content with a citation) and honest-miss rate. Supporting: recipe-page session depth and return frequency.

### 3. My Library, Queryable

Intelligent questions over the user's own saved recipes: "my most-cooked," "quickest to make," "the chicken ones," "what did I save and never make?"

*User story:* As someone with a large saved collection, I can actually find things in it and rediscover recipes I forgot I saved.

*Why it matters:* Saves are our north star, and today a save is close to a dead end. Making saves retrievable is what makes saving worth doing — it closes the loop between the metric and the user's actual benefit.

*Must be true:*

- Results come only from the user's own saved set. 
- Ranking questions return correctly ordered results — most-cooked, quickest, least recently made.
- The product tracks whether a user has cooked something, so "most-cooked" and "never made" are answerable at all.

*Outcome measure:* Query completion rate — the share of library questions producing a usable answer. Supporting: return frequency among users with saves.

### 4. Meal Planning & Smart Collections

Generating and refining a *set* of recipes rather than a shortlist — a week of dinners, a themed collection — and saving it.

*User story:* As someone who plans ahead, I ask for a week of meals and get a set I'd actually cook, which I can adjust and keep.

*Why it matters:* Moves the assistant from answering one question to owning a recurring habit. Serves the System Thinker, and a plan is a multi-recipe save.

*Must be true:*

- The output is a plan view, not prose. The conversation is the input; the plan is the result.
- The set works as a set — coherent and varied, not seven individually good recipes that make no sense together.
- Refinement carries full context. "Make it cheaper" preserves every constraint already stated.
- The user can adjust part of a plan without regenerating all of it.
- Plans persist and live alongside the user's collections. Saving is always an explicit action.
- Users never start from a blank slate — recommended starter plans are previewable and adoptable as an editable copy.

*Outcome measure:* Plan completion and retention — plans generated, kept, and returned to.

### 5. Photo as Input

A photo of a fridge or a plate becomes a recipe search. Detail in `poc/PRD - Photo-Based Recipe Discovery.md` (POC spec, until rewritten).

*User story:* I point my camera at what I have, or at something that looks good, and get recipes I can actually make.

*Why it matters:* The lowest-effort possible way to describe a situation, and it's app-native. Pantry mode also gives us the ingredient signal that makes recommendations feel genuinely practical.

*Must be true:*

- The system recognizes on its own whether it's looking at ingredients or a finished dish.
- **Pantry mode:** identified ingredients come back as editable chips the user can correct, and recommendations use several of them.
- **Dish mode:** an identification is offered as a guess, never asserted as fact, and is used to find similar recipes.
- Photos are used for the request and not retained.
- Dietary restrictions and exclusions apply to photo-driven results exactly as they do to typed ones.

*Outcome measure:* Completion rate from capture to recipe open or save.

### 6. Voice as Input

Speaking a query instead of typing it. Everything downstream behaves identically.

*User story:* I'd rather say what I want than type it, especially on my phone with my hands full.

*Why it matters:* The smallest feature here and among the most useful. Natural-language requests are long and awkward to type; speaking them is effortless.

*Must be true:*

- Anything the user can type, they can say.
- Voice queries route to the same capabilities and produce the same result formats.
- Success rate for spoken queries is comparable to typed ones.

*Outcome measure:* Share of assistant queries submitted by voice, and parity of completion rate with typed queries.

### 7. Hands-Free Cooking Companion

A voice companion that walks the user through a recipe while they cook, and answers questions mid-recipe.

*User story:* While cooking, I can follow the recipe and ask questions without touching my phone.

*Why it matters:* The moment when hands are dirty and a screen is least usable. It also extends our relationship past the save into the cook, which is where the real outcome lives.

*Must be true:*

- Launches from the recipe in view, with that recipe already loaded. No re-selection.
- Exiting returns the user to the recipe exactly where they left it.
- Mid-cook questions are answered from our content with the same honesty standard as feature 2 — and fast enough that the conversation doesn't feel broken.
- Never alters a recipe's quantities, temperatures, times, or food-safety guidance.

*Outcome measure:* Cooking-session completion rate, and return-to-cook rate.

## Key Flows

**Deciding what to make.** User opens the assistant on the homepage. They can tap "What's for dinner tonight?" or just say what they want in their own words — "what should I make tonight," "quick dinner with chicken," "something comforting that isn't much work." The tap is a shortcut, not the only door; a typed or spoken request is interpreted and answered the same way → two or three real recipes appear as cards, each with rating, time, source, and a one-line reason it fits → user says "make it faster" → the assistant comes back with a new set that's faster and still respects everything stated earlier → user saves one.

What comes back reflects what was actually asked. A dinner request returns dinner mains. A broader request — "something comforting" — isn't forced into a meal type the user never named.

**A question mid-recipe.** User is on a recipe and asks "can I use Greek yogurt instead of sour cream?" → the assistant answers from our editorial content, showing the source → user taps to start hands-free cooking → the companion walks them through, answering as they go.

**Finding something they already have.** User opens the assistant from their saves and asks "what have I saved but never made?" → a ranked list drawn only from their library → they pick one, and it goes into this week's plan.

**A week at once.** User asks for five weeknight dinners with no pork → a plan view appears with five real recipes → "make it cheaper" returns a cheaper version of that plan, still no pork → user saves it, and it lives alongside their collections.

## Key Logic

Rules that apply across every feature. These are product promises, not implementation notes.

**Trust and honesty**

- An explicit constraint is a hard requirement. "No mushrooms," "vegetarian," "under 30 minutes," and any allergy are absolute. A result that violates one must never appear. When metadata is uncertain, exclude rather than risk it.
- Inferred qualities — familiar, comforting, low-effort, handheld — shape what we look for and how we rank, but never become invisible filters the user didn't ask for.
- When we can't satisfy a request, we say so and offer a way forward. We never return a "close enough" result and hope. Returning two good options beats returning three when the third is weak.
- We never claim knowledge we don't have. "Uses ingredients you cook with often" is honest. "You already have everything for this" is not, unless we genuinely know.
- Any answer not drawn from our content is clearly labeled as AI-generated.

**Understanding the user**

- "Knows me" is built from three things: what the user has explicitly told us (diet, dislikes, preferred cuisines, pantry staples), what we infer from what they save, and what they've actually done — saved, viewed, rated, cooked.
- A new user with no history still gets a useful product. An empty profile is more honest than an invented one; we lean on quality and stated constraints until we know more.
- Constraints and context persist through a conversation and across surfaces. The user states something once.
- What the user explicitly asks for beats where they happen to be. "Show me chicken recipes from my saves" is a library question even from the homepage.

**Presence and restraint**

- The assistant never opens itself and never interrupts. Every surface works completely with it closed.
- The entry point is consistent everywhere, so there's one thing to learn.
- Tapping is always a complete path. A user should be able to run any core flow without typing a word.
- Suggestions are specific to the moment and to what's actually on screen — never a static list reused across surfaces.
- Nothing is saved, planned, or changed without an explicit user action.

**Output**

- The format follows the question. Recommendations are cards. A cooking question is a short cited answer. A week is a plan view. Text connects things; it isn't the payload.
- Recipes always keep their standard trust signals — rating, review count, time, source, image. We don't strip useful information to look more like AI.
- The assistant uses the product's existing components. It shouldn't feel like a separate app bolted on.
- Results don't repeat across consecutive requests when alternatives exist.

---



## Success Measures

**The true outcome:** the user cooked what we recommended. Nothing else proves the assistant did its job — a save can mean intent, curiosity, or nothing at all. We can't see this today, which makes establishing a cook signal a prerequisite for knowing whether any of this worked rather than a later refinement.

**North-star ladder:** saves per session → MAU. Assistant-attributed saves are the leading indicator and the closest proxy we have until the cook signal exists, which means attribution has to be built into saves from the start rather than added later.

**Product-level health**

- Assistant open rate and repeat-open rate per session
- Query completion rate — the share of requests producing a usable answer rather than a dead end
- Constraint-violation rate, which should be zero
- Return frequency among assistant users versus non-users

**Per-feature outcomes** are listed with each feature above.

**Guardrail:** the Established Home Cook's experience must not degrade. If engagement or satisfaction drops for users who never open the assistant, something is wrong regardless of what the assistant's own numbers say.

---



## Open Questions

1. **Is the feature priority order right?** Grounded answers are our strongest differentiator but sit after discovery, which is the job most at risk. That's a deliberate call and worth challenging.
2. **What does the first release get measured on** if it ships before the full set? Some of these features ladder to saves per session much more directly than others.
3. **What's the lightest way to capture a cook signal?** Goal 1 and the true outcome both depend on it, and we have nothing today. An explicit "I made this" is the obvious start, but it needs to be worth tapping.
4. **What's the minimum a user must tell us** before recommendations feel personal rather than generic, and how do we ask without a questionnaire?
5. **Is there a naming decision to make?** Recommendation is to keep it unbranded and low-key until the interaction pattern is validated.
