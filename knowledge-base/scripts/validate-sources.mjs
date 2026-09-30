#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '../..');

const allowedAuthority = new Set([
  'canonical',
  'release',
  'supporting',
  'poc',
  'generated',
  'archived',
]);

const authoritativeCore = [
  'prd/PRD - MyRecipes Assistant.md',
  'prd/PRD - Assistant Discovery MVP (Backend).md',
  'prd/Assistant Discovery MVP - App Requirements.md',
  'prd/Assistant Conversation and Interaction Behavior.md',
  'prd/PRD - Assistant Semantic Query Planner.md',
  'prd/Assistant Semantic Retrieval - Elasticsearch Execution Spec.md',
  'prd/Assistant Follow-Up Suggestions - Relevance Rules.md',
  'prd/Recipe-Specific Suggested Questions - Relevance Rules.md',
];

const manifestSources = [
  ...authoritativeCore,
  'prd/Assistant Discovery MVP - Design Brief.md',
  'prd/Assistant Discovery - Golden Sequences.csv',
  'prd/Build Plan - MyRecipes Assistant.md',
  'prd/Assistant Backend Capability Map.md',
  'prd/Dinner Tonight - Data Science Problem Statement.md',
  'prd/poc/PRD - Agentic Recipe Assistant.md',
  'prd/poc/PRD - Dinner Decision Engine.md',
  'prd/poc/PRD - Photo-Based Recipe Discovery.md',
  'prd/poc/PRD - User Recommendation Preferences.md',
  'prd/poc/PRD - Catch a Vibe.md',
  'prd/poc/Build Plan - Catch a Vibe.md',
  'prd/poc/Figma Handoff - Catch a Vibe.md',
  'prd/archive/PRD - Dinner Recommendation Intelligence (Data Science).md',
  'prd/archive/Brief - Dinner Recommendation Intelligence Working Session.md',
  'prd/experiments/Feature Overview - Multi-Recipe Cooking Guidance.md',
];

function parseFrontmatter(source, relativePath) {
  if (!source.startsWith('---\n')) return null;
  const end = source.indexOf('\n---\n', 4);
  if (end === -1) throw new Error(`${relativePath}: frontmatter is not closed`);
  const lines = source.slice(4, end).split('\n');
  const data = {};
  let currentKey = null;
  for (const rawLine of lines) {
    if (/^\s+-\s+/.test(rawLine) && currentKey) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      data[currentKey].push(rawLine.replace(/^\s+-\s+/, '').trim());
      continue;
    }
    const match = rawLine.match(/^([a-z_]+):\s*(.*)$/);
    if (!match) continue;
    currentKey = match[1];
    const value = match[2].trim();
    if (value === '[]') data[currentKey] = [];
    else if (value === 'null') data[currentKey] = null;
    else data[currentKey] = value;
  }
  return data;
}

const errors = [];
const records = [];
for (const relativePath of authoritativeCore) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    errors.push(`${relativePath}: missing authoritative source`);
    continue;
  }
  const metadata = parseFrontmatter(fs.readFileSync(absolutePath, 'utf8'), relativePath);
  if (!metadata) {
    errors.push(`${relativePath}: missing frontmatter`);
    continue;
  }
  records.push({ relativePath, metadata });
}

const ids = new Map();
for (const { relativePath, metadata } of records) {
  for (const field of ['kb_id', 'title', 'authority', 'status', 'owner', 'last_reviewed']) {
    if (!metadata[field]) errors.push(`${relativePath}: missing ${field}`);
  }
  if (metadata.authority && !allowedAuthority.has(metadata.authority)) {
    errors.push(`${relativePath}: unknown authority ${metadata.authority}`);
  }
  if (metadata.kb_id) {
    if (ids.has(metadata.kb_id)) {
      errors.push(`${relativePath}: duplicate kb_id ${metadata.kb_id} also used by ${ids.get(metadata.kb_id)}`);
    } else ids.set(metadata.kb_id, relativePath);
  }
  for (const relatedPath of metadata.related_docs ?? []) {
    if (!fs.existsSync(path.join(root, relatedPath))) {
      errors.push(`${relativePath}: related_docs path does not exist: ${relatedPath}`);
    }
  }
}

const manifestPath = path.join(root, 'knowledge-base/SOURCE_MANIFEST.md');
const manifest = fs.readFileSync(manifestPath, 'utf8');
for (const relativePath of manifestSources) {
  const token = `\`${relativePath}\``;
  const occurrences = manifest.split(token).length - 1;
  if (occurrences !== 1) {
    errors.push(`SOURCE_MANIFEST.md: expected ${relativePath} exactly once, found ${occurrences}`);
  }
  if (!fs.existsSync(path.join(root, relativePath))) {
    errors.push(`SOURCE_MANIFEST.md: listed path does not exist: ${relativePath}`);
  }
}

if (errors.length) {
  console.error(`Knowledge-base validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Knowledge-base validation passed: ${records.length} authoritative Markdown sources and ${manifestSources.length} classified PRD sources.`);
