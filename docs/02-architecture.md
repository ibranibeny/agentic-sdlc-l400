# 02 / Reference architecture and state machine

## Separate intent, evidence and authority

An agent is a producer of proposed work or evidence. A deterministic control plane decides whether required evidence is complete. A protected GitHub workflow and authorized humans decide whether a change can merge or deploy. Combining those roles in a single prompt creates an attractive but fragile shortcut.

```text
TRUSTED INTENT                     ADVISORY EXECUTION
Approved issue + acceptance  --->  Requirements -> Specification -> Architecture
          |                                      |
          |                              Implementation branch
          |                                      |
          v                                      v
Versioned risk policy       --->  Independent specialist review at HEAD SHA
          |                                      |
          |                               Bounded repair loop
          |                                      |
          v                                      v
Trusted evidence collector <---   Results + artifact references + limitations
          |
          v
Required checks + CODEOWNERS + fresh human approval
          |
          v
Protected environment -> immutable release artifact -> smoke tests -> telemetry
```

In this repository, the collector and enterprise execution boxes are a design, not deployed services. `lab/policy.mjs` demonstrates structural checks. `review-plan.yml` produces a plan; it never invokes specialists. Real Copilot sessions are explicitly selected by a user.

## Three planes

**Work plane:** branches, PRs, source code and proposed fixes. Implementation is the only supplied profile with edit/execute tools. It is instructed not to change protected workflows, policy or evidence.

**Evidence plane:** test output, specialist verdicts, scan results, review metadata and artifact identity. Every item must identify the exact head SHA and policy version. Do not mix results from a previous commit into the current release decision.

**Authority plane:** repository rulesets, authorized reviewer identities, protected environments and deployment identities. These are service-enforced controls, not text in a JSON report. Production requires separation from untrusted PR code and from accounts capable of changing the evidence.

## State transitions

| State | Entry requirement | Exit / failure |
|---|---|---|
| Intake | Owner and approved acceptance criteria | Ambiguous scope -> needs-human |
| Plan | Relevant context and change-risk classification | Policy-sensitive change -> elevated review |
| Implement | Accepted specification and scoped branch | Out-of-scope change -> stop |
| Review | Immutable head SHA and reviewer set | Missing/stale report -> fail closed |
| Repair | Reproducible finding and bounded scope | New commit invalidates previous evidence |
| Human decision | Fresh checks and review evidence | Disagreement -> owner adjudication |
| Deploy | Approved artifact and environment authorization | Smoke failure -> stop promotion / rollback |
| Observe | Versioned telemetry and accountable on-call | Error budget breach -> incident process |

The reference budget is three concurrent specialist sessions, two repair attempts and a 30-minute review window. These are policy recommendations, not enforced timers in this lab. Set real scheduler quotas and cost controls before automated execution. A timeout is a missing result, never a pass.

## Risk routing: 5 / 8 / 11

`lab/policy.mjs` is the executable source for this workshop:

| Risk | Selection | Required reviewers |
|---|---|---|
| Low | Only `docs/`, `presentations/`, README or LICENSE | specification, unit-test, security, documentation, release |
| Medium | Ordinary source or an unknown path | Low set + integration-test, dependencies, accessibility |
| High | `.github/`, `lab/`, `config/`, `scripts/`, or auth/payments/migrations/infra paths | Medium set + architecture, data, observability |

Five/eight/eleven is our teaching allocation, not a claim about the company's private routing algorithm. The seventeen-role library includes discovery, implementation and operations roles that do not all review every PR.

A docs-only reviewer may mark a specific check not applicable with reasoning, but still must return a verdict. Do not silently drop mandatory reviewers. For production, extend path routing with data sensitivity, customer reach, backward compatibility, deployment scope and a human-controlled risk escalation. Never let a label supplied by the author reduce computed risk.

## Reviewer independence is multidimensional

Different prompts in one conversation are not independent review. Separate task contexts reduce anchoring but may share model blind spots. Separate run identities and tool scopes improve auditability. Distinct test mechanisms, owners and data sources improve diversity. None alone proves correctness.

For a real parallel review, freeze a common head SHA and give each reviewer the specification and diff without the other reviewers' verdicts. Collect results before reconciliation. One coordinator summarizes disagreements only after independent evidence exists.

## Conflict and repair rules

If security finds a high-severity issue and unit tests pass, security still blocks. If a specialist cannot access necessary evidence, return needs-human. Do not use majority voting to resolve contradictory requirements or downgrade a finding.

Allow a repairer to update only the work branch. Once it commits, recompute changed paths and risk, obtain the new head SHA, and rerun required checks. Optimizing to only impacted reviewers can come later, after a defensible invalidation model; full re-review is the simpler reference behavior.

## Two deployments, not one

The guide publishes as static HTML on Pages. It cannot run Node.js handlers or store inventory. The sample API runs locally or in a container on an explicitly selected runtime. A production enterprise deployment would also require identity, durable data, rate limits, secure ingress, telemetry, rollback and governance.

Continue with [agent contracts](03-agent-contracts.md).
