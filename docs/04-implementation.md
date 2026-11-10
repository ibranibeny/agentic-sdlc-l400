# 04 / Repository implementation

## Establish a clean baseline

```powershell
gh repo clone ibranibeny/agentic-sdlc-l400
Set-Location agentic-sdlc-l400
node --version
gh auth status
npm ci
npm test
npm run check
npm run build
npm run verify:deck
```

Expect 17 generated profiles, twelve rendered chapters and a copied PPTX. The Python check uses the standard library only. You do not need a Copilot license, MCP servers or a cloud subscription to run deterministic labs.

`npm ci` installs the committed lockfile exactly. Do not substitute `npm install` in CI to repair dependency drift silently. Review manifest and lockfile updates together.

## Layout

```text
.github/agents/             generated, opt-in custom-agent profiles
.github/workflows/          CI, review-plan and Pages deployment
config/agents.json         canonical role registry
demo/server.mjs            read-only retail availability API
lab/policy.mjs             risk router and evidence validator
lab/cli.mjs                deterministic lab CLI
test/                      policy, API and CLI tests
docs/                      twelve original guide chapters
site/                      responsive static-site CSS and JS
scripts/                   profile generator, site build and checks
presentations/             downloadable PowerPoint
Dockerfile                 optional sample API container
```

## Domain contract

`GET /api/availability?sku=501&quantity=2` returns HTTP 200 and a JSON object with `sku`, `requested`, `available` and `fulfillable`. Supported synthetic stock is 501:12, 511:0 and 721:5. A quantity is a decimal string representing an integer from 1 through 100.

The API rejects missing/duplicate query fields and unexpected parameter names. It rejects fractions, negatives, leading zeros, scientific notation, whitespace and quantities greater than 100. Unknown SKUs return 404. Non-GET methods return 405 with `Allow: GET`; unknown routes return 404.

Unknown SKU takes precedence over quantity validation once the two query keys are structurally valid. That choice is explicit so tests and documentation agree. This demo is read-only: an availability check does not reserve stock, guarantee fulfillment or implement concurrent inventory accounting.

## Why these edge cases matter

JavaScript coercion can make `" 2"`, `"2e1"` and empty strings appear numeric. Checking a strict lexical grammar before conversion makes the contract intentional. `Object.hasOwn` avoids treating inherited property names as stock keys. Rejecting duplicate query keys prevents disagreement between components that read the first versus last value.

Production needs more: SKU normalization policy, request limits, authentication where required, abuse controls, durable inventory consistency, input-size limits at ingress and structured logs. Keep those as explicit requirements instead of implying a small demo already supplies them.

## Policy and CLI

```powershell
npm run lab -- route docs/07-deployment.md
npm run lab -- route demo/server.mjs
npm run lab -- route .github/workflows/ci.yml
```

Expect low/5, medium/8 and high/11 respectively. CLI paths are data arguments, not shell fragments. Windows backslashes normalize to repository-relative slashes. Empty lists, absolute paths and `..` traversal are rejected.

Risk is a recommendation from paths. In a real system classify against a trusted policy version; do not allow a PR that edits policy to use the edited policy to approve itself. The supplied review-plan workflow uses `main` for policy execution while computing the PR's changed paths separately.

## Tests and build

`node --test` exercises pure domain logic, actual HTTP requests on an ephemeral loopback port, CLI failures, exact routing counts, stale evidence, reviewer duplication, malformed reports and synthetic rejection.

`npm run check` checks role identity, generated profile consistency and relative Markdown links. `npm run build` renders Markdown with raw HTML disabled, produces navigation and copies the deck. No runtime Node.js process is required on Pages.

The site uses only local CSS/JS and system fonts. No analytics, external font requests or video embeds are needed. Source links open the original publisher's pages only when a reader follows them.

## Build the animated diagram from the actual engine

Open the [live workshop](https://ibranibeny.github.io/agentic-sdlc-l400/workshop.html) and [source walkthrough](https://ibranibeny.github.io/agentic-sdlc-l400/code.html). Every code listing on that page is read from the repository at build time and carries a SHA-256 fingerprint. It is not a manually simplified version that can drift from the implementation.

Build the experience in this order:

| Step | File | What to inspect / implement |
|---|---|---|
| 1. Define policy | `lab/policy.mjs` | `route`, `reviewersFor`, `simulate`, `validateEvidence` |
| 2. Define controlled scenarios | `lab/scenario.mjs` | Calls the policy; mutates stale/missing/duplicate/high-finding fixtures |
| 3. Draw semantic stages | `site/workshop.html` | Accessible SVG nodes and edges, controls, status and JSON output |
| 4. Bind data to animation | `site/workshop.js` | `computeScenario` import, stage index, play/pause/step and live verdict |
| 5. Share the real modules | `scripts/build-site.mjs` | Copies unchanged engine/scenario files into `assets/lab/` |
| 6. Prove behavior in a browser | `browser-tests/workshop.spec.mjs` | Asserts actual reviewer counts, failures and closed authority |

The UI never draws a hardcoded success independent of the validator. All scenario reports are labelled synthetic; `aiAgentsExecuted` is zero and `releaseAuthorized` remains false. Highlighted SVG nodes show the current learning stage, not a claim that enterprise agents are executing.

The page has play, pause, step, reset and run-to-result controls. Moving-edge animation is disabled under reduced-motion preferences. The static guide and complete code listings remain readable without JavaScript; the executable diagram requires it.

## Reproduce the real screenshots and animation

Browser tooling is a development dependency, separate from the application. After the initial build:

```powershell
npx playwright install chromium
npm run browser:test
npm run capture
npm run build
npm run preview
```

Open `http://127.0.0.1:4173/workshop.html`. The capture command starts a temporary local server through Playwright, visits the actual built pages, changes the controls, asserts the results and saves unedited screenshots in `site/screenshots/`. It does not replace the page with a design mockup.

If browser downloads are restricted but Google Chrome is installed, set `$env:PLAYWRIGHT_CHANNEL = 'chrome'` before the browser/capture commands. Playwright launches an isolated browser context, not your personal profile. Remove the override with `Remove-Item Env:PLAYWRIGHT_CHANNEL` afterward. The capture manifest records the actual browser channel and version.

`provenance.json` records capture time, browser tool, URL, viewport, screenshot hashes and the built files' fingerprints. The screenshot gallery explicitly identifies these as our running reference implementation. The publisher's private UI is neither recreated nor implied.

To create the optional GIF used in the presentation, capture the six real stage frames, then use an isolated Python environment:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-artifacts.txt
.\.venv\Scripts\python.exe scripts\make-animation.py
npm run build
```

The image sequence is a recording of browser-rendered states, not an AI-generated diagram. PowerPoint shows GIF motion in Slide Show mode; the Pages diagram is fully interactive.

The supplied CI pins Ubuntu 24.04, installs Chromium and runs browser behavior checks. This avoids an unreviewed runner upgrade to an operating system unsupported by the pinned Playwright release. It does not regenerate tracked screenshots on every push. Capture deliberately after a relevant visual/code change and commit the new images and provenance together.

## Install profiles in another application repository

Copy `.github/agents/`, the role contract and necessary project instructions into the target repository through a PR. If you also copy the generator, copy its registry. Adapt references to the target code and tests. Do not blindly copy this lab's path rules into a different monorepo.

Merge to the target default branch, confirm Copilot is enabled by organizational policy, select a profile and inspect its effective tools. Run one bounded requirement or documentation task before enabling edit-capable implementation work.

Continue with [MCP integration](05-mcp.md).
