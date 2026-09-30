# 04A Core Loop Strategy Synthesis

## Purpose

This document refines the core loop defined in `04_Core_Loop_Strategy.md` based on the interactive exercise. The original loop (`Plan → Cook → Reflect → Improve`) was a useful first approximation, but it does not accurately describe the current product state or the near-term priorities. The exercise produced a more precise framing with two distinct loop modes and a clearer account of what is and is not achievable today.

## Inputs Used

- `04_Core_Loop_Strategy.md` (base framework)
- `07A_Moments_of_Truth_Synthesis.md`
- `05A_TenX_vs_TenPercent_Synthesis.md`
- `06A_Platform_vs_Feature_AI_Architecture_Synthesis.md`
- Interactive exercise

---

## The Structural Reality: A Loop That Breaks by Design

The most important context for the core loop is that the current product sends users out to brand sites to cook. When a user clicks a recipe, they leave MyRecipes and land on an external page — Allrecipes, Food Network, or another brand property — where the ads that fund the business live. This is a deliberate monetization choice, not a gap to be closed immediately.

The consequence is that the loop **cannot currently close at the Cook step**. The product loses the user at the moment of highest engagement and receives no signal from the actual cooking experience. There is no completion event, no step-level engagement data, no in-cook friction signal, and no natural Reflect moment.

This changes what the loop can do today versus what it will be able to do when recipes live natively on the platform.

---

## Two Loops, One Intelligence Layer

The original framework defined one loop. The exercise surfaced that the product actually needs to support two distinct loop modes, both powered by the same shared intelligence layer.

### Daily Loop: "What do I make tonight?"

```
Discover (new or saved) → Commit → Cook → Signal → Better discovery tomorrow
```

This loop serves the Weeknight Reducer and the Established Home Cook. The user comes in with a specific near-term intent — feed people tonight — and needs to move quickly from idea to execution. The loop is short, session-bound, and driven by the quality of the Discover step.

**Critical nuance on Discover:** In this loop, Discover does not mean only finding new recipes. It equally means **rediscovering what the user has already saved** — surfacing the right thing from an existing library at the right moment. The intelligence layer must handle both "show me something new" and "help me find the right saved recipe for tonight" through the same capability.

### Weekly Loop: "What is the plan for this week?"

```
Plan the week → Execute the plan → Adapt as life changes → Smarter plan next week
```

This loop serves the System Thinker and Weeknight Reducer. The user invests planning effort upfront to reduce daily friction throughout the week. The loop is longer, week-bound, and driven by the quality of constraint synthesis and plan resilience.

### How the loops relate

Both loops share the same intelligence layer. Preference signals from the daily loop improve weekly planning. Weekly plan state informs what surfaces in daily discovery. The separation is in the user's intent and session mode — not in the underlying product architecture.

---

## The Near-Term Priority: Rediscovery

The most important loop problem to solve today — before native recipes exist and before the full signal capture pipeline is built — is **rediscovery**.

Users save recipes, but cannot reliably find the right one at the right moment. The problem is not one thing. It is all three of the following simultaneously:

1. **Timing failure:** The right recipe was saved months ago and would be perfect tonight, but the app never surfaces it.
2. **List size failure:** The saved library has grown too large to browse manually; users can no longer find things they know they saved.
3. **Context loss:** The recipe was saved for a specific reason — a weeknight, guests, summer produce — but that context is no longer attached. The app cannot surface it when the context returns.

Fixing rediscovery does not require native recipes. It requires intelligence on the saved library: understanding the metadata of what was saved, inferring the context in which it makes sense, and surfacing it proactively when that context is active. This is an achievable near-term loop investment that compounds immediately.

---

## The Signal Problem: Implicit Inference Over Explicit Capture

The Reflect step is the most underbuilt part of the loop. With the cook happening off-app, there is no natural completion signal. Explicit mechanisms like "mark as cooked" are likely to be under-reported — users are finishing a meal, not logging data.

**The near-term solution is implicit inference from behavioral signals:**

- **Recipe click-out:** The user navigated to the brand site. Strong proxy for intent to cook.
- **Time-on-recipe page:** Extended time on the recipe detail page strongly implies the user was cooking from it, not just reading it.
- **Revisit frequency:** A user who returns to the same recipe multiple times has likely cooked it more than once and finds it reliable.
- **Save patterns:** Users who save similar recipes signal taste vectors even without explicit ratings.
- **Post-save behavior:** Did the user open the save, revisit it, or let it sit? Behavioral engagement with saved content is a signal about cooking intent.

The system should not wait for explicit input to learn. It should be designed to infer from the signals that naturally exist in the current product, and improve its inferences as more behavioral data accumulates.

**When native recipes arrive:** The cook-step signal capture unlocks dramatically. Step engagement, time per step, interruption points, and substitution requests all become available. But the priority this enables most immediately is **execution guidance** — the companion and rescue features can finally surface in context during an active cook. This is a more important unlock than the Reflect mechanism itself.

---

## Compounding Behavior: Silent, Not Announced

The exercise confirmed that users will not experience a moment where the product visibly clicks into personalization. The loop compounds gradually — the experience just feels progressively less generic over time.

**Design implication:** Do not try to show users that the product is learning. Do not surface "based on your cooking history" labels or personalization badges. The compound effect should be felt in the quality of what surfaces, not announced through UI signals. For the Established Home Cook in particular, making personalization visible is likely to trigger skepticism rather than appreciation.

The intelligence layer becomes credible by producing better results, not by claiming it is producing better results.

---

## Revised Loop Map

### Daily Loop

| Step | User value | Current mechanism | AI role | System learning |
| --- | --- | --- | --- | --- |
| Discover (new) | Fresh options that fit intent and taste | Search, browse, home feed | Curator; intent parsing; constraint synthesis | Taste preference, query patterns, session intent |
| Discover (saved) | The right saved recipe at the right moment | Saved library browse | Rediscovery engine; contextual surfacing | Context-recipe fit, timing patterns, revisit signals |
| Commit | Confidence that this is worth making | Recipe card, modal | Conviction signals; fit indicators | Commitment patterns, trust signal effectiveness |
| Cook | Get through the recipe successfully | Click-out to brand site (today); native in-app (future) | Execution guide (future); substitution (future) | Time-on-recipe, click-out behavior, revisit-after-cook |
| Signal | System learns what happened | Implicit: time-on-recipe, revisit, save patterns | Inference engine | Completion proxy, satisfaction proxy, preference reinforcement |

### Weekly Loop

| Step | User value | Current mechanism | AI role | System learning |
| --- | --- | --- | --- | --- |
| Plan | A coherent week from competing constraints | Manual or basic tools | Planning partner; constraint optimizer | Household constraints, schedule patterns, budget signals |
| Execute | Cook the plan with confidence | Brand site click-outs today | Execution guidance (future) | Plan adherence signals, step-level friction (future) |
| Adapt | Plan survives real-life disruption | Currently manual rebuild | Recovery engine | Disruption patterns, replanning triggers |
| Signal | System learns how the week went | Implicit from plan engagement | Inference engine | Plan reliability, cook completion rate, skips and swaps |

---

## Anti-Pattern Update

The original anti-patterns were correct but could be more precise given the current product state.

| Anti-pattern | What it means now |
| --- | --- |
| Browse → Save → Forget | More precisely: Browse → Save → Lose context → Fail to rediscover. The problem is not saving; it is that saved recipes become unsearchable at the right moment. |
| Search → Read recipe → Cook elsewhere | This is structural today, not just a UX failure. The monetization model sends users off-app at the Cook step. The solution is native recipes, not just better UX on the current product. |
| Ask AI → Get answer → Leave | This remains the risk for any explicit AI surface that treats the interaction as a transaction rather than building state toward the next loop cycle. |

---

## What This Changes in the Strategy

### 1. Rediscovery belongs in Phase 1, not Phase 2

Fixing the saved library rediscovery problem is addressable with the metadata and intelligence layer already planned for Phase 1. It does not require native recipes. And it closes the most common real-world loop break faster than any other investment. It should be named explicitly in Phase 1 alongside metadata structuring and preference memory.

### 2. The loop has two modes that should be designed separately

The daily "what do I make tonight?" loop and the weekly "plan the week" loop are different enough in shape, session length, and persona that they warrant distinct product surfaces. They share intelligence; they do not share UX.

### 3. The Reflect step is an inference system, not a feature

There is no explicit Reflect screen or prompt in the near-term product. The system learns from behavioral signals that exist today. This means the signal capture infrastructure — instrumenting click-outs, time-on-page, revisit frequency, and save engagement — is the near-term Reflect investment, not a visible product surface.

### 4. Native recipes are not the only path to execution guidance

The voice companion partially lifts the cook-step constraint before native recipes exist. A companion surface that launches alongside the recipe — including brand pages the user is already on — can deliver substitution rescue and technique guidance via the OpenAI Realtime API without waiting for native recipe integration. This is not a full replacement for the native surface, but it is an actionable Phase 2 opt-in path for execution features that otherwise would wait until Phase 3 or later.

When recipes do live natively on the platform, the companion deepens significantly: step-level signal capture activates, in-context interruption detection becomes possible, and the companion can reference the exact recipe step the user is on rather than inferring it. Native recipes don't unlock execution guidance from zero — they make it materially better.

### 5. Personalization should be silent

The compounding loop does not need to be made visible to users. Better results are the signal. Labels, badges, and "learning" indicators are likely to add noise without improving trust, especially for the Established Home Cook.

---

## Open Questions

- What is the minimum behavioral signal threshold before the system has enough data to improve rediscovery meaningfully for a given user?
- How should the daily loop and weekly loop be distinguished in the product surface — should there be explicit mode switching, or should the product infer intent from context?
- The voice companion can launch on brand pages now via OpenAI Realtime API. The remaining open question is what execution signals are capturable through the companion interaction versus what still requires native recipe integration.
- What is the minimum viable rediscovery feature — smart surfacing on the home page, a contextual prompt, or a rearchitected saved library?
