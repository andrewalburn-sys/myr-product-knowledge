# 08 MyRecipes AI Strategy Synthesis

## Purpose

This document is the single strategic point of view for how MyRecipes should use AI across the cooking journey. It consolidates the decisions made across the full synthesis set into one coherent recommendation for roadmap prioritization, product design, and leadership alignment.

## Source Frameworks

- `01A_User_Journey_Pain_Density_Synthesis.md`
- `02A_Magical_vs_Mechanical_Synthesis.md`
- `03A_JTBD_Synthesis.md`
- `04A_Core_Loop_Strategy_Synthesis.md`
- `05A_TenX_vs_TenPercent_Synthesis.md`
- `06A_Platform_vs_Feature_AI_Architecture_Synthesis.md`
- `07A_Moments_of_Truth_Synthesis.md`

---

## The Strategic Question

How should MyRecipes layer AI into an experience where pain spans discovery, deciding, planning, shopping, cooking, and recovery?

## The Strategic Answer

MyRecipes should not build a recipe app with AI features layered on top.

MyRecipes should build an intelligent cooking companion — a product that makes the right decision, helps the user follow through, and gets smarter every time. AI is not a product category to inhabit. It is the mechanism by which the product earns the right to be called a companion rather than a destination.

The architecture that supports this is:

- **One shared intelligence layer** that accumulates knowledge across the full journey
- **Multiple context-specific surfaces** that express different AI roles by journey stage
- **Three tiers of AI visibility** that vary by persona, trust, and the nature of the moment

---

## What the Frameworks Decided

### 1. Journey and Pain Density

The cooking journey does not have uniform pain. The research-adjusted ranking by pain intensity and AI opportunity is:

1. `Discover (active intent) + Decide` — combined zone; user has a need-state and is moving toward a commitment. Active-intent search and saved-library rediscovery both belong here. Pain concentrates at the commit end: validating fit, building conviction, choosing.
2. `Cook / Execute` — ambiguity, timing, uncertainty, high failure cost
3. `Plan` — multi-variable cognitive overload, front-loaded burden
4. `Recover: in-the-moment` — missing ingredient, mistake, confusion during active cooking
5. `Shop` — fragmentation and list optimization failure
6. `Discover (passive inspiration)` — lean-back mode with no current decision intent; pain is weak relevance and low save conversion, not commitment anxiety
7. `Reflect / Save / Learn` — low acute pain, high long-term leverage

**The trust tolerance finding:** AI failure is not equally costly across stages. Users accept imperfect recommendations during discovery. They require near-perfect reliability during cooking and recovery. The product cannot hold all stages to the same performance standard, and should not try to.

**The Discover stage has three distinct modes.** Active-intent discovery helps the user find something new when they have a query or need-state. Passive-inspiration discovery is the homepage-style lean-back experience — curated and personalized sections that build appetite, generate saves, and create future learning signal. Saved-library rediscovery surfaces the right saved recipe at the right moment. These are different user states with different product expressions. The saved-library failure — users build recipe libraries they cannot find the right thing in at the right time — is the most actionable near-term loop problem and belongs explicitly in the product roadmap. Passive-inspiration matters strategically too, but it should be treated primarily as a growth and signal-generation surface that feeds later decisions rather than as the core decision engine itself.

**Cook / Execute is partially off-limits near-term.** The current product sends users to external brand sites to cook, which means the product is not present during the active cook. Execution guidance and in-cook rescue features require native recipes to be useful. This does not change the pain score (users genuinely struggle here) but it bounds what the product can do about it until native recipes exist.

**AI roles by zone:**

| Zone | AI role |
| --- | --- |
| Discover / Decide (active-intent) | Curator, confidence layer, decision support |
| Discover / Decide (passive-inspiration) | Homepage curation + personalization engine that drives better saves and future intent signal |
| Discover / Decide (saved) | Contextual rediscovery engine |
| Plan / Shop | Planning partner, constraint optimizer |
| Cook / Execute / Recover | Real-time guide, rescue system. Near-term: voice companion (opt-in) launches alongside brand pages. Full integrated surface requires native recipes. |

---

### 2. Magical vs Mechanical

**Mechanical functions** are table-stakes utilities where AI should be invisible or absent. They must work well, but they are not differentiation:

- Recipe storage and saving
- Grocery list creation
- Timers and step progression
- Quantity scaling

**Pantry sync** sits at the boundary. The sync itself is mechanical. The downstream actions — proactively surfacing what to cook, removing already-owned items from a shopping list — are Tier 2 magical. But the fully invisible version (the system just knows what you have) is gated by a data capture problem that has not yet been solved.

**Magical moments** are where AI is allowed to surface and where differentiation happens. The full classified list:

| Moment | Tier | Priority |
| --- | --- | --- |
| Tell me the one dinner that fits tonight | T1 brain, T2 surface | Lead magical moment |
| Is this actually worth making? | T1 + T2 conviction signals | High |
| What can I cook with what is already here? | T2 (gated by pantry data) | Medium |
| Make the product feel like it knows me | T1 always | Foundation |
| Something changed, fix the plan | T2 / T3 | Medium |
| In-cook substitution confidence | T2 quick + T3 deep | High |
| Technique clarification at the moment of uncertainty | T3 | High in execution zone |
| Full week plan generation from constraints | T2 form, T3 to refine | Medium |
| Help me pace multiple dishes | T3 advanced mode only | Lower |

**The lead magical moment** is "Tell me the one dinner that fits tonight." It was chosen because it sits at the intersection of the highest-volume daily pain, the most under-served persona (Weeknight Reducer), and the earliest proof point for whether the shared intelligence layer is actually working.

**The Established Home Cook design rule:** Invisible for mechanical tasks. AI surfaces only at the highest-value magical moments — commitment and rescue. Never decorative. This rule is the strictest constraint on AI visibility in the product because the EHC is approximately 50% of the audience.

---

### 3. AI Architecture

**The decision: hybrid shared brain with multiple context-specific surfaces.**

One shared intelligence layer learns across the full cooking journey. That intelligence is expressed through distinct product experiences by stage. There is no single persistent visible AI assistant as the default experience.

#### The Three-Tier AI Visibility Model

| Tier | What it is | Primary audience | Build position |
| --- | --- | --- | --- |
| Tier 1: Invisible | AI runs beneath the product entirely. Users experience a smarter platform — better relevance, better personalization — without a label, chat interface, or AI prompt. | Established Home Cook (primary); all personas (foundation) | First to build, last to deprioritize |
| Tier 2: Ambient | AI shows up as smart product moments without announcing itself. Constraint-first search, consolidated shopping lists, substitution suggestions — expressed as native product features, not AI. | Weeknight Reducer and System Thinker (primary) | Built on top of Tier 1 |
| Tier 3: Voice companion alongside the recipe (opt-in, Phase 2) | A companion the user activates while looking at a recipe — substitution help, technique clarification, real-time guidance. Not the default, not a standalone app. Launches on brand pages via OpenAI Realtime API today; tighter native integration once recipes are on the platform. POC exists. | System Thinker and Enthusiast (primary); broadly useful opt-in for execution rescue | Phase 2 opt-in — not Phase 4 |

**Tier 3 is an advanced mode.** It is not surfaced to users who have not opted in. The form factor is: user is looking at a recipe and launches the companion. Today it works alongside brand pages. When native recipes exist it deepens into step-aware, context-specific guidance. A companion with no knowledge of the user's taste and history is just a voice search box.

#### The Shared Intelligence Layer

What the shared brain must hold:

- Recipe metadata: taste, technique, occasion, flavor profile, effort, similarity
- Persistent preference and taste memory
- Household constraints and family fit
- Pantry and ingredient state
- Weekly plan and schedule state
- Cooking progress and interruption state
- Trust history: what worked, what was skipped, what was modified, what failed

**MVP of the shared brain** (not building from scratch — connecting what exists):

1. Complete and structure the recipe metadata layer
2. Connect existing behavioral signals (saves, revisits, ratings) into a persistent preference model
3. Instrument planning and recovery directly, and infer execution through near-term proxy signals (click-out, time-on-page, revisit, save engagement) until native recipes unlock true in-cook telemetry

#### Context-Specific Surfaces

| Stage | AI role | Tier default | Trust rule |
| --- | --- | --- | --- |
| Discover / Decide | Curator + confidence layer + decision support | T1, T2 at decision point | No AI labels; the platform should feel like it knows the user |
| Plan / Shop | Planning partner + constraint optimizer | T2 for constraint planning, T3 in advanced mode | Output is the product (the plan, the list) — not the conversation |
| Cook / Execute / Recover | Real-time guide + rescue system | T2 embedded, T3 opt-in | Highest reliability bar in the product; AI should not surface here unless it performs consistently |

---

### 4. 10x Impact Classification

Not all AI investments are equal. The exercise produced four categories:

| Category | Meaning | Shipping rule |
| --- | --- | --- |
| Forgiving-threshold 10x | Step-function improvement where partial accuracy still delivers the value — imperfection is tolerable and recoverable, not catastrophic | Ship when output is coherent and constraint-aware; value survives imperfection |
| Reliability-gated 10x | Step-function only if AI answer is trustworthy; wrong answers at high-stakes moments are actively harmful | Do not ship until the reliability threshold is proven internally |
| 2x | Real practical value, not a category-level change | Ship as a supporting feature |
| 10% | Minor incremental gain, not differentiated | Deprioritize; do not over-invest |

**The reliability-gated 10x category is the most important new finding.** Several of the highest-value AI opportunities are only 10x if the system is trustworthy enough that users act on it without verification. Below that threshold, the same feature damages trust. The rule: do not ship reliability-gated 10x features until the accuracy threshold is confirmed.

**Top opportunities by classification:**

*Forgiving-threshold 10x:*
- Constraint-adaptive full week plan generation — an imperfect meal in a plan is adjustable; the value survives imperfection, but zero constraint awareness is not 10x
- Plan recovery engine (10x for System Thinker and Weeknight Reducer — narrower audience than it first appears)

*Reliability-gated 10x:*
- "Tell me the one dinner that fits tonight"
- In-the-moment substitution rescue during active cooking
- Pantry-aware intelligence (data-capture-gated: ceiling rises to 10x only if data quality is solved)

*2x (solid supporting layer):*
- Persistent preference memory (foundational; enables every reliability-gated 10x)
- Generic substitution suggestions (planning and browsing context)
- Plan-consolidated shopping list
- Contextual technique clarification (2x only when specific to the recipe step, not generic)
- Natural language intent parsing (2x for search quality; prerequisite for constraint-first search)

*10% (deprioritize):*
- Repertoire-aware novelty scoring without a validated behavioral success metric — the primary over-investment risk
- AI-generated recipe tips and explanations
- Step-by-step narration as default experience for experienced cooks

---

### 5. The Search-to-Decision-Collapse Spectrum

Natural language input, intent parsing, constraint-first search, and "one dinner tonight" are four distinct capabilities on a dependency chain — not one feature at different levels of investment.

```
Semantic metadata → intent parsing → constraint-first search → decision collapse
```

| Capability | Impact | Current state |
| --- | --- | --- |
| Semantic metadata (AI-assigned recipe attributes) | 2x foundational; enables everything above it | In progress |
| Natural language intent parsing | 2x for search quality; prerequisite for constraint synthesis | Not built |
| Constraint-first search | 2x–10x depending on persona | Not built |
| Decision collapse — "one dinner tonight" | Reliability-gated 10x | Not built |

The user-facing surface for constraint-first search and decision collapse is a natural language input: a smarter search experience that understands what "something easy for the kids tonight" means across dietary, effort, skill, and family-fit dimensions simultaneously — without requiring the user to set filters manually. This is not a visible AI assistant. It is a Tier 2 surface that works because of the intelligence beneath it.

The metadata structuring work currently in progress is not a parallel track to the AI strategy. **It is the intelligence prerequisite for the entire chain.** Its strategic importance is higher than it appears as a line item.

---

## Product Identity

### What MyRecipes is today

A recipe destination. A place to find and save recipes.

### What it should become

A cooking companion. Something that helps users through the whole process — from idea to execution — not just the front door.

### How that identity should be expressed

Through product behavior, not through AI branding.

The platform should feel like it knows you. It should help you move from idea to execution with less friction. It should get better over time without requiring extra work. It should be there when things go wrong.

None of that requires a named AI character, a branded companion, or a persistent chatbot. The companion identity shows up in how the product behaves.

### Internal rally point

> **From "I need to make dinner" to "dinner happened."**

This framing does three things: it makes the scope clear (the product is accountable for the whole journey), it makes the AI role clear (intelligence removes friction across that journey, it does not demonstrate capability), and it makes the quality bar clear (success is dinner happening with less stress and less failure than before).

---

## Recommended Build Order

### Phase 1: Shared intelligence foundation

*Enables everything that follows. Nothing 10x works without this.*

- Complete and structure the recipe metadata layer (taste, technique, flavor profile, effort, occasion, family fit, similarity)
- Connect existing behavioral signals into a persistent preference model
- Instrument planning and recovery directly, and build the proxy-signal layer for execution behavior until native recipes unlock step-level telemetry
- **Conviction signal surfacing** — social proof badges, fit signals, and trust indicators at the recipe card and modal level, powered by the metadata layer; this must be performing before the decision engine is promoted
- **Saved-library rediscovery engine** — contextual, timing-aware surfacing of the right saved recipe at the right moment; addressable now without native recipes and the most actionable near-term loop fix
- **Smarter homepage** — personalized, contextual module packaging that improves with every session

**This is not just a search quality improvement.** It is the semantic intelligence layer that enables intent parsing, constraint-first search, decision collapse, and the conviction signals that make the decision engine trustworthy.

**Incremental shipping note:** The Phase 1 consumer-facing features — conviction signals, saved-library rediscovery, and homepage improvements — ship as individual releases as they become ready. The phase structure governs the reliability-gated features (the Phase 2 gate); it does not mean nothing is visible to users until all Phase 1 infrastructure is complete. Visible progress within Phase 1 is part of the strategy.

### Phase 2: Lead magical moment + first 10x release + voice companion opt-in

*After conviction signals are established and internal accuracy thresholds are confirmed.*

**Trust sequence rule:** The decision engine should not be promoted as the primary product experience until conviction signals are performing. Users will not hand over their dinner decision to a product whose content they do not already trust. Conviction first, then decision collapse. (See `07A_Moments_of_Truth_Synthesis.md`.)

- "Tell me the one dinner that fits tonight" (2-3 strong options at launch, not forced single answer) — reliability-gated 10x, primary persona proof; promoted after conviction layer is established
- Constraint-adaptive full week plan generation — highest forgiving-threshold 10x
- Natural language / constraint-first search input surface — Tier 2 ambient, built on top of the intelligence foundation
- Plan-consolidated shopping list — 2x, directly attached to planning
- **Voice companion alongside the recipe (Tier 3 opt-in)** — launches on brand pages via OpenAI Realtime API, no native recipe dependency required. Delivers substitution rescue and technique guidance as early opt-in features. POC already exists. The companion deepens once recipes are native; it does not start there.

### Phase 3: High-trust execution and recovery zones (full native surface)

*After Phase 2 trust is established and the shared brain is proven.*

- In-the-moment substitution rescue — full native-surface integration (deliverable via voice companion in Phase 2 opt-in; this is the deeply integrated version)
- Pantry-aware intelligence — data-capture-gated 10x; sequence after data capture mechanism is validated
- Contextual technique guidance — full native-surface integration (deliverable via voice companion in Phase 2 opt-in; this is the step-aware, in-context version)

### Phase 4: Advanced companion depth and plan recovery

- Plan recovery engine — forgiving-threshold 10x for System Thinker and Weeknight Reducer specifically; do not overbuild for the full audience
- Multi-dish pacing — Tier 3, advanced mode only; requires voice companion surface from Phase 2
- Full contextual cooking history — the companion across sessions, building a memory of what worked, what was modified, what failed

### What to validate before scaling investment

- Repertoire-aware novelty scoring — requires a behavioral success metric (e.g., measurable increase in cooking frequency or recipe follow-through) before the hypothesis becomes a strategic bet

---

## Operating Principles

1. **Build around answers, not options.** The product should collapse decisions, not multiply them.
2. **Reliability is a strategy.** For reliability-gated 10x features, shipping before the accuracy threshold is met is a path to trust damage, not a faster path to value.
3. **Keep AI invisible until visibility improves the outcome.** If removing the AI label does not change the user experience, the label should be removed.
4. **The Established Home Cook is the constraint on default visibility.** If a feature would feel intrusive or performative to the largest persona, it should be invisible by default and opt-in only.
5. **The intelligence layer comes before the surface.** Build the semantic foundation before the features that depend on it. The interface is not the product; what the system understands is.
6. **Treat recovery as a first-class feature, not an exception state.** In-the-moment rescue and plan recovery are where trust is won.
7. **Use one intelligence system with multiple UX roles.** Context-specific surfaces are acceptable; a fragmented intelligence stack is not.
8. **Judge new ideas by whether they strengthen the core loop.** The product has two loops sharing one intelligence layer: a daily loop (`Discover → Commit → Cook → Signal → Better discovery tomorrow`) and a weekly loop (`Plan the week → Execute → Adapt → Smarter plan next week`). AI should make each stage of both loops better and carry learning forward. Features that sit outside both loops are not compounding the product.
9. **Ship incremental features that matter. Don't wait for the complete picture.** The phase gates protect reliability-gated features — they do not mean nothing ships until an entire phase is done. Consumer-facing improvements within each phase ship continuously. Visible progress is part of the product strategy, not separate from it.

---

## Persona-Specific AI Posture

| Persona | What they need most | Right AI posture | What to avoid |
| --- | --- | --- | --- |
| Established Home Cook | Meaningful relevance, trusted conviction signals, no disruption | Invisible personalization; AI surfaces only at commitment and rescue | Chatbot framing, overt AI labels, decorative AI features |
| Weeknight Reducer | One answer fast, feasibility confirmed, instant recovery | Constraint-first decision engine; Tier 2 default | Multi-step setup, ambiguous results, opaque logic |
| Enthusiast | Conviction, taste expansion, technique confidence | Knowledgeable curator; Tier 3 available for guidance | Generic suggestions, over-simplification |
| System Thinker | Whole-week optimization, resilient replanning | Explicit planning partner; Tier 3 available for full week-building and recovery | Single-meal framing, fragmented tools |

---

## What Best-In-Class Means

For MyRecipes, best-in-class means:

- The app feels like it knows what I should make.
- The answer I get requires less work than any alternative.
- The plan survives real life.
- Cooking feels less fragile.
- Every successful dinner makes the next one easier.

It does not mean:

- The most visible AI presence.
- The broadest set of AI-branded features.
- A chat interface as the primary product surface.
- AI that is impressive in demos but unreliable in daily use.

---

## The LLM Competitive Context

The JTBD exercise (03A) surfaced a competitive threat that does not appear in earlier frameworks: LLMs (ChatGPT, Claude, Gemini) are an increasingly direct substitute for MyRecipes' core decision job.

When a user asks an LLM "what should I make with chicken thighs tonight?" they get an immediate, constraint-aware answer — the closest existing substitute for what MyRecipes' decision engine should become. Unlike Google (requires browsing results) or TikTok (passive discovery), an LLM gives a personalized, direct answer. Once the habit forms, it is the hardest firing behavior to reverse.

**The window of advantage is real but time-bounded.** LLMs currently lack:
- Real, tested, community-validated recipe content
- Social proof and trust signals (ratings, reviews, editorial credibility)
- Persistent personalization across sessions
- A dedicated UI optimized for the active cooking journey

**The window narrows as LLMs gain access to real recipe databases.** The defensible moat is conviction — test kitchen credibility, community-validated quality, and personalized fit signals that LLMs cannot fabricate. This is precisely what the metadata and conviction signal work in Phase 1 is building.

**Urgency: 12-18 month horizon.** The LLM threat does not require changing Phase 1 priorities — it validates them. The conviction and personalization investments are both the right product work and the right competitive investments. Build them faster than LLMs can acquire real-recipe credibility.

---

## Leadership Narrative

> The opportunity is not to add AI across a recipe product. The opportunity is to build a cooking companion — a product that acts as a decision engine when you need to know what to make, a planning partner when you need to figure out the week, a trusted guide during cooking, and a memory layer that makes every future decision easier. The same intelligence system powers all of it. The experience changes by context and persona. The standard is not "AI-powered features." The standard is: did dinner happen?
