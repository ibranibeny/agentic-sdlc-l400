# 11 / Facilitation, assessment and adoption

## One-day L400 agenda

Teach in a deliberate narrative sequence: **story → overview → how to build → guided experiment → deployment → operations**. Do not start with a wall of agent configuration. Establish the case and evidence boundary, then show how the reference code produces observable behavior.

| Block | Duration | Output |
|---|---|---|
| Story, evidence limits and architecture | 45 min | Shared trust-boundary map |
| Baseline and acceptance contract | 45 min | Local passing baseline and explicit criteria |
| Roles, routing and tool scopes | 40 min | Correct 5/8/11 route explanations |
| Evidence and failure injection | 70 min | Stale, duplicate, malformed and synthetic failures |
| Lunch / break | 45 min | No work required |
| Real specialist review or manual equivalent | 45 min | Advisory artifact and limitations |
| Pages deployment and API/container separation | 50 min | Live guide, PPTX download and local health result |
| Governance tabletop and assessment | 50 min | Control backlog and individual score |

Allow extra setup time for organizational approvals. No participant should be required to expose private credentials or purchase services to complete the deterministic core.

## Presentation use

Use the companion PowerPoint to introduce each concept; use the guide for commands and detailed operating decisions. Presenter notes supply source context and discussion prompts. The slides are not a replacement for the labs.

Show the real animated diagram after the architecture overview, then inspect its shared policy source before running failure injection. Use the actual captured screenshots for offline delivery. They are labelled reference-implementation captures, not evidence of access to the company's internal platform. In PowerPoint Slide Show, the embedded recorded GIF can animate; the live Pages diagram supports participant interaction.

Keep the original video linked rather than rehosting its content. Play it from the publisher's page if you choose to show it. Distinguish the talk's published claims from our proposed implementation on every architectural discussion.

## Assessment rubric / 100 points

| Competency | Points | Full-credit evidence |
|---|---|---|
| Source fidelity | 10 | Separates verified talk description from original choices |
| Architecture | 15 | Explains work, evidence and authority planes |
| Contracts and scopes | 15 | Identifies role/tool boundaries and advisory outputs |
| Executable routing | 10 | Demonstrates exact 5/8/11 counts and high-risk precedence |
| Failure injection | 20 | Reproduces stale, missing, duplicate and synthetic failures |
| Deployment | 15 | Live Pages URL, downloaded PPTX and separate API health |
| Governance and operations | 15 | Prevents self-approval; defines rollback and telemetry |

Suggested completion threshold: 80/100 **and** no misunderstanding that synthetic/forged JSON can authorize release. This is a workshop criterion, not a vendor certification.

## Knowledge checks with answer guidance

**Why not invoke all seventeen on every PR?** Discovery, implementation and incident roles have different lifecycle responsibilities. Risk and evidence needs drive reviewer selection; more sessions also increase cost and coordination overhead.

**Is a pass from eleven prompts independent assurance?** No. Context/model correlation and weak evidence provenance can produce common-mode failure. Use independent mechanisms and human judgment.

**Can Pages deploy the availability API?** No. It serves static files. Node/container needs a runtime; the guide and API have different deployment units.

**What happens after an auto-fix commit?** Freeze the new head SHA, recompute risk and rerun required evidence. Old reports and stale human reviews cannot silently carry forward.

**Can `synthetic: false` prove a real agent ran?** No. It is author-controlled data. Use authenticated runner identities and immutable evidence.

**Can a prompt replace branch protection?** No. Actual repository rules, approvals and environment controls must enforce authority outside the model.

## Rollout plan

**Phase 1: baseline.** Choose one non-sensitive repository, define acceptance criteria, measure existing review cost/lead time and identify accountable owners.

**Phase 2: assist.** Start with requirements, documentation and read-only review. Manually invoke specialists. Evaluate against known defects and adversarial examples.

**Phase 3: controlled repair.** Permit implementation on work branches only. Cap attempts. Require deterministic tests and independent reviews at the updated SHA.

**Phase 4: trusted collection.** Build or adopt an authenticated evidence system, protected policy, immutable artifacts and verified review state. Red-team replay, tampering and privilege escalation.

**Phase 5: bounded orchestration.** Only after evidence and approval controls work, introduce selected event-driven scheduling with quotas, auditing and a clear kill switch. Deployment approval remains external.

These phases are a reference adoption strategy, not the company's exact rollout chronology.

## Production readiness exit criteria

The architecture is not ready merely because the workshop passed. Require approved data handling, real owners, least-privilege identities, supported MCP configuration, tested evaluations, trusted evidence, enforced human gates, known-good rollback, cost ceilings and an on-call process.

Record every unimplemented control as a gap with an owner and due date. "Future work" is not a control.

Continue with [sources and attribution](12-sources.md).
