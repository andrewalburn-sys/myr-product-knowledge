---
kb_id: knowledge-base-decision-log
title: MyRecipes Assistant Decision Log
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

# Decision Log

This log records decisions that change product or knowledge-base behavior. Source documents remain the complete specification; this log explains the decision, status, and affected sources.

## Index

| ID | Date | Status | Decision | Owner |
|---|---|---|---|---|
| `KB-001` | 2026-09-30 | accepted | Use a dedicated private GitHub repository for this project folder | Andrew Alburn |
| `KB-002` | 2026-09-30 | accepted | Andrew is the initial sole approver of canonical changes | Andrew Alburn |
| `KB-003` | 2026-09-30 | accepted | Keep one editable source; published copies are read-only | Andrew Alburn |
| `KB-004` | 2026-09-30 | accepted | Automation may draft and audit but may not silently change normative content | Andrew Alburn |
| `KB-005` | 2026-09-30 | accepted | Hold user research out of Git and indexing pending access review | Andrew Alburn |
| `PROD-OPEN-001` | 2026-09-30 | open | Define cross-surface conversation continuity | Andrew Alburn |

## KB-001 — Dedicated private repository

**Decision:** Version `/conversational-ui` in the private repository `andrewalburn-sys/myr-product-knowledge` rather than attaching a remote to the entire Vault.

**Why:** The repository should contain the bounded product-knowledge project, preserve reviewable history, and avoid exposing unrelated Vault material.

**Consequences:** The repository root is this project folder. Parent-Vault state has no authority inside this repository.

## KB-002 — Approval ownership

**Decision:** Andrew Alburn is the sole canonical approver initially.

**Why:** Andrew is the current product owner and sole active maintainer. The workflow can expand to additional reviewers later without changing source authority.

**Consequences:** `CODEOWNERS` routes every path to `@andrewalburn-sys`. Agent-authored or contributor-authored normative changes remain proposals until Andrew approves them.

## KB-003 — One editable source

**Decision:** The local project folder is the editable authoring source. GitHub records and shares that source. Any generated site, index, or app-repository copy is read-only.

**Why:** Multiple editable copies create silent drift and ambiguous authority.

## KB-004 — Automation boundary

**Decision:** Automation may validate, index, detect drift, run evaluations, and draft changes. It must not approve product intent, resolve conflicts, or promote demo behavior to a production requirement.

**Why:** Current code describes what exists, not necessarily what should exist.

## KB-005 — Research access gate

**Decision:** Keep `user-research/` local and out of the first Git publication and answer corpus.

**Why:** Research access and participant-data sensitivity have not been reviewed. A later decision may allow selected, sanitized sources.

## PROD-OPEN-001 — Cross-surface continuity

**Status:** Open.

**Question:** When someone opens the assistant from a different app surface, should the active conversation travel with them, reopen only on its originating surface, or require an explicit history selection?

**Current rule:** Do not infer a final policy from demo behavior. Preserve the durable-conversation and drill-in return guarantees already defined in `prd/Assistant Conversation and Interaction Behavior.md`.
