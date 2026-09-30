# 05A 10x vs 10% Synthesis

## Purpose

This document records the interactive 10x pressure-test exercise for MyRecipes AI opportunities. It applies the 10x definition established in the base framework, challenges the existing classifications, and surfaces a new category — the reliability-gated 10x — that changes how several major bets should be sequenced.

## Inputs Used

- `05_TenX_vs_TenPercent_Test.md` (base framework)
- `01A_User_Journey_Pain_Density_Synthesis.md`
- `02A_Magical_vs_Mechanical_Synthesis.md`
- `06A_Platform_vs_Feature_AI_Architecture_Synthesis.md`
- Interactive exercise

## The 10x Definition for MyRecipes

For this product, 10x means one of the following:

- The user no longer has to solve the problem manually
- The user no longer has to restart when things change
- The user can trust the answer without doing extra validation
- A major category of stress is eliminated

Ideas that merely make existing workflows slightly faster or slightly nicer do not qualify.

---

## The Most Important New Finding: The Reliability-Gated 10x

The most significant output of this exercise is a new classification that the original framework did not have.

Several AI opportunities at MyRecipes are not unconditionally 10x. They are 10x only if the AI answer is trustworthy enough that the user acts on it without verification. Below that threshold, the same feature becomes actively harmful — it produces a wrong answer at a high-stakes moment, damages trust, and may be worse than having no AI at all.

This is a meaningfully different category from straightforward 10x or 2x:

| Category | What it means | Shipping rule |
| --- | --- | --- |
| Forgiving-threshold 10x | Step-function improvement where partial accuracy still delivers the value — imperfection doesn't cause active harm and can be corrected. Distinct from reliability-gated: failure is tolerable and recoverable. | Ship when the output is coherent and constraint-aware. Value survives imperfection; zero constraint awareness is not 10x. |
| Reliability-gated 10x | Step-function improvement only if accuracy meets a minimum threshold. Below that bar, the same feature causes active harm — a wrong answer at a high-stakes moment. | Do not ship until the reliability threshold is proven internally |
| 2x | Solid practical improvement but not a category-level change | Ship as a supporting feature; do not anchor the strategy here |
| 10% | Minor incremental gain; useful but not differentiated | Deprioritize; do not over-invest |

The rule for reliability-gated 10x: do not ship these features until the reliability threshold is confirmed through internal testing. A wrong answer in a high-stakes moment is not a miss — it is a trust event that damages the product's credibility for the moments that come after.

---

## Full Opportunity Classification

### Forgiving-threshold 10x

These clear the 10x bar without requiring a specific accuracy threshold to achieve the step-function value. Imperfect output still delivers the core value — the user can adjust a meal in a plan or recover from a suboptimal week; they cannot "un-experience" a wrong substitution during an active cook.

| Opportunity | Why 10x | Notes |
| --- | --- | --- |
| Constraint-adaptive plan generation | Replaces a multi-variable manual optimization workflow. The user no longer has to figure out a coherent week from competing constraints. | Highest forgiving-threshold 10x. An imperfect meal in a plan is adjustable; the value survives. But a plan with zero constraint awareness is not 10x. |
| Plan recovery engine | Existing tools require full manual rebuilding when a week is disrupted. Nothing on the market rebalances a live plan. | 10x but for a narrower audience — System Thinker and Weeknight Reducer, not the full base. Do not overbuild for broad adoption. |

### Reliability-Gated 10x

These are 10x only if the AI answer is trustworthy. Unreliable versions are worse than no feature at all.

| Opportunity | Why reliability-gated | Notes |
| --- | --- | --- |
| "Tell me the one dinner that fits tonight" | The daily decision stress is a genuine category of pain. A confident, accurate answer eliminates it. A wrong answer deepens frustration and breaks trust. | The lead magical moment. Do not ship until internal testing confirms consistent accuracy across persona types. |
| In-the-moment substitution rescue (active cooking) | When a cook is mid-recipe and stuck, a trustworthy substitution is a full rescue moment. An untrustworthy one causes the dish to fail. | Split from generic substitution suggestions. These are fundamentally different features at different risk levels. See below. |
| Pantry-aware intelligence (proactive and shopping) | If pantry data is accurate, the system can eliminate manual list cleanup and surface what to cook now. If the data is stale or incomplete, the suggestions are actively misleading. | Data-capture-gated 10x. The ceiling rises to 10x only if the upstream data quality problem is solved. |

### 2x (Solid Supporting Layer)

These create real practical value and should be built, but should not anchor the strategy or receive major standalone investment.

| Opportunity | Why 2x | Notes |
| --- | --- | --- |
| Persistent preference memory | Powerful as infrastructure, but felt gradually rather than as a dramatic moment. | Required foundation for reliability-gated 10x to work. Build this first even though it does not feel like 10x independently. |
| Generic substitution suggestions (non-active-cooking context) | Useful when browsing or planning, but the user can usually find an answer externally without major friction. | A different product than in-the-moment rescue. Lower trust bar, lower impact ceiling. |
| Plan-consolidated shopping list | Reduces admin fragmentation and saves real time. But the user can tolerates some manual cleanup here more than they can during cooking. | High priority as a quality-of-life feature; not a category-level stress eliminator. |
| Step-aware hands-free guide | Improves execution confidence for certain personas, especially less experienced cooks. | Good differentiator but not universally demanded. |
| Technique clarification at the moment of uncertainty | Valuable when contextual to the specific recipe step. Removes a context-switch that breaks cooking momentum. | 2x unless the answer is specific to the recipe and step. Generic technique tips (e.g., "folding means to gently combine") are undifferentiated — users can find those anywhere. The opportunity is in technique guidance that knows what the user is doing right now. |
| Repertoire-aware novelty scoring | Adds an interesting signal to discovery, but behavioral evidence that it changes what people actually cook is unproven. | See 10% risk section below. Treat as a hypothesis to validate, not a strategic bet. |

### 10% (Deprioritize)

These are ideas that may be interesting but should not receive strategic investment. They improve the surface without changing outcomes.

| Opportunity | Why 10% | Risk |
| --- | --- | --- |
| Repertoire-aware novelty scoring (standalone) | Feels differentiated in demos. Evidence that it materially changes cooking behavior is missing. Without that evidence, it is personalization theater. | **Primary over-investment risk.** Requires a clear behavioral success metric before investment scales. |
| AI-generated recipe tips and explanations | Useful context, but content-adjacent and rarely changes whether someone makes the recipe or whether the cook succeeds. | Useful as a quality baseline; not a differentiator. |
| Step-by-step narration for experienced cooks | The Established Home Cook explicitly does not want to be guided through steps they already know. For this segment it is friction, not value. | Right for beginner cooks and Enthusiasts in specific contexts, but should not be the default execution experience. |

---

## The Substitution Split

The existing framework treated substitution as a single opportunity rated at 2x. The interactive exercise surfaced a meaningful split that should be reflected in product planning.

| Scenario | Impact | Trust bar | Tier |
| --- | --- | --- | --- |
| Generic substitution suggestions during browsing or planning | 2x — useful, lower stakes, user can verify | Low | T2 ambient, surface contextually |
| In-the-moment substitution rescue during active cooking | Reliability-gated 10x — the cook is stuck, high stakes, trust must be earned | Very high | T2 inline quick answer + T3 for deeper confidence |

These are two different features. The generic version can ship earlier. The in-the-moment rescue version requires the reliability-gated 10x standard before launch.

---

## The Pantry Ceiling Problem

Pantry-aware features span two ratings depending on data quality:

- **With stale or manually-maintained pantry data:** 2x at best. Useful when accurate, but the overhead of maintaining it reduces the net value.
- **With solved data capture (passive ingestion, receipt parsing, purchase history):** Reliability-gated 10x for both what-to-cook suggestions and shopping list optimization.

This means pantry intelligence is not a single build decision — it is a bet on the data capture layer. Product investment in pantry features should be sequenced after the data capture mechanism is validated, not before.

---

## The Search-to-Decision-Collapse Spectrum

"Natural language search," "intent parsing," "constraint-first search," and "one dinner tonight" are not the same opportunity. They are four distinct capabilities that exist on a dependency chain — each enables the next, and each has a different impact ceiling and build requirement. The metadata structuring work currently in progress is building the Tier 1 semantic foundation that makes the higher capabilities in this chain possible.

### The Four Capabilities on the Spectrum

| Capability | What it is | Current state | Impact | Tier |
| --- | --- | --- | --- | --- |
| Semantic search intelligence | Better understanding of recipe meaning — taste, technique, occasion, flavor, similarity — so any query returns more relevant results | In progress (AI metadata structuring) | 2x — foundational quality improvement, invisible to users | T1 invisible |
| Natural language intent parsing | Understanding what a user means by a vague query ("something cozy for a rainy weeknight") and mapping it to recipe attributes without requiring keyword precision | Not built; depends on semantic metadata being complete | 2x for discovery quality; prerequisite for constraint synthesis | T1/T2 boundary |
| Constraint-first search | Accepting multiple explicit constraints simultaneously ("gluten-free, under 30 minutes, kid-friendly") and synthesizing a results set without forcing keyword input | Not built | 2x–10x depending on persona; high value for Weeknight Reducer | T2 ambient |
| Decision collapse — "one dinner tonight" | Synthesizing constraints + preferences + context into one answer, eliminating choice entirely | Not built; requires all of the above | Reliability-gated 10x | T2 surface, T1 brain |

### The Dependency Chain

```
Semantic metadata → intent parsing → constraint-first search → decision collapse
```

Each capability requires the one before it to function reliably. "One dinner tonight" does not work without constraint synthesis. Constraint synthesis does not work without intent parsing. Intent parsing does not work without a semantic understanding of what recipes mean across multiple dimensions.

### What the Metadata Work Is Actually Building

The nine categories of AI-assigned recipe attributes currently in progress — dietary, cooking method, effort, skill level, flavor profile, cuisine, nutritional callouts, family/lifestyle, social proof — are not just a decision-stage UX improvement. They are the semantic translation layer that makes intent parsing possible.

A query like "something cozy for a rainy weeknight" maps to: Comfort Food (flavor profile) + low-effort practicality.
A query like "easy dinner for the kids tonight" maps to: Kid-Approved (family/lifestyle) + Beginner (skill) + 30 min or less (effort).

Without this semantic layer, constraint-first search and decision collapse are working with keyword matching — which is brittle, literal, and misses the actual meaning of how people describe what they want.

This means the metadata structuring work is not a search quality improvement sitting in parallel to the AI strategy. It is the foundational layer of the search-to-decision-collapse chain. Its strategic importance is higher than it appears as a line item in the build sequence.

### The User-Facing Expression

The spectrum describes intelligence capabilities, not UI patterns. But each capability needs an input surface, and natural language is the right one once the intelligence is ready.

Constraint-first search and decision collapse both require the user to express intent — constraints, context, mood, situation — in a way that keyword search boxes cannot capture. A natural language input surface is the correct interface for these capabilities. When someone types "something easy I can make with ground beef tonight that my kids will eat," that should resolve against dietary attributes, skill level, family fit, effort, and pantry state simultaneously. That is what conversational search becomes when it is built on top of the intelligence chain rather than in front of a keyword index.

This is not a chat UI or a visible AI assistant. It is a Tier 2 surface: a smarter search input that understands natural language, resolves constraints, and returns results (or one answer) without the user having to filter manually afterward. It does not announce itself as AI. It just works.

The product question — whether this surfaces as an enhanced search bar, a constraint wizard, or a hybrid — is a UX decision to be made after the intelligence layer is confirmed to be working. The strategic commitment is to the intelligence chain, not to a specific UI form.

### Build Sequencing Implication

The Phase 1 foundation item "recipe metadata structuring (taste, technique, occasion, difficulty, similarity)" is correctly placed in the build order. But its true role should be understood as: **the intelligence prerequisite for every capability above 10% in the search-to-decision-collapse chain**, not just a search quality improvement. Descoping or delaying it delays the ceiling for the lead magical moment and every reliability-gated 10x that depends on knowing what a recipe means.

---

## Novelty Scoring: The Primary Over-Investment Risk

Repertoire-aware novelty scoring was identified as the item most at risk of absorbing disproportionate investment relative to its actual impact.

The risk is structural: novelty scoring is conceptually compelling and technically interesting, but the behavioral hypothesis — that surfacing "right amount of novelty" changes what people cook or increases long-term engagement — has not been validated.

Before investing here, the team needs a measurable success definition. If the success metric is "users cook a higher percentage of recipes from their saved library" or "repeat visit frequency increases after a novelty-tuned recommendation," those are testable. Without a metric, novelty scoring risks becoming a feature that generates positive qualitative feedback without changing product outcomes.

---

## Build Order Implications

The 10x pressure test, combined with the reliability-gated category, produces the following sequencing logic:

### Phase 1: Foundation (enables everything else)

- Persistent preference memory and shared intelligence layer
- Recipe metadata structuring (taste, technique, occasion, difficulty, similarity, flavor profile, effort, family fit) — **this is the semantic intelligence layer that enables intent parsing, constraint-first search, and decision collapse; it is not a parallel track to the AI strategy, it is the prerequisite for it**
- Behavioral signal instrumentation across planning, plus proxy-based inference for execution behavior until native recipes unlock true in-cook telemetry

### Phase 2: First 10x Release (after reliability is proven internally)

- "One dinner tonight" — reliability-gated 10x, primary persona proof
- Constraint-adaptive plan generation — highest forgiving-threshold 10x
- Plan-consolidated shopping list — 2x but directly attached to the above
- **Voice companion alongside the recipe (opt-in)** — a companion surface that activates while the user is looking at the recipe. Can launch on brand pages today via OpenAI Realtime API before native recipes exist. Delivers substitution rescue and technique guidance as early opt-in features, ahead of the full native-recipe surface.

### Phase 3: Expand into high-trust zones (after Phase 2 trust is established)

- In-the-moment substitution rescue — reliability-gated 10x; deliverable via voice companion in Phase 2 (opt-in), full native-surface integration here
- Pantry intelligence (if data capture is solved) — data-capture-gated 10x
- Contextual technique guidance — 2x; deliverable via voice companion in Phase 2 (opt-in), full native-surface integration here

### Phase 4: Advanced mode and plan recovery depth

- Plan recovery engine — forgiving-threshold 10x for the right personas, but narrow. Build for System Thinker and Weeknight Reducer explicitly.
- Multi-dish pacing companion — T3 advanced mode only; requires voice companion surface established in Phase 2

### What to validate before investing further

- Repertoire-aware novelty scoring — requires a behavioral success metric before investment scales

---

## Strategic Principles From This Exercise

1. **Reliability is a strategy, not just an engineering standard.** For reliability-gated 10x features, shipping before the accuracy threshold is met is not a faster path to value — it is a path to trust damage.
2. **Don't conflate features that share a name but operate at different risk levels.** Substitution suggestions during planning and substitution rescue during active cooking are different products with different trust requirements.
3. **Novelty is a hypothesis, not a strategy.** Validate it before building it.
4. **Foundation work is not 10% just because users can't see it.** Persistent preference memory and shared intelligence are prerequisites for every reliability-gated 10x on this list.

---

## Open Questions

- What is the internal reliability threshold required before "one dinner tonight" ships? How is it measured?
- At what point does pantry data quality become good enough that the feature ceiling lifts from 2x to 10x?
- How should the team distinguish between generic substitution (2x, can ship sooner) and active-cooking rescue (reliability-gated 10x, higher bar) in the product backlog and roadmap?
- What is the right behavioral success metric for novelty scoring that would justify moving it from hypothesis to strategic bet?
