import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const text = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const json = relative => JSON.parse(text(relative));
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const expectedNames = {
  alex: 'Alex Bennett', lauren: 'Lauren West', maya: 'Maya Brooks',
  charlie: 'Charlie Reed', julian: 'Julian Price', nina: 'Nina Hayes',
  morgan: 'Morgan Shaw', jamie: 'Jamie Vale',
};
let checks = 0;
let skipped = 0;
function check(label, test) {
  try { test(); checks++; console.log(`PASS ${label}`); }
  catch (error) { console.error(`FAIL ${label}: ${error.message}`); process.exitCode = 1; }
}
function filesIn(relative) {
  const location = path.join(root, relative);
  return fs.readdirSync(location, {withFileTypes: true}).flatMap(entry => {
    const child = path.join(relative, entry.name);
    return entry.isDirectory() ? filesIn(child) : [child];
  });
}

check('ten-episode project, author, team and Fountain format', () => {
  const project = json('development/project.json');
  assert.equal(project.episodes, 10);
  assert.equal(project.author, 'Paul Murphy');
  assert.equal(project.team, 'Canyon House Pictures');
  assert.equal(project.screenplay_format, 'fountain');
  assert.equal(project.screenplay_extension, '.fountain');
});
check('preserved original source bytes', () => {
  const manifest = json('source/manifest.json');
  const sourcePath = path.join(root, 'source', manifest.file);
  if (!fs.existsSync(sourcePath)) {
    assert.equal(manifest.repository_copy, 'not-published-pending-explicit-approval');
    skipped++;
    console.log('SKIP source bytes: original treatment is local-only and unavailable in this checkout; diagnosis requires a local copy.');
    return;
  }
  const bytes = fs.readFileSync(sourcePath);
  assert.equal(bytes.length, manifest.bytes);
  assert.equal(sha(bytes), manifest.sha256);
});
check('repository-local team and state', () => {
  const config = json('.squad/config.json');
  assert.equal(config.stateBackend, 'local');
  assert.ok(!config.teamRoot);
  assert.notEqual(config.stateLocation, 'external');
});
check('specialist registry, charters, roster and label IDs agree', () => {
  const registry = json('.squad/casting/registry.json');
  assert.equal(registry.schema, 'squad-agent-provenance/v1');
  assert.deepEqual(Object.keys(registry.agents).sort(), Object.keys(expectedNames).sort());
  const team = text('.squad/team.md');
  const routing = text('.squad/routing.md');
  const members = team.split('## Members\n')[1]?.split('\n## ')[0];
  assert.ok(members, '## Members roster is required');
  const seenNames = new Set();
  for (const [id, fullName] of Object.entries(expectedNames)) {
    const record = registry.agents[id];
    const firstName = fullName.split(' ')[0];
    assert.equal(record.display_name, firstName);
    assert.equal(record.persistent_name, firstName);
    assert.equal(record.status, 'active');
    assert.ok(record.role && record.universe);
    assert.ok(!Number.isNaN(Date.parse(record.created_at)));
    assert.ok(!Number.isNaN(Date.parse(record.updated_at)));
    assert.ok(!seenNames.has(firstName.toLowerCase()));
    seenNames.add(firstName.toLowerCase());
    assert.ok(members.includes(`| ${firstName} |`), `missing roster entry ${id}`);
    assert.ok(routing.includes(`squad:${id}`), `missing label route ${id}`);
    const charter = text(`.squad/agents/${id}/charter.md`);
    assert.ok(charter.includes(fullName), `missing full name ${fullName}`);
    assert.ok(charter.includes('Fountain'), `missing screenplay policy for ${id}`);
  }
});
check('registry/history transaction and content hashes agree', () => {
  const registryRaw = text('.squad/casting/registry.json');
  const historyRaw = text('.squad/casting/history.json');
  const registry = JSON.parse(registryRaw);
  const history = JSON.parse(historyRaw);
  const manifest = json('.squad/casting/registry-history.commit.json');
  assert.equal(registry.transaction_id, history.transaction_id);
  assert.equal(registry.transaction_id, manifest.transaction_id);
  assert.equal(registry.revision, history.registry_revision);
  assert.equal(registry.revision, manifest.registry_revision);
  assert.equal(sha(registryRaw), manifest.registry_sha256);
  assert.equal(sha(historyRaw), manifest.history_sha256);
});
check('fixed support agents and Scribe compatibility', () => {
  for (const id of ['scribe', 'ralph', 'Rai', 'fact-checker']) {
    assert.ok(fs.existsSync(path.join(root, '.squad/agents', id, 'charter.md')));
  }
  assert.ok(text('.squad/agents/scribe/charter.md').includes('Decision Merger'));
  assert.ok(text('meet-the-squad.md').includes('Sam Ellis'));
  assert.ok(text('docs/squad/README.md').includes('Maya owns meeting notes'));
});
check('coordinator payload retained and capabilities populated', () => {
  const coordinator = text('.github/agents/squad.agent.md');
  assert.ok(coordinator.includes('SQUAD_COORDINATOR_CANARY_HEAD_b7d2'));
  assert.ok(coordinator.includes('SQUAD_COORDINATOR_CANARY_a8f3'));
  assert.ok(coordinator.includes('specialists=8'));
});
check('Fountain requirement and FDX exclusion in active instructions', () => {
  for (const file of ['AGENTS.md', '.github/copilot-instructions.md', '.squad/governance.md', 'docs/fountain-workflow.md', 'package/README.md']) {
    const content = text(file);
    assert.ok(content.includes('Fountain'), file);
    assert.ok(/FDX/i.test(content), file);
  }
  const scan = ['development', 'package', 'source', 'docs', 'research', 'reviews', '.squad/agents'].flatMap(filesIn);
  assert.deepEqual(scan.filter(file => /\.fdx$/i.test(file)), []);
});
check('new project Markdown links resolve locally', () => {
  const documents = ['README.md', 'AGENTS.md', 'meet-the-squad.md', '.github/PR_REQUIREMENTS.md', '.github/copilot-instructions.md', '.squad/team.md', '.squad/governance.md', ...['docs', 'development', 'source', 'research', 'reviews', 'package'].flatMap(filesIn)].filter(file => file.endsWith('.md'));
  for (const file of documents) {
    const body = text(file).replace(/```[\s\S]*?```/g, '');
    for (const match of body.matchAll(/\]\((<[^>]+>|[^)]+)\)/g)) {
      const target = match[1].replace(/^<|>$/g, '');
      if (/^[a-z]+:/i.test(target) || target.startsWith('#')) continue;
      const local = decodeURIComponent(target.split('#')[0]);
      assert.ok(fs.existsSync(path.resolve(root, path.dirname(file), local)), `${file} -> ${target}`);
    }
  }
});
if (!process.exitCode) console.log(`Validated ${checks} project checks (${skipped} source checks skipped). Creative, legal and screenplay rendering review remain separate.`);
