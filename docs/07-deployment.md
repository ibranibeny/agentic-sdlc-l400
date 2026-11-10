# 07 / Deploy the guide, install agents, run the API

## Choose the deployment unit

| Unit | Target | What you obtain |
|---|---|---|
| Guide and deck | GitHub Pages | Public static learning site and PPTX download |
| Agent profiles | Your repository default branch | Selectable specialist configurations |
| Retail API | Local Node.js or local container | Running dynamic demo, separate from Pages |
| Enterprise multi-agent platform | Your approved execution and identity systems | Not supplied or automatically provisioned by this guide |

## A. Publish the guide in a new public repository

The maintained deployment is [the live guide](https://ibranibeny.github.io/agentic-sdlc-l400/). For your own independent workshop, fork or copy this repository. Public visibility is intentional because GitHub Free supports Pages for public repositories; never copy private content into it.

The following creates a separate copy rather than pushing changes into the source repository:

```powershell
gh repo clone ibranibeny/agentic-sdlc-l400 my-agentic-sdlc
Set-Location my-agentic-sdlc
$owner = gh api user --jq .login
$repo = 'my-agentic-sdlc-l400'
git remote rename origin upstream
gh repo create "$owner/$repo" --public --source . --remote origin --push
```

If that repository name already exists, choose another name; do not overwrite it. Review README links to point to your new repository and Pages URL. The generated site's internal links and deck download are relative and do not require a fixed base path.

Enable the Pages workflow source:

```powershell
gh api --method POST "repos/$owner/$repo/pages" -f build_type=workflow
gh workflow run pages.yml --repo "$owner/$repo" --ref main
gh run list --repo "$owner/$repo" --workflow pages.yml --limit 5
```

If Pages already exists, inspect it first with `gh api "repos/$owner/$repo/pages"`; use the documented PUT endpoint to change `build_type` rather than retrying create blindly. In the UI choose **Settings > Pages > Build and deployment > Source: GitHub Actions**.

The workflow runs tests, consistency checks, builds the site, validates the PPTX, uploads `dist` and deploys through the `github-pages` environment. Only the deploy job has `pages: write` and `id-token: write`; build has `contents: read`.

Find the actual URL and inspect a run:

```powershell
gh api "repos/$owner/$repo/pages" --jq .html_url
# Replace RUN_ID with the numeric ID returned by gh run list.
gh run view RUN_ID --repo "$owner/$repo" --log-failed
```

Do not infer success from a workflow being queued. Wait for a successful deploy job and check the returned URL:

```powershell
$url = gh api "repos/$owner/$repo/pages" --jq .html_url
(Invoke-WebRequest $url).StatusCode
(Invoke-WebRequest ($url + '07-deployment.html')).StatusCode
Invoke-WebRequest ($url + 'downloads/agentic-sdlc-l400.pptx') -OutFile downloaded-guide.pptx
```

Expect HTTP 200. Open the PPTX in PowerPoint or another compatible reader. The included package check is helpful but does not replace visual inspection.

## B. Install and use the seventeen profiles

The profiles are already committed in this repository. For another project, copy the profile directory and adapt the contracts, file paths and acceptance criteria through a reviewed PR. Verify organizational Copilot policy and entitlement. Merge to the default branch.

On GitHub's agents page, select your repository, open the custom-agent picker and choose a specialist. For the CLI or IDE, use that client's documented agent selection and verify its supported tools. Missing profiles often mean the wrong repository/branch or an organizational restriction.

Start with requirements/specification. Then one implementation task on a work branch. Collect read-only review evidence from separate contexts at the same SHA. This is a staged operating procedure, **not an included fan-out scheduler**. CI does not consume Copilot premium requests.

## C. Run the demo API with Node.js

```powershell
npm start
```

By default the listener is `127.0.0.1:3000`. To use another local port:

```powershell
$env:PORT = '3100'
npm start
```

In another terminal:

```powershell
Invoke-RestMethod http://127.0.0.1:3100/health
Invoke-RestMethod 'http://127.0.0.1:3100/api/availability?sku=501&quantity=2'
```

Expect health status ok and fulfillable true. Use Ctrl+C to stop the server. Remove an overridden environment variable with `Remove-Item Env:PORT` if needed.

On Linux/macOS, clone paths use that shell's syntax and start with `PORT=3100 npm start`; query with `curl -fsS 'http://127.0.0.1:3100/health'`. The application is the same; do not paste PowerShell variable assignments into Bash.

## D. Optional local container

Requires a running Docker engine. The image contains only the API and runs as the non-root node user. The base image tag is suitable for the lab; pin a reviewed digest and scan the final image in production.

```powershell
docker build -t agentic-sdlc-demo:local .
docker run --rm --name agentic-sdlc-demo -p 127.0.0.1:3000:3000 agentic-sdlc-demo:local
```

Check health from another terminal, then stop only this named lab container:

```powershell
Invoke-RestMethod http://127.0.0.1:3000/health
docker inspect --format '{{.State.Health.Status}}' agentic-sdlc-demo
docker stop agentic-sdlc-demo
```

The container listens on `0.0.0.0` internally, while the port mapping limits host exposure to loopback. A static Pages site cannot execute this container.

## E. Enterprise promotion checklist

Before deploying an actual service, choose a runtime and approved infrastructure separately. Define identity, TLS, durable data, ingress limits, egress restrictions, image provenance, artifact immutability, SLOs and rollback. Use short-lived federated identities where supported; never give an agent a broad permanent deployment token.

Configure required checks, independent human reviews and a protected environment in the target repository. Where your GitHub plan supports it, require deployment reviewers and prevent self-review; verify availability rather than assuming Free/public settings provide every enterprise control.

Promote the exact tested digest. Run smoke checks against the real target and halt on failed health, error-rate or latency criteria. A release recommendation from an agent does not satisfy those external gates.

## Rollback and cleanup

For Pages, revert the bad content commit through a PR and allow the same workflow to redeploy. Preserve the failed run and previous commit SHA. Avoid deleting the Pages environment as a "rollback."

For the API, stop the local process/container or redeploy a previously approved immutable image on your selected runtime. No database rollback is needed in this read-only fixture; real services require a tested migration strategy.

Delete only your disposable lab branch, synthetic evidence files and explicitly identified lab resources. Revoke test MCP credentials when an integration exercise ends. Do not delete the source repository or shared environments.

Continue with [governance](08-governance.md).
