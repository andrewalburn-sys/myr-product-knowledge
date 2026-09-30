# MyRecipes AI Strategy — Opportunity Set

**Version:** 1.0
**Status:** Draft
**Prepared:** March 2026
**Author:** Andrew Alburn
**Source documents:** `MYR_AI_Strategy_Persona_Cards.md` · `MYR_AI_Strategy_Persona_Definitions.md`

---

## Overview

These opportunities are organized by user journey stage and derived directly from persona pain points. Each is written in outcome-forward language — what it does for the user, not what the technology does.

The underlying strategic framing: the most differentiating thing we can build across all four personas is not any one feature — it is the shift from **"here are options"** to **"here is an answer."** Every persona, in different ways, is asking us to make the call.

---

## Foundational Capability

> This capability is a dependency for many of the opportunities below. It sits behind the board, not on the user journey.

**LLM-extracted recipe metadata**
Parse every recipe for semantic attributes — taste, technique, occasion, similarity — to power search, filtering, recommendations, and exploration across the platform.

---

## Discover / Decide

**1. Constraint-first search**
Return a tight set of high-confidence options already filtered to fit — with the signals to choose quickly at a glance.

**2. Lean-back inspiration feed**
A video-driven browsing mode for when appetite needs building — scroll until something stops you, then go from interest to recipe in one tap.

**3. Persistent preference memory**
Personalization that builds silently over time. The platform starts knowing you without ever asking.

**4. Repertoire-aware novelty scoring**
Surface what's meaningfully different but tonally familiar. Variation that doesn't feel like disruption.

**5. LLM extracted recipe metadata**
Parse every recipe for semantic attributes (taste, technique, occasion, similarity) to power search, filtering, recommendations, and exploration across the platform.

**6. Pantry-aware discovery**
Show what you can actually make tonight based on what's already in the house.

**7. Attribute-driven exploration**
Navigate by taste profile, mood, or recipe similarity — no query required. Exploration mode for users following interest, not intent.

**8. Plan-aware filtering**
Filter across nutrition, budget, preferences, and ingredient overlap simultaneously — as a weekly set, not one recipe at a time.

---

## Collect

**UGC-powered conviction signals**
Surface what real cooks said — substitutions that worked, picky-eater wins, honest time checks — at the moment of decision. The trust layer AI-generated content can never replicate.

**Adaptive recipe saving**
Save a recipe as your version — swap for dietary needs or preferences at the point of collection, so what you save is already adapted to how you'll actually make it.

---

## Decide / Plan

**8. Constraint-adaptive plan generation**
Turn household constraints into a complete week in seconds. Flexible enough to adapt when life changes, no manual rebuilding required.

---

## Shop

**12. Plan-consolidated shopping**
One optimized list for the week: overlap resolved, quantities right-sized, substitutions pre-resolved.

**13. Pantry inventory sync**
Remove what's already on hand, reduce waste, and close the feasibility loop before the trip.

**14. One-tap cart fulfillment**
Push your complete shopping list directly to your preferred retailer. The plan becomes a cart without leaving the platform.

---

## Cook / Execute + Recover

> Opportunities 16–19 are triggered by normal execution. Opportunities 20–23 are triggered by failure states.

**16. AI kitchen companion**
Voice-activated and always in context — ask it for the next step, a technique tip, or a mid-cook substitution. Your co-cook for the whole process.

**17. Substitution engine**
When an ingredient is missing, suggest a smart swap that still delivers the dish as it was meant to taste — not just a generic alternative.

**18. Step-aware hands-free guide**
Voice guidance that paces with actual progress — a responsive kitchen presence, not a recipe read-aloud.

**20. Plan recovery engine** *(Recover)*
Day missed, ingredient unavailable? Rebalance the remaining week automatically. Not a restart — a smart pivot.

---

## Persona × Opportunity Coverage


| Opportunity                         | Weeknight Reducer | Enthusiast | System Thinker | Established Home Cook |
| ----------------------------------- | ----------------- | ---------- | -------------- | --------------------- |
| 1. Constraint-first search          | ●                 |            |                |                       |
| 3. Persistent preference memory     |                   |            |                | ●                     |
| 4. Repertoire-aware novelty scoring |                   |            |                | ●                     |
| 6. Pantry-aware discovery           | ●                 |            | ●              |                       |
| 8. Plan-aware filtering             |                   |            | ●              |                       |
| 12. Plan-consolidated shopping      | ●                 |            | ●              |                       |
| 13. Pantry inventory sync           | ●                 |            | ●              |                       |
| 14. One-tap cart fulfillment        |                   | ●          |                |                       |
| 17. Substitution engine             | ●                 |            |                |                       |
| 18. Step-aware hands-free guide     | ●                 | ●          |                |                       |
| 20. Plan recovery engine            |                   |            | ●              |                       |


---

*Companion documents: `MYR_AI_Strategy_Persona_Cards.md` · `MYR_AI_Strategy_Persona_Definitions.md` · `MYR_AI_Strategy_Research_Synthesis.md`*