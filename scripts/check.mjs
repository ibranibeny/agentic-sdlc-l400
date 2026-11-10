import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
import { root, agents, profile } from './generate-agents.mjs';
import { REVIEWERS } from '../lab/policy.mjs';

assert.equal(agents.length, 17, 'Exactly 17 reference specialists required.');
const ids = agents.map(a => a.id);
assert.equal(new Set(ids).size, 17, 'Agent IDs must be unique.');
for (const agent of agents) {
  assert.match(agent.id, /^[a-z][a-z-]+$/);
  const file = path.join(root, '.github', 'agents', `${agent.id}.agent.md`);
  const actual = await readFile(file, 'utf8');
  assert.equal(actual.replaceAll('\r\n', '\n'), profile(agent), `Regenerate ${agent.id}.`);
  const frontmatter = YAML.parse(actual.split('---')[1]);
  assert.equal(frontmatter['disable-model-invocation'], true);
  assert.deepEqual(frontmatter.tools, agent.mode === 'write' ? ['read', 'search', 'edit', 'execute'] : ['read', 'search']);
}
assert.equal((await readdir(path.join(root, '.github', 'agents'))).filter(f => f.endsWith('.agent.md')).length, 17);
for (const reviewers of Object.values(REVIEWERS)) for (const id of reviewers) assert.ok(ids.includes(id), `Unknown reviewer ${id}.`);
for (const file of (await readdir(path.join(root, 'docs'))).filter(f => f.endsWith('.md'))) {
  const text = await readFile(path.join(root, 'docs', file), 'utf8');
  for (const [, href] of text.matchAll(/\]\(([^)]+)\)/g)) {
    if (/^[a-z]+:/i.test(href) || href.startsWith('#')) continue;
    await access(path.resolve(root, 'docs', href.split('#')[0]));
  }
}
for (const file of await readdir(path.join(root, '.github', 'workflows'))) {
  const workflow = YAML.parse(await readFile(path.join(root, '.github', 'workflows', file), 'utf8'));
  assert.ok(workflow.name && workflow.on && workflow.jobs, `Invalid workflow ${file}.`);
}
console.log('17 profiles, reviewer identities, chapter links and workflow YAML are consistent.');
