import test from 'node:test';
import assert from 'node:assert/strict';
import { computeScenario } from '../lab/scenario.mjs';
test('browser scenario uses real policy with 5/8/11 reviewers', () => {
  for (const [scenario, count] of [['docs', 5], ['api', 8], ['policy', 11]]) {
    const result = computeScenario({ scenario });
    assert.equal(result.plan.reviewers.length, count);
    assert.equal(result.validation.ok, true);
    assert.equal(result.releaseAuthorized, false);
    assert.equal(result.aiAgentsExecuted, 0);
  }
});
test('all animated failure scenarios reject actual evidence', () => {
  for (const failure of ['stale', 'missing', 'duplicate', 'finding', 'unavailable']) {
    assert.equal(computeScenario({ failure }).validation.ok, false, failure);
  }
  assert.equal(computeScenario({ production: true }).validation.ok, false);
});
test('animation rejects unknown scenario controls', () => {
  assert.throws(() => computeScenario({ scenario: 'unknown' }));
  assert.throws(() => computeScenario({ failure: 'unknown' }));
  assert.throws(() => computeScenario({ production: 'true' }));
});
