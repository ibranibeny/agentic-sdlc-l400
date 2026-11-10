# 03 / Seventeen specialists and evidence contracts

## An original role library

The registry is `config/agents.json`. Run `npm run agents` to regenerate the committed `.github/agents/*.agent.md` profiles. CI checks the count, unique identifiers, generated contents and tool allowlists. This avoids prompt drift between a table in documentation and the actual files users install.

| Role | Responsibility / principal output |
|---|---|
| orchestrator | Dependency plan, budgets and unresolved human decisions |
| requirements | Acceptance criteria, ambiguity register and non-goals |
| specification | API contract, error matrix and traceability |
| architecture | Trust boundaries, ADR alternatives and failure isolation |
| implementation | Scoped code changes and observed test results |
| unit-test | Pure-function boundary coverage and reproducible defects |
| integration-test | HTTP contract matrix and component-boundary failures |
| security | Trust-boundary findings and exploit prerequisites |
| dependencies | Manifest delta, provenance and advisory limitations |
| accessibility | Semantic, keyboard and manual verification findings |
| performance | Workload assumptions and measured regression evidence |
| data | Data integrity, minimization and migration implications |
| observability | SLIs, sanitized telemetry, alert ownership |
| documentation | Reproducible install, operation and rollback instructions |
| release | Recommendation against an exact artifact; never authorization |
| deployment | Least-privilege promotion plan and smoke checks |
| incident | Evidence timeline, containment and recovery options |

Only implementation has `edit` and `execute`. All others have `read` and `search`; they review supplied outputs but cannot actually run tests or modify files. This is intentional least privilege, not a claim that every tool permission is a security sandbox. Platform permissions and isolation still matter.

All profiles set `disable-model-invocation: true`. They are manually selected, not silently auto-routed by a model. No profile includes MCP tools. A repository MCP server does not automatically make its tools available to these allowlisted profiles.

## Sample invocation

Select **specification** in the GitHub Copilot agents picker for this repository. Supply a bounded prompt:

```text
Review the availability API at full head SHA <40-character SHA>.
Acceptance: known SKU; integer quantity 1..100; return fulfillable without
changing stock; reject duplicate query fields; no customer data.
Read docs/03-agent-contracts.md and demo/server.mjs.
Return a verdict, acceptance-criterion coverage, file/line evidence,
unknowns and any requested operator-run tests. Do not edit or deploy.
```

Record the actual session reference and output. A model's statement that it ran a command is not a trusted runner log. With read-only profiles, the expected answer should explicitly distinguish inspection from execution.

## Machine-readable report

The teaching validator expects an array of records shaped like:

```json
{
  "reviewer": "security",
  "sha": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "policyVersion": "2026-11-reference-v1",
  "verdict": "pass",
  "runId": "operator-recorded-session-123",
  "artifact": "https://example.invalid/immutable-review-artifact",
  "synthetic": false,
  "findings": []
}
```

`example.invalid` is deliberately a placeholder, not a configured storage system. Use a real immutable reference under your control for real runs.

Allowed verdicts in the collaboration contract are `pass`, `blocked` and `needs-human`. The validator accepts only `pass` for a structurally complete success. Missing inputs, unresolved ambiguities, unavailable tools and contradictory requirements are not passes.

Findings have a severity of `low`, `medium`, `high` or `critical`, and a nonempty `summary`. High and critical findings block even when the record says pass. File locations, rationale, acceptance criterion and reproduction belong in the referenced human-readable artifact. Medium/low findings require accountable disposition in production; the lab does not implement a waiver database.

## What the validator checks

It rejects unknown/duplicate/missing reviewers, wrong policy version, stale or absent SHA, absent run/artifact fields, non-pass verdicts and malformed findings. In `--production` mode it also rejects synthetic records. A full forty-character SHA prevents accidental short-SHA mismatches.

It **does not authenticate** a report's writer, verify a URL, check cryptographic signatures, inspect the referenced artifact, validate a scan engine or query actual GitHub approval state. Flipping `synthetic` to false proves nothing. An attacker can forge a structurally correct report. This is why the lab gate must never become the only protected check.

## Production extension contract

A trusted collector should derive reviewer identity from the execution system, not user-supplied JSON. Bind repository ID, PR number, current head SHA, policy digest, workflow run attempt, tool configuration, artifact digest and timestamp. Store results outside author-writeable branches. Reject expired, revoked or cross-repository evidence.

Use short-lived identities, isolated execution and protected workflow definitions. Fetch review state through GitHub's authenticated API at the point of merge. Check the latest commit, required approvals, dismissed stale reviews and actor authorization. Evaluate environment approvals through the deployment platform.

Do not trust a `humanApproved: true` field. Do not grant the implementation agent the token that can update release gates. Do not make a coordinator's summary overwrite individual findings.

## Prompts are versioned software

Change a profile through a PR. Run the existing evaluation scenarios, record behavior changes, and require owners for policy/tool expansions. A tool alias unknown to a given Copilot surface can be ignored; verify the effective tool list in that surface before relying on it. `handoffs` behavior in an IDE is not proof of cloud-agent orchestration.

Continue with [implementation](04-implementation.md).
