# 01 / Start with the story, then build

## The Levi Strauss story

GitHub's published description of Jenny Patchen's Universe 2026 session says Levi Strauss used seventeen specialized agents across requirements, specifications, testing, security, accessibility and deployment. It describes Jira, Confluence and New Relic connected through MCP, five to eleven independent reviewers per PR, automated fixes committed to the branch, and strict human approval gates.

That establishes the pattern, not a complete implementation specification. We verified the linked video's title, publisher and description, and cross-checked a secondary summary. We did not independently verify every spoken statement, slide, production configuration or business outcome. The exact role roster, risk rules, prompts, limits and code in this workshop are **original reference choices**. No percentage improvement, ROI, defect reduction or causal business outcome is asserted.

The provided video is approximately 30 minutes. Use the chapter links in [sources](12-sources.md) to return to the original context. This guide summarizes ideas in original language; it does not redistribute the video, transcript or slide images.

## Translate the story into a workshop

The lesson we explore is not "run seventeen prompts." It is how to connect intent, specialized work, review evidence and accountable release decisions across one lifecycle. Treat that as the reference design challenge, not an assertion that we know the company's private implementation.

Follow this deliberate sequence:

1. **Story:** understand the published case, its scope and the limits of available evidence.
2. **Overview:** map the lifecycle and distinguish work, evidence and authority.
3. **Build:** inspect actual modules, install the profiles and connect browser controls to the shared engine.
4. **Prove:** step through the animated diagram and reproduce real validation failures.
5. **Deploy:** publish Pages, verify the PowerPoint and run the API on a separate runtime.
6. **Operate:** enforce human gates, measure outcomes, practice rollback and complete the assessment.

The [live animated workshop](https://ibranibeny.github.io/agentic-sdlc-l400/workshop.html) and [actual source walkthrough](https://ibranibeny.github.io/agentic-sdlc-l400/code.html) accompany the chapters. They run our reference code; they do not simulate access to the company's internal system.

## Outcome, not agent count

Build an evidence-driven SDLC in which specialists improve delivery while trusted systems and accountable people retain authority. By the end, you can explain the source story, install 17 custom-agent profiles, classify changes into 5/8/11-reviewer plans, reproduce stale-evidence failures, publish this guide through GitHub Pages and operate a deliberately small API demo.

L400 means implementation details, tradeoffs, failure injection and operating controls. It does not mean this repository is a production platform. The runnable components are a reference lab: local API, deterministic policy, opt-in specialist prompts, tests, static publishing and review-plan generation. Production integrations and identity-verified orchestration are extension work with explicit acceptance criteria.

## Audience and prerequisites

You should already know Git branches and pull requests, GitHub Actions YAML, Node.js HTTP basics, API tests, least-privilege credentials and the difference between planning and execution.

| Requirement | Why / minimum |
|---|---|
| Node.js 22+ and npm | Application, policy lab, site generator and tests; CI uses 22 |
| Git and GitHub CLI | Clone, branch, publish and inspect Actions / Pages |
| GitHub account with repository administration | Configure Pages and optional governance |
| Python 3.10+ | Optional local site preview and PPTX integrity check |
| GitHub Copilot entitlement and permitted custom-agent surface | Only needed for real specialist sessions |
| Docker Desktop or Docker Engine | Optional container lab, not required for the guide |
| Access to approved MCP services | Optional enterprise extension; not needed for core labs |

Use synthetic retail fixtures only. A public workshop repository must not contain customer data, employee data, private issue exports, credentials, incident payloads or internal business designs.

## What actually runs

| Component | Runs now | Not implied |
|---|---|---|
| API | Read-only availability queries over three synthetic SKUs | Orders, inventory reservations, identity or a database |
| Policy router | Path-based risk selection and exact reviewer lists | Complete business-risk classification |
| Evidence lab | Shape, SHA, verdict and completeness checks | Signature verification or trusted human approval |
| Profiles | Opt-in Copilot specialist instructions | Automatic PR fan-out, guaranteed tool execution or model isolation |
| Actions | Tests, build, review-plan artifact and static publishing | LLM reviewers, repair commits or production API release |
| PPTX | Original companion slides with notes and source links | Levi Strauss's internal presentation |

## Suggested learning paths

**Engineer, 4 hours:** architecture, contracts, implementation, labs, deployment, troubleshooting. Complete the stale-SHA and production-rejection exercises.

**Platform lead, 3 hours:** architecture, MCP, governance, operations, rollout. Leave with a trust-boundary map and concrete repository-control backlog.

**Facilitator, 1 day:** complete all chapters and [assessment](11-facilitator.md). Use a separate public fork for publishing and a disposable branch for mutation exercises.

## Definition of done

Your local commands pass; all 17 profiles match their source registry; the five/eight/eleven sets are reproducible; malformed and stale evidence fails; your published Pages URL returns the guide and downloadable presentation; you can distinguish a static Pages deployment from a live API runtime; and a human can describe what controls still need enterprise implementation.

Do not declare success simply because every model said "pass." A deployment gate must be enforced outside the change author's control, and its evidence must be tied to the artifact actually being released.

Continue with [reference architecture](02-architecture.md).
