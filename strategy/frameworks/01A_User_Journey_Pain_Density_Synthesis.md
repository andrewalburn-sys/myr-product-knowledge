# 01A User Journey Pain Density Synthesis

## Purpose

This document synthesizes the interactive pain-density exercise across the cooking journey and adjusts the conclusions using the broader findings from `full_perplexity_cooking_research.md`.

The goal is to produce a clearer answer to three questions:

1. Where is user pain most concentrated?
2. Where does AI have the strongest right to improve outcomes?
3. What role should AI play in each part of the journey?

## Inputs Used

- `../MYR_AI_Strategy_Leadership_Presentation.md`
- `../MYR_AI_Strategy_Opportunity_Set.md`
- `../user-research/MYR_AI_Strategy_Persona_Cards.md`
- `../user-research/full_perplexity_cooking_research.md`
- Interactive scoring and refinement across:
  - `Discover / Decide`
  - `Plan / Shop`
  - `Cook / Execute / Recover`
- Cross-reference against `../MYR_AI_Strategy_Opportunity_Set.md` to identify missing modes and opportunity gaps (added: passive-inspiration discovery mode; Collect reviewed and resolved as a micro-action within Discover/Decide, not a separate stage)

## Executive Summary

The cooking journey should not be treated as one uniform AI problem.

The synthesis points to three distinct problem zones:

1. `Discover / Decide`
   - Primary problem: reducing cognitive load and increasing confidence
   - Best AI role: curator + confidence layer + decision support
   - Note: `Discover` contains three distinct modes — active-intent search, passive-inspiration browsing, and saved-library rediscovery — each with different product expressions. Saving is a micro-action within this zone, not a separate stage; the intelligence at the save moment (adaptive context capture, UGC conviction signals) is addressed within the Decide section.

2. `Plan / Shop`
   - Primary problem: coordinating constraints and optimizing feasibility
   - Best AI role: planning partner + optimizer

3. `Cook / Execute / Recover`
   - Primary problem: providing trustworthy in-the-moment help when failure cost is highest
   - Best AI role: guide + rescue system

The strongest strategic conclusion is that **AI should not surface the same way across the full journey**. The system should share intelligence underneath, but the role AI plays should change by stage.

## Research-Adjusted Journey Ranking

Based on the interactive exercise plus the research cross-check, the current first-pass ranking is:

1. `Discover (active intent) + Decide` — combined zone; the user has a need-state and is moving toward a commitment. Includes active-intent search and saved-library rediscovery. Pain concentrates at the commit end.
2. `Cook / Execute`
3. `Plan`
4. `Recover: in-the-moment`
5. `Shop`
6. `Discover (passive inspiration)` — lean-back mode; no decision intent; appetite-building; pain is weak relevance and low save conversion, not commitment anxiety
7. `Reflect / Save / Learn`

Important nuance:

- `Recover: plan-level` remains strategically interesting, but is less directly supported by the research than in-the-moment recovery.
- Active-intent discovery and deciding are inseparable — you discover options in order to commit to one. Passive-inspiration is a distinct mode where the user has no current decision intent and the goal is a save for later.
- Saving is not a separate stage. It is a micro-action within Discover/Decide. The quality of what gets captured at save time (adaptive context, UGC conviction signals) has downstream consequences for rediscovery, but this is best treated as a product design consideration within Decide, not a ranked stage in its own right.

## Journey Table

| Stage | Pain shape | Research-adjusted read | AI fit | Recommended AI role |
| --- | --- | --- | --- | --- |
| Discover (active intent) + Decide | Decision fatigue, fit validation, confidence — pain concentrates at commit; browsing and searching are forgiving, committing is hard | One of the strongest opportunity zones; users need vague intent understood, conviction signals at the recipe level, and help validating whether something is worth making. Saved-library rediscovery belongs here too — same user intent, different path. | High | Curator → Confidence layer + decision support |
| Discover (passive inspiration) | Lean-back mode; no current decision intent | Users are building appetite, not making a decision. Pain is weak relevance and low save conversion — the homepage doesn't inspire them enough to save. | Medium | Homepage curator |
| Plan | Multi-variable cognitive overload | Strong structural opportunity, especially for planners; burden is real even if not universal | High | Planning partner |
| Shop | Fragmentation and optimization failure | Weakly served today, but more manually tolerable than execution failures | Medium to high | Optimizer |
| Cook / Execute | Ambiguity, interruption, timing, uncertainty | Higher trust boundary than initially scored; users tolerate very little failure here | Very high | Real-time guide |
| Recover: in-the-moment | Missing ingredient, mistake, confusion, interruption | Strongly supported by research; current tools rarely recover well once things go wrong | Very high | Rescue system |
| Recover: plan-level | Week disruption, replanning | Strategically promising, especially for planner personas, but less directly evidenced than current-cook rescue | Medium | Rebalancer |
| Reflect / Save / Learn | Low acute pain, high long-term leverage | Not an urgent pain point, but important for building memory and compounding personalization | Medium | Memory layer |

## Detailed Synthesis By Zone

## Discover / Decide

### Discover

The pain density exercise treated Discover as a single stage, but the opportunity set (`MYR_AI_Strategy_Opportunity_Set.md`) surfaces three meaningfully different modes that have different pain shapes and different product implications.

**Mode 1: Active-intent discovery**
The user has a loose idea or query and is searching with intent — even if that intent is vague. This is the mode the exercise primarily scored.

What the exercise found:
- `Browse for inspiration` is not a major pain point in this mode.
- `Search with loose intent` is a real friction point.
- The hottest sub-stage is `Evaluate whether a recipe is worth making`.

What the research adds:
- Users tolerate imperfect recommendations during active discovery.
- They want better trust cues before they invest time.
- They want the system to understand vague intent without forcing manual filtering.

**Mode 2: Passive-inspiration browsing (lean-back)**
The user is not searching — their appetite needs building before they have any intent. This already exists today in the homepage experience: a mix of curated sections shown to everyone and personalized sections shaped by user history. This mode was not scored in the original exercise and was implicitly excluded when "Browse for inspiration is not a major pain point" was concluded. That conclusion applies to active browsing; passive-inspiration is a different state.

The pain in this mode is not friction — it is weak inspiration quality and weak downstream conversion. The current strategic opportunity is not limited to video. It is strengthening the homepage as a passive-discovery surface so it generates more high-quality saves and better future learning signal. That means improving three things: the relevance of what is shown, the conviction of the content itself, and the packaging of the modules/sections that frame the ideas. Alternative formats, including more immersive or motion-led ones, may still be worth exploring later, but the immediate opportunity is to make the existing homepage surface materially stronger.

**Mode 3: Saved-library rediscovery**
The user is not looking for something new — they want to surface the right recipe from what they already saved. This mode was surfaced in the Core Loop exercise (`04A`) and confirmed as a distinct job in the JTBD exercise (`03A`). The pain is timing and context loss: the right recipe was saved, but the product cannot surface it at the right moment.

Strategic conclusion across all three modes:
- `Discover` is not mainly a browsing problem.
- Active-intent discovery is about: vague-intent interpretation, personalization, and conviction-building.
- Passive-inspiration is about: stronger inspiration quality, stronger save conversion, and better learning signal generation through the homepage and related lean-back surfaces.
- Rediscovery is about: contextual surfacing of saved content at the right moment — and is the most actionable near-term loop investment.

Note on vague-intent interpretation: this is a more specific capability than it sounds. It means the system understands what a user means when they search with natural language ("something cozy for a rainy weeknight," "easy dinner the kids will eat") and maps that meaning to recipe attributes — flavor profile, effort level, family fit — without requiring keyword precision. This depends on the semantic metadata layer being complete. It is distinct from constraint-first search (accepting multiple explicit constraints simultaneously) and distinct from decision collapse (returning one answer). See `05A_TenX_vs_TenPercent_Synthesis.md` for the full search-to-decision-collapse spectrum.

### Decide

What the exercise found:

- The hardest part is not simply choosing from a list.
- The core issue is `Validate fit`.
- `Screen options`, `Validate fit`, and `Choose one answer and commit` all scored high.

What the research adds:

- Decision fatigue is strongly evidenced.
- Users want help assessing whether a recipe is trustworthy before they commit.
- Household fit, pantry fit, and confidence signals matter more than more options.

Strategic conclusion:

- `Decide` remains one of the strongest AI opportunity zones.
- The product should shift from surfacing options to supporting commitment with confidence.

**Product design note on the save action:** Saving happens inside the Decide zone, not after it. When a user saves a recipe, two things are currently lost that have compounding downstream costs:

1. **Context** — why was it saved? For a weeknight, for guests, for a dietary constraint? Without this, the saved recipe becomes decontextualized and harder to rediscover at the right moment.
2. **The adapted version** — most users would modify the recipe for their household. They save the original. When they return, they must re-solve all those modifications from scratch.

The opportunity set also names UGC conviction signals here — real cook notes, substitution tips, honest time estimates — as the trust layer that attaches to a recipe at the point of save and reinforces commitment. This is part of the conviction layer for Decide, not a separate concern. It is also the primary defensible moat against LLMs: a language model can suggest a recipe, but it cannot show you what 47,000 real cooks said about making it.

These are product design implications of how the save action is built, not a separate journey stage.

### Recommended Role Across Discover / Decide

- Early: AI as `curator`
- Later: AI as `confidence layer` and `decision support`

## Plan / Shop

### Plan

What the exercise found:

- Planning begins as a `too many variables` problem.
- The front-end pain is in `Gather requirements`.
- The back-end pain is in `Commit to a weekly plan`, where the week can feel brittle before it starts.

What the research adds:

- Multi-constraint optimization is strongly validated.
- Planning reduces future daily burden, but concentrates cognitive burden up front.
- Existing planning tools are often overwhelming and fragmented.

Strategic conclusion:

- `Plan` is a system-design problem, not just a feature gap.
- AI has real value as a planner if it can take multiple constraints and return a coherent week.

### Shop

What the exercise found:

- `Optimize list` is the hottest shopping sub-stage.
- The problem is not one thing; it is a combination of:
  - overlap,
  - quantity accuracy,
  - and pantry mismatch.

What the research adds:

- Shopping-list fragmentation is strongly validated.
- Users want consolidated lists, ingredient overlap handling, pantry-aware matching, and better quantity logic.
- Users will tolerate some manual cleanup here more than they will during cooking.

Strategic conclusion:

- `Shop` is important, but it is not the emotional center of the experience.
- AI should act primarily as an optimizer, not a prominent assistant.

### Recommended Role Across Plan / Shop

- AI as `planning partner` first
- AI as `optimizer` second

## Cook / Execute / Recover

### Cook / Execute

What the exercise found:

- `Follow steps` is not the main issue.
- `Manage timing` was initially rated lower than expected.
- The hottest sub-stage is `Handle questions / uncertainty`.

What the research adds:

- This stage has lower failure tolerance than planning or discovery.
- Timing, ambiguity, interruptions, and context-switching are all major execution problems.
- Users require much higher reliability here.

Strategic conclusion:

- `Cook / Execute` should be treated as a high-trust surface.
- The role of AI is not simply to narrate a recipe.
- The role is to clarify, pace, guide, and adapt without increasing friction.
- **Near-term constraint:** The current product sends users to external brand sites at the Cook step (monetization model). The product is not present during the active cook. The pain scores above are valid — users genuinely struggle here — but the product's ability to address this pain is architecturally blocked until recipes live natively on the platform. Near-term investment in this zone should focus on signal instrumentation and readiness, not on shipping guidance features that have no in-app surface to live on. See `04A_Core_Loop_Strategy_Synthesis.md`.

### Recover

What the exercise found:

- `Ingredient missing`, `Step confusion`, and `Plan disruption` all matter.
- `Plan disruption` surfaced as the hottest strategic recovery sub-stage.

What the research adds:

- The strongest direct support is for in-the-moment recovery:
  - missing ingredients
  - troubleshooting mistakes
  - interruption recovery
  - substitution confidence
- Weekly replanning remains compelling, but is less directly evidenced in this research set.

Strategic conclusion:

- Recovery is real and important.
- But there are two different recovery products hiding inside it:
  - `current-cook rescue`
  - `plan-level recovery`

The first is strongly evidenced.
The second is strategically promising, but should be treated as a more specific bet.

### Recommended Role Across Cook / Execute / Recover

- During execution: AI as `guide`
- During failure states: AI as `rescue system`

## What Changed After Research Cross-Check

Compared with the initial interactive scoring, the main adjustments are:

1. `Cook / Execute` should be treated as a higher-risk, higher-trust-boundary stage.
2. `Recover` should be split into in-the-moment rescue and plan-level replanning.
3. `Discover` remains important, but users are more tolerant of imperfection there.
4. `Shop` remains highly broken structurally, but not necessarily the most emotionally intense stage.

## What Changed After Opportunity Set Cross-Reference

Compared with the research cross-check version, the main updates from comparing against `MYR_AI_Strategy_Opportunity_Set.md` are:

1. **`Discover` split into three modes**: active-intent search (the only mode originally scored), passive-inspiration browsing (lean-back, format-driven), and saved-library rediscovery (previously mentioned but now properly positioned as a distinct Discover mode rather than a Reflect/Save/Learn issue).
2. **`Best-in-class` definition for discovery updated** to reflect all three modes rather than treating discovery as a uniform experience.
3. **Save action design implications surfaced within Decide**: adaptive context capture (preserving why a recipe was saved and the user's intended adaptations) and UGC conviction signals were identified as important product design considerations at the save moment. These belong inside the Decide zone, not as a separate stage. `Collect` was considered as a distinct stage and rejected — saving does not represent a distinct user mental mode or goal; it is a micro-action within Discover/Decide, and its downstream implications (rediscovery quality, adaptation loss) are already captured elsewhere in this document.

## Strategic Implications

### 1. One Journey, Different Tolerance Levels

The user journey is connected, but the trust bar is not constant.

- Discovery can be imperfect and still useful.
- Planning can require some manual cleanup and still succeed.
- Execution and recovery demand much higher reliability.

This means AI products across the journey cannot all be held to the same performance standard.

### 2. Same Intelligence Layer, Different Roles

The role of AI should change by zone:

- `Discover / Decide`: interpret, curate, validate (saving is within this zone; adaptive context capture and UGC conviction signals are product design implications of how the save action is built)
- `Plan / Shop`: coordinate, optimize, structure
- `Cook / Execute / Recover`: guide, clarify, rescue

### 3. Best-In-Class Means Different Things In Different Moments

- In discovery: better relevance and intent understanding across all three modes (active-intent, passive-inspiration, rediscovery)
- In deciding: fewer decisions, more confidence, and conviction signals at the point of commitment (including UGC trust signals and adaptive save quality)
- In planning: less cognitive burden
- In shopping: less fragmentation
- In execution: fewer breakdowns
- In recovery: faster rescue with less improvisation

## Recommended Output For Next Framework

Use this synthesis as the input to `06_Platform_vs_Feature_AI_Architecture.md`.

The core architecture question can now be answered with better evidence:

- AI should not be one generic assistant over the whole journey.
- AI should not be fragmented into disconnected features either.
- The likely answer is a shared intelligence layer with role-specific surfaces by context.

## Open Questions To Validate Later

- How much of `Decide` is truly driven by the Established Home Cook versus being shared across multiple personas?
- How strong is the real user demand for plan-level replanning relative to in-the-moment rescue?
- How much execution guidance do experienced cooks actually want versus tolerate?
- Where is the minimum reliability threshold for surfacing explicit AI during cooking?
