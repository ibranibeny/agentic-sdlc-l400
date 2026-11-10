import { readFile, readdir, mkdir, writeFile, copyFile, rm, cp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import MarkdownIt from 'markdown-it';
import { root } from './generate-agents.mjs';

const md = new MarkdownIt({ html: false, linkify: true, typographer: false });
const out = path.join(root, 'dist');
const files = (await readdir(path.join(root, 'docs'))).filter(f => /^\d\d-.*\.md$/.test(f)).sort();
const chapters = await Promise.all(files.map(async file => {
  const text = await readFile(path.join(root, 'docs', file), 'utf8');
  return { file, text, title: text.split('\n')[0].replace(/^# /, ''), url: file.replace(/\.md$/, '.html') };
}));
const esc = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const defaultLink = md.renderer.rules.link_open ?? ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const href = token.attrGet('href');
  if (href && !/^[a-z][a-z0-9+.-]*:/i.test(href)) token.attrSet('href', href.replace(/\.md(?=#|$)/, '.html'));
  return defaultLink(tokens, idx, options, env, self);
};

function frame(title, body, current = '') {
  const index = chapters.findIndex(c => c.url === current);
  const pager = index < 0 ? '' : `<nav class="pager" aria-label="Chapter navigation">${
    index > 0 ? `<a href="${chapters[index - 1].url}">Previous chapter</a>` : '<span></span>'
  }${index + 1 < chapters.length ? `<a href="${chapters[index + 1].url}">Next chapter</a>` : '<a href="index.html">Overview</a>'}</nav>`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="An original L400 field guide to agentic SDLC: 17 specialists, evidence contracts, hands-on labs and deployment. Inspired by the Levi Strauss GitHub Universe story.">
<title>${esc(title)} | Agentic SDLC L400</title><link rel="stylesheet" href="assets/style.css"><script defer src="assets/site.js"></script>${current === 'workshop.html' ? '<script type="module" src="assets/workshop.js"></script>' : ''}</head>
<body><a class="skip" href="#main">Skip to content</a>
<header><a class="brand" href="index.html"><span class="brand-mark">17</span> AGENTIC SDLC <span class="level">L400 FIELD GUIDE</span></a>
<a class="header-download" href="downloads/agentic-sdlc-l400.pptx">Download PPTX <span aria-hidden="true">&#8599;</span></a></header>
<div class="shell"><aside aria-label="Guide chapters"><p class="eyebrow">THE IMPLEMENTATION PATH</p>
<label for="chapter-search">Find a chapter</label><input id="chapter-search" type="search" placeholder="Architecture, deploy, MCP...">
<nav aria-label="Contents"><a class="overview" href="index.html"${current ? '' : ' aria-current="page"'}>Overview</a>
<a class="experience-link" href="workshop.html"${current === 'workshop.html' ? ' aria-current="page"' : ''}>Animated executable lab &#8599;</a>
<a class="experience-link" href="code.html"${current === 'code.html' ? ' aria-current="page"' : ''}>Real source &amp; build walkthrough &#8599;</a>
${chapters.map(c => `<a data-chapter href="${c.url}"${c.url === current ? ' aria-current="page"' : ''}>${esc(c.title)}</a>`).join('\n')}</nav>
<p id="search-status" class="muted" role="status" aria-live="polite"></p>
<div class="sidebar-note">Original reference design.<br>Not the company's internal implementation.</div></aside>
<main id="main" tabindex="-1">${body}${pager}<footer>Original educational reference &middot; MIT &middot; <a href="12-sources.html">Sources &amp; claim ledger</a><br>Inspired by GitHub's Levi Strauss session. No endorsement implied. Prepared November 2026.</footer></main></div></body></html>`;
}

await rm(out, { recursive: true, force: true });
await mkdir(path.join(out, 'assets'), { recursive: true });
await mkdir(path.join(out, 'assets', 'lab'), { recursive: true });
await mkdir(path.join(out, 'downloads'), { recursive: true });
for (const name of ['style.css', 'site.js', 'workshop.js']) await copyFile(path.join(root, 'site', name), path.join(out, 'assets', name));
for (const name of ['policy.mjs', 'scenario.mjs']) await copyFile(path.join(root, 'lab', name), path.join(out, 'assets', 'lab', name));
await copyFile(path.join(root, 'presentations', 'agentic-sdlc-l400.pptx'), path.join(out, 'downloads', 'agentic-sdlc-l400.pptx'));
for (const chapter of chapters) await writeFile(path.join(out, chapter.url), frame(chapter.title, `<article>${md.render(chapter.text)}</article>`, chapter.url));

const overview = `<section id="story-first" class="hero"><p class="eyebrow">01 / START WITH THE STORY</p>
<h1>17 specialists.<br>One accountable<br><span>delivery system.</span></h1>
<h2>Start with the story: Levi Strauss &amp; Co.</h2>
<p class="lead">At GitHub Universe 2026, Jenny Patchen described a development lifecycle spanning seventeen specialized agents, connected enterprise context and human approval gates.</p>
<p>The published session description follows the back pocket app's lifecycle and a wider enterprise architecture: requirements and specifications, automated testing, security, accessibility and deployment. Five to eleven reviewers examine each PR; proposed repairs do not eliminate human oversight.</p>
<div class="hero-actions"><a class="button" href="https://www.youtube.com/watch?v=-GpxKKgoWWg">Watch the original GitHub story <span aria-hidden="true">&#8599;</span></a><a class="button secondary" href="01-orientation.html">Read the story &amp; workshop brief</a></div>
<p class="source-note">Verified against the linked video's publisher description. No internal code, exact role roster or productivity metrics are claimed. Everything we build below is an original reference implementation.</p></section>
<section class="workshop-sequence"><p class="eyebrow">02 / WORKSHOP OVERVIEW</p><h2>From the story to a system you can inspect</h2>
<ol class="sequence-list"><li><strong>Understand the pattern</strong><span>Architecture, scope and trust boundaries.</span></li><li><strong>Build the reference</strong><span>Actual code, contracts and agent profiles.</span></li><li><strong>Prove the behavior</strong><span>Animated flow, live calculations and failure injection.</span></li><li><strong>Deploy and operate</strong><span>Pages, separate API, rollback and assessment.</span></li></ol>
<div class="hero-actions"><a class="button" href="workshop.html">Open the animated workshop &#8594;</a><a class="button secondary" href="code.html">See the actual code</a><a class="button secondary" href="downloads/agentic-sdlc-l400.pptx">Download PPTX</a></div></section>
<section class="stats" aria-label="Guide at a glance"><div><strong>17</strong><span>Opt-in custom agents</span></div><div><strong>5 / 8 / 11</strong><span>Risk-routed reviewers</span></div><div><strong>12</strong><span>Implementation chapters</span></div></section>
<section><p class="eyebrow">THE TRUST MODEL</p><h2>Agents propose. Evidence informs. Humans authorize.</h2>
<div class="cards"><div><span class="card-number">01 / WORK</span><h3>Bound the change</h3><p>Acceptance criteria, scoped implementation and independent specialist review at an exact commit.</p></div>
<div><span class="card-number">02 / EVIDENCE</span><h3>Fail closed</h3><p>Reject stale, missing, duplicate and contradictory reports. A repair commit starts a fresh evidence cycle.</p></div>
<div><span class="card-number">03 / AUTHORITY</span><h3>Keep real gates</h3><p>Protected branches, trusted identities and accountable human approvals belong outside model output.</p></div></div></section>
<section class="callout"><h2>What runs &mdash; and what does not</h2><p>The repository includes a local API, deterministic evidence lab, seventeen selectable profiles, CI and a working Pages publisher. It does <strong>not</strong> include an autonomous seventeen-agent scheduler, configured enterprise MCP services or production evidence authentication.</p><a href="06-labs.html">Run the failure-injection labs &rarr;</a></section>
<section><p class="eyebrow">BUILD YOUR UNDERSTANDING</p><h2>The complete L400 path</h2><div class="chapter-grid">${chapters.map(c => `<a href="${c.url}"><span>${esc(c.title.split(' / ')[0])}</span><strong>${esc(c.title.split(' / ').slice(1).join(' / '))}</strong><b aria-hidden="true">&#8599;</b></a>`).join('')}</div></section>
<section class="split"><div><p class="eyebrow">DEPLOY WITH INTENT</p><h2>Publish the guide.<br>Run the service separately.</h2><p>GitHub Pages hosts static learning content and the deck. The sample API runs on Node.js or in a container, never inside Pages.</p><a class="button" href="07-deployment.html">Open deployment guide</a></div>
<div class="terminal"><span>LOCAL QUICK START</span><pre><code>npm ci
npm test
npm run check
npm run build
npm start</code></pre><p>Node.js 22+ &middot; synthetic data only</p></div></section>
<section><h2>Source-first, not story-shaped claims</h2><p>The primary video's published description confirms the high-level pattern. This guide makes no unsupported productivity, ROI or defect-reduction claims.</p><a href="12-sources.html">Read the source register and claim ledger &rarr;</a></section>`;
await writeFile(path.join(out, 'index.html'), frame('Overview', overview));

let gallery = '<p class="callout">No captures are present in this checkout yet. Run <code>npm run capture</code>, then rebuild. No mock screenshots are substituted.</p>';
try {
  const provenance = JSON.parse(await readFile(path.join(root, 'site', 'screenshots', 'provenance.json'), 'utf8'));
  await cp(path.join(root, 'site', 'screenshots'), path.join(out, 'images'), { recursive: true });
  gallery = `<div class="screenshot-gallery">${provenance.captures.filter(c => c.kind !== 'animation-frame').map(capture =>
    `<figure><a href="images/${esc(capture.file)}"><img src="images/${esc(capture.file)}" alt="${esc(capture.description)}" loading="lazy"></a><figcaption>${esc(capture.description)}</figcaption></figure>`
  ).join('')}</div>${provenance.animation ? '<p><a href="images/workshop-journey.gif">Open the recorded six-stage animated GIF</a> (actual browser frames; interactive controls are above).</p>' : ''}<p class="source-note">Captured ${esc(provenance.capturedAt)} with ${esc(provenance.tool)}. Unedited browser output. <a href="images/provenance.json">Capture provenance and SHA-256 fingerprints</a>.</p>`;
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  console.warn('Screenshot capture not available yet; run npm run capture after the initial build.');
}
const workshop = (await readFile(path.join(root, 'site', 'workshop.html'), 'utf8')).replace('{{SCREENSHOT_GALLERY}}', gallery);
await writeFile(path.join(out, 'workshop.html'), frame('Animated executable lab', workshop, 'workshop.html'));

const sourceFiles = [
  'lab/policy.mjs', 'lab/scenario.mjs', 'site/workshop.js', 'site/workshop.html',
  'demo/server.mjs', 'scripts/build-site.mjs', 'scripts/generate-agents.mjs',
  '.github/workflows/pages.yml', 'Dockerfile', 'browser-tests/workshop.spec.mjs'
];
const sourceEntries = await Promise.all(sourceFiles.map(async file => ({
  file, id: file.replaceAll(/[^a-z0-9]+/gi, '-').replace(/^-/, ''),
  text: await readFile(path.join(root, ...file.split('/')), 'utf8')
})));
const codeIntro = `<section><p class="eyebrow">03 / BUILD IT FROM THE ACTUAL SOURCE</p><h1>Code you can read.<br><span>Behavior you can reproduce.</span></h1>
<p class="lead">Every listing below is loaded directly from the repository at build time, not a hand-maintained pseudocode version. The browser and CLI share the same policy module.</p>
<ol class="build-steps"><li><strong>Clone and install:</strong> <code>gh repo clone ibranibeny/agentic-sdlc-l400</code>, enter the checkout, then <code>npm ci</code>.</li>
<li><strong>Inspect the engine:</strong> read <code>lab/policy.mjs</code>. Path risk, exact reviewer sets and fail-closed validation live here.</li>
<li><strong>Connect a scenario:</strong> <code>lab/scenario.mjs</code> calls the real engine and injects controlled failures.</li>
<li><strong>Render the animation:</strong> <code>site/workshop.js</code> binds controls and step state to the SVG and actual JSON output.</li>
<li><strong>Build and prove:</strong> run <code>npm test</code>, <code>npm run check</code>, <code>npm run build</code>, install Chromium, then <code>npm run browser:test</code>.</li>
<li><strong>Capture and publish:</strong> <code>npm run capture</code>, rebuild, inspect the real PNGs and provenance, then follow <a href="07-deployment.html">Pages deployment</a>.</li></ol>
<div class="callout"><strong>Professional workshop sequence:</strong> story → architecture → code → animated experiment → deployment → operations. Use <a href="01-orientation.html">chapter 01</a> for the brief and <a href="11-facilitator.html">chapter 11</a> for timing and assessment.</div></section>
<nav class="code-index" aria-label="Source files">${sourceEntries.map(s => `<a href="#${s.id}">${esc(s.file)}</a>`).join('')}</nav>`;
const sourceSections = sourceEntries.map((source, i) => {
  const first = source.text.split('\n').slice(0, 27).join('\n');
  return `<section id="${source.id}" class="source-section"><div${i === 0 ? ' id="policy-code-capture"' : ''}><p class="eyebrow">ACTUAL REPOSITORY FILE / ${i + 1} OF ${sourceEntries.length}</p><h2>${esc(source.file)}</h2>
<p class="source-note">SHA-256: <code>${createHash('sha256').update(source.text).digest('hex')}</code></p><pre class="source-preview"><code>${esc(first)}</code></pre></div>
<details><summary>Read the complete ${esc(source.file)} file</summary><pre><code>${esc(source.text)}</code></pre></details></section>`;
}).join('');
await writeFile(path.join(out, 'code.html'), frame('Actual code and build walkthrough', codeIntro + sourceSections, 'code.html'));
const fingerprintedFiles = ['index.html', 'workshop.html', 'code.html', 'assets/style.css', 'assets/workshop.js', 'assets/lab/policy.mjs', 'assets/lab/scenario.mjs'];
const fingerprints = Object.fromEntries(await Promise.all(fingerprintedFiles.map(async file => [
  file, createHash('sha256').update(await readFile(path.join(out, ...file.split('/')))).digest('hex')
])));
await writeFile(path.join(out, 'build-info.json'), JSON.stringify({
  builtAt: new Date().toISOString(), sourceRevision: process.env.GITHUB_SHA ?? 'local-build-see-file-fingerprints',
  fingerprints
}, null, 2));
await writeFile(path.join(out, '.nojekyll'), '');
console.log(`Built story-first overview, ${chapters.length} chapters, live workshop, actual code and PPTX download in dist/.`);
