# Assistant product docs

Living production docs sit here. Specs written to build the prototype live in `poc/` — useful as feature detail until those PRDs are rewritten. `experiments/` is a separate test, not part of the assistant.

The plan for governing these documents as a developer knowledge base and living PRD is in `../knowledge-base/Build Plan - Living PRD Knowledge Base.md`.

## Production

- `PRD - MyRecipes Assistant.md` — what the assistant is, who it's for, how we'll know it worked
- `PRD - Assistant Discovery MVP (Backend).md` — Q4 release, backend. User flows written as service requirements.
- `Assistant Discovery MVP - Design Brief.md` — use cases, required states, and open interaction problems for product design.
- `Assistant Discovery MVP - App Requirements.md` — Q4 release, app side. For Smart Labs.
- `Assistant Conversation and Interaction Behavior.md` — canonical cross-feature behavior for turns, context, navigation, response formats, and chat history
- `Assistant Discovery - Golden Sequences.csv` — 49 test sequences with expected behavior and hard constraints
- `Build Plan - MyRecipes Assistant.md` — sequencing for engineering
- `Assistant Backend Capability Map.md` — backend capabilities and dependencies
- `Dinner Tonight - Data Science Problem Statement.md` — taste + makeability problem for "what's for dinner tonight," cook signals, explainability discovery
- `PRD - Assistant Semantic Query Planner.md` — how typed queries get interpreted and routed
- `Assistant Semantic Retrieval - Elasticsearch Execution Spec.md` — how semantic plans compile into bounded Elasticsearch retrieval, hard gates, reranking, and diagnostics
- `Assistant Follow-Up Suggestions - Relevance Rules.md` — post-result refinement suggestion quality
- `Recipe-Specific Suggested Questions - Relevance Rules.md` — recipe-page suggestion quality

## POC reference

Written to guide the prototype. Don't treat them as production requirements. The master PRD still points at Dinner Decision Engine, Photo-Based Discovery, and User Recommendation Preferences as placeholders.

- `poc/PRD - Agentic Recipe Assistant.md` — prototype record; superseded by the production PRD
- `poc/PRD - Dinner Decision Engine.md`
- `poc/PRD - Photo-Based Recipe Discovery.md`
- `poc/PRD - User Recommendation Preferences.md`
- `poc/PRD - Catch a Vibe.md`
- `poc/Build Plan - Catch a Vibe.md`
- `poc/Figma Handoff - Catch a Vibe.md`

## Archive

Superseded docs, kept for reference.

- `archive/PRD - Dinner Recommendation Intelligence (Data Science).md` — replaced by the Dinner Tonight problem statement
- `archive/Brief - Dinner Recommendation Intelligence Working Session.md` — replaced by the Dinner Tonight problem statement

## Experiments

- `experiments/Feature Overview - Multi-Recipe Cooking Guidance.md` — internal LLM test, not a product build
