# 07A Moments of Truth Synthesis

## Purpose

This document records the interactive Moments of Truth exercise for MyRecipes. It extends the base framework (`07_Moments_of_Truth.md`) with four things the first-pass did not have: failure severity ranking, trust transfer logic between moments, minimum reliability thresholds per moment, and trust recovery rules.

## Inputs Used

- `07_Moments_of_Truth.md` (base framework)
- `05A_TenX_vs_TenPercent_Synthesis.md`
- `06A_Platform_vs_Feature_AI_Architecture_Synthesis.md`
- `01A_User_Journey_Pain_Density_Synthesis.md`
- Interactive exercise

---

## The Seven Moments — Confirmed

The interactive exercise confirmed that the seven moments in the base framework cover the critical surface area. No additions were needed.

One clarification matters for consistency with the later strategy documents: the moment `Can I make this with what I have?` remains strategically must-win in the end-state product, but the strongest version of that moment depends on pantry-state quality that MyRecipes does not have yet. Near-term, the product should interpret this moment more broadly as **feasibility confirmation before commitment** — surfacing likely fit, likely gaps, and likely substitutions before the user commits — while treating full pantry-aware certainty as a later, data-gated version of the same moment.

| Moment | Priority tier |
| --- | --- |
| What should I cook tonight? | Tier 1 — must-win |
| Can I make this with what I have? | Tier 1 — must-win end-state; near-term data-gated |
| Something went wrong, now what? | Tier 1 — must-win |
| Is this worth making? | Tier 2 — differentiation; at risk of becoming Tier 1 |
| Did the weekly plan actually hold together? | Tier 2 — differentiation |
| Am I doing this right right now? | Tier 2 — differentiation |
| Does the product understand me better over time? | Tier 3 — compounding trust |

---

## Failure Severity Ranking

Not all failures are equally recoverable. The exercise produced a clear ranking.

### Most unrecoverable: "What should I cook tonight?"

If the product fails this moment consistently, the user reroutes their decision relationship to Google, TikTok, or memory — and does not come back to MyRecipes for that job. The product retains the user only as a recipe reference tool: a destination for executing a decision made elsewhere. That is a structurally weaker, lower-frequency behavior. The decision relationship, once lost, is the hardest to reclaim.

This is the failure that ends the product's ambition to be a companion. Everything else can be compensated for. Losing the daily decision moment cannot.

### Tier 2 moment most at risk of becoming must-win: "Is this worth making?"

If the product repeatedly fails to provide conviction at the moment of commitment — the user opens a recipe, considers it, and cannot tell whether it is trustworthy — they stop trusting what MyRecipes surfaces. Saves drop. Re-visits drop. The user stops treating the app as a place that curates quality and starts treating it as a search index. The differentiation collapses.

This moment is not in Tier 1 today because users can still use the product without strong conviction signals. But it is the Tier 2 moment most likely to slide up under consistent underperformance.

### Recovery failure is severe but bounded

"Something went wrong, now what?" failure is highly memorable and painful in the moment. But its trust damage is bounded to users who have already invested in cooking from the app — a narrower audience than the daily decision pool. The failure is severe per-user, but the surface area is smaller than the decision moment.

---

## Trust Transfer Logic

Trust does not move freely between zones. The exercise produced the following rules.

### Trust transfers partially, not fully

Being good at decisions builds goodwill, but each new zone the product enters — planning, shopping, cooking, recovery — must earn its own trust independently. A user who trusts the decision engine will give the cooking guide more initial latitude than a stranger would, but that latitude is not infinite. A failure in execution erodes execution-zone trust regardless of how good the decision experience has been.

**Implication:** Do not assume that delivering on Phase 2 (decision engine) means Phase 3 (cooking and recovery) surfaces will be accepted readily. Each zone needs to establish its own reliability record before surfacing confidently.

### Trust sequence: conviction before decision

The right order for building trust is:

1. **Win "Is this worth making?" first.** The product must establish that what it surfaces is genuinely trustworthy — high quality, well-matched, worth the user's time.
2. **Then the decision engine earns credibility.** Once users trust that MyRecipes shows them good things, they will extend that trust to letting it narrow or collapse the decision. A decision engine built on top of content users do not trust is not trusted.

This is a meaningful reordering from the original framework's implied sequence (decision engine first, conviction signals supporting). The conviction layer is not just a nice-to-have at the moment of commitment — it is the trust foundation the decision engine is built on.

**Implication for build order:** Conviction signals (social proof, trust badges, fit signals at the recipe card and modal level) should be in place and performing before the decision engine is promoted as the primary product experience.

---

## Reliability Thresholds by Moment

The exercise surfaced an important asymmetry: the decision moment has a lower threshold than previously assumed, and the recovery moment has a higher threshold than the rest of the journey.

### "What should I cook tonight?" — lower threshold than expected

**Minimum bar:** Narrow the field to 2-3 strong, well-matched options. Full collapse to a single answer is not required.

The user will accept a confident shortlist over an exhaustive list. The product does not need to make the final choice — it needs to reduce the decision space to a small, confident set where every option is genuinely viable. This is a materially lower bar than "tell me exactly what to make," and it means a confidence-narrowing version of this feature can ship before a full decision-collapse version.

This also reframes the launch state for this feature. "One dinner tonight" is the end-state product expression. The launch state is "three strong options that all fit your situation" — which is achievable at a lower reliability threshold.

### "Something went wrong, now what?" — higher threshold than other moments

**Minimum bar:** Provide a specific, immediately actionable answer the user can act on without further searching.

Directional guidance does not count as a rescue. "Try searching for alternatives" does not count. The user is mid-cook, under stress, and the product must solve the problem — not route toward a solution. Partial help that keeps the cook moving is a win; anything that requires the user to leave the app to find the real answer is a failure.

This confirms that the recovery surface should not ship until the AI can deliver specific, contextually accurate answers with high consistency. The bar is higher here than in discovery or planning.

### Threshold summary

| Moment | Minimum bar | Bar level |
| --- | --- | --- |
| What should I cook tonight? | Narrow to 2-3 strong, well-matched options | Lower than assumed |
| Is this worth making? | Conviction signals strong enough that the user commits without external validation | Medium |
| Can I make this with what I have? | Feasibility confirmed or gap surfaced before commitment; near-term this may come from fit signals, missing-ingredient surfacing, and lightweight substitution guidance, while full pantry-aware certainty remains gated by pantry data quality | Medium |
| Did the weekly plan hold together? | Plan remains actionable after real-life disruption without requiring full rebuild | High |
| Am I doing this right right now? | Accurate, contextually specific guidance that does not require cross-referencing | High |
| Something went wrong, now what? | Specific and immediately actionable answer, no external search required | Highest |
| Does the product understand me over time? | Noticeably more relevant over repeated use | Slow compound |

---

## Trust Recovery

When the product fails a high-stakes moment, there is no shortcut to recovery.

**Rule: Trust is rebuilt through consistent wins over time, not through in-session correction.**

This has three implications:

1. **The shipping rule matters more than any other product decision.** If the product ships a reliability-gated feature before it is ready, the trust damage accumulates visit by visit and is not recoverable within a session, a week, or even a month of good performance. Users who associate the product with a failure return less, commit less, and extend less latitude to new AI moments.

2. **First impressions at each new zone have outsized weight.** Because trust recovery is slow, the first time a user encounters AI in a new zone — their first decision suggestion, their first plan, their first mid-cook guidance — sets a ceiling that is difficult to raise afterward. Getting the first experience right in each zone is strategically more important than average performance across many experiences.

3. **The product cannot rely on recovery to fix a bad launch.** "We'll improve it after we ship" is not a viable strategy for reliability-gated features. The trust hit precedes the improvement, and the recovery timeline is long.

---

## Revised Moment Priority with New Dimensions

| Moment | Tier | Failure severity | Reliability threshold | Trust transfer note |
| --- | --- | --- | --- | --- |
| What should I cook tonight? | 1 — must-win | Most unrecoverable — loses the decision relationship | 2-3 strong options, not forced single answer | Foundation for decision engine; trust sequence step 2 |
| Is this worth making? | 1/2 — at risk of escalating | High — erodes content trust and save behavior | Conviction without external validation | Trust sequence step 1; must precede decision engine |
| Something went wrong, now what? | 1 — must-win | Severe but bounded | Specific and immediately actionable — highest bar | Zone-specific trust; does not transfer from decision trust |
| Can I make this with what I have? | 1 — must-win end-state; near-term phased | High — late-stage surprises damage planning trust | Feasibility confirmed or gap surfaced before commitment; strongest version depends on pantry-state quality | Closely linked to planning trust |
| Am I doing this right right now? | 2 — differentiation | Medium — builds execution zone credibility | Contextually specific, not generic | Must be earned independently from decision trust |
| Did the weekly plan hold together? | 2 — differentiation | Medium-high for System Thinker and Weeknight Reducer | Remains actionable after disruption | Planning zone trust; separate from decision and execution |
| Does the product understand me over time? | 3 — compounding | Low per instance, high cumulative | Noticeably more relevant over time | Compounds T1 and T2 trust; the foundation for Tier 3 AI |

---

## What This Changes in the Master Strategy

### 1. The conviction layer precedes the decision engine

The trust sequence finding reorders Phase 2. Before shipping the decision engine as a primary product experience, the product must establish strong conviction signals at the recipe card and modal level — the metadata-powered trust and fit signals currently in development. Users will not trust the decision engine if they do not already trust what the product surfaces.

**Practical implication:** The Phase 2 sequence should be:
- First: conviction signals at decision point (social proof, fit signals, trust badges) — these are built on the metadata layer already in progress
- Then: constraint-first narrowing and the decision engine — once users trust the content, they will trust the narrowing

### 2. The decision engine launches as confident shortlisting, not forced single answer

The reliability threshold for "what to cook tonight" is lower than the synthesis assumed. Narrowing to 2-3 strong, well-matched options is sufficient at launch. This makes the first viable version of the feature more achievable and reduces the reliability gate before shipping. The full "one answer" collapse is the end-state product expression, not the launch requirement.

### 3. Recovery must be solved completely or not surfaced at all

The recovery moment has the highest reliability bar in the product. The minimum is a specific, immediately actionable answer. Partial answers are failures. This confirms that recovery AI should not surface until the system can consistently hit that bar — and that the trust recovery timeline means a bad early launch is not correctable through iteration alone.

### 4. Each zone must earn its own trust

Trust transfers partially between zones. Being good at decisions gives the product latitude in new zones, but it is not a free pass. Planning, execution, and recovery surfaces each need to build their own credibility record before promoting AI capabilities in that zone.

### 5. Pantry-aware feasibility is strategically important but should not be over-promoted before data quality exists

The feasibility moment should stay in the must-win set because late-stage surprises materially damage trust. But the documents are now clearer that the **full pantry-aware version** of this moment is a later-state capability, not an immediate roadmap lead. Near-term, MyRecipes should solve the broader feasibility question with the signals it can actually trust: effort fit, household fit, likely missing ingredients, and lightweight substitutions. Full pantry-state confidence should only be promoted once pantry data quality is good enough to support it reliably.

---

## Open Questions

- What is the right mechanism for surfacing conviction signals before a user commits — at the card level, the modal level, or both? Does the answer differ by query context?
- What behavioral signal tells us a user has moved into the "trusts the conviction layer" state that unlocks the decision engine?
- At what point in the trust-building sequence can the product introduce explicit AI-labeled features without triggering skepticism from the Established Home Cook?
- How should the product handle a recovery failure when it occurs — should it acknowledge the failure explicitly, or is the better strategy to exit gracefully and let the user take over without friction?
