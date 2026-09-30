---
kb_id: knowledge-base-update-policy
title: Living PRD Update Policy
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
  - knowledge-base/SOURCE_MANIFEST.md
  - knowledge-base/DECISION_LOG.md
---

# Living PRD Update Policy

## Purpose

Keep product documentation useful as the assistant changes without allowing code, prototypes, or generated summaries to silently become product requirements.

## Roles

- **Canonical owner and approver:** Andrew Alburn.
- Contributors and coding agents may propose changes, generate audits, and prepare drafts.
- A normative change is approved only when Andrew approves it through the repository workflow or explicitly directs the change.

## When documentation review is required

Review documentation when a change affects:

- user-visible behavior, wording logic, or interaction states;
- conversation state, constraint carry-forward, scope, history, or navigation;
- retrieval, ranking, exact-match or partial-match behavior;
- response formats, citations, explanations, or follow-up suggestions;
- ownership boundaries between the app and services;
- a product decision, release promise, or source's authority.

A purely visual correction may be marked `no-doc-impact`, but the change record must say why.

## Change workflow

1. Identify the affected behavior and read the manifest.
2. Locate the highest-authority source for that behavior.
3. Update the smallest authoritative source that fully expresses the change.
4. Add or update a decision-log entry when the change resolves an open question, changes product behavior, or changes authority.
5. Update related sources only to link, clarify scope, or mark supersession; do not duplicate the full rule.
6. Run `node knowledge-base/scripts/validate-sources.mjs`.
7. Review the diff for unintended prose changes.
8. Obtain Andrew's approval before treating a normative change as accepted.
9. Rebuild generated indexes and run benchmarks when those capabilities exist.

## What automation may do without approval

- validate metadata and links;
- rebuild generated indexes and reports;
- identify likely documentation impact;
- draft proposed changes;
- report conflicts, staleness, or missing coverage;
- run retrieval and answer benchmarks.

## What always requires approval

- changing a product requirement;
- resolving or closing an open decision;
- changing source authority or precedence;
- adding or removing a canonical source;
- declaring current demo behavior to be intended production behavior;
- publishing research into the answer corpus;
- archiving or superseding an authoritative document.

## Source-specific rules

- `canonical` and `release` sources may answer within their stated scope.
- `supporting` sources require canonical or release support for product claims.
- `poc` sources answer demo questions only.
- `archived` sources answer historical questions only.
- `generated` files are diagnostics and must say they are non-authoritative.
- Code may trigger review; it cannot automatically rewrite intent.

## Review cadence

- Per behavior-changing task: documentation-impact check.
- Per approved documentation change: validation; later, re-indexing and benchmark evaluation.
- Weekly while the demo changes rapidly: drift review.
- Monthly: canonical-source and open-decision review.
- Before a developer handoff or release review: full source, conflict, and benchmark review.

## Research and sensitive material

`user-research/` is excluded from the Git repository and answer corpus until Andrew approves its access policy and reviews the material for participant or confidential information. Approval to version it does not automatically grant permission to index it for answers.
