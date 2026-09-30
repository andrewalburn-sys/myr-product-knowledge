# Brief — Dinner Recommendation Intelligence (Working Session)

**Author:** Andrew Alburn
**For:** Mike Olson and the Data Science team
**Formal handoff:** `PRD - Dinner Recommendation Intelligence (Data Science).md`
**Last updated:** September 21, 2026

This is a briefing for a conversation, not a spec. The PRD above is the formal statement of the problem; this adds the product decisions we've made since, the places I think the current approach needs to stretch, and the questions I'd like us to work through together. Everything about *how* to model this is yours. I've tried to be clear about which parts aren't.

---

## The problem in one paragraph

The existing Flavor Profile answers "what recipes is this user likely to like." "What's for dinner tonight?" needs a harder answer: **what are three dinners this person will like *and can realistically make tonight*.** Those are different problems, and the second one is where the product promise lives. A taste-perfect recommendation that requires a grocery run fails the button. Repeated failures teach people that MyRecipes can't be trusted with the dinner decision, which is a reliability-gated moment — we don't get many tries.

---

## What we're fixing, and why these are product calls

Four things I'd like to hold constant so you're not solving a moving problem. None of them is a modeling decision.

**1. Makability is a ranking factor with a floor, not a gate.** Taste can't win when someone plainly can't make the recipe tonight. Where the floor sits and how the tradeoff curves between taste and feasibility is yours to determine — the principle that feasibility can veto a delicious recommendation is ours.

**2. Hard constraints are gates that run before ranking.** Allergies, stated dietary restrictions, disliked ingredients, explicit exclusions, and stated time limits. Allergy-tier is absolute, including when our metadata is uncertain — when in doubt, exclude. Separately: an *inferred* lean is never a filter. Someone whose saves are 40% vegetarian is vegetarian-leaning, and that should lift ranking. It must never quietly become a restriction they didn't ask for.

**3. Every recommendation must come back with structured evidence.** This is the requirement most likely to shape your architecture, so I want to flag it early rather than spring it later. The assistant has to tell the user *why* a recipe was chosen, in one specific, credible line. That means the recommender can't just return ranked IDs — it has to return the reasons, typed and checkable. More on the shape below.

**4. We evaluate whole sets, not individual recipes.** The unit of quality is three recipes together. Would this person eat these, could they make each one, are all three worth making, is the evidence accurate, and would this set stop someone browsing and start them cooking.

---

## What's yours

How to model taste. How to define makability and weight ingredient importance. How to balance taste, feasibility, quality, and diversity. How to handle a user with three saves. What new signals would be worth collecting, and what you'd want instrumented now that we can't recover retroactively.

---

## Three things worth saying out loud

### 1. We're probably asking the wrong question about pantry

There are two different things that get conflated. **Pantry state** is what's physically in someone's kitchen right now — it decays by the hour and is effectively unknowable without asking or a photo. **Ingredient familiarity** is what someone habitually buys and cooks with. That's stable, and I think it's inferable from saves today.

Familiarity is also exactly what our honesty rules already permit us to say. "Uses ingredients you cook with often" is an honest claim. "You have everything for this" is not, and we've committed to never making it without real evidence.

Concretely: the ingredient lists of everything a user has saved, normalized and recency-weighted, describe that person's cooking universe. That gives you a per-recipe answer to "how far outside their normal does this push them" — which is most of the value of pantry awareness without the impossible part. We'd layer stated pantry staples and photo-detected ingredients on top when we have them.

### 2. Makability is a burden question, not an inventory question

Framing it as "do they have the ingredients" leads to counting overlap, and overlap counting gives bad answers. The better question is *how annoying is the gap*. Missing two pantry staples is nothing. Missing the protein kills it. Missing saffron kills it. Missing buttermilk doesn't, because milk and vinegar work.

So it needs ingredient **importance** and **substitutability**, not just presence. And it isn't only ingredients — time against their demonstrated time distribution, effort against demonstrated skill, and equipment all belong in whether someone can realistically make something tonight.

### 3. Saves are aspirational, and that's a real limit on the current profile

People save what they wish they cooked. A save-based representation models browsing appeal, which diverges from cooking behavior in exactly the way that matters for "what should I make tonight." Three upgrades, in increasing order of value:

- **Weight by engagement depth.** A save that was reopened three times over two weeks is a much stronger signal than one never opened again. We have this today and aren't using it.
- **Use negative signal.** The profile is currently built only from positives, so there's nothing to discriminate against. Impressions without opens and opens without saves are available now. Better still, the assistant's feedback sheet captures four *labeled* reasons a recommendation missed — too much work, missing ingredients, had that recently, not in the mood. That's not a thumbs-down; it names which dimension failed. Effort, makability, recency, and taste respectively. We've decided to persist these rather than discard them at session end, so they'll accumulate.
- **Cook signal.** The real one. We don't have it, we're going to start capturing it, and it's the only thing that eventually gives us ground truth.

---

## The evidence contract

For each recommendation, we'd want back something like:

- a taste score and a makability score, separably
- **typed evidence** — not prose, and not scores we'd have to interpret
- a confidence, so we know when to explain and when to stay quiet
- for rejected candidates, why they were rejected, so we can debug

Typed evidence meaning something along these lines:

```
{ type: "ingredient_familiarity", ingredients: ["lemon","garlic","chicken"], strength: "high" }
{ type: "cuisine_affinity", cuisine: "Mediterranean", basis: "22 of 60 saves", confidence: "high" }
{ type: "effort_fit", recipe_minutes: 30, typical_range: "25–40" }
{ type: "makability", missing: ["feta","dill"], missing_importance: "low" }
```

The assistant turns that into "one pan and the bright flavors you save most." The seam is clean in both directions: you never write user-facing copy, and we never invent a reason you didn't give us.

Two notes on this:

**Confidence per dimension matters as much as the affinity itself.** With eight saves we might have a reliable protein affinity and no reliable cuisine affinity. We should only explain using dimensions that clear a bar — "you love Thai food" from three saves is worse than saying nothing at all.

**Post-hoc explanation is acceptable to us**, as long as it's true. If an embedding picks the recipe and interpretable attributes explain it afterward, that's fine by me, provided every claim is verifiably true of both the recipe and the user. We're not requiring that the stated reason be the ranking reason. We are requiring that it not be fiction.

---

## What we're committing to on our side

- **Graphene canonical ingredient IDs.** We're the first consumer and we're building the extraction to map recipes to them. Build against canonical IDs rather than raw strings.
- **Persisting the feedback reasons**, so they become a usable signal over time rather than evaporating each session.
- **Starting cook-signal capture**, because its value is entirely the history it accumulates and we can't recover September retroactively.
- **Explicit user preferences** — diet, dislikes, cuisines, cooking style, pantry staples — stored server-side and available to you as inputs alongside whatever you infer.

---

## What I'd like from you

1. **What does the Flavor Profile actually emit?** I know it's embedding-based and produces a set of recipes we think a user will like. What I don't know is whether we can get a per-recipe taste score for candidates we bring you, or only a served list. Those are very different integration stories and it changes what the rest of this looks like, so I'd start here.
2. **A point of view on makability** — what it should mean in practice, how confident we need to be, and how it should trade against taste and quality.
3. **Which of the signal upgrades above are worth the effort,** and what else you'd add that I've missed.
4. **What you'd want instrumented now.** Anything with a collection lead time should start immediately, independent of when the modeling work lands.
5. **Tell me where I'm wrong.** Particularly on the familiarity-versus-pantry framing — I think it's the tractable near-term target, but I'm reasoning from the product side and you may see something I don't.
