# 06A Platform vs Feature AI Architecture Synthesis

## Purpose

This document records the architecture decision for how MyRecipes should build and surface AI across the cooking journey, based on the interactive exercise, the pain-density synthesis, and two VP-level pressure-test questions.

## Decision

**Recommended model: Hybrid shared brain with multiple context-specific surfaces.**

One shared intelligence layer learns across the full cooking journey. That intelligence is surfaced through distinct product experiences by stage and context. There is no single persistent visible AI assistant as the default experience.

## Inputs Used

- `01A_User_Journey_Pain_Density_Synthesis.md`
- `../user-research/MYR_AI_Strategy_Persona_Cards.md`
- `../user-research/full_perplexity_cooking_research.md`
- Interactive architecture exercise and VP pressure-test

---

## Why The Hybrid Model Was Chosen

### Why not Option A: One visible AI assistant across the journey

- `Cook / Execute / Recover` is the most distinct zone and has the highest trust bar. A uniform assistant surface would be too risky to deploy there without undermining trust.
- The Established Home Cook — 50% of the audience — has documented distrust of explicit AI. A persistent assistant as the default experience would alienate the majority before the product proves its value.
- The research shows users tolerate very different levels of AI failure at different stages. One consistent surface cannot hold the right reliability standard everywhere simultaneously.

### Why not Option B: Separate AI solutions by pillar

- The primary signal identified as needing to carry across stages was **trust history**: what worked for this user before and what they rely on. That signal only compounds if the system shares intelligence underneath.
- Separate solutions also lose the ability to connect plan state, pantry state, and household constraints across the discovery, planning, and execution journey.
- Fragmentation was identified as the biggest architecture risk. Separate solutions without a shared brain would make the product feel like stitched-together tools, not a coherent experience.

### Why the hybrid model is right

- Separate context-specific surfaces are strategically acceptable if each one solves its pain point well. There is no requirement for users to see a unified AI thread.
- A shared brain is still important because the product gets materially better when learning carries across stages.
- AI visibility should be determined by what produces the best solve, not by a branding rule. The hybrid model allows this judgment to vary by stage.

---

## The Three-Tier AI Visibility Model

The architecture defines three levels of how AI presents to users. The default is Tier 1. Tier 2 activates in context. Tier 3 is advanced mode only.

### Tier 1: Invisible

AI runs beneath the product entirely. Users experience a smarter platform — better relevance, better personalization, better curation — without seeing a label, a chat interface, or an AI prompt.

- This is the primary AI experience for the Established Home Cook.
- It is the foundation required before Tiers 2 and 3 can work well.
- It is the first thing to build and the last thing to deprioritize.

### Tier 2: Ambient

AI shows up as smart product moments without announcing itself. Users interact with these as product features, not as AI. Examples include constraint-first search, a consolidated shopping list with overlap resolved, and a substitution suggestion during cooking.

- This is the primary AI experience for the Weeknight Reducer and System Thinker.
- It is expressed as native product design, not as a chatbot or assistant UI.
- It activates when the user signals a constraint, intent, or context.

### Tier 3: Voice companion alongside the recipe (advanced mode, opt-in only)

A dialogue-capable companion that the user activates while looking at a recipe — for substitution help, technique clarification, and real-time cooking guidance. It lives alongside the recipe content, not as a standalone app or default experience.

- **This tier is an advanced mode. It is not the default experience and is not surfaced to users who have not opted in.**
- **Form factor:** the user is looking at a recipe and chooses to launch the companion. Today, this can live alongside brand recipe pages via the OpenAI Realtime API. When recipes move natively to the platform, the integration tightens: the companion knows which step the user is on, what they have already done, and can reference the recipe directly.
- A POC of this experience already exists. Tier 3 is a Phase 2 opt-in release, not a Phase 4 aspiration.
- It is most valuable for the System Thinker and Enthusiast, who have the highest AI affinity. But substitution rescue during cooking is broadly useful — the opt-in framing ensures it does not intrude on users who want to cook unassisted.
- Must be built on top of a working Tier 1 layer. A companion without taste, household, and constraint memory is a generic voice assistant, not a cooking companion.

---

## The Shared Intelligence Layer

This is what the shared brain must know and maintain. It is the infrastructure that makes all three tiers better over time.

### Current state

- Recipe metadata work is already in progress.
- Some personalization and recommendation capability exists.
- The product currently knows almost nothing about what actually worked for a specific user.
- Planning, execution, and recovery stages generate no usable behavioral signal today.

### MVP of the shared brain

The MVP is not building from scratch. It is connecting and structuring what already exists.

**Step 1: Finish and structure the metadata layer**
Complete LLM-extracted recipe metadata so every surface can draw from a shared semantic understanding of recipes — taste, technique, occasion, similarity, and difficulty.

**Step 2: Connect existing behavioral signals into a persistent preference model**
Saves, revisits, ratings, and time-on-recipe already exist as raw signals. The job is to structure them into a model that persists across sessions and improves recommendations over time.

**Step 3: Instrument the missing stages**
Planning and recovery currently generate little usable signal, and execution is mostly observable only through proxy behavior until recipes are native. The near-term job is to instrument what MyRecipes can actually see — plan interactions, click-out behavior, time-on-page, revisits, and related recovery signals — so the shared brain can begin to carry trust history, the primary cross-stage signal identified in the exercise.

### What the shared brain needs to hold long-term

- Taste and preference memory
- Household constraints and family fit
- Pantry and ingredient state
- Weekly plan and schedule state
- Cooking progress and interruption state
- Trust history: what worked, what was skipped, what was modified, what failed

---

## Context-Specific Surfaces

The shared brain powers all three zones, but the product surface changes by context.

### Discover / Decide

**AI role:** curator + confidence layer + decision support

**Three distinct modes in this zone:** The synthesis work identified that Discover / Decide contains three different user states that require different product expressions:
1. **Active-intent discovery mode** — the user is open to something new but has a query, mood, or need-state; the system should interpret vague intent, personalize, and surface relevant options
2. **Passive-inspiration mode** — the user is not searching yet; the system should use curated and personalized homepage surfaces to spark appetite, generate high-quality saves, and create future learning signal
3. **Saved-library rediscovery mode** — the user wants to find the right recipe from what they have already saved; the system should surface the right saved item at the right moment based on context, timing, and fit

All three modes share the same intelligence layer but require different surfaces. Treating them as the same "browse and search" experience is the primary reason the homepage remains too generic and the saved library currently fails users.

**What the surface should do:**
- Interpret vague intent without forcing manual filtering (active-intent discovery mode)
- Strengthen homepage-style passive discovery through better curation, better personalization, and better section/module packaging so passive browsing leads to saves and later decisions
- Surface contextually relevant saved recipes at the right moment (rediscovery mode)
- Provide conviction signals before commitment — social proof, testing evidence, household fit, taste relevance
- Help users move from "interesting" to "I am making this"

**AI tier:** Tier 1 by default, Tier 2 at the moment of decision

**Trust rule:** No AI labels. The experience should feel like the platform knows the user, not like AI is recommending things.

### Plan / Shop

**AI role:** planning partner + optimizer

**What the surface should do:**
- Accept household constraints and return a coherent plan, not a filtered list
- Resolve ingredient overlap, right-size quantities, and produce a consolidated shopping list
- Match against pantry state to close the feasibility gap before the trip
- Allow the plan to bend without requiring a full rebuild when something changes

**AI tier:** Tier 2 for constraint-first planning, Tier 3 available for full week-building in advanced mode

**Trust rule:** Expressed as a structured product workflow, not as a chat interface. The output — the plan, the list — is the product, not the conversation.

### Cook / Execute / Recover

**AI role:** real-time guide + rescue system

**Near-term constraint (partially lifted):** The current product sends users to external brand sites to cook. The fully integrated Cook/Execute/Recover surface described below represents the intended architecture once recipes live natively on the platform. However, the voice companion (Tier 3 opt-in, Phase 2) partially lifts this constraint: a companion that launches alongside the recipe — including brand pages — can deliver substitution rescue and technique guidance via the OpenAI Realtime API today, before native recipes exist. This is not a full replacement for the native surface, but it makes key execution features available now on an opt-in basis. Near-term investment in this zone should cover both the voice companion (actionable now) and signal instrumentation (what can be inferred from click-out and revisit behavior).

**What the surface should do (once native recipes exist):**
- Clarify ambiguous steps, imprecise language, and technique uncertainty without adding friction
- Handle interruptions and help the user resume without losing place
- Provide substitution confidence before the user commits to a swap
- Rescue the current cook when something goes wrong
- In advanced mode, support active step-by-step dialogue and timing coordination

**AI tier:** Tier 2 for embedded guidance and substitution, Tier 3 available as opt-in kitchen companion

**Trust rule:** This zone has the highest reliability bar in the product. AI should not surface here unless it can perform consistently. A wrong answer during cooking damages trust in a way that a wrong recommendation during browsing does not.

---

## Product Identity Decision

### What MyRecipes is today

A recipe destination. A place to find and save recipes.

### What it should become

A cooking companion. Something that helps users through the whole process, not just the front door.

### How that identity should be expressed

**Through product behavior, not through branding.**

The platform should feel like it knows you. It should help you move from idea to execution with less friction. It should get better over time without requiring the user to do extra work. It should be there when things go wrong.

None of that requires a named AI character, a branded companion, or a persistent chatbot presence. The companion identity shows up in how the product behaves, not in how it labels itself.

### What this rules out

- A named AI assistant as the default product identity
- AI labels on recommendations or curated content shown to the general audience
- Forcing Tier 3 interaction on users who have not opted in
- Positioning the product primarily as an AI product in external communication

---

## Internal Rally Point

The most useful internal framing for product and engineering teams is:

> **From "I need to make dinner" to "dinner happened."**

This framing does three things:

1. It makes the scope clear. The product is accountable for the whole journey, not just discovery.
2. It makes the AI role clear. Intelligence exists to remove friction across that journey, not to demonstrate capability.
3. It makes the quality bar clear. Success is not a better recommendation or a smarter feature. Success is dinner happening with less stress, less failure, and less effort than before.

---

## Architecture Sequencing

The hybrid model only works if the shared brain comes first. Surfaces built before the intelligence layer exists will produce point solutions that do not compound over time.

### Build order

**Foundation first: shared intelligence layer**
- Complete recipe metadata structuring
- Connect existing behavioral signals into a persistent preference model
- Instrument planning and recovery directly, and capture proxy execution signals until native recipes unlock true in-cook telemetry

**Second: Tier 2 ambient surfaces**
- Constraint-first search and decision support
- Plan-consolidated shopping and pantry optimization
- In-cook substitution and uncertainty guidance

**Third: Tier 3 advanced mode**
- Week-building companion for System Thinker
- Step-aware cooking companion for Enthusiast
- Only introduced after Tier 1 trust is established and Tier 2 is performing well

---

## Architecture Rules

Use these to evaluate individual features and roadmap items against the architecture decision.

1. **Does this feature require the shared brain to work well?** If yes, confirm the brain component is ready before the surface ships.
2. **Which tier is this?** If it is Tier 3, confirm it is positioned as advanced mode and not the default.
3. **Does this carry cross-stage context?** If yes, confirm it reads from and writes back to the shared layer.
4. **What is the trust bar?** Features in execution and recovery require a higher reliability standard than features in discovery and planning.
5. **Is AI visible here?** If yes, ask whether visibility improves the outcome or just signals AI presence. If the latter, make it invisible.

---

## Open Questions

- What is the right activation mechanism for Tier 3? Does the user explicitly enable it, or does it surface contextually once sufficient trust history exists?
- How should the product handle users who move between multiple personas across the week? Does the shared brain need to detect mode shifts?
- What is the minimum viable instrumentation for planning and recovery, plus the proxy execution signals, to start generating usable learning before native recipes exist?
- How does the trust history model account for household variability over time, for example when household composition or dietary needs change?
