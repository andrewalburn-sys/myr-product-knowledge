---
kb_id: assistant-follow-up-suggestions
title: Assistant Follow-Up Suggestions — Relevance Rules
authority: canonical
status: draft-v1
owner: Andrew Alburn
audience:
  - product
  - design
  - backend-engineering
  - qa
applies_to:
  - production
  - demo
last_reviewed: 2026-09-30
supersedes: []
superseded_by: null
related_code:
  - src/assistant/suggestions.ts
related_docs:
  - prd/PRD - MyRecipes Assistant.md
  - prd/PRD - Assistant Discovery MVP (Backend).md
  - prd/Recipe-Specific Suggested Questions - Relevance Rules.md
---

# Assistant Follow-Up Suggestions — Relevance Rules

**Status:** Draft v1
**Author:** Andrew Alburn
**Parent PRD:** `PRD - MyRecipes Assistant.md`
**Release requirement:** `PRD - Assistant Discovery MVP (Backend).md` — Flow 4
**Sibling spec:** `Recipe-Specific Suggested Questions - Relevance Rules.md`
**Informed by:** `Scribe Meeting Notes/2026/09/2026-09-18 17.50 - Assistant BE conversation.md`
**Last updated:** September 18, 2026

---

## 1. Purpose

This defines how the assistant chooses the follow-up suggestions it offers after returning a set of results.

It exists because this is the part of the interaction most likely to be built generically and most damaging when it is. A user who gets three good recipes and then sees "Quick recipes," "Healthy recipes," and "Popular recipes" has just been told the assistant wasn't paying attention. The recommendations can be excellent and the follow-ups can still make the whole thing feel mechanical.

Good follow-ups do something specific: they carry the conversation forward along a dimension the user hasn't settled yet, and they're guaranteed to lead somewhere. That second half is what separates this from a chip rail.

**Scope.** Post-result follow-ups in discovery. Opening suggestions — what the assistant offers before any results exist — are covered by SHELL-5 in the release PRD. Recipe-page suggested questions are a different problem with their own spec; see the sibling doc, whose structure this one deliberately follows.

**What this isn't.** It doesn't say where any of this runs or how it's implemented. Where it describes a check, that's a condition the output has to satisfy.

---

## 2. Core principle

**A suggestion has to be earned twice: once by evidence, once by viability.**

**Evidence** means the suggestion is derived from something real — what the user asked, what they've already constrained, or an attribute actually present in the results we just returned. Not from a list of things people generally want.

**Viability** means we know it leads somewhere before we offer it. "Make it faster" is a broken promise if nothing faster exists. A suggestion that dead-ends is worse than no suggestion at all, because the user tapped it on our recommendation.

Everything below is in service of those two conditions. And as with the sibling spec: **it is better to show one strong suggestion than three weak ones.** We never pad to fill a row.

### Where candidates come from

Engineering's position, which I agree with: suggestions are **selected from a pre-generated pool**, not written fresh on every request. Generating live is slow, costs a model call per result set, and produces copy too long to sit on a button. A pool built ahead of time and matched semantically to the current context solves all three.

That changes where the intelligence lives, not whether it exists.

| Layer | What it does | Built when |
|---|---|---|
| The pool | A large library of candidate refinements, organized by the dimensions in §4 and the types in §5 | Ahead of time, offline |
| Matching | Narrow the pool to what fits this request and this result set | Per request, cheaply |
| The gate | Evidence and viability checks in §6 | Per request |
| Ranking | Scoring and selection in §7 and §8 | Per request |

**The gate is the part that matters, and it's the part most easily skipped.** A thousand pre-generated suggestions with semantic matching and no evidence or viability checking is a chip rail with extra steps — it will produce fluent, plausible, dead-end suggestions at speed. The pool makes the feature affordable. The gate makes it good. Both have to ship.

A practical consequence for how the pool is authored: entries should be **templates bound to a dimension and a value**, not finished sentences. "Under {time}" and "Something {cuisine}" resolve against what's actually in the results. That's what lets a pooled system stay specific rather than sliding back toward generic.

---

## 3. Signals

Before generating anything, the system assembles what it knows about the current moment.

| Signal | What it tells us |
|---|---|
| The interpreted request | What the user actually asked for, as understood |
| Resolved dimensions | What they've already specified, this turn or earlier in the conversation |
| Active constraints | Hard requirements currently in force |
| Returned-set attributes | Time, cuisine, main ingredient, method, effort, cost signals actually present across the results we just showed |
| Adjacent pool | What else retrieval could return for a near variant of this request |
| Set quality | Whether we returned a full set or fell short, and why |
| Conversation history | Refinements already tried, and anything the user moved away from |
| Exclusion ledger | What we've already shown, so a refinement doesn't return the same recipes |

Every signal has to come from the actual request and the actual results. The system must not assume an attribute is present because it's common in similar recipes — the same discipline the sibling spec applies to recipe payloads.

---

## 4. Resolved and open dimensions

This is the idea most of the quality rests on.

Every request resolves some dimensions and leaves others open. "Quick chicken dinner" resolves time, main ingredient, and meal type. It leaves cuisine, effort, cost, servings, and technique open. A follow-up that offers "quicker" is restating something the user already told us. A follow-up that offers a cuisine is moving the conversation somewhere new.

**The rule: offer along open dimensions, not resolved ones.**

Dimensions we track for discovery:

| Dimension | Example values |
|---|---|
| Time and effort | under 30 minutes, one pan, no-prep, weekend project |
| Main ingredient | chicken, beef, fish, vegetarian, beans |
| Cuisine and flavor | Italian, Thai, Mexican, comforting, fresh, spicy |
| Meal type | dinner, breakfast, lunch |
| Dietary | vegetarian, gluten-free, dairy-free |
| Cost | budget-friendly, pantry-based |
| Method | sheet pan, slow cooker, grilled, no-cook |
| Servings | for two, for a crowd, leftovers |

Two exceptions where a resolved dimension can be re-offered:

1. **Tightening.** The user said "quick" and the results range from 20 to 45 minutes. "Under 30 minutes" is a legitimate tightening of something they raised themselves, and the evidence is in the set.
2. **Relaxing a constraint that's starving the results.** If we returned fewer than three because a constraint left nothing else, offering to relax it is the most useful thing on screen. See §6.4.

---

## 5. Refinement types

**5.1 Tighten within a dimension.** Narrow along something present in the returned set. "Under 30 minutes," "one pan," "five ingredients or fewer."
*Evidence:* the attribute is present in a subset of the results.
*Viability:* self-evident — the subset already exists. This is the cheapest category to validate and should be the backbone of the feature.

**5.2 Substitute within a dimension.** Swap a value for another. "Beef instead," "something Thai."
*Evidence:* the dimension is relevant to the request and the current value is identifiable.
*Viability:* requires a check. The substitute has to return a usable set under all active constraints.

**5.3 Open a new dimension.** Add a constraint on something untouched. "Something for a crowd," "budget-friendly."
*Evidence:* the dimension is open and plausible for this request.
*Viability:* requires a check.

**5.4 Relax a constraint.** Offered only when a constraint is why the set is thin, and never for a dietary restriction or allergy.
*Evidence:* the constraint measurably reduced the eligible pool.
*Viability:* by construction — we know what's on the other side of it.

**5.5 Repeat with different results.** "Show me different ones."
*Evidence:* always applicable.
*Viability:* only offered when unshown alternatives actually exist. When they don't, it's suppressed rather than offered and then apologized for.

**5.6 Pivot.** A move to a different direction rather than a refinement of this one. "Actually, what about lunch?"
At most one per result set, and only when the request itself was exploratory rather than specific. A user who asked something precise and got a good answer doesn't need an exit ramp.

---

## 6. Hard eligibility checks

Every candidate passes all of these before it's scored. A failure removes it. Fluent wording never rescues a candidate that fails a check.

1. **Evidence exists.** The suggestion traces to the request, an active constraint, or an attribute present in the returned set.
2. **Viable.** We know it returns a usable set under every active constraint. No dead ends.
3. **Not already resolved.** It doesn't restate something the user specified, except as a legitimate tightening per §4.
4. **Not contradictory.** It doesn't conflict with an active constraint — unless it's an explicit relaxation offer per §5.4.
5. **Changes the outcome.** It would produce a meaningfully different set, not a reshuffle of the same recipes.
6. **Not already tried.** The user hasn't issued or declined this refinement in this conversation.
7. **Not redundant.** It doesn't serve substantially the same need as a higher-scoring candidate.
8. **One tap to act.** No suggestion requires typing to complete.
9. **Honest.** It implies nothing about the user we don't actually know. Personalized-sounding suggestions we can't substantiate fail this check.
10. **Never relaxes a safety constraint.** Dietary restrictions, allergies, and explicit exclusions are never offered as something to loosen. This one is absolute.

---

## 7. Scoring

Candidates that clear the hard checks are scored. Use a 0–3 scale per factor, as in the sibling spec.

`score = outcome impact + specificity + dimension openness + viability confidence + conversational likelihood − obviousness − redundancy`

| Factor | High-score meaning |
|---|---|
| Outcome impact | Tapping it produces a genuinely different and better-targeted set |
| Specificity | Names a real attribute of this request or these results, in concrete terms |
| Dimension openness | Addresses something the user hasn't settled |
| Viability confidence | We're certain it returns a good set, not merely a non-empty one |
| Match confidence | How well the pooled candidate actually fits this context, from the matching step |
| Conversational likelihood | A plausible next thought given what they asked — inferred from the conversation, not from a user profile |
| Obviousness penalty | The user would have typed it unprompted, or it's trivially implied by what they already said |
| Redundancy penalty | Another candidate serves nearly the same need |

A note on match confidence: semantic similarity is a retrieval signal, not a quality signal. A candidate can match the context closely and still be a bad suggestion — it's one factor among several, and it can't outvote evidence or viability. Ranking primarily by match score is the most likely way this feature quietly degrades into generic.

Note what's deliberately absent: there's no personalization factor. Ranking which dimension to offer is derived from the conversation and the result set, so this feature carries no dependency on another team. Profile-informed ranking is a later improvement, not a launch requirement.

---

## 8. Selection

1. Up to three suggestions. Fewer whenever fewer clear the threshold.
2. Diversity across dimensions — never two suggestions probing the same one when a stronger mix exists.
3. At most one pivot, and only per §5.6.
4. Relaxation offers, when eligible, rank first. They're the most useful thing we can say about a thin set.
5. Zero is a valid outcome. A precise request answered well may warrant no follow-ups at all — the sibling spec's position on padding applies here too.

**Wording.** Suggestions are phrased the way a user would say them, not the way a system would execute them. "Make it faster," not "Filter by cooking time." Short, lowercase-friendly, concrete. They read as things the user is saying, so they shouldn't be mixed with questions the assistant is asking.

**Length is a hard constraint, not a preference.** These sit on buttons. Authoring wording in the pool rather than generating it per request is most of what keeps length predictable — a live model reliably produces suggestions too long for the UI, which was one of the reasons for pooling in the first place. An agreed character ceiling belongs in the pool's authoring rules, and anything over it never reaches the UI.

---

## 9. Library results

**Position: we probably don't offer follow-ups on library results at launch, and that's a feature rather than a gap.**

Most users don't have enough saved recipes for refinement to mean anything. Offering "narrow to chicken" against a library of eleven recipes is theater — the user can see their whole library, and we'd be adding a step to something already finished.

The rule that follows: **no depth, no refinement.** Library follow-ups appear only when the user's library is large enough that filtering genuinely helps, and only when the specific filter offered would return a useful subset rather than one recipe. Below that threshold, we show the results and stop.

We need the real save-count distribution to set the threshold, which is an open item in the release PRD. Until we have it, the default is no library follow-ups.

---

## 10. Candidate record

Every displayed suggestion should be traceable, for the same reason as the sibling spec: this is model-adjacent logic that can degrade without failing.

```ts
type FollowUpCandidate = {
  label: string;
  poolEntryId: string;
  matchConfidence: number;
  type:
    | "tighten"
    | "substitute"
    | "open_dimension"
    | "relax"
    | "repeat"
    | "pivot";
  dimension: string;
  evidence: {
    source: "request" | "active_constraint" | "result_set" | "set_shortfall";
    value: string;
  }[];
  viability: {
    checked: boolean;
    method: "subset_of_returned" | "retrieval_check";
    estimatedResults: number;
  };
  scores: {
    outcomeImpact: number;
    specificity: number;
    dimensionOpenness: number;
    viabilityConfidence: number;
    matchConfidence: number;
    conversationalLikelihood: number;
    obviousnessPenalty: number;
    redundancyPenalty: number;
  };
  score: number;
};
```

Tracing back to a pool entry matters for a reason beyond debugging: it's how we find out which parts of the pool are dead weight, which are overused, and where the gaps are. The pool is a maintained asset, not a one-time authoring job.

---

## 11. Pipeline

1. Assemble the signals in §3.
2. Classify each dimension as resolved or open.
3. Match the pool to the current context, narrowing to plausible candidates.
4. Resolve each template against real values from the request and the result set.
5. Apply the hard checks in §6, including viability.
6. Score the survivors.
7. Remove semantic duplicates.
8. Select up to three, diverse, above threshold.
9. Display fewer, or none, if that's what passed.

The evidence and viability layer is authoritative. Matching proposes; the gate disposes. A model may help author the pool offline or re-rank within it, but it may not introduce a suggestion at request time that didn't pass the checks. This mirrors the sibling spec, and for the same reason — a fluent suggestion that dead-ends is a worse failure than a plain one that works.

---

## 12. On speed and cost

Pooling handles most of the cost concern. What it doesn't handle is viability, and that's the requirement I don't want traded away quietly — so it's worth being precise about what's actually expensive.

**Tightening (§5.1) is nearly free.** If the attribute is present in a subset of results we already have, the subset is proof. No extra retrieval, no model call. These should carry most of the feature.

**Substitutions and new dimensions (§5.2, §5.3) need to know what retrieval would return next.** That's the real cost, and it's a retrieval cost rather than a model cost — which is worth separating, since the pooling decision was about model calls and doesn't address this at all.

If that check is too expensive at launch, the middle position is to restrict those two categories to cases we can establish cheaply and lean harder on tightening. What I'd rather not do is show them unvalidated. A suggestion that dead-ends damages trust more than a shorter list of reliable ones does.

If we launch with only tightening and repeat, that's still a coherent feature and still far better than a generic chip rail.

**On latency.** Suggestions appear alongside results, so their budget is whatever's left after the results are ready — effectively none. Anything that can be precomputed, cached, or derived from the result set we already have should be. If suggestion generation would delay the results themselves, show the results first.

---

## 13. Examples

**"Quick chicken dinner"** — returns three recipes, 20–40 minutes, Italian, Mexican, and American.

Strong:
- "Under 30 minutes" — tightening; two of three results qualify, viable by construction.
- "Something Thai" — open dimension, cuisine untouched by the request, pool checked.
- "For a crowd" — open dimension, plausible for dinner, pool checked.

Weak:
- "Quick recipes" — restates a resolved dimension, and generic.
- "Chicken recipes" — restates the request.
- "Healthy recipes" — no evidence, no defined meaning, unverifiable.
- "Show me desserts" — pivot after a precise, well-answered request.

**"Vegetarian dinner, no mushrooms"** — returns two recipes because the constraint pair is restrictive.

Strong:
- "Include mushrooms" — *not eligible.* Relaxing a stated exclusion fails check 10.
- "Show me different ones" — eligible only if unshown alternatives exist.
- "Under 45 minutes" — tightening, if the returned set supports it.
- "Something Mediterranean" — open dimension, pool checked under both constraints.

Note the shape of this case: the honest response to a thin set caused by a dietary constraint is not to offer loosening it. It's to offer other ways to move, or to say plainly that there isn't much else.

**"Dinner using what I have"** after the user listed chicken, rice, and broccoli — returns three recipes.

Strong:
- "Fewer ingredients" — tightening, evidence in the set.
- "Add one more ingredient" — opens a dimension and is honest about the tradeoff.
- "Something faster" — tightening, if times vary in the set.

Weak:
- "Use what I have" — restates the request.
- "Recipes with chicken" — restates a stated ingredient.

---

## 14. Acceptance criteria

- 100% of displayed suggestions have an inspectable evidence record, traceable to a pool entry.
- 100% of displayed suggestions return a usable result set when tapped. This is the headline measure; a dead-end suggestion is a defect, not a low score.
- Every displayed suggestion fits the agreed character ceiling. No truncation in the UI, ever.
- Suggestions never delay the results they accompany.
- No suggestion restates a dimension the user already resolved, except as a tightening with evidence in the returned set.
- No suggestion ever offers to relax a dietary restriction, allergy, or explicit exclusion.
- The system shows fewer than three, including zero, when fewer clear the threshold.
- Displayed suggestions cover distinct dimensions when multiple strong candidates exist.
- A regression set covers precise requests, vague requests, thin result sets, heavily constrained requests, repeat requests where alternatives are exhausted, and cases where zero suggestions is the correct output.
- Reviewers judge the majority of displayed suggestions as something a real user might plausibly want next.

**Worth instrumenting from day one:** follow-up tap rate, and the result quality of what a tapped suggestion returns. Tap rate alone is misleading — a suggestion can be tempting and useless. The pair tells us whether this logic is working.

---

## 15. Guardrails

- Suggestions assist; they never interrupt, auto-run, or auto-open anything.
- Nothing is saved, planned, or changed by tapping a suggestion. It issues a request, nothing more.
- Suggestions never imply knowledge of the user we can't substantiate.
- A suggestion is never a substitute for an honest answer. When we can't satisfy a request, we say so plainly — we don't paper over it with a row of alternatives.
- Suggestion quality is measured by whether the next result was good, never by how many we displayed.
