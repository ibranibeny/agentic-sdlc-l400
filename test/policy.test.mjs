import test from 'node:test';
import assert from 'node:assert/strict';
import { reviewersFor, route, simulate, validateEvidence } from '../lab/policy.mjs';

const sha = 'a'.repeat(40);
const check = reports => validateEvidence({ risk: 'high', sha, reports });
test('risk sets contain exactly 5, 8 and 11 unique reviewers', () => {
  for (const [risk, count] of [['low', 5], ['medium', 8], ['high', 11]]) {
    assert.equal(new Set(reviewersFor(risk)).size, count);
  }
});
test('docs-only is low, API is medium and policy is high', () => {
  assert.equal(route(['docs/01-orientation.md']).risk, 'low');
  assert.equal(route(['demo/server.mjs']).risk, 'medium');
  assert.equal(route(['.github/workflows/ci.yml', 'README.md']).risk, 'high');
});
test('normalizes Windows paths and handles sensitive paths', () => {
  assert.equal(route(['.github\\agents\\security.agent.md']).risk, 'high');
  assert.equal(route(['src/auth/token.mjs']).risk, 'high');
  assert.equal(route(['src/payments.mjs']).risk, 'high');
});
test('unknown paths are not treated as documentation', () => {
  assert.equal(route(['unknown.txt']).risk, 'medium');
});
test('invalid path sets fail closed', () => {
  for (const paths of [[], [''], ['../secrets'], ['C:\\file'], ['/file'], [3]]) {
    assert.throws(() => route(paths));
  }
});
test('unknown risk fails', () => assert.throws(() => reviewersFor('urgent')));
test('complete synthetic evidence passes only lab structure', () => assert.equal(check(simulate('high', sha)).ok, true));
test('synthetic evidence is rejected in production mode', () => {
  assert.equal(validateEvidence({ risk: 'high', sha, reports: simulate('high', sha), production: true }).ok, false);
});
test('stale evidence fails after a repair commit', () => {
  const reports = simulate('high', sha);
  reports[0].sha = 'b'.repeat(40);
  assert.equal(check(reports).ok, false);
});
test('missing specialist fails', () => assert.equal(check(simulate('high', sha).slice(1)).ok, false));
test('duplicate specialist cannot replace missing specialist', () => {
  const reports = simulate('high', sha);
  reports[0] = structuredClone(reports[1]);
  assert.equal(check(reports).ok, false);
});
test('blocked and needs-human are not passes', () => {
  for (const verdict of ['blocked', 'needs-human', undefined]) {
    const reports = simulate('high', sha); reports[0].verdict = verdict;
    assert.equal(check(reports).ok, false);
  }
});
test('a high finding overrides a pass verdict', () => {
  const reports = simulate('high', sha);
  reports[0].findings.push({ severity: 'high', summary: 'Unsafe token permission' });
  assert.equal(check(reports).ok, false);
});
test('malformed findings and reports are rejected', () => {
  for (const bad of [null, [], 'pass', {}]) assert.equal(check([bad]).ok, false);
  const reports = simulate('high', sha); reports[0].findings = [{}];
  assert.equal(check(reports).ok, false);
});
test('missing artifact, run identity or policy version fails', () => {
  for (const key of ['artifact', 'runId', 'policyVersion', 'synthetic']) {
    const reports = simulate('high', sha); delete reports[0][key];
    assert.equal(check(reports).ok, false);
  }
});
test('invalid SHA cannot be simulated or verified', () => {
  assert.throws(() => simulate('low', 'abc'));
  assert.throws(() => validateEvidence({ risk: 'low', sha: 'abc', reports: [] }));
});
test('valid-looking real evidence is explicitly not release approval', () => {
  const reports = simulate('high', sha).map(r => ({ ...r, synthetic: false }));
  const result = validateEvidence({ risk: 'high', sha, reports, production: true });
  assert.equal(result.ok, true);
  assert.match(result.authority, /NOT RELEASE APPROVAL/);
});
