---
kb_id: living-prd-build-plan
title: Build Plan for the Living PRD Knowledge Base
authority: supporting
status: in-progress
owner: Andrew Alburn
audience:
  - product
  - engineering
  - coding-agents
applies_to:
  - knowledge-governance
last_reviewed: 2026-09-30
supersedes: []
superseded_by: null
related_code: []
related_docs:
  - knowledge-base/README.md
  - knowledge-base/SOURCE_MANIFEST.md
  - knowledge-base/UPDATE_POLICY.md
  - knowledge-base/DECISION_LOG.md
---

# Build Plan for the Living PRD Knowledge Base

**Status:** Ready for execution
**Owner:** Andrew Alburn
**Audience:** Product, design, engineering, QA, and coding agents
**Last updated:** September 30, 2026
**Knowledge base root:** `/Users/andrew.alburn/Vault/Work/Efforts/Projects/Active/conversational-ui/knowledge-base`
**Product documentation root:** `/Users/andrew.alburn/Vault/Work/Efforts/Projects/Active/conversational-ui`
**App repository:** `/Users/andrew.alburn/Library/CloudStorage/Dropbox/Andrew Work/App Projects/myrecipes-poc`
**App remote:** `https://github.com/andrewalburn-sys/myr`

This plan creates a governed documentation system that can later power a question-answering experience. It keeps the existing PRDs, strategy, and research in their current folders; the new `knowledge-base/` folder contains the authority map, maintenance rules, decision record, evaluations, and generated audits that make those sources safe to query.

The first deliverable is useful without a Q&A application: a developer can enter through one manifest, find the authoritative answer, understand whether it is a production requirement or demo behavior, and see unresolved decisions. The later deliverable adds retrieval and answers with citations.

The central safety rule is that automation may detect drift, generate reports, and draft changes, but it must not silently turn current code behavior into a product requirement.

## Execution status

As of September 30, 2026:

- Phase 0 decisions are complete: the bounded project has a private GitHub repository, and Andrew Alburn is the canonical approver.
- KB 1–KB 6 have an initial baseline: governance entry point, classified manifest, templates and validator, authoritative-core metadata, decision log, and the app path-to-document impact map.
- `user-research/` remains local pending an access and indexing decision.
- KB 6 is implemented in the app repository through `docs/assistant-documentation-map.json` and `scripts/documentation/checkImpact.mjs`, with fixture coverage for history, ingredient enforcement, visual-only changes, and unmapped capabilities.
- The next implementation package is KB 7, aligning `AGENTS.md`, Cursor rules, and `HANDOFF.md` with the knowledge-base workflow.

---

## 1. Outcomes

When this plan is complete:

1. Every authoritative document has an owner, status, authority level, scope, review date, and relationship to other documents.
2. Developers and coding agents have one entry point for product questions.
3. A behavior change in the app identifies the documentation that may need review.
4. Generated reports update automatically; changes to normative product requirements require approval.
5. A question-answering layer returns concise answers with document and section citations.
6. Conflicts, open decisions, unsupported answers, and demo-only behavior are surfaced rather than blended into confident prose.
7. A benchmark suite detects when retrieval or documentation changes degrade answer quality.

---

## 2. Decisions established by this plan

These are implementation decisions for the knowledge-base project. They do not resolve open product questions inside the assistant PRDs.

### Source organization

- Existing source documents remain in `prd/`, `strategy/`, `user-research/`, and `tickets/`.
- The `knowledge-base/` folder does not contain duplicate editable copies of those documents.
- The Vault is the editable authoring source.
- Any copy published to GitHub or another shared system is generated and read-only.

### Authority

- Production PRDs and approved behavior specifications outrank POC documents.
- POC documents may explain current demo behavior but cannot establish production requirements.
- Research and strategy may support a decision but do not override an approved requirement.
- An unresolved conflict is returned as a conflict, not resolved by retrieval score.

### Updates

- Generated indexes, coverage reports, and drift reports may update automatically.
- Product requirements, decisions, and source classifications require review before they become authoritative.
- Code is evidence of implementation behavior, not automatic proof of product intent.

### Answers

- Answers cite the source document and section.
- Answers state whether they describe intended production behavior, the current demo, or an open decision.
- The system declines to answer when the approved source material is insufficient.
- The initial Q&A implementation is retrieval-first. A specific vector database, hosting platform, and user interface are deferred until the governed source set and benchmark exist.

---

## 3. Scope

### Included

- Documentation inventory and classification
- Document metadata and precedence
- Decision tracking
- App-to-document impact mapping
- Drift detection and review workflow
- Generated coverage and open-question reports
- Section-level document indexing
- Citation-aware question answering
- Benchmark questions and regression evaluation
- Publishing a shared read-only reference when a destination is selected

### Not included in the first milestone

- Rewriting every historical or prototype document
- Automatically deciding product questions
- Indexing the entire Vault
- Indexing interview notes or other sensitive research by default
- Building a polished end-user product
- Replacing Git, code review, product approval, or engineering tickets
- Automatically merging AI-authored changes into authoritative requirements

---

## 4. Target structure

```text
conversational-ui/
├── knowledge-base/
│   ├── README.md
│   ├── SOURCE_MANIFEST.md
│   ├── UPDATE_POLICY.md
│   ├── DECISION_LOG.md
│   ├── GLOSSARY.md
│   ├── QUESTION_BENCHMARK.md
│   ├── Build Plan - Living PRD Knowledge Base.md
│   ├── templates/
│   │   ├── SOURCE_METADATA_TEMPLATE.md
│   │   └── DECISION_TEMPLATE.md
│   └── generated/
│       ├── COVERAGE_REPORT.md
│       ├── DOCUMENTATION_DRIFT_REPORT.md
│       ├── OPEN_QUESTIONS.md
│       └── SOURCE_INDEX.json
├── prd/
├── strategy/
├── user-research/
└── tickets/
```

The JSON source index is generated for software consumption. Markdown remains the human-editable source.

---

## 5. Metadata contract

Canonical documents receive a small YAML frontmatter block. Existing body content should not be reformatted solely to add metadata.

```yaml
---
kb_id: assistant-conversation-behavior
title: Assistant Conversation and Interaction Behavior
authority: canonical
status: working-contract
owner: Andrew Alburn
audience:
  - product
  - design
  - engineering
  - qa
applies_to:
  - production
  - demo
last_reviewed: 2026-09-30
supersedes: []
superseded_by: null
related_code:
  - src/components/assistant
  - src/assistant/chatHistory.ts
related_docs:
  - prd/PRD - MyRecipes Assistant.md
  - prd/Assistant Discovery MVP - App Requirements.md
---
```

### Authority values

| Authority | Meaning | May answer product questions directly |
|---|---|---:|
| `canonical` | Approved source of truth for its scope | Yes |
| `release` | Requirement for a named release | Yes, within that release |
| `supporting` | Design, technical, research, or strategy context | Only with canonical support |
| `poc` | Prototype behavior or implementation reference | Only when the question asks about the demo |
| `generated` | Machine-produced index, audit, or synthesis | No |
| `archived` | Superseded historical material | No |

### Required validation

The metadata validator fails when:

- a canonical or release document has no owner or review date;
- two active documents use the same `kb_id`;
- a superseded document is still classified as canonical;
- a referenced source path does not exist;
- an authority value is unknown;
- a production document points to an archived document as its only authority.

---

## 6. Update model

The update workflow has four stages.

```text
App or product change
    → Documentation impact detection
    → Drafted changes and conflict report
    → Human approval of normative changes
    → Re-index and benchmark evaluation
```

### Automatically permitted

- Rebuilding the source index
- Updating coverage counts and stale-review lists
- Recording the app commit range examined
- Producing a proposed documentation-impact report
- Rerunning benchmark questions
- Publishing an approved read-only snapshot

### Approval required

- Changing a product requirement
- Marking a decision resolved
- Changing document authority or precedence
- Adding a new canonical source
- Declaring demo behavior to be intended production behavior
- Removing or archiving an authoritative document

### Change detection

The drift process compares the app repository against the last reviewed commit stored in generated state. It maps changed paths to documentation domains.

Initial mappings:

| App path or concern | Documents to review |
|---|---|
| `src/components/assistant/AssistantOverlay.tsx`, `AssistantSheet.tsx` | Conversation behavior and app requirements |
| `src/assistant/chatHistory.ts`, `chatTitle.ts` | Conversation behavior and history decisions |
| `src/assistant/discovery/` | Backend MVP, semantic retrieval, conversation behavior, golden sequences |
| `src/assistant/semanticPlanner.ts`, `intent.ts` | Semantic Query Planner and backend MVP |
| `src/assistant/suggestions.ts` | Follow-Up Suggestions relevance rules |
| `src/assistant/smartRecipeSuggestions.ts` | Recipe-Specific Suggested Questions relevance rules |
| `src/assistant/tools/answerCookingQuestion.ts` and answer UI | Master PRD, citation rules, conversation behavior |
| Photo and vibe tools | Applicable POC PRD until replaced by production documentation |
| Meal planning tools | Master PRD and plan-specific requirement documents |
| Authentication, storage, or analytics | App requirements, privacy decisions, and implementation runbooks |

The mapping starts explicit and conservative. New code paths require a mapping or an intentional `no-doc-impact` explanation.

---

## 7. Execution phases

### Phase 0 Establish access and versioning

**Purpose:** Make the source dependable before adding automation.

The app repository is connected to GitHub. The Vault currently has no Git remote, so developer access, CI execution, and review history are not yet portable.

Tasks:

- Choose how the Vault is shared and versioned.
- Preserve the Vault as the only editable source.
- Choose a read-only publication destination for developers who cannot access the Vault.
- Confirm whether internal research documents may be indexed.
- Define who can approve canonical requirement changes.

Recommended starting position:

- Keep authoring in the Vault.
- Put the Vault under a private shared Git remote or an equivalent versioned document system.
- Publish a generated read-only snapshot to the app repository or the eventual Q&A service.
- Do not publish private user-research material until access and privacy are reviewed.

Acceptance:

- Two authorized users can retrieve the same version of the documentation.
- Every approved change has history and an identifiable author.
- The editable and published locations cannot both be treated as sources of truth.

Effort: Small, but blocking.

### Phase 1 Create knowledge-base governance

**Purpose:** Give humans and agents one safe entry point.

Create:

- `README.md`
- `SOURCE_MANIFEST.md`
- `UPDATE_POLICY.md`
- `DECISION_LOG.md`
- `GLOSSARY.md`
- metadata and decision templates

Classify every file currently listed in `prd/README.md`. Add only the minimum metadata required by §5. Do not normalize all prose in the same change.

Acceptance:

- Every production, POC, experiment, and archive document appears once in the manifest.
- Each entry says what questions it answers and whether it may answer them authoritatively.
- Document precedence is explicit.
- A developer can find the authoritative source for navigation, constraints, citations, follow-ups, and recipe questions without searching the entire folder.
- Known contradictions are recorded rather than silently reconciled.

Effort: Medium.

### Phase 2 Normalize the authoritative core

**Purpose:** Make the most important sources internally consistent and machine-readable.

Initial authoritative core:

- `prd/PRD - MyRecipes Assistant.md`
- `prd/PRD - Assistant Discovery MVP (Backend).md`
- `prd/Assistant Discovery MVP - App Requirements.md`
- `prd/Assistant Conversation and Interaction Behavior.md`
- `prd/PRD - Assistant Semantic Query Planner.md`
- `prd/Assistant Semantic Retrieval - Elasticsearch Execution Spec.md`
- `prd/Assistant Follow-Up Suggestions - Relevance Rules.md`
- `prd/Recipe-Specific Suggested Questions - Relevance Rules.md`
- `prd/Assistant Discovery - Golden Sequences.csv`

Tasks:

- Add metadata frontmatter.
- Assign stable `kb_id` values.
- Identify duplicated or contradictory requirements.
- Move resolved product choices into the decision log.
- Mark old statements as superseded instead of deleting historical context without explanation.
- Add section anchors or stable heading names where needed for citations.

Acceptance:

- No unresolved conflict is hidden from the manifest.
- Every canonical claim has one preferred source.
- Demo-only behavior is labeled locally.
- Links between related documents resolve.
- The source set passes metadata validation.

Effort: Medium.

### Phase 3 Connect app changes to documentation

**Purpose:** Make documentation review part of normal feature work.

Tasks in the app repository:

- Extend `AGENTS.md` with a required documentation-impact check.
- Extend `.cursor/rules/llm-handoff.mdc` so Cursor and Codex follow the same policy.
- Add a pointer from `HANDOFF.md` to the knowledge-base entry point.
- Add a path-to-document mapping file.
- Add a command that reports documentation impact for the current app diff.
- Add `no-doc-impact` as an explicit reviewed outcome rather than an implicit omission.

Expected agent behavior:

1. Read `HANDOFF.md` and the knowledge-base manifest.
2. Identify affected product behavior before editing code.
3. Update implementation and tests.
4. Run the documentation-impact command.
5. Update or draft changes to affected source documents.
6. Record a decision when behavior or authority changed.
7. Rerun knowledge-base validation.

Acceptance:

- A change to assistant history flags the conversation behavior document.
- A change to ingredient enforcement flags the backend and retrieval documents.
- A purely visual asset change can be marked no impact with a reason.
- Coding-agent instructions use the same source path and precedence rules.
- The process does not require copying PRDs into the app repository.

Effort: Medium.

### Phase 4 Build drift detection and generated reports

**Purpose:** Detect documentation gaps without allowing unattended product changes.

Create a local audit tool that reads:

- the source manifest and document metadata;
- app changes since the last reviewed commit;
- changed documentation files;
- open decisions and supersession links.

Generate:

- `generated/COVERAGE_REPORT.md`
- `generated/DOCUMENTATION_DRIFT_REPORT.md`
- `generated/OPEN_QUESTIONS.md`
- `generated/SOURCE_INDEX.json`

The drift report classifies findings:

| Severity | Meaning |
|---|---|
| Blocking | Behavior changed but no authoritative document is mapped or reviewed |
| Review | A mapped document may now be stale |
| Conflict | Two active sources disagree |
| Stale | A canonical source has passed its review interval |
| Informational | Generated index or link changed with no normative impact |

Acceptance:

- Reports are deterministic for the same source and commit range.
- Generated files identify themselves as generated and non-authoritative.
- A report links every finding to the code area and source document.
- Rerunning without changes produces no false new findings.
- No source requirement changes automatically.

Effort: Medium.

### Phase 5 Create the benchmark question set

**Purpose:** Define correct answers before selecting retrieval technology.

Create at least 40 benchmark questions across:

- product purpose and trust principles;
- context and constraint behavior;
- navigation and history;
- exact and partial matches;
- Saves scope;
- citations and mechanical answers;
- follow-up suggestions;
- recipe-specific questions;
- photo, planning, and voice boundaries;
- open decisions and conflicts;
- questions that should not be answered from current documentation.

Each record includes:

- question;
- expected answer or required answer elements;
- authoritative source and section;
- authority class;
- whether the answer is production, demo, or open;
- prohibited claims;
- evaluation notes.

Required adversarial cases:

- A POC document conflicts with a production PRD.
- Code behaves differently from intended production behavior.
- Two active sources conflict.
- A source mentions a topic but does not answer the question.
- The correct answer is “open decision.”
- The correct answer is “not documented.”

Acceptance:

- A human reviewer approves the expected answer and source for each question.
- At least 20 percent of questions test refusal, conflict, or open-decision behavior.
- Questions cover both common developer questions and recent failure modes from the demo.

Effort: Medium.

### Phase 6 Build retrieval and citation

**Purpose:** Produce reliable evidence for answers.

Ingestion rules:

- Read only sources allowlisted by the manifest.
- Chunk by heading and preserve the full heading path.
- Keep tables and their explanatory paragraphs together where possible.
- Attach file path, `kb_id`, authority, status, applicability, review date, and section anchor to every chunk.
- Exclude generated reports from product-answer retrieval unless the question asks about coverage or drift.
- Exclude archived and POC sources by default unless the question asks for history or demo behavior.

Retrieval rules:

- Use hybrid lexical and semantic retrieval.
- Filter by authority and applicability before ranking.
- Prefer an exact term match for defined product language.
- Retrieve related decision-log entries when a requirement changed.
- Return evidence from more than one source when checking for conflicts.

Technology decision gate:

- Start with a local index against the current source size.
- Measure benchmark recall, update speed, operational cost, and citation accuracy.
- Choose a hosted vector store only if the local approach cannot meet the intended sharing or scale requirements.

Acceptance:

- The correct authoritative section appears in the top three retrieved sections for at least 90 percent of answerable benchmark questions.
- Archived or POC material never outranks an applicable canonical source.
- Section citations resolve to the exact source passage.
- Re-indexing a changed document updates only affected content.

Effort: Medium.

### Phase 7 Build the answer layer

**Purpose:** Turn retrieved evidence into trustworthy developer answers.

Answer contract:

- Lead with the answer.
- Cite every material product claim.
- Label the answer as production behavior, current demo behavior, or open decision when the distinction matters.
- Explain conflicts rather than averaging them.
- Do not turn implementation evidence into product intent.
- Do not cite generated reports as product authority.
- State “not documented” when evidence is insufficient.
- Offer the source passages and related open decisions.

Minimum output fields:

```text
answer
classification: production | demo | open | conflict | undocumented
sources[]: document, section, path, authority
related_decisions[]
confidence
```

Acceptance:

- Every benchmark answer includes the expected authoritative citation.
- No answer fabricates a decision, owner, date, or status.
- Conflict and open-decision benchmarks are labeled correctly.
- A developer can open the cited local or published document.
- Answers remain useful when only lexical retrieval is available.

Effort: Medium.

### Phase 8 Operationalize the living workflow

**Purpose:** Keep the system current after launch.

Tasks:

- Re-index automatically after approved source changes.
- Run metadata, link, retrieval, and answer benchmarks after each publication.
- Run a scheduled drift audit against new app commits.
- Notify only for blocking drift, conflicts, failed evaluation, or required review.
- Record the last reviewed app commit and documentation publication.
- Establish review intervals for canonical documents.
- Add a recovery procedure for a bad index or incorrect published snapshot.

Recommended cadence:

- Per behavior-changing task: documentation-impact check
- Per approved documentation update: index and benchmark
- Weekly while the demo changes rapidly: drift audit
- Monthly: canonical-source review and open-decision cleanup
- Before developer handoff or release planning: full benchmark and coverage review

Acceptance:

- A known behavior change appears in the drift report within one audit cycle.
- Approved documentation changes appear in answers after re-indexing.
- Failed benchmarks block publication of a new index.
- The previous published index remains recoverable.
- Notifications remain quiet when nothing material changed.

Effort: Medium.

---

## 8. Work packages for coding agents

Each work package should be completed and verified independently.

| Package | Deliverable | Depends on | Verification |
|---|---|---|---|
| KB 1 | Knowledge-base folder and governance files | Phase 0 decision | File and link review |
| KB 2 | Source manifest and classification | KB 1 | Every current source classified once |
| KB 3 | Metadata templates and validator | KB 2 | Valid and intentionally invalid fixtures |
| KB 4 | Authoritative-core metadata migration | KB 3 | Validator plus preservation diff |
| KB 5 | Decision log and initial known decisions | KB 2 | Links from affected source documents |
| KB 6 | App path-to-document map | KB 2 | Recent app changes map correctly |
| KB 7 | Agent instruction updates | KB 6 | Cursor and Codex follow the same checklist |
| KB 8 | Drift-report generator | KB 3 and KB 6 | Deterministic fixture scenarios |
| KB 9 | Initial benchmark questions | KB 2 and KB 5 | Human review of answers and sources |
| KB 10 | Section chunker and source index | KB 3 | Stable IDs and incremental rebuild |
| KB 11 | Hybrid retrieval | KB 9 and KB 10 | Top-three recall target |
| KB 12 | Citation-aware answer layer | KB 11 | Benchmark classification and citations |
| KB 13 | Publication and scheduled audit | KB 8 and KB 12 | End-to-end update rehearsal |

Agents must not combine metadata migration, broad prose rewriting, and retrieval implementation into one change. Keeping those separate makes preservation review and regression diagnosis possible.

---

## 9. Verification strategy

### Static validation

- Metadata schema
- Duplicate IDs
- Missing and broken links
- Invalid supersession chains
- Unknown authority values
- Missing owners and review dates
- Generated files edited by hand
- Source paths outside the allowlist

### Drift fixtures

- Chat-history logic changes with no documentation change
- Ingredient enforcement changes with the wrong document updated
- CSS-only change correctly marked no impact
- New assistant capability with no manifest entry
- Demo behavior diverges from the production PRD

### Retrieval evaluation

- Top-three authoritative-section recall
- POC suppression
- Exact product-term retrieval
- Table and section integrity
- Conflict-source retrieval
- Incremental update correctness

### Answer evaluation

- Required claim coverage
- Citation accuracy
- Production versus demo classification
- Open-decision and conflict detection
- Unsupported-question refusal
- No fabricated status, owner, rationale, or date

---

## 10. Risks and mitigations

| Risk | Mitigation |
|---|---|
| The app becomes the accidental product specification | Require approval before code-derived drafts change canonical docs |
| Duplicate editable copies drift | One editable Vault source; generated read-only publication only |
| POC content overrides production requirements | Authority filtering before ranking and adversarial benchmarks |
| Local-only Vault blocks collaboration | Resolve shared versioning in Phase 0 |
| Broad indexing exposes research or sensitive material | Manifest allowlist and access review before ingestion |
| AI confidently resolves an open decision | Explicit answer classification and open-decision benchmarks |
| Metadata migration creates noisy diffs | Add metadata separately from prose edits |
| Scheduled audits create notification fatigue | Notify only on blocking drift, conflict, failed evaluation, or required review |
| Retrieval platform is selected too early | Benchmark a local index before choosing hosted infrastructure |
| Generated files are mistaken for authority | Mark them generated in metadata, headers, and retrieval filters |

---

## 11. Open decisions before implementation

Only the first two block Phase 1.

1. **Shared versioning:** Which private remote or document platform will version the Vault?
2. **Approval owner:** Who may approve changes to canonical product requirements besides Andrew?
3. **Published destination:** Should developers read the generated snapshot in GitHub, an internal document system, or the Q&A interface only?
4. **Q&A surface:** Local web tool, internal website, Slack, or another interface?
5. **Indexing model:** Local lexical and embedding index or hosted retrieval service after benchmarking?
6. **Automation runner:** Local Codex automation, GitHub Actions against a published snapshot, or an internal CI runner with Vault access?
7. **Research access:** Which research and strategy documents may be available to the answer layer?
8. **Review interval:** How often should each authority class require human review?

---

## 12. Recommended first execution slice

Complete KB 1 through KB 5 before building retrieval.

That slice produces:

- the knowledge-base entry point;
- a complete authority manifest;
- an update and approval policy;
- a glossary;
- metadata and decision templates;
- the initial decision log;
- metadata on the authoritative core;
- a list of known conflicts and open decisions.

It is valuable immediately and gives the later automation a dependable corpus. Building Q&A before this slice would make the system fluent but unreliable.

---

## 13. Completion criteria

The living PRD knowledge base is complete for its first release when:

- the authoritative source set is versioned and accessible to intended developers;
- all indexed sources have valid metadata and authority classification;
- one manifest routes common questions to the correct source;
- app changes produce a documentation-impact report;
- normative changes cannot publish without review;
- the source index rebuilds incrementally;
- at least 40 benchmark questions pass the agreed retrieval and answer thresholds;
- answers cite exact sections and correctly label production, demo, open, conflict, and undocumented states;
- approved documentation changes reach the published Q&A reference through a repeatable workflow;
- rollback, ownership, and review cadence are documented.
