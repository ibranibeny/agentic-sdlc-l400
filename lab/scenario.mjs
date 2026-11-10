import { route, simulate, validateEvidence } from './policy.mjs';

export const scenarios = Object.freeze({
  docs: { label: 'Documentation change', paths: ['docs/01-orientation.md'] },
  api: { label: 'Availability API change', paths: ['demo/server.mjs'] },
  policy: { label: 'Protected workflow change', paths: ['.github/workflows/ci.yml'] }
});
export const failures = Object.freeze({
  none: 'No injected defect',
  stale: 'Repair commit: stale evidence',
  missing: 'Missing specialist',
  duplicate: 'Duplicate specialist identity',
  finding: 'High finding despite pass verdict',
  unavailable: 'Specialist needs human input'
});
export const stages = Object.freeze([
  { id: 'input', label: '1 / Scope the change', detail: 'Start from repository-relative changed paths and an exact reference SHA.' },
  { id: 'risk', label: '2 / Compute the risk route', detail: 'The actual route() function selects five, eight or eleven reviewers.' },
  { id: 'reviews', label: '3 / Create lab reports', detail: 'simulate() creates explicitly synthetic fixtures. No AI agents execute.' },
  { id: 'mutate', label: '4 / Apply the selected failure', detail: 'A controlled mutation demonstrates a real evidence-validation failure.' },
  { id: 'gate', label: '5 / Validate the evidence', detail: 'The actual validateEvidence() function checks completeness, SHA, verdict and findings.' },
  { id: 'human', label: '6 / Stop at the authority boundary', detail: 'The diagram never grants release authority. Real identity and human approvals remain external.' }
]);

export function computeScenario({ scenario = 'api', failure = 'none', production = false } = {}) {
  if (!Object.hasOwn(scenarios, scenario)) throw new Error(`Unknown scenario: ${scenario}`);
  if (!Object.hasOwn(failures, failure)) throw new Error(`Unknown failure: ${failure}`);
  if (typeof production !== 'boolean') throw new Error('Production mode must be boolean.');
  const plan = route(scenarios[scenario].paths);
  const reviewedSha = 'a'.repeat(40);
  const expectedSha = failure === 'stale' ? 'b'.repeat(40) : reviewedSha;
  const reports = simulate(plan.risk, reviewedSha);
  if (failure === 'missing') reports.pop();
  if (failure === 'duplicate') reports[0] = structuredClone(reports[1]);
  if (failure === 'finding') reports[0].findings.push({ severity: 'high', summary: 'Injected unsafe permission for the workshop.' });
  if (failure === 'unavailable') reports[0].verdict = 'needs-human';
  const validation = validateEvidence({ risk: plan.risk, sha: expectedSha, reports, production });
  return {
    scenario, failure, production, plan, reviewedSha, expectedSha, reports, validation,
    aiAgentsExecuted: 0, releaseAuthorized: false,
    notice: 'Actual policy calculations; synthetic lab evidence only. No production authorization.'
  };
}
