---
kb_id: knowledge-base-glossary
title: MyRecipes Assistant Glossary
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
  - production
  - demo
  - knowledge-governance
last_reviewed: 2026-09-30
supersedes: []
superseded_by: null
related_code: []
related_docs:
  - prd/Assistant Conversation and Interaction Behavior.md
  - prd/Assistant Semantic Retrieval - Elasticsearch Execution Spec.md
---

# Glossary

- **Active conversation:** The durable chat object currently being viewed or resumed.
- **Canonical:** The preferred product source of truth for its stated scope.
- **Complete match:** A result verified to satisfy every hard requirement carried by the conversation.
- **Constraint carry-forward:** Preserving unresolved hard requirements across refinement turns until explicitly removed, replaced, or reset.
- **Conversation:** A durable sequence of user and assistant turns with accumulated state.
- **Demo behavior:** Behavior implemented or documented for the prototype; it is not automatically a production requirement.
- **Drift:** A material difference between current implementation, authoritative documentation, or an approved decision.
- **Generated:** Machine-produced index, audit, or synthesis with no independent product authority.
- **Hard constraint:** A stated requirement that results must satisfy, such as an included or excluded ingredient, scope, dietary rule, or maximum time.
- **Honest miss:** A response that says no complete match was verified and clearly identifies how any displayed alternatives differ.
- **Normative change:** A change to what the product must, should, or may do.
- **Partial match:** A result that satisfies some but not all hard requirements and is labeled with the unmet requirement.
- **POC:** Prototype material that may explain demo behavior but does not establish production intent.
- **Release source:** An authoritative requirement within a named release scope.
- **Scope:** The collection or surface being searched, such as all recipes or the user's Saves.
- **Soft quality:** A preference used for ranking or diversity rather than an eligibility requirement.
- **Supporting:** Context that helps explain a product decision but cannot override a canonical or release source.
- **Surface context:** The app location from which the assistant was opened. It may set initial scope or presentation but is not itself the conversation.
- **Turn:** One user input and its corresponding assistant response.
