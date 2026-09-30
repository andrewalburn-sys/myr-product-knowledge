import assert from 'node:assert/strict';
import {
  buildSourceIndex,
  createModel,
  renderCoverageReport,
  renderDriftReport,
  renderOpenQuestions,
} from './generate-drift-reports.mjs';

const input = {
  knowledgeRef: 'fixture-ref',
  sourceFingerprint: 'fixture-fingerprint',
  asOf: '2026-09-30',
  appState: 'fixture-base...fixture-head',
  changedKnowledgeFiles: ['prd/Current.md'],
  openDecisions: [{ id: 'OPEN-1', date: '2026-09-30', decision: 'Choose continuity', owner: 'Andrew' }],
  declaredBoundaries: ['A prototype source remains intentionally non-authoritative.'],
  appMap: {
    guardedPrefixes: ['src/assistant/'],
    rules: [{ id: 'history', patterns: ['src/assistant/chatHistory.ts'] }],
  },
  appImpact: {
    analysis: {
      files: [
        {
          path: 'src/assistant/chatHistory.ts',
          rules: [{ id: 'history', documents: ['prd/Current.md'] }],
        },
        { path: 'src/assistant/newCapability.ts', rules: [] },
      ],
      documents: [{ document: 'prd/Current.md', ruleIds: ['history'] }],
      unmappedGuarded: ['src/assistant/newCapability.ts'],
      unmappedGeneral: [],
    },
  },
  sources: [
    {
      id: 'current',
      path: 'prd/Current.md',
      title: 'Current behavior',
      authority: 'canonical',
      status: 'active',
      answers: 'Current behavior',
      directAnswer: 'Yes',
      exists: true,
      metadata: {
        kb_id: 'current', owner: 'Andrew', last_reviewed: '2026-09-30',
        applies_to: ['production'], supersedes: [], superseded_by: null, related_docs: [],
      },
      headings: [{ level: 1, title: 'Current behavior', anchor: 'current-behavior' }],
    },
  ],
};

const model = createModel(input);
assert(model.findings.some((finding) => finding.severity === 'Blocking'));
assert(model.findings.some((finding) => finding.severity === 'Informational'));

const drift1 = renderDriftReport(model);
const drift2 = renderDriftReport(createModel(structuredClone(input)));
assert.equal(drift1, drift2, 'Drift output must be deterministic for identical evidence.');
assert(drift1.includes('GENERATED FILE — NON-AUTHORITATIVE'));
assert(drift1.includes('src/assistant/newCapability.ts'));
assert(drift1.includes('prd/Current.md'));

const coverage = renderCoverageReport(model);
assert(coverage.includes('Authoritative sources with required metadata: **1/1**'));
assert(coverage.includes('Blocking unmapped assistant files: **1**'));

const openQuestions = renderOpenQuestions(model);
assert(openQuestions.includes('OPEN-1'));
assert(openQuestions.includes('Choose continuity'));

const sourceIndex = buildSourceIndex(model);
assert.equal(sourceIndex.authoritative, false);
assert.equal(sourceIndex.sources[0].headings[0].anchor, 'current-behavior');

console.log('Drift-report fixtures passed: deterministic output, severity classification, coverage, open questions, and source index.');
