# 09 / Operations, cost and incident response

## Operational ownership

Assign an accountable platform owner for profiles/policy, an application owner for acceptance criteria and code, a security owner for tool/data access, and a release owner for promotion and rollback. These roles can collaborate but should not collapse into one unattended agent identity.

Maintain a registry entry per specialist: owner, prompt version, model policy, allowed tools, intended inputs, expected output, evaluation results and retirement criteria. The supplied registry captures the learning contract; production should add real ownership and evidence references.

## Telemetry without leaking context

Record repository/PR IDs, exact head SHA, policy version/digest, specialist ID, real run ID, duration, retry count, tool-call counts, verdict and sanitized failure class. Log artifact digests and locations, not full issue bodies, credentials or private stack payloads.

For release telemetry, join the deployed digest and source SHA to smoke results and incident events. The demo `/health` confirms its process can respond; it does not check a database, dependency readiness or end-to-end business availability.

## Metrics and denominators

| Metric | Definition | Interpretation caution |
|---|---|---|
| Change lead time | PR ready-for-review to deployed approved artifact, median and p90 | Compare similar change classes |
| Review completeness | Current-SHA required reviews received / required reviews planned | Not a correctness metric |
| Escaped defects | Confirmed post-release defects / deployments or changed work units | Choose and retain one denominator |
| False-positive rate | Adjudicated non-defects / reported findings reviewed | Human adjudication required |
| Repair churn | Repair commits / reviewed PR | More activity may mean worse coordination |
| Cost per accepted PR | Attributable execution cost / merged evaluated PRs | Include failed runs and human effort |
| Approval burden | Human review minutes / accepted change | Automation can increase this |

These are recommended measurements, not reported results from Levi Strauss. Capture a baseline before claiming improvements. Stratify by risk and repository; do not compare a docs PR with a database migration.

## Budget design

Estimate tokens, tool costs and runner time per specialist before multiplying by eleven. A planning formula is:

```text
per-PR cost =
  sum(review input + review output + authorized tool/runner costs)
  + repair attempts
  + amortized evaluation/operations overhead
```

Use your provider's current billing units and actual invoices; this guide does not publish assumed token prices. Record premium-request consumption separately when applicable.

Start with manual invocation and a small cohort. In a real scheduler, enforce concurrency 3, at most 2 repair attempts and a 30-minute review window as reference defaults. Reject runaway fan-out and nested delegation. Cancel no-longer-relevant runs after a new push, then collect evidence at the new SHA.

## Failure classes

**Configuration:** missing tool, wrong profile branch, invalid MCP schema. Stop the affected task; correct configuration through review.

**Execution:** runner timeout, rate limit, missing dependency. Preserve failure logs; retry only known transient failures within budget.

**Evidence:** stale SHA, absent reviewer, inaccessible artifact. Mark incomplete; never infer pass from absence.

**Decision:** contradictory requirements or specialist findings. Escalate to the accountable human; do not average verdicts.

**Release:** smoke failure, wrong digest or telemetry regression. Halt promotion and use the known-good release procedure.

## Incident runbook

1. Declare scope and appoint an incident commander. Stop automated repair/promotion if it may worsen the incident.
2. Preserve run IDs, source SHAs, deployed digests and sanitized logs. Do not overwrite evidence.
3. Verify current health and business impact with independent telemetry.
4. Choose containment or rollback with the authorized release owner. Agents may recommend; operators authorize.
5. Deploy the known-good artifact or revert the guide content through the normal workflow.
6. Run health and business smoke tests; monitor the actual target rather than trusting a deployment-success message.
7. Review root-cause hypotheses, add regression cases and update the prompt/policy only through normal review.

## Pages runbook

If a deployment fails, inspect the failing job, preserve its log and identify whether test, build, artifact upload, permission or environment configuration failed. Do not grant a broader token as the default response.

If the site works but the PPTX fails, inspect the exact download response and package file. Ensure the build copied the binary into `dist/downloads`. If only fork links fail, check relative URLs and hardcoded README attribution links separately.

Rollback by reverting the content commit. Do not erase history or delete the deployment environment. The workflow's deployment artifact is recreated from version-controlled sources.

## Lifecycle hygiene

Review model/tool availability regularly; re-evaluate after a model, prompt, MCP server or dependency update. Remove unused privileges and rotate credentials. Retire specialists that add cost without distinct, measurable value.

Continue with [troubleshooting](10-troubleshooting.md).
