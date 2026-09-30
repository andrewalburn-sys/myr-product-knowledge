---
kb_id: source-manifest
title: MyRecipes Assistant Source Manifest
authority: canonical
status: active
owner: Andrew Alburn
audience:
  - product
  - design
  - engineering
  - qa
  - coding-agents
applies_to:
  - knowledge-governance
last_reviewed: 2026-09-30
supersedes: []
superseded_by: null
related_code: []
related_docs:
  - knowledge-base/README.md
  - knowledge-base/UPDATE_POLICY.md
---

# Source Manifest

This manifest determines which documents may answer product questions. A source's authority applies only to the scope described here; a high-authority document does not become authoritative about subjects it does not govern.

## Production and release sources

| ID | Path | Authority | Status | What it answers | Can answer directly? |
|---|---|---|---|---|---:|
| `assistant-product-prd` | `prd/PRD - MyRecipes Assistant.md` | canonical | draft for engineering review | Product purpose, features, trust principles, success criteria | Yes |
| `assistant-discovery-backend-mvp` | `prd/PRD - Assistant Discovery MVP (Backend).md` | release | draft for engineering scoping | Q4 backend flows, service behavior, contracts, release acceptance | Yes, for Q4 |
| `assistant-discovery-design-brief` | `prd/Assistant Discovery MVP - Design Brief.md` | supporting | active | Design use cases, required states, unresolved interaction work | Only with canonical or release support |
| `assistant-discovery-app-requirements` | `prd/Assistant Discovery MVP - App Requirements.md` | release | draft release requirements | Q4 app ownership, shell, rendering, entry points, navigation | Yes, for Q4 |
| `assistant-conversation-behavior` | `prd/Assistant Conversation and Interaction Behavior.md` | canonical | working product contract | Turns, context, scope, response presentation, drill-in, return, history | Yes |
| `assistant-discovery-golden-sequences` | `prd/Assistant Discovery - Golden Sequences.csv` | release | active benchmark | Executable examples, expected behavior, hard constraints | Yes, as release examples |
| `assistant-build-plan` | `prd/Build Plan - MyRecipes Assistant.md` | supporting | active | Engineering sequence and delivery dependencies | No product authority |
| `assistant-backend-capability-map` | `prd/Assistant Backend Capability Map.md` | supporting | active | Backend capabilities, dependencies, ownership boundaries | Only with requirement support |
| `dinner-tonight-data-science-problem` | `prd/Dinner Tonight - Data Science Problem Statement.md` | supporting | active | Taste, makeability, signals, and explainability research questions | No product authority |
| `assistant-semantic-query-planner` | `prd/PRD - Assistant Semantic Query Planner.md` | canonical | approved logic; implementation pending | Intent interpretation, constraint carry-forward, routing, abstract situations | Yes |
| `assistant-semantic-retrieval` | `prd/Assistant Semantic Retrieval - Elasticsearch Execution Spec.md` | canonical | draft v0.1 | Hard filters, retrieval, partial matches, reranking, honest failure | Yes |
| `assistant-follow-up-suggestions` | `prd/Assistant Follow-Up Suggestions - Relevance Rules.md` | canonical | draft v1 | Post-result follow-up relevance and viability | Yes |
| `recipe-specific-suggested-questions` | `prd/Recipe-Specific Suggested Questions - Relevance Rules.md` | canonical | draft v1 | Recipe-page question relevance and evidence requirements | Yes |

## Prototype references

These may answer questions about the current prototype or preserve feature history. They must not establish production behavior when a production or release source exists.

| ID | Path | Authority | Status | What it answers | Can answer directly? |
|---|---|---|---|---|---:|
| `poc-agentic-recipe-assistant` | `prd/poc/PRD - Agentic Recipe Assistant.md` | poc | superseded prototype record | Original assistant prototype behavior | Demo questions only |
| `poc-dinner-decision-engine` | `prd/poc/PRD - Dinner Decision Engine.md` | poc | placeholder detail | Prototype dinner decision behavior | Demo questions only |
| `poc-photo-recipe-discovery` | `prd/poc/PRD - Photo-Based Recipe Discovery.md` | poc | placeholder detail | Prototype camera and photo discovery behavior | Demo questions only |
| `poc-user-recommendation-preferences` | `prd/poc/PRD - User Recommendation Preferences.md` | poc | placeholder detail | Prototype preference controls and personalization | Demo questions only |
| `poc-catch-a-vibe` | `prd/poc/PRD - Catch a Vibe.md` | poc | prototype | Vibe-photo concept and output behavior | Demo questions only |
| `poc-catch-a-vibe-build-plan` | `prd/poc/Build Plan - Catch a Vibe.md` | poc | prototype plan | Prototype implementation sequence | No |
| `poc-catch-a-vibe-figma-handoff` | `prd/poc/Figma Handoff - Catch a Vibe.md` | poc | design handoff | Prototype screen and content guidance | Demo design questions only |

## Historical and experimental material

| ID | Path | Authority | Status | What it answers | Can answer directly? |
|---|---|---|---|---|---:|
| `archive-dinner-intelligence-prd` | `prd/archive/PRD - Dinner Recommendation Intelligence (Data Science).md` | archived | superseded | Historical dinner-intelligence framing | History only |
| `archive-dinner-intelligence-brief` | `prd/archive/Brief - Dinner Recommendation Intelligence Working Session.md` | archived | superseded | Historical working-session brief | History only |
| `experiment-multi-recipe-guidance` | `prd/experiments/Feature Overview - Multi-Recipe Cooking Guidance.md` | archived | experiment | Internal LLM experiment | Experiment questions only |

## Governance and delivery material

| ID | Path | Authority | Status | What it answers | Can answer directly? |
|---|---|---|---|---|---:|
| `knowledge-base-entry-point` | `knowledge-base/README.md` | canonical | active | How to use the knowledge base | Yes, for governance |
| `source-manifest` | `knowledge-base/SOURCE_MANIFEST.md` | canonical | active | Source authority, applicability, and precedence | Yes, for governance |
| `knowledge-base-update-policy` | `knowledge-base/UPDATE_POLICY.md` | canonical | active | Documentation update and approval workflow | Yes, for governance |
| `knowledge-base-decision-log` | `knowledge-base/DECISION_LOG.md` | canonical | active | Approved and open governance decisions | Yes, for governance |
| `knowledge-base-glossary` | `knowledge-base/GLOSSARY.md` | canonical | active | Shared terms | Yes, for definitions |
| `living-prd-build-plan` | `knowledge-base/Build Plan - Living PRD Knowledge Base.md` | supporting | ready for execution | Delivery plan for this system | No product authority |

## Sources outside the initial answer corpus

- `strategy/` is versioned as supporting context but is not allowed to override product requirements.
- `tickets/` is implementation evidence, not product authority.
- `user-research/` remains local and uncommitted until Andrew reviews its access and indexing policy.
- Application source code is implementation evidence. It may reveal drift, but it does not establish product intent without review.

## Known boundaries and conflicts

- Some production documents still point to POC PRDs as placeholders. Those links preserve feature detail; the POC authority class still applies.
- The cross-surface continuity policy is not fully resolved. Do not infer a final rule from current demo behavior.
- Draft status does not make a listed canonical source optional. It means the contract is active but still subject to approved revision.
