# Agentic SDLC: L400 field guide

**17 specialists. Evidence before promotion. Humans retain release authority.**

An original advanced workshop inspired by GitHub's [17 agents, one SDLC: How Levi Strauss reimagined development on GitHub](https://www.youtube.com/watch?v=-GpxKKgoWWg), presented by Jenny Patchen at GitHub Universe 2026.

**[Read the published guide](https://ibranibeny.github.io/agentic-sdlc-l400/)** | **[Download the PowerPoint](https://ibranibeny.github.io/agentic-sdlc-l400/downloads/agentic-sdlc-l400.pptx)** | [Source and attribution](docs/12-sources.md)

**Workshop sequence:** the story → overview and architecture → build from actual code → animated evidence lab → deployment → operations and assessment.

**[Run the animated diagram](https://ibranibeny.github.io/agentic-sdlc-l400/workshop.html)** | **[Inspect the actual code](https://ibranibeny.github.io/agentic-sdlc-l400/code.html)**

This is not Levi Strauss's internal source code, exact agent roster, a GitHub product, or an endorsed implementation. The talk's published description verifies the high-level pattern. The agent names, risk policy, lab, diagrams and operating model here are our reference design. No performance gains or production readiness are claimed.

## What is included

| Deliverable | Location |
|---|---|
| Twelve-part L400 guide, facilitator path and assessment | `docs/` |
| Seventeen opt-in GitHub Copilot custom-agent profiles | `.github/agents/` |
| Source-controlled role registry and reproducible generator | `config/agents.json`, `scripts/generate-agents.mjs` |
| Risk router and fail-closed evidence-validation lab | `lab/` |
| Small retail availability API and container definition | `demo/`, `Dockerfile` |
| Read-only PR review-plan workflow (no AI execution) | `.github/workflows/review-plan.yml` |
| CI and GitHub Pages deployment | `.github/workflows/` |
| Companion presentation with presenter notes | `presentations/agentic-sdlc-l400.pptx` |
| Live animation driven by the actual CLI policy engine | `site/workshop.*`, `lab/scenario.mjs` |
| Real browser screenshots, animation frames and provenance | `site/screenshots/`, `browser-tests/` |

## Quick start

Use Node.js 22+ (22 LTS recommended), npm, Git and GitHub CLI. Python 3.10+ is needed only for presentation package checks.

```powershell
gh repo clone ibranibeny/agentic-sdlc-l400
Set-Location agentic-sdlc-l400
npm ci
npm test
npm run check
npm run build
npm start
```

In another terminal:

```powershell
Invoke-RestMethod http://127.0.0.1:3000/health
Invoke-RestMethod 'http://127.0.0.1:3000/api/availability?sku=501&quantity=2'
```

The demo has no login, database, order placement or customer data. It binds to loopback by default. It is not a production retail system. Stop it with Ctrl+C.

## Run the evidence lab without Copilot or paid services

```powershell
$sha = git rev-parse HEAD
npm run lab -- route demo/server.mjs
npm run lab -- simulate --risk high --sha $sha --out evidence.json
npm run lab -- verify --risk high --sha $sha --file evidence.json
```

Simulation is explicitly labelled synthetic. Verification above accepts simulation **only for learning** and prints `LAB ONLY`; it never grants release authority. Add `--production` to see synthetic reports rejected. Even a structurally valid real report is not trusted proof: production needs independently authenticated, immutable evidence collection and GitHub-enforced human approvals.

## Learn and deploy

Start with [scope and prerequisites](docs/01-orientation.md), follow [the hands-on labs](docs/06-labs.md), then use [deployment](docs/07-deployment.md). For enterprise controls, read [trust and governance](docs/08-governance.md). The site build includes all chapters and the PPTX using relative URLs, so forks work under a different Pages repository path.

Agent profiles are configuration, **not an autonomous 17-agent scheduler**. CI runs deterministic checks; the review-plan workflow computes a suggested reviewer set. A human invokes Copilot specialists explicitly. MCP integrations and production release gates must be configured by your administrators; no Jira, Confluence, New Relic, cloud or Copilot credentials are bundled.

## Local site preview

```powershell
npm run build
python -m http.server 8080 --directory dist --bind 127.0.0.1
```

Open `http://127.0.0.1:8080`. Search filters chapter navigation, not the full text of every chapter. The printable chapter pages work without JavaScript.

To reproduce the actual screenshots rather than use mockups:

```powershell
npx playwright install chromium
npm run browser:test
npm run capture
npm run build
npm run preview
```

The executable workshop is at `http://127.0.0.1:4173/workshop.html`. It uses real route/validation code with explicitly synthetic review data; it does not run enterprise agents. Capture provenance identifies the actual files and browser states.

## Maintenance

Edit `config/agents.json`, then run `npm run agents`. Commit generated profiles with the registry. Run `npm test`, `npm run check`, `npm run build` and `npm run verify:deck` before publishing. See [operations](docs/09-operations.md) for rollback and incident procedures.

MIT license covers original material. Sources and third-party marks retain their owners' rights.
