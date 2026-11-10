import { test, expect } from '@playwright/test';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { root } from '../scripts/generate-agents.mjs';

const output = async page => JSON.parse(await page.locator('#lab-output').textContent());

test('story-first overview and all published internal links resolve', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Start with the story/ })).toBeVisible();
  const links = await page.locator('a[href]').evaluateAll(nodes =>
    [...new Set(nodes.map(n => n.getAttribute('href')).filter(href => !/^(?:https?:|#)/.test(href)))]);
  for (const link of links) expect((await request.get('/' + link.split('#')[0])).ok(), link).toBeTruthy();
  const code = await request.get('/code.html');
  expect(await code.text()).toContain('export function validateEvidence');
});

test('actual engine drives exact routes, failures and closed authority', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/workshop.html');
  for (const [scenario, count] of [['docs', 5], ['api', 8], ['policy', 11]]) {
    await page.selectOption('#scenario', scenario);
    await expect(page.locator('.reviewer')).toHaveCount(count);
    const result = await output(page);
    expect(result.plan.reviewers).toHaveLength(count);
    expect(result.aiAgentsExecuted).toBe(0);
    expect(result.releaseAuthorized).toBe(false);
  }
  for (const failure of ['stale', 'missing', 'duplicate', 'finding', 'unavailable']) {
    await page.selectOption('#failure', failure);
    await page.click('#run-result');
    await expect(page.locator('#verdict')).toHaveAttribute('data-verdict', 'blocked');
    expect((await output(page)).validation.ok).toBe(false);
  }
  await page.selectOption('#failure', 'none');
  await page.click('#run-result');
  await expect(page.locator('#verdict')).toContainText('NOT RELEASE APPROVAL');
  await page.check('#production');
  await page.click('#run-result');
  await expect(page.locator('#verdict')).toHaveAttribute('data-verdict', 'blocked');
  expect((await output(page)).validation.errors.join(' ')).toContain('synthetic evidence rejected');
  expect(errors).toEqual([]);
});

test('animation steps, pauses, resets and respects reduced motion CSS', async ({ page }) => {
  await page.goto('/workshop.html');
  await page.click('#step');
  await expect(page.locator('#stage-title')).toContainText('2 /');
  await page.click('#play');
  await expect(page.locator('#stage-title')).toContainText('3 /', { timeout: 5000 });
  await page.click('#play');
  await expect(page.locator('#play')).toHaveText('Play journey');
  await page.click('#reset');
  await expect(page.locator('#stage-title')).toContainText('1 /');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
  await expect(page.locator('.flow-edge.is-active')).toHaveCSS('animation-name', 'none');
});

test('mobile layout, semantic diagram and chapter filtering', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/workshop.html');
  await expect(page.getByRole('img', { name: 'Executable evidence-lab flow' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.fill('#chapter-search', 'MCP');
  await expect(page.locator('[data-chapter]:visible')).toHaveCount(1);
});

test('capture unedited screenshots of actual running implementation', async ({ page, request, browser }) => {
  test.skip(process.env.CAPTURE !== '1', 'Run npm run capture to regenerate tracked screenshots.');
  const directory = path.join(root, 'site', 'screenshots');
  await mkdir(directory, { recursive: true });
  const captured = [];
  async function capture(name, selector, description, kind = 'screenshot') {
    const file = path.join(directory, name);
    await page.locator(selector).screenshot({ path: file, animations: 'disabled' });
    captured.push({ file: name, kind, description, url: page.url(), viewport: page.viewportSize(),
      sha256: createHash('sha256').update(await readFile(file)).digest('hex') });
  }
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Start with the story/ })).toBeVisible();
  await capture('story-overview.png', '#story-first', 'Actual story-first overview in the running reference site.');
  await page.goto('/workshop.html');
  await page.selectOption('#scenario', 'policy');
  await page.click('#run-result');
  expect((await output(page)).plan.reviewers).toHaveLength(11);
  await capture('workshop-pass.png', '#diagram-capture', 'Actual high-risk route: synthetic lab structure pass; authority remains closed.');
  await page.selectOption('#failure', 'stale');
  await page.click('#run-result');
  expect((await output(page)).validation.ok).toBe(false);
  await capture('workshop-blocked.png', '#diagram-capture', 'Actual validator rejects reports after the expected head SHA changes.');
  await page.selectOption('#failure', 'none');
  for (let stage = 0; stage < 6; stage++) {
    await expect(page.locator('#stage-title')).toContainText(`${stage + 1} /`);
    await capture(`journey-${stage}.png`, '#diagram-capture',
      `Actual browser-rendered animation stage ${stage + 1} of 6.`, 'animation-frame');
    if (stage < 5) await page.click('#step');
  }
  await page.goto('/code.html');
  await capture('real-code.png', '#policy-code-capture', 'Actual policy source loaded from lab/policy.mjs at site build time.');
  const buildInfo = await (await request.get('/build-info.json')).json();
  await writeFile(path.join(directory, 'provenance.json'), JSON.stringify({
    capturedAt: new Date().toISOString(),
    tool: `Playwright 1.56.1 / Chromium (${process.env.PLAYWRIGHT_CHANNEL || 'bundled'} channel, ${browser.version()})`,
    edited: false, buildInfo, captures: captured
  }, null, 2));
});
