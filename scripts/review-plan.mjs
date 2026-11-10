import { execFileSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { route, POLICY_VERSION } from '../lab/policy.mjs';

const base = process.env.BASE_SHA;
const head = process.env.HEAD_SHA;
for (const sha of [base, head]) {
  if (!/^[a-f0-9]{40}$/i.test(sha ?? '')) throw new Error('Expected full base/head SHA from event metadata.');
}
const paths = execFileSync('git', ['diff', '--name-only', '-z', `${base}...${head}`], { encoding: 'utf8' }).split('\0').filter(Boolean);
const plan = paths.length ? route(paths) : { policyVersion: POLICY_VERSION, risk: 'none', reviewers: [], paths: [] };
await writeFile('review-plan.json', JSON.stringify({
  ...plan, base, head, advisoryOnly: true, aiAgentsExecuted: 0,
  warning: 'Planning only. Does not authenticate evidence, approve, merge or deploy.'
}, null, 2));
console.log(`Advisory plan: ${plan.risk}, ${plan.reviewers.length} reviewers; no AI agents executed.`);
