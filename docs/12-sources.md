# 12 / Sources, attribution and change notes

## Evidence method

Prepared 10 November 2026. We retrieved metadata and the publisher's description for the exact YouTube URL supplied by the requester. The title, author (GitHub), description and chapter offsets were verified from that page's player metadata. A secondary article was cross-checked. A complete transcript and the talk's slide images were not used to substantiate additional claims.

All prose, code, diagrams, role definitions, risk rules and slides in this repository are original reference material. No internal Levi Strauss implementation, exact agent roster, private outcomes or endorsement is asserted.

## Source register

| ID | Source | Used for / limitation |
|---|---|---|
| S1 | [GitHub: 17 agents, one SDLC](https://www.youtube.com/watch?v=-GpxKKgoWWg) | Primary title/description: 17 specialists, lifecycle scope, 5–11 PR reviewers, MCP systems and human gates |
| S2 | [Tech Hub session summary](https://tech.hub.ms/all/videos/17-agents-one-sdlc-how-levi-strauss-reimagined-development-on-github) | Secondary corroboration and chapter context; not independent production validation |
| S3 | [GitHub custom-agent configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration) | Frontmatter, tools, automatic invocation control and cloud/IDE differences |
| S4 | [Creating custom agents](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/create-custom-agents) | `.github/agents/*.agent.md`, default-branch installation and selection |
| S5 | [Repository MCP configuration](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/configure-mcp-servers) | Server schema, allowlists, secret substitution and cloud auth limitations |
| S6 | [Custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) | Artifact build/deploy linkage, Pages permissions and environment |
| S7 | [Pages REST API](https://docs.github.com/en/rest/pages/pages) | Enable/inspect Pages and returned site URL |
| S8 | [GitHub deployment environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments) | Environment protection context; availability varies by plan |

Platform features can change. Recheck official documentation and your organization's supported configuration before using these instructions in production.

## Primary-video chapter guide

| Offset | Link / topic |
|---|---|
| 00:00 | [Introduction](https://www.youtube.com/watch?v=-GpxKKgoWWg&t=0s) |
| 01:14 | [Back pocket app lifecycle](https://www.youtube.com/watch?v=-GpxKKgoWWg&t=74s) |
| 02:59 | [Success and objectives](https://www.youtube.com/watch?v=-GpxKKgoWWg&t=179s) |
| 04:22 | [Rewiring the process](https://www.youtube.com/watch?v=-GpxKKgoWWg&t=262s) |
| 09:46 | [Enterprise multi-agent architecture](https://www.youtube.com/watch?v=-GpxKKgoWWg&t=586s) |
| 16:44 | [Standards and quality gates](https://www.youtube.com/watch?v=-GpxKKgoWWg&t=1004s) |
| 19:47 | [Marketplace and reuse](https://www.youtube.com/watch?v=-GpxKKgoWWg&t=1187s) |
| 20:32 | [Adoption](https://www.youtube.com/watch?v=-GpxKKgoWWg&t=1232s) |
| 24:56 | [Impact and lessons](https://www.youtube.com/watch?v=-GpxKKgoWWg&t=1496s) |
| 29:11 | [Outlook](https://www.youtube.com/watch?v=-GpxKKgoWWg&t=1751s) |

These offsets come from the publisher's chapter listing. They are navigation aids, not proof that our reference implementation duplicates every detail discussed at those times.

## Claim ledger

**Attributed to the published source description:** seventeen specialist agents; requirements/spec/testing/security/accessibility/deployment; MCP connections to Jira/Confluence/New Relic; five to eleven reviewers; automated fix commits; human gates.

**Our reference design:** named seventeen-role roster; low/medium/high path rules; exact five/eight/eleven allocation; three-plane architecture; 3-concurrent/2-repair/30-minute budgets; JSON report format; stock fixture; conservative tools; manual invocation; Pages/site implementation.

**Not claimed:** exact private architecture, production credentials or policies, transcript-level verification, measured productivity uplift, ROI, defect-reduction percentage, deployed enterprise scheduler, configured MCP services or enterprise-grade evidence authentication.

## Change notes

Version 1.0: original story-first twelve-chapter guide, generated custom-agent library, deterministic evidence lab, read-only sample API, actual-source walkthrough, live animated diagram, real browser captures with provenance, companion presentation and Pages publishing.

When updating platform instructions, amend this register and the relevant chapter. When changing role behavior, update the registry, regenerate profiles and rerun evaluations. Preserve this distinction between sourced fact and teaching design.

Return to [orientation](01-orientation.md).
