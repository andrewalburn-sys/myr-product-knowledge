#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(scriptPath), '../..');
const defaultOutputDirectory = path.join(root, 'knowledge-base/generated');
const defaultAppRepository = '/Users/andrew.alburn/Library/CloudStorage/Dropbox/Andrew Work/App Projects/myrecipes-poc';
const authorityValues = new Set(['canonical', 'release', 'supporting', 'poc', 'generated', 'archived']);
const generatedNotice = '<!-- GENERATED FILE — NON-AUTHORITATIVE. Rebuild with knowledge-base/scripts/generate-drift-reports.mjs. -->';

function run(command, args, cwd, allowFailure = false) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8' });
  if (result.status !== 0 && !allowFailure) {
    throw new Error(result.stderr.trim() || `${command} ${args.join(' ')} failed`);
  }
  return result;
}

function gitLines(args, cwd) {
  return run('git', args, cwd).stdout.split('\n').map((line) => line.trim()).filter(Boolean);
}

function readAtRef(relativePath, ref) {
  return run('git', ['show', `${ref}:${relativePath}`], root).stdout;
}

function listAtRef(ref) {
  return gitLines(['ls-tree', '-r', '--name-only', ref], root);
}

function changedKnowledgeFiles(ref) {
  return [...new Set([
    ...gitLines(['diff', '--name-only', ref, '--'], root),
    ...gitLines(['ls-files', '--others', '--exclude-standard'], root),
  ])].sort();
}

function parseFrontmatter(source) {
  if (!source.startsWith('---\n')) return {};
  const end = source.indexOf('\n---\n', 4);
  if (end === -1) return {};
  const data = {};
  let currentKey;
  for (const rawLine of source.slice(4, end).split('\n')) {
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

function parseManifest(source) {
  const entries = [];
  for (const line of source.split('\n')) {
    const match = line.match(/^\| `([^`]+)` \| `([^`]+)` \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|$/);
    if (!match) continue;
    entries.push({
      id: match[1].trim(),
      path: match[2].trim(),
      authority: match[3].trim(),
      status: match[4].trim(),
      answers: match[5].trim(),
      directAnswer: match[6].trim(),
    });
  }
  return entries;
}

function slugHeading(title) {
  return title
    .toLowerCase()
    .replace(/[`*_~]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function parseHeadings(source) {
  const headings = [];
  let fenced = false;
  for (const line of source.split('\n')) {
    if (line.trim().startsWith('```')) {
      fenced = !fenced;
      continue;
    }
    if (fenced) continue;
    const match = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (!match) continue;
    const title = match[2].replace(/\s+#+$/, '').trim();
    headings.push({ level: match[1].length, title, anchor: slugHeading(title) });
  }
  return headings;
}

function sourceLink(relativePath) {
  return `[${relativePath}](<../../${relativePath}>)`;
}

function appLink(relativePath) {
  return `[${relativePath}](https://github.com/andrewalburn-sys/myr/blob/main/${relativePath.split('/').map(encodeURIComponent).join('/')})`;
}

function daysBetween(start, end) {
  const startDate = new Date(`${start}T00:00:00Z`);
  const endDate = new Date(`${end}T00:00:00Z`);
  if (Number.isNaN(startDate.valueOf()) || Number.isNaN(endDate.valueOf())) return null;
  return Math.floor((endDate - startDate) / 86_400_000);
}

function parseOpenDecisions(source) {
  const decisions = [];
  for (const line of source.split('\n')) {
    const match = line.match(/^\| `([^`]+)` \| ([^|]+) \| open \| ([^|]+) \| ([^|]+) \|$/i);
    if (!match) continue;
    decisions.push({
      id: match[1].trim(),
      date: match[2].trim(),
      decision: match[3].trim(),
      owner: match[4].trim(),
    });
  }
  return decisions;
}

function parseDeclaredBoundaries(source) {
  const heading = '## Known boundaries and conflicts';
  const start = source.indexOf(heading);
  if (start === -1) return [];
  const remainder = source.slice(start + heading.length);
  const end = remainder.search(/^##\s/m);
  const section = end === -1 ? remainder : remainder.slice(0, end);
  return section.split('\n')
    .map((line) => line.match(/^\s*-\s+(.+)$/)?.[1]?.trim())
    .filter(Boolean);
}

function parseArgs(argv) {
  const options = {
    knowledgeRef: 'HEAD',
    asOf: new Date().toISOString().slice(0, 10),
    outputDirectory: defaultOutputDirectory,
    appRepository: process.env.MYR_APP_REPO || defaultAppRepository,
    write: true,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--knowledge-ref') options.knowledgeRef = argv[++index];
    else if (arg === '--app-repo') options.appRepository = path.resolve(argv[++index]);
    else if (arg === '--app-base') options.appBase = argv[++index];
    else if (arg === '--app-head') options.appHead = argv[++index];
    else if (arg === '--as-of') options.asOf = argv[++index];
    else if (arg === '--output-dir') options.outputDirectory = path.resolve(argv[++index]);
    else if (arg === '--check') options.write = false;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

function usage() {
  return `Usage: node knowledge-base/scripts/generate-drift-reports.mjs [options]

Options:
  --app-repo <path>       App repository path (or set MYR_APP_REPO)
  --app-base <ref>        Analyze committed app changes from base...head
  --app-head <ref>        Head used with --app-base (default: HEAD)
  --knowledge-ref <ref>   Read governed sources from this committed ref (default: HEAD)
  --as-of <YYYY-MM-DD>    Stable date for staleness evaluation
  --output-dir <path>     Generated output directory
  --check                 Build and validate in memory without writing
  --help                  Show this help`;
}

function runAppImpact(options) {
  const checker = path.join(options.appRepository, 'scripts/documentation/checkImpact.mjs');
  if (!fs.existsSync(checker)) throw new Error(`App impact checker not found: ${checker}`);
  const args = [checker, '--json'];
  if (options.appBase) {
    args.push('--base', options.appBase, '--head', options.appHead || 'HEAD');
  }
  const result = run(process.execPath, args, options.appRepository, true);
  try {
    return JSON.parse(result.stdout);
  } catch {
    throw new Error(result.stderr.trim() || 'App impact checker did not return JSON.');
  }
}

export function createModel(input) {
  const byPath = new Map(input.sources.map((source) => [source.path, source]));
  const changedKnowledge = new Set(input.changedKnowledgeFiles);
  const findings = [];

  for (const pathName of input.appImpact.analysis.unmappedGuarded) {
    findings.push({
      severity: 'Blocking',
      codePaths: [pathName],
      sourcePaths: [],
      message: 'Assistant behavior changed on a guarded path with no documentation mapping.',
    });
  }

  for (const row of input.appImpact.analysis.documents) {
    const source = byPath.get(row.document);
    const codePaths = input.appImpact.analysis.files
      .filter((file) => file.rules.some((rule) => rule.documents.includes(row.document)))
      .map((file) => file.path);
    findings.push({
      severity: changedKnowledge.has(row.document) ? 'Informational' : 'Review',
      codePaths,
      sourcePaths: [row.document],
      message: changedKnowledge.has(row.document)
        ? 'Mapped implementation and documentation both changed; confirm the documentation change is normative and complete.'
        : 'Mapped implementation changed without a corresponding working-tree change to this governed source.',
      rules: row.ruleIds,
      sourceAuthority: source?.authority ?? 'unclassified',
    });
  }

  const ids = new Map();
  for (const source of input.sources) {
    if (ids.has(source.id)) {
      findings.push({
        severity: 'Conflict',
        codePaths: [],
        sourcePaths: [ids.get(source.id), source.path],
        message: `Duplicate source ID: ${source.id}.`,
      });
    } else ids.set(source.id, source.path);

    if ((source.authority === 'canonical' || source.authority === 'release') && source.metadata?.superseded_by) {
      findings.push({
        severity: 'Conflict',
        codePaths: [],
        sourcePaths: [source.path],
        message: 'A superseded source is still classified as authoritative.',
      });
    }

    const age = source.metadata?.last_reviewed
      ? daysBetween(source.metadata.last_reviewed, input.asOf)
      : null;
    if ((source.authority === 'canonical' || source.authority === 'release') && age != null && age > 90) {
      findings.push({
        severity: 'Stale',
        codePaths: [],
        sourcePaths: [source.path],
        message: `Authoritative source was last reviewed ${age} days before ${input.asOf}.`,
      });
    }
  }

  const severityOrder = { Blocking: 0, Conflict: 1, Review: 2, Stale: 3, Informational: 4 };
  findings.sort((a, b) => {
    const severity = severityOrder[a.severity] - severityOrder[b.severity];
    if (severity !== 0) return severity;
    return (a.sourcePaths[0] || a.codePaths[0] || '').localeCompare(b.sourcePaths[0] || b.codePaths[0] || '');
  });

  return { ...input, findings };
}

function findingCounts(findings) {
  const counts = { Blocking: 0, Conflict: 0, Review: 0, Stale: 0, Informational: 0 };
  for (const finding of findings) counts[finding.severity] += 1;
  return counts;
}

function compactLinks(paths, linkBuilder, limit = 8) {
  const visible = paths.slice(0, limit).map(linkBuilder).join(', ');
  return paths.length > limit ? `${visible}, and ${paths.length - limit} more` : visible || 'None';
}

export function renderDriftReport(model) {
  const counts = findingCounts(model.findings);
  const lines = [
    generatedNotice,
    '# Documentation Drift Report',
    '',
    '**Authority:** Generated diagnostic; not a product requirement.',
    '',
    `**Knowledge source fingerprint:** \`${model.sourceFingerprint}\`  `,
    `**Knowledge ref:** \`${model.knowledgeRef}\`  `,
    `**App state:** \`${model.appState}\`  `,
    `**As of:** \`${model.asOf}\``,
    '',
    '## Summary',
    '',
    '| Severity | Findings |',
    '|---|---:|',
    ...Object.entries(counts).map(([severity, count]) => `| ${severity} | ${count} |`),
    '',
  ];

  if (model.findings.length === 0) {
    lines.push('No drift findings were detected for the selected evidence.', '');
  } else {
    lines.push('## Findings', '');
    model.findings.forEach((finding, index) => {
      lines.push(`### ${index + 1}. ${finding.severity}: ${finding.message}`, '');
      lines.push(`- **Code:** ${compactLinks(finding.codePaths, appLink)}`);
      lines.push(`- **Sources:** ${compactLinks(finding.sourcePaths, sourceLink)}`);
      if (finding.rules?.length) lines.push(`- **Map rules:** ${finding.rules.map((rule) => `\`${rule}\``).join(', ')}`);
      if (finding.sourceAuthority) lines.push(`- **Source authority:** \`${finding.sourceAuthority}\``);
      lines.push('');
    });
  }

  lines.push(
    '## Interpretation',
    '',
    '- **Blocking:** a governed assistant path has no source mapping.',
    '- **Conflict:** active source metadata is internally inconsistent.',
    '- **Review:** implementation changed and the mapped source needs review.',
    '- **Stale:** an authoritative source exceeded the 90-day review interval.',
    '- **Informational:** implementation and its mapped source both changed; human approval is still required for normative content.',
    '',
  );
  return `${lines.join('\n')}\n`;
}

export function renderCoverageReport(model) {
  const authorityCounts = {};
  for (const source of model.sources) authorityCounts[source.authority] = (authorityCounts[source.authority] || 0) + 1;
  const authoritative = model.sources.filter((source) => source.authority === 'canonical' || source.authority === 'release');
  const hasRequiredMetadata = (source) => source.path.endsWith('.md')
    ? Boolean(source.metadata?.kb_id && source.metadata?.owner && source.metadata?.last_reviewed)
    : Boolean(source.id && source.authority && source.status);
  const authoritativeWithMetadata = authoritative.filter(hasRequiredMetadata);
  const missingFiles = model.sources.filter((source) => !source.exists);
  const unknownAuthority = model.sources.filter((source) => !authorityValues.has(source.authority));
  const patternCount = model.appMap.rules.reduce((total, rule) => total + rule.patterns.length, 0);
  const counts = findingCounts(model.findings);

  const lines = [
    generatedNotice,
    '# Knowledge-Base Coverage Report',
    '',
    '**Authority:** Generated diagnostic; not a product requirement.',
    '',
    `**Knowledge source fingerprint:** \`${model.sourceFingerprint}\`  `,
    `**As of:** \`${model.asOf}\``,
    '',
    '## Source coverage',
    '',
    `- Manifest sources: **${model.sources.length}**`,
    `- Authoritative sources with required metadata: **${authoritativeWithMetadata.length}/${authoritative.length}**`,
    `- Missing manifest paths: **${missingFiles.length}**`,
    `- Unknown authority values: **${unknownAuthority.length}**`,
    '',
    '| Authority | Sources |',
    '|---|---:|',
    ...Object.keys(authorityCounts).sort().map((authority) => `| ${authority} | ${authorityCounts[authority]} |`),
    '',
    '## App mapping coverage',
    '',
    `- Mapping rules: **${model.appMap.rules.length}**`,
    `- Path patterns: **${patternCount}**`,
    `- Guarded assistant prefixes: **${model.appMap.guardedPrefixes.length}**`,
    `- Changed app files evaluated: **${model.appImpact.analysis.files.length}**`,
    `- Blocking unmapped assistant files: **${model.appImpact.analysis.unmappedGuarded.length}**`,
    `- Mapped sources requiring review: **${counts.Review}**`,
    '',
    '## Gaps',
    '',
  ];

  const gaps = [];
  for (const source of missingFiles) gaps.push(`Missing manifest path: \`${source.path}\`.`);
  for (const source of unknownAuthority) gaps.push(`Unknown authority \`${source.authority}\` on \`${source.path}\`.`);
  for (const source of authoritative.filter((item) => !hasRequiredMetadata(item))) {
    gaps.push(`Authoritative source lacks complete frontmatter: ${sourceLink(source.path)}.`);
  }
  for (const pathName of model.appImpact.analysis.unmappedGuarded) gaps.push(`Unmapped guarded app path: ${appLink(pathName)}.`);
  if (gaps.length === 0) lines.push('No structural coverage gaps were detected.');
  else gaps.forEach((gap) => lines.push(`- ${gap}`));
  lines.push('');
  return `${lines.join('\n')}\n`;
}

export function renderOpenQuestions(model) {
  const lines = [
    generatedNotice,
    '# Open Questions',
    '',
    '**Authority:** Generated index; decisions remain authoritative only in their source documents.',
    '',
    `**Knowledge source fingerprint:** \`${model.sourceFingerprint}\``,
    '',
    '## Open decisions',
    '',
  ];
  if (model.openDecisions.length === 0) lines.push('No open decision-log entries were detected.', '');
  else {
    for (const decision of model.openDecisions) {
      lines.push(`- **${decision.id}:** ${decision.decision} — owner: ${decision.owner}; opened ${decision.date}.`);
    }
    lines.push('');
  }

  lines.push('## Declared boundaries and conflicts', '');
  if (model.declaredBoundaries.length === 0) lines.push('No declared boundaries were detected.', '');
  else {
    for (const boundary of model.declaredBoundaries) lines.push(`- ${boundary}`);
    lines.push('');
  }

  lines.push('## Source sections explicitly tracking open questions', '');
  const openSections = model.sources.flatMap((source) =>
    source.headings
      .filter((heading) => /open (question|decision)|unresolved/i.test(heading.title))
      .map((heading) => ({ source, heading }))
  );
  if (openSections.length === 0) lines.push('No explicit open-question sections were detected.', '');
  else {
    for (const { source, heading } of openSections) {
      lines.push(`- ${sourceLink(source.path)} — **${heading.title}**`);
    }
    lines.push('');
  }
  return `${lines.join('\n')}\n`;
}

export function buildSourceIndex(model) {
  return {
    generated: true,
    authoritative: false,
    schemaVersion: 1,
    knowledgeRef: model.knowledgeRef,
    sourceFingerprint: model.sourceFingerprint,
    sources: model.sources.map((source) => ({
      id: source.id,
      path: source.path,
      title: source.title,
      authority: source.authority,
      status: source.status,
      answers: source.answers,
      directAnswer: source.directAnswer,
      exists: source.exists,
      owner: source.metadata?.owner ?? null,
      lastReviewed: source.metadata?.last_reviewed ?? null,
      appliesTo: source.metadata?.applies_to ?? [],
      supersedes: source.metadata?.supersedes ?? [],
      supersededBy: source.metadata?.superseded_by ?? null,
      relatedDocs: source.metadata?.related_docs ?? [],
      headings: source.headings,
    })),
  };
}

function buildEvidence(options) {
  const files = listAtRef(options.knowledgeRef);
  const fileSet = new Set(files);
  const manifestSource = readAtRef('knowledge-base/SOURCE_MANIFEST.md', options.knowledgeRef);
  const manifestEntries = parseManifest(manifestSource);
  const sourceContents = [];
  const sources = manifestEntries.map((entry) => {
    const exists = fileSet.has(entry.path);
    const content = exists ? readAtRef(entry.path, options.knowledgeRef) : '';
    sourceContents.push(`${entry.path}\0${content}`);
    const metadata = parseFrontmatter(content);
    return {
      ...entry,
      exists,
      metadata,
      title: metadata.title || parseHeadings(content).find((heading) => heading.level === 1)?.title || entry.id,
      headings: parseHeadings(content),
    };
  });
  const sourceFingerprint = crypto.createHash('sha256').update(sourceContents.sort().join('\0')).digest('hex');
  const appImpact = runAppImpact(options);
  const appMap = JSON.parse(fs.readFileSync(path.join(options.appRepository, 'docs/assistant-documentation-map.json'), 'utf8'));
  const appHead = gitLines(['rev-parse', '--short=12', 'HEAD'], options.appRepository)[0];
  const decisionLog = readAtRef('knowledge-base/DECISION_LOG.md', options.knowledgeRef);
  const model = createModel({
    knowledgeRef: options.knowledgeRef,
    sourceFingerprint,
    asOf: options.asOf,
    appState: options.appBase ? `${options.appBase}...${options.appHead || 'HEAD'}` : `working tree from ${appHead}`,
    appImpact,
    appMap,
    sources,
    changedKnowledgeFiles: changedKnowledgeFiles(options.knowledgeRef),
    openDecisions: parseOpenDecisions(decisionLog),
    declaredBoundaries: parseDeclaredBoundaries(manifestSource),
  });
  return model;
}

function outputsFor(model) {
  return {
    'COVERAGE_REPORT.md': renderCoverageReport(model),
    'DOCUMENTATION_DRIFT_REPORT.md': renderDriftReport(model),
    'OPEN_QUESTIONS.md': renderOpenQuestions(model),
    'SOURCE_INDEX.json': `${JSON.stringify(buildSourceIndex(model), null, 2)}\n`,
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }
  if (!fs.existsSync(options.appRepository)) throw new Error(`App repository not found: ${options.appRepository}`);
  const model = buildEvidence(options);
  const outputs = outputsFor(model);
  if (options.write) {
    fs.mkdirSync(options.outputDirectory, { recursive: true });
    for (const [name, content] of Object.entries(outputs)) {
      fs.writeFileSync(path.join(options.outputDirectory, name), content);
    }
  } else {
    const mismatches = [];
    for (const [name, content] of Object.entries(outputs)) {
      const outputPath = path.join(options.outputDirectory, name);
      if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, 'utf8') !== content) {
        mismatches.push(name);
      }
    }
    if (mismatches.length > 0) {
      throw new Error(`Generated drift artifacts are stale: ${mismatches.join(', ')}`);
    }
  }
  const counts = findingCounts(model.findings);
  console.log(`Drift reports ${options.write ? 'written' : 'validated'}: ${model.sources.length} sources, ${model.appImpact.analysis.files.length} app changes, ${counts.Blocking} blocking, ${counts.Conflict} conflicts, ${counts.Review} review findings.`);
}

if (path.resolve(process.argv[1] ?? '') === scriptPath) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
