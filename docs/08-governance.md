# 08 / Trust, approvals and threat modeling

## The central threat

If the actor producing a change can also edit its policy, fabricate its evidence and authorize release, the system is self-certifying. Adding more prompts does not repair that boundary.

The reference lab intentionally exposes the distinction: `--production` rejects synthetic fixtures, but a forged record with `synthetic: false` can still satisfy structural rules. No protected workflow in this repository treats that result as a release approval.

## Control matrix

| Threat | Required production control | Lab posture |
|---|---|---|
| Author fabricates a specialist pass | Authenticated runner identity and immutable artifact store | JSON structure only; not trusted |
| Reviewer sees previous opinions | Separate contexts, freeze SHA, collect before reconciliation | Manual operating procedure |
| Old report replayed after push | SHA/digest binding, expiry and latest-head verification | SHA binding demonstrated |
| Policy edited to reduce risk | Protected policy source, independent owners | Plan workflow executes base policy |
| Prompt injection in issue/tool output | Least-privilege tools, untrusted-data handling, egress and filtering | Profile instructions; no external tools enabled |
| Agent commits to protected branch | Rulesets, no bypass identity, scoped write token | Work-branch instruction only |
| Human approval spoofed in JSON | Query actual GitHub review/environment state | No human-approved JSON field |
| Fork PR steals secrets | Read-only fork-safe workflows, no privileged execution of PR code | No secrets in PR jobs |
| Workflow injection from branch names | Pass data through environment/API; avoid shell expression interpolation | No PR text inserted into shell |
| Model review misses defect | Deterministic tests, scans, human expertise and evaluations | Tests and explicit limitations |

## Configure repository controls yourself

For an enterprise target, create a ruleset for the default branch. Require PRs, passing CI and an appropriate number of independent human approvals. Dismiss stale approvals when new commits arrive; require resolution of review conversations. Restrict force-push/deletion and remove broad bypass grants.

Use CODEOWNERS with real accountable teams for `.github/`, `lab/`, `config/`, dependency files and release configuration. The guide does not invent team names or claim a CODEOWNERS file alone enforces ownership. Enable required owner reviews where your plan supports it.

Protect production environments and require approvals where available. Restrict deployment branches. Review the actual plan/organization feature set, including self-review prevention and administrator bypass behavior.

This repository's initial publication is a learning deliverable, not proof these enterprise controls have been installed. Record screenshots/API evidence of settings in your controlled environment rather than publishing private configuration in this public guide.

## CI trust boundary

Ordinary pull_request jobs have read-only repository permissions and no application secrets. They may execute PR code in an isolated hosted runner, so their outputs are not inherently authenticated business approvals.

Avoid `pull_request_target` combined with checkout/execution of untrusted PR code. Do not expose a token with contents-write, environment access or organization privileges to a fork's build. Approved agent repair work should use dedicated identities and branches, not the Pages deployment identity.

The review-plan workflow checks out the PR base commit to run trusted routing code, fetches the PR head for a path diff, then uploads a JSON plan. It does not execute the fetched head. This only trusts the repository's existing base policy; it does not magically validate whether that policy was already unsafe.

## Tool permission expansion

The supplied read-only profiles do not have execute or edit. Giving them MCP wildcard access would undermine that choice. Verify both the profile tool list and the provider identity scope.

Treat every permission change as a high-risk review. Pin approved server versions, audit provider behavior and rotate test credentials. If the client ignores an unknown tool name, treat missing capability as a configuration error, not a successful check.

## Data classification

Public: workshop text, synthetic SKUs and original prompts. Internal: architecture details and ordinary company issues. Restricted: credentials, customer records and sensitive business/incident data. Only public synthetic material belongs in this repository.

Reduce context to the smallest relevant excerpt, preserve source IDs, redact payloads and enforce retention. Never use public Pages as a staging area for internal training material.

## Evaluation before autonomy

Build a replay set containing ordinary changes, policy edits, adversarial issue text, tool failures, contradictory reports and stale evidence. Measure detection, false positives, missed defects and operator effort. Run candidate prompt/tool/model versions against the same cases before rollout.

Do not use model agreement as the only metric. Reviewers sharing a provider/model can share blind spots. The quality target is evidence-backed defect detection at an acceptable cost and burden, not maximum specialist count.

Continue with [operations](09-operations.md).
