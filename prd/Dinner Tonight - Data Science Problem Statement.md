# What's for Dinner Tonight — Data Science Problem Statement

**Author:** Andrew Alburn
**For:** Mike Olson, Gazi, and the Data Science team
**Status:** v1 — for kickoff
**Last updated:** September 24, 2026
**Target:** Discovery release, end of Q4
**Replaces:** `archive/PRD - Dinner Recommendation Intelligence (Data Science).md` and `archive/Brief - Dinner Recommendation Intelligence Working Session.md`
**Context:** [[2026-09-21 15.30 - Mike Olson + Gazi Data Science Meeting]] · `PRD - Assistant Discovery MVP (Backend).md`

This is the doc I promised after Monday's session. It's intentionally an open problem statement, not a spec. How to model any of this is yours — I've tried to be clear about the few things that are product calls, and leave everything else open.

---

## The problem

"What's for dinner tonight?" is the flagship of the assistant. A user opens it, taps one button, and immediately gets three recipes. The goal is that they look at the set and think, "yes, I can make that tonight."

For that to work, every recommendation has to clear two bars:

1. **They'll like it.** We have a strong foundation here in the Data Science Flavor Profile.
2. **They can realistically make it tonight.** This is the open problem, and it's where the product promise actually lives.

The hard part is that, for that first set, makeability has to be **inferred**. We don't know what's in anyone's kitchen, and we won't ask before showing results. We have to reason from what users have already shown us: what they save, what they return to, what we can infer they've cooked, and the ingredients inside all of it.

Users will be able to give us more. After the first set, a follow-up lets them list ingredients they have or add them another way, and we'll use that to refine. But that's the recovery path, not the moment we're designing for. The delight is getting close with a single tap, so that the follow-up feels like fine-tuning rather than a chore.

---

## A few product hunches (tell me where I'm wrong)

These aren't requirements, just how I've been thinking about it from the product side.

- **Familiarity, not pantry.** What's physically in someone's fridge tonight is unknowable without asking. What they habitually cook with is stable and probably inferable. The ingredients across everything a user engages with describe their "cooking universe," and the question becomes how far outside it a recipe pushes them.
- **Makeability is about the burden of the gap, not overlap.** Missing salt and olive oil is nothing. Missing the protein, or saffron, kills it. Time, effort, and equipment arguably belong here too.
- **Saves are aspirational.** People save what they wish they cooked. Signals that suggest someone actually cooked a recipe should count for a lot more than a save that was never opened again.
- **Makeability can come for free, partly.** Mike, you mentioned there may already be close alignment between the flavor profile and what people can make. If that's true, great — let's measure it before building anything heavier.

---

## What's already decided

- **The first set requires no input from the user.** No intake and no ingredient list up front. It has to stand on inference alone.
- **Explicit ingredients come after, and they're optional.** A follow-up lets users tell us what they have: by listing ingredients, and later possibly through a photo or saved pantry staples. When they do, what they tell us outweighs what we inferred. We aren't building ongoing ingredient tracking for V1.
- **Inferred leans are never filters.** Someone whose saves are 40% vegetarian is vegetarian-leaning, which can lift ranking. It should never quietly become a restriction they didn't ask for. (This is scoped to this feature — Mike's broader point about system-wide effects is below.)

---

## Signals on the table

A starting list, not a prescription. Add, cut, or reweight as you see fit.

- **Saves**, weighted by engagement depth — a save reopened three times over two weeks is a very different signal than one never touched again.
- **Cook-intent behavior:** cook mode in the app, and keep-screen-awake on Allrecipes web. Coverage differs by surface, but where we can tie it to a MyRecipes user, it's our strongest "they probably made this" signal.
- **Dwell time.** The GA field in the Mart. We don't know exactly how Google computes it, but as a relative signal it's still useful.
- **Recipe ingredients.** The ontology and Graphene canonical ingredient mapping are complete, so ingredients can be reasoned about as canonical IDs rather than raw strings.
- **Explicit inputs, when the user gives them:** ingredients they list or photograph in the follow-up. Over time, ingredients that show up repeatedly are also a strong signal for inferring familiarity next time.

---

## The ask

Three areas of work, in priority order.

### 1. The dinner algorithm (Q4 delivery)

How do we produce three dinners a user will like and can realistically make tonight? The questions I'd love your point of view on:

- What does makeability mean in practice, and how do we score it from the signals above?
- How should taste, makeability, recipe quality, and variety across the three trade off against each other? 
- When a user tells us what they have in the follow-up, how should that combine with what we inferred? And how should the refined set be ranked without reducing it to pure ingredient matching?
- How should it behave for users with little or no history?

**What we ideally need back** for each recommended recipe:

- a taste score and a makeability score, kept separate
- a confidence level, so we know when inference is strong enough to lean on

### 2. Cook signals as standalone outputs

These feed the dinner algorithm, but they're valuable on their own too — the saves view, for example, could show "your most-made recipes."

- **Likely cooked:** recipes we believe a user actually made (or engaged with most deeply), based on cook mode, keep-screen-awake, dwell time, and repeat visits.
- **Saved but never made:** recipes a user saved and never meaningfully returned to. A low-strength signal for makeability, and potentially useful for resurfacing.

For each, I'd love to know how confident we can be per user, and what coverage looks like. Anything with a collection lead time should start now — we can't recover this quarter's history later.

### 3. Explainability (Q4 discovery, not a launch requirement)

Why are we showing you this? For example, "Mediterranean flavors that match what you tend to enjoy." This isn't needed for the Q4 release, but I'd love to start exploring it.

The hard part isn't writing one good explanation, it's not writing the same one every time. With limited data, "quick Italian things" gets old fast. Questions worth exploring:

- Which dimensions can we explain honestly, and how much evidence does each need? "You love Thai food" from three saves is worse than saying nothing.
- How do we keep explanations varied without making them less true?
- Surfacing: always visible, or exposed on tap or hover? If it's good, I'd lean toward always visible.
- Letting users correct a wrong explanation ("I don't actually like Mediterranean food") and feeding that back into the system.

Post-hoc explanation is fine by me — the stated reason doesn't have to be the ranking reason, it just has to be true of both the recipe and the user.

---

## How we'll judge it

The real outcome is that the user made one of the recipes. We can't see that reliably yet, so the cook-signal work above matters for measurement too, not just ranking.

In the meantime, let's review whole three-recipe sets against real user profiles, the same way we stress-tested suggested search:

- Would this person plausibly want to eat these?
- Could they realistically make each one?
- Are all their constraints respected?
- Are the three meaningfully different?
- Would this set get them to stop browsing and start cooking?

Opens, saves, refreshes, and feedback reasons are useful directional signals, but none of them proves dinner happened. One worth watching closely is how often people need the ingredient follow-up before they find something. The less they need it, the closer the one-tap set is getting.

---

## Timeline (proposed)

- **Now → week of Oct 5:** your initial read and approach. 
- **October → November:** at least two rounds of "here's what we think" → stress test → adjust.
- **End of Q4:** the dinner algorithm powers the discovery release. Cook-signal outputs ship alongside it where ready. Explainability findings inform the next phase.

---

## Open questions

- **System effects of inferred preferences.** Mike raised this: if inferred diet or ingredient leans start driving other surfaces (campaigns, onboarding, broader discovery), the users we have strong signal for are a small subset, and imposing those correlations on users with only a few saves could backfire. For this feature I'm comfortable with leans affecting ranking only. Whether and how they spread elsewhere deserves its own conversation.
- **What's the lightest way to capture a true cook signal?** An explicit "I made this" is the obvious start, but it has to be worth tapping.
- **Cost.** This is an app-first feature that may be gated behind premium or limited trials. That shouldn't change the modeling, but it could change who we're optimizing for early on.

