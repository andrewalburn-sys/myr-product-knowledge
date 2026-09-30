# 03A JTBD Synthesis

## Purpose

This document extends the Jobs-to-be-Done framework in `03_JTBD_for_Cooking_AI.md` with three things the first-pass did not address: the firing analysis (when users leave and why), a competitive threat assessment against LLMs, and a job gap analysis that identifies where MyRecipes is most underserving its most important jobs.

## Inputs Used

- `03_JTBD_for_Cooking_AI.md` (base framework)
- `04A_Core_Loop_Strategy_Synthesis.md`
- `07A_Moments_of_Truth_Synthesis.md`
- `05A_TenX_vs_TenPercent_Synthesis.md`
- Interactive exercise

---

## Updated Job List

The base framework listed seven jobs. The interactive exercise confirmed all seven and added one new distinct job surfaced by the Core Loop exercise.

### Full Job List

| Job to be done | Primary personas | Current solution | Why it fails | AI opportunity |
| --- | --- | --- | --- | --- |
| Help me decide what to cook quickly | Weeknight Reducer, Established Home Cook | Search, browsing, memory | Too many results, not enough relevance; no fast confident answer | Narrow to 2-3 strong options with visible reasoning; eventually full decision collapse |
| **Help me find the right saved recipe at the right moment** | Weeknight Reducer, Established Home Cook | Manual browse of saved library | Library grows too large; context is lost; right recipe never surfaces at the right time | Contextual rediscovery engine powered by metadata and timing inference |
| Help me build a week that works | System Thinker, Weeknight Reducer | Spreadsheets, lists, mental planning, multiple apps | Manual optimization across constraints, overlap, schedule, and budget | Generate and maintain a coherent week plan from constraints |
| Help me know I can actually pull this off | Weeknight Reducer, Enthusiast | Manual pantry check, recipe reading, separate shopping tools | Feasibility is hidden until too late | Pantry-aware filtering, right-sized quantities, pre-resolved substitutions |
| Help me trust this dish is worth the effort | Enthusiast, Established Home Cook | Editorial copy, ratings, comments, intuition | Conviction signals are weak or generic; ratings don't answer "is this right for me?" | Surface UGC proof, provenance, household fit, and real confidence context |
| Help me not mess this up while cooking | Weeknight Reducer, Enthusiast | Static recipe, timers, memory | Recipes do not adapt to pace, confusion, or mistakes | Step-aware guidance and technique help on demand |
| Help me recover when things go wrong | Weeknight Reducer, System Thinker, Enthusiast | Manual improvisation, abandonment, takeout | No recovery path exists in current tools | Substitution engine and plan recovery engine |
| Help me improve without extra work | All personas | Saved recipes, memory, ad hoc notes | Learning does not compound across sessions | Preference memory and behavioral feedback loop |

### Why Rediscovery Is a Distinct Job

The user who is browsing for something new and the user who is trying to surface the right thing from what they have already saved are in fundamentally different modes. The first is in exploration mode — open to new ideas, willing to browse. The second is in decision mode — they know they have something saved, they trust it, and they want the system to find it for them. These are different jobs with different success criteria and different product expressions. Collapsing them into one "decide" job obscures the rediscovery gap, which the Core Loop exercise identified as the most actionable near-term investment.

---

## The Firing Analysis

Understanding when users fire MyRecipes is as strategically important as understanding why they hire it. A job unfulfilled does not just go unsatisfied — it migrates to a competitor.

### Primary firing triggers

**1. Can't find it quickly**
When search returns too many results or irrelevant ones, users switch to Google. The product fails the "help me decide" and "help me find the right saved recipe" jobs simultaneously. Google is fast, familiar, and does not require trusting a specific platform's curation.

**2. No fast answer**
When the product requires browsing effort to arrive at a decision, users default to what they already know — their mental repertoire of reliable meals — or ask someone else. This is especially acute for the Weeknight Reducer, whose primary job is speed-to-decision under time pressure.

**3. LLMs for decisions**
Users increasingly ask ChatGPT, Claude, or Gemini "what should I make with chicken thighs tonight?" and get an immediate, specific, constraint-aware answer. This directly competes with MyRecipes' core decision job. Unlike Google (which requires the user to browse results) or TikTok (which requires passive discovery), LLMs give a personalized, immediate answer — the closest existing substitute for what MyRecipes' decision engine should eventually become.

### The hardest firing habit to win back: LLM adoption

Of all the firing triggers, LLM habit formation is the hardest to reverse. Once a user establishes the reflex of asking an LLM for dinner decisions, they have found a satisfying substitute for one of MyRecipes' primary jobs. The habit is fast, low-friction, and increasingly reliable as LLMs improve.

The current window of advantage exists because:
- LLMs do not have access to verified, tested recipe data with real social proof
- LLMs do not know the user's household, pantry, or taste history
- LLMs have no dedicated UI optimized for the active cooking journey

**This window is bounded.** As LLMs gain access to real recipe databases, the trust gap narrows. The opportunity is to build conviction signals and personalization into MyRecipes faster than LLMs can acquire real-recipe credibility.

---

## The LLM Competitive Threat

### Assessment: Serious but bounded

LLMs are good at fast, constraint-aware, natural language answers to cooking questions. They directly compete with the decision job and the "help me know I can pull this off" job. However, they have structural disadvantages that MyRecipes can exploit:

| Dimension | LLM status | MyRecipes advantage |
| --- | --- | --- |
| Real, tested recipe content | Limited; fabrication risk | Deep library of tested, brand-backed recipes |
| Social proof and trust signals | None | Ratings, reviews, UGC, editorial credibility |
| Personalization depth | Session-only; no persistent memory without accounts | Can build persistent taste, household, and preference memory |
| Dedicated cooking UI | Generic text interface | Optimized surfaces for decision, planning, execution |
| Execution guidance | Possible but unoptimized | Can build step-aware, cook-context-specific guidance |

### The defensible moat

The most defensible advantage is **conviction** — real user proof, test kitchen credibility, community-validated quality signals, and editorial trust. These are things LLMs cannot generate. A recipe that has been made 50,000 times, rated 4.8 stars, and marked "Test Kitchen Approved" carries a different kind of trust than a recipe generated on the fly by a language model.

The moat is strongest when all three advantages are combined: conviction + personalization + execution. Any one alone is replicable over time. The combination — a product that knows you, surfaces things you can trust, and helps you cook them — is structurally harder to replicate.

### Urgency: 12-18 month horizon

The LLM threat is real enough to shape strategy now, but does not require changing near-term Phase 1 priorities. The metadata and conviction signal work already in progress is exactly the right investment. The urgency is to execute it faster than LLMs can acquire real-recipe credibility, not to change direction.

---

## Job Gap Analysis

Not all jobs are equally well-served by MyRecipes today. The gap matrix shows the distance between how important a job is and how well the current product fulfills it.

| Job | Importance | Current performance | Gap |
| --- | --- | --- | --- |
| Help me decide what to cook quickly | Very high | Low — returns a list, not an answer | Large |
| Help me find the right saved recipe at the right moment | High | Very low — saved library is static and undersurfaced | Very large |
| Help me build a week that works | High for planners | Low — no planning tool exists | Large |
| Help me know I can actually pull this off | High | Low — feasibility hidden until late | Large |
| **Help me trust this dish is worth the effort** | **High** | **Very low — conviction signals are weak and generic** | **Largest** |
| Help me not mess this up while cooking | High | Low — currently impossible in-app; cook happens offsite | Structural |
| Help me recover when things go wrong | High | Very low — no recovery path exists | Large |
| Help me improve without extra work | Medium-high | Low — learning does not currently compound | Large |

### The conviction gap is the most urgent

The single largest gap between importance and current performance is **conviction** — "help me trust this dish is worth the effort." This is also the job that the Moments of Truth exercise identified as the trust sequence precondition: users will not hand over decisions to the product if they do not first trust what it surfaces.

Current conviction signals — star ratings, comment counts, editorial copy — fail users because they answer the wrong question. They tell the user whether other people liked the recipe in the aggregate. They do not tell the user whether this recipe is right for them: their skill level, their household, their taste profile, their occasion. The gap is between generic social proof and personalized conviction.

**Closing this gap is the highest-urgency JTBD investment** because it unlocks the decision engine. A decision engine built on top of weak conviction signals is not trusted. A decision engine built on top of strong, personalized conviction signals earns the user's willingness to follow its recommendation.

---

## Updated Job Hierarchy

The original hierarchy remains structurally correct. One job has been added and one note added about sequencing.

### Core Decision Jobs (front door to value)

- Help me decide what to cook quickly
- **Help me find the right saved recipe at the right moment** *(new)*
- Help me build a realistic plan
- Help me know this will work

### Core Execution Jobs (where trust is won or lost)

- Help me cook without stress
- Help me recover when something breaks

### Core Learning Jobs (what turns AI into a compounding system)

- Help the product understand me better over time
- Help future decisions get easier

### Sequencing note

The trust sequence identified in the Moments of Truth exercise applies here too: the **conviction job** ("help me trust this is worth the effort") must be served well before the **decision job** ("help me decide quickly") can earn full credibility. Users will not trust a fast answer from a product whose content they do not yet trust.

---

## What This Changes in the Strategy

### 1. Conviction signals belong in Phase 1, not Phase 2

The conviction gap is the largest in the product and a trust precondition for the decision engine. The metadata work in progress — social proof badges, flavor and effort tags, contextual fit signals — is precisely the conviction layer. It should be understood as JTBD work (closing the conviction gap) not just UX work (improving the decision-point display).

### 2. Rediscovery is a distinct job requiring a distinct product investment

Treating rediscovery as a subtype of "help me decide" understates it. The job is specifically: the user has already done the curation work (saving), and the product is failing to complete the loop by surfacing the saved item when it is relevant. This job needs its own product expression — not just better search in the library, but contextual, timing-aware surfacing of saved content.

### 3. The LLM threat validates the conviction and personalization investment

The reason conviction signals and personalization matter competitively — not just experientially — is that they are what MyRecipes can build that LLMs cannot easily replicate. Building them urgently is both the right product investment and the right competitive investment.

### 4. The decision job needs reframing

The current framing is "help me decide what to cook quickly." The product today fails this job by returning a list. The right reframe, now that the decision engine concept is shaped, is: **help me commit to what to make with enough confidence that I do not need to verify it elsewhere.** That framing sets the right product bar — not speed alone, but speed plus conviction.

---

## Open Questions

- What conviction signals, specifically, does the user need to commit to a recipe without external validation? Is it social proof volume, fit signals, or something else?
- How does the rediscovery job change across personas — does the Established Home Cook return to a stable rotation of trusted recipes, while the Weeknight Reducer needs faster surfacing of reliably quick options?
- At what rate are early-adopter users on our platform currently migrating decision jobs to LLMs? Is there data on this?
- What is the minimum conviction signal set that closes the biggest part of the conviction gap — social proof alone, or does it require personalized fit signals?
