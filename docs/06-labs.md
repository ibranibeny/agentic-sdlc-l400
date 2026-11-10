# 06 / Hands-on labs and failure injection

## Lab 0: baseline / 15 minutes

Clone the repository, run `npm ci`, `npm test`, `npm run check` and `npm run build`. Record Node version and full Git SHA. Use a disposable branch for exercises:

```powershell
git switch -c workshop/evidence
$sha = git rev-parse HEAD
```

**Exit:** existing tests pass, seventeen profiles exist and the site builds. Keep your evidence file outside commits; `evidence.json` is ignored.

## Lab 1: the business contract / 25 minutes

Read `demo/server.mjs` without changing it. Write five acceptance criteria in an issue: known SKU lookup, integer quantity bounds, no stock mutation, explicit failure responses and no customer data. Select the requirements or specification custom agent if Copilot is available; otherwise perform the review manually.

Use the bounded prompt from the agent-contract chapter. Capture what was inspected versus executed. Test zero stock and quantities 1, 100 and 101.

```powershell
npm start
# In a second terminal:
Invoke-RestMethod 'http://127.0.0.1:3000/api/availability?sku=511&quantity=1'
```

**Expected:** HTTP 200, available 0, fulfillable false. Availability is not a reservation. Stop the API with Ctrl+C.

**Exit:** acceptance criteria map to code and tests; any ambiguity is explicit.

## Lab 2: five, eight and eleven / 20 minutes

```powershell
npm run lab -- route docs/01-orientation.md
npm run lab -- route demo/server.mjs
npm run lab -- route .github/agents/security.agent.md
```

**Expected:** low/5, medium/8, high/11. Then supply both a docs path and a policy path; the policy path must dominate. Try an unknown path; it must not be low. Try `..\outside`; the command must fail.

**Exit:** explain why the full seventeen-role library is not the per-PR reviewer count. Propose a human-controlled escalation rule for data-sensitive changes.

## Visual checkpoint: follow the executable diagram / 15 minutes

Open the [animated workshop](https://ibranibeny.github.io/agentic-sdlc-l400/workshop.html), or build locally and run `npm run preview`. Choose documentation, API and protected-workflow changes; observe the actual five, eight and eleven reviewer calculations.

Use **Step** to follow input, routing, synthetic reports, mutation, validation and the human-authority boundary. Then use **Play journey**. Read the actual JSON output and connect it to `lab/policy.mjs` and `lab/scenario.mjs` on the source walkthrough.

Select **Repair commit: stale evidence** and run to the result. It must block. Turn on production-mode checking with otherwise clean fixtures; it must block synthetic records. The human gate must remain closed even for a clean lab-only pass.

**Exit:** identify the exact function producing the verdict and explain why animation is not evidence that AI agents executed. The PNG gallery and recorded GIF are genuine browser captures of this same reference code, not company screenshots or design mockups.

## Lab 3: complete evidence and synthetic rejection / 20 minutes

```powershell
$sha = git rev-parse HEAD
npm run lab -- simulate --risk high --sha $sha --out evidence.json
npm run lab -- verify --risk high --sha $sha --file evidence.json
npm run lab -- verify --risk high --sha $sha --file evidence.json --production
```

**Expected:** the first verification reports `LAB ONLY` and `ok: true`; production mode returns nonzero and lists synthetic evidence errors. No AI sessions ran. Do not screenshot the lab's green result as enterprise release evidence.

**Exit:** distinguish structural validity, authenticated evidence and human authorization.

## Lab 4: stale evidence after a repair / 20 minutes

```powershell
$sha = git rev-parse HEAD
npm run lab -- simulate --risk high --sha $sha --out evidence.json
$differentSha = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
npm run lab -- verify --risk high --sha $differentSha --file evidence.json
```

**Expected:** nonzero exit; stale SHA errors for every record. The synthetic different SHA models a new commit without changing your repository.

In a real repair branch, make the approved code change, run tests, commit, recalculate `git rev-parse HEAD`, recalculate risk and rerun required reviews. Reusing the old report because "only one line changed" violates the contract.

**Exit:** explain how an actual push dismisses stale approvals and invalidates evidence in your chosen platform configuration.

## Lab 5: missing, duplicate and contradictory evidence / 30 minutes

Regenerate evidence before each experiment. Use PowerShell to create an explicit malformed scenario:

```powershell
$reports = @(Get-Content evidence.json -Raw | ConvertFrom-Json)
$reports[0].verdict = 'needs-human'
ConvertTo-Json -InputObject $reports -Depth 10 | Set-Content evidence.json -Encoding utf8
npm run lab -- verify --risk high --sha $sha --file evidence.json
```

**Expected:** non-pass verdict error. On Windows PowerShell 5.1, UTF-8 output can add a BOM; use PowerShell 7 or save UTF-8 without BOM in an editor if JSON parsing fails.

Repeat with one missing reviewer, duplicate reviewer identity, a mismatched policy version and a pass report containing `{ "severity": "high", "summary": "Unsafe permission" }`. Each must fail. `npm test` includes automated versions of these cases.

**Exit:** demonstrate that a pass verdict cannot override a high finding. Do not fix the fixture by removing a genuine defect from an actual review.

## Lab 6: one real specialist session / 30 minutes, optional entitlement

Select a read-only specialist and give it the current SHA, specification and operator-run test output. Capture its real verdict, limitations and session reference. Do not use simulation output as a substitute.

Have a different person compare findings with the acceptance criteria. If the specialist requests a command, a trusted operator runs it and returns the output. Do not expand tool permissions solely for convenience.

**Exit:** one real advisory artifact, not seventeen invented passes. If Copilot is unavailable, mark this lab not executed and continue deterministic labs.

## Lab 7: publication and rollback / 40 minutes

Follow the deployment chapter in your own public repository. Verify the Pages overview, two chapter pages and PPTX download. Confirm the downloaded ZIP contains slide and speaker-note parts. Change one harmless sentence through a PR, inspect CI, merge only when authorized and observe a new deployment.

For a safe rollback drill, revert that harmless content commit through a PR; do not force-push or reset history. The previous good content should return after Pages redeploys.

**Exit:** record repository URL, deployed Pages URL, Actions run and the known-good commit.

## Stretch lab: production gap analysis / 45 minutes

Propose, without provisioning credentials, a trusted collector design. Explain how it prevents forged identities, cross-PR replay, self-approval, policy tampering and stale evidence reuse. Add expiry, policy digest and artifact digest to a design schema.

Do not implement automatic merging or production deployment until the governance acceptance criteria are met. The stretch exercise is complete when a reviewer can trace each threat to an externally enforced control.

Continue with [deployment](07-deployment.md).
