import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { root } from '../scripts/generate-agents.mjs';

const run = args => spawnSync(process.execPath, [path.join(root, 'lab', 'cli.mjs'), ...args], { encoding: 'utf8' });
test('CLI reports risk as parseable JSON', () => {
  const result = run(['route', 'demo/server.mjs']);
  assert.equal(result.status, 0);
  assert.equal(JSON.parse(result.stdout).risk, 'medium');
});
test('CLI rejects missing and unknown arguments', () => {
  for (const args of [[], ['route'], ['simulate', '--risk', 'low'], ['verify', '--unknown', 'x'],
    ['simulate', '--risk', 'low', '--risk', 'high']]) assert.notEqual(run(args).status, 0);
});
test('CLI fixture roundtrip and production failure', async t => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'sdlc-lab-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const file = path.join(dir, 'fixture.json');
  const sha = 'a'.repeat(40);
  assert.equal(run(['simulate', '--risk', 'high', '--sha', sha, '--out', file]).status, 0);
  const args = ['verify', '--risk', 'high', '--sha', sha, '--file', file];
  const valid = run(args);
  assert.equal(valid.status, 0); assert.match(valid.stdout, /LAB ONLY/);
  const production = run([...args, '--production']);
  assert.equal(production.status, 1); assert.match(production.stdout, /synthetic evidence rejected/);
});
