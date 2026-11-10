# 10 / Troubleshooting and diagnostics

## Diagnose the boundary, not the slogan

| Symptom | Likely boundary | Diagnostic / correction |
|---|---|---|
| `npm ci` fails | Runtime or lockfile | Confirm Node 22+, npm and committed lockfile; inspect actual error |
| Profile check fails | Generated-file drift | Edit registry, run `npm run agents`, review all generated changes |
| Agent is absent | Repository, branch or policy | Merge profile to default branch; confirm selected repo and entitlement |
| Agent cannot run tests | Intentional tool scope | Read-only profiles need operator-supplied runner output |
| MCP tool missing | Configuration surface / allowlist | Inspect actual tools and client support; do not use wildcard as shortcut |
| MCP auth fails | Provider and cloud auth compatibility | Verify supported server auth and Agents secret references |
| Review is green despite missing evidence | Incorrect external gate | Reject missing reports; confirm current SHA and exact reviewer set |
| Lab result called production approval | Category error | Structural JSON validation is not authentication or authorization |
| Pages 404 | Source/build/deploy/base path | Inspect Pages settings, successful run and returned site URL |
| PPTX URL gives HTML | Wrong path or failed deployment | Check content length, ZIP signature and download path |
| API 404 on Pages | Wrong runtime expectation | Pages is static; run Node/container separately |
| Port already in use | Local process collision | Use a different PORT; do not kill unrelated processes |
| Fixture JSON parse error | Encoding or edited JSON | Use UTF-8 without BOM / PowerShell 7; inspect syntax |
| Container unhealthy | Process, port or host binding | Inspect only the named lab container and its logs |

## Minimal diagnostic commands

```powershell
node --version
npm --version
git status --short
git rev-parse HEAD
npm test
npm run check
npm run build
gh run list --repo ibranibeny/agentic-sdlc-l400 --limit 5
gh api repos/ibranibeny/agentic-sdlc-l400/pages
```

For your fork, substitute its owner/repository. Do not paste secrets, environment dumps or private logs into a public issue.

## Why a profile can look correct but behave differently

Different Copilot clients support different fields and tools. Cloud does not treat IDE `handoffs` as a general scheduler. Custom-agent MCP frontmatter is not the IDE's MCP configuration. Unknown tool names can be ignored. Verify the effective capability list and a real bounded invocation.

The supplied profiles make this explicit by disabling automatic model invocation and using conservative tool aliases. Their presence does not prove seventeen paid sessions were launched or that output was independently reviewed.

## Debug a stale report

Compare the report's `sha` with `git rev-parse HEAD`. Inspect whether a repair, merge update or rebase changed the head. Re-run the required reviewers at the current SHA. Do not patch just the report's SHA field; that would falsify what was reviewed.

Likewise, a changed policy version requires fresh evaluation against that policy. Production needs stronger digest binding and authenticated collection than the teaching validator implements.

## Debug Pages permissions

Confirm Actions is allowed for the repository and organization. The deployment job needs Pages and OIDC permissions, and `github-pages` must allow the publishing branch. Check that the upload artifact and deploy job belong to the same workflow run and that `needs: build` is present.

If a repository is private, verify your plan supports the intended Pages visibility. Do not make confidential content public as a workaround. This workshop deliberately uses original public material in a new public repository.

## Debug the API without broad process cleanup

Change `PORT` or stop the foreground process you started with Ctrl+C. Inspect a specific known PID if necessary; never terminate all Node processes on a shared machine.

For Docker:

```powershell
docker logs agentic-sdlc-demo
docker inspect agentic-sdlc-demo
```

Use only the explicit container name from the lab. If another container already uses that name, inspect it and choose a different name rather than deleting it.

## Escalation bundle

Provide the failing command, sanitized error, Node/npm version, relevant SHA, selected profile, intended client and observed behavior. Include run IDs and non-sensitive artifact links. State whether the failure occurred during planning, execution, evidence validation or deployment.

Continue with [facilitation and assessment](11-facilitator.md).
