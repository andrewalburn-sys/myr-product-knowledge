---
kb_id: knowledge-base-entry-point
title: MyRecipes Assistant Knowledge Base
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
  - knowledge-base/UPDATE_POLICY.md
  - knowledge-base/DECISION_LOG.md
---

# MyRecipes Assistant Knowledge Base

This is the entry point for questions about how the MyRecipes Assistant should work. It separates intended production behavior, release requirements, prototype behavior, supporting evidence, and historical material so a developer or coding agent does not mistake the most similar paragraph for the most authoritative answer.

## Start here

| Question | Preferred source |
|---|---|
| What is the assistant and what problem does it solve? | `prd/PRD - MyRecipes Assistant.md` |
| How do turns, context, navigation, history, and response states behave? | `prd/Assistant Conversation and Interaction Behavior.md` |
| What must the Q4 backend support? | `prd/PRD - Assistant Discovery MVP (Backend).md` |
| What does the app own? | `prd/Assistant Discovery MVP - App Requirements.md` |
| How are natural-language requests interpreted? | `prd/PRD - Assistant Semantic Query Planner.md` |
| How are hard constraints, partial matches, and honest misses handled? | `prd/Assistant Semantic Retrieval - Elasticsearch Execution Spec.md` |
| How are result follow-ups selected? | `prd/Assistant Follow-Up Suggestions - Relevance Rules.md` |
| How are recipe-page questions selected? | `prd/Recipe-Specific Suggested Questions - Relevance Rules.md` |
| Which sources are allowed to answer other questions? | `knowledge-base/SOURCE_MANIFEST.md` |
| Why was a product or governance choice made? | `knowledge-base/DECISION_LOG.md` |

## Authority order

When sources disagree, use this precedence:

1. An applicable `canonical` source.
2. An applicable `release` requirement for the named release.
3. A recorded decision that explicitly changes or narrows one of those sources.
4. `supporting` material for context only.
5. `poc` material only when the question is specifically about the prototype or demo.
6. `archived` material only for history.

Implementation behavior is evidence about the current build; it does not silently override product intent. Generated reports are diagnostics and never product authority.

## Answer contract

A reliable answer from this corpus should:

- lead with the answer;
- distinguish intended production behavior from current demo behavior;
- cite the document and section that support each material claim;
- surface conflicts and open decisions instead of averaging them;
- say `not documented` when the source set is insufficient.

## Current scope

The initial governed corpus is the product-document set in `prd/`. Strategy may be used as supporting context. Prototype and archive documents are excluded from production answers by default. `user-research/` remains local and is not committed or indexed until Andrew reviews its access policy.

## Making a change

1. Read `SOURCE_MANIFEST.md` and the relevant authoritative source.
2. Change the smallest applicable source; do not duplicate the rule elsewhere.
3. Record a decision when authority, precedence, or product behavior changes materially.
4. Run `node knowledge-base/scripts/validate-sources.mjs`.
5. Review the change with Andrew before treating a normative change as approved.

See `UPDATE_POLICY.md` for the full workflow.

## Generated audits

Rebuild the non-authoritative coverage, drift, open-question, and source-index artifacts with:

```bash
node knowledge-base/scripts/generate-drift-reports.mjs \
  --app-repo "/path/to/myrecipes-poc" \
  --knowledge-ref HEAD \
  --as-of YYYY-MM-DD
```

Use `--check` to validate the same evidence without writing files. The generator reads governed sources from the committed knowledge ref, so unfinished working-tree documents are reported as changes but never silently folded into the indexed source snapshot.
