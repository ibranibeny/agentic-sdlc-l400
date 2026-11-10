export const POLICY_VERSION = '2026-11-reference-v1';
export const REVIEWERS = Object.freeze({
  low: Object.freeze(['specification', 'unit-test', 'security', 'documentation', 'release']),
  medium: Object.freeze(['specification', 'unit-test', 'security', 'documentation', 'release',
    'integration-test', 'dependencies', 'accessibility']),
  high: Object.freeze(['specification', 'unit-test', 'security', 'documentation', 'release',
    'integration-test', 'dependencies', 'accessibility', 'architecture', 'data', 'observability'])
});

export function reviewersFor(risk) {
  if (!Object.hasOwn(REVIEWERS, risk)) throw new Error(`Unknown risk: ${risk}`);
  return [...REVIEWERS[risk]];
}

export function route(paths) {
  if (!Array.isArray(paths) || paths.length === 0) throw new Error('Provide at least one changed path.');
  const normalized = paths.map(p => {
    if (typeof p !== 'string' || !p.trim()) throw new Error('Changed paths must be nonempty strings.');
    const name = p.replaceAll('\\', '/').replace(/^\.\//, '');
    if (name.startsWith('/') || /^[a-z]:/i.test(name) || name.split('/').includes('..')) {
      throw new Error(`Expected repository-relative path: ${p}`);
    }
    return name;
  });
  const high = normalized.some(p =>
    /^(?:\.github\/|lab\/|config\/|scripts\/)|(?:^|\/)(?:auth|payments|migrations|infra)(?:\/|[.])/i.test(p));
  const documentationOnly = normalized.every(p =>
    /^(?:docs\/|presentations\/)/i.test(p) || /^(?:README|LICENSE)(?:\.md)?$/i.test(p));
  const risk = high ? 'high' : documentationOnly ? 'low' : 'medium';
  return { policyVersion: POLICY_VERSION, risk, reviewers: reviewersFor(risk), paths: normalized };
}

export function validateEvidence({ risk, sha, reports, production = false }) {
  const required = reviewersFor(risk);
  if (!/^[a-f0-9]{40}$/i.test(sha ?? '')) throw new Error('Expected a full 40-character Git head SHA.');
  if (!Array.isArray(reports)) throw new Error('Reports must be an array.');
  const errors = [];
  const seen = new Set();
  for (const report of reports) {
    if (!report || typeof report !== 'object' || Array.isArray(report)) {
      errors.push('Malformed report.');
      continue;
    }
    const id = report.reviewer;
    if (!required.includes(id)) errors.push(`Unexpected reviewer: ${id}`);
    if (seen.has(id)) errors.push(`Duplicate reviewer: ${id}`);
    seen.add(id);
    if (report.sha !== sha) errors.push(`${id}: stale or missing SHA.`);
    if (report.policyVersion !== POLICY_VERSION) errors.push(`${id}: policy version mismatch.`);
    if (report.verdict !== 'pass') errors.push(`${id}: verdict is not pass.`);
    for (const key of ['runId', 'artifact']) {
      if (typeof report[key] !== 'string' || !report[key].trim()) errors.push(`${id}: missing ${key}.`);
    }
    if (typeof report.synthetic !== 'boolean') errors.push(`${id}: synthetic flag must be boolean.`);
    if (production && report.synthetic !== false) errors.push(`${id}: synthetic evidence rejected.`);
    if (!Array.isArray(report.findings)) {
      errors.push(`${id}: findings must be an array.`);
    } else {
      for (const finding of report.findings) {
        if (!finding || !['low', 'medium', 'high', 'critical'].includes(finding.severity) ||
            typeof finding.summary !== 'string' || !finding.summary.trim()) {
          errors.push(`${id}: malformed finding.`);
        } else if (['high', 'critical'].includes(finding.severity)) {
          errors.push(`${id}: blocking ${finding.severity} finding.`);
        }
      }
    }
  }
  for (const id of required) if (!seen.has(id)) errors.push(`Missing reviewer: ${id}`);
  return { ok: errors.length === 0, errors, required, authority: 'STRUCTURAL CHECK ONLY; NOT RELEASE APPROVAL' };
}

export function simulate(risk, sha) {
  if (!/^[a-f0-9]{40}$/i.test(sha ?? '')) throw new Error('Expected a full 40-character Git head SHA.');
  return reviewersFor(risk).map(reviewer => ({
    reviewer, sha, policyVersion: POLICY_VERSION, verdict: 'pass',
    runId: `synthetic-${reviewer}`, artifact: `fixture://${reviewer}`,
    synthetic: true, findings: []
  }));
}
