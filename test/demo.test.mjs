import test from 'node:test';
import assert from 'node:assert/strict';
import { availability, createServer } from '../demo/server.mjs';

test('stock fixture supports available and unfulfillable requests', () => {
  assert.equal(availability('501', '2').body.fulfillable, true);
  assert.equal(availability('511', '1').body.fulfillable, false);
  assert.equal(availability('721', '6').body.fulfillable, false);
});
test('quantity boundary 1 and maximum 100 are accepted', () => {
  for (const q of ['1', '100']) assert.equal(availability('501', q).status, 200);
});
test('rejects malformed, fractional, coercible and excessive quantities', () => {
  for (const q of ['0', '-1', '1.5', '01', '1e1', ' 2', '2 ', '101', '', 'NaN', 'Infinity', '9007199254740993', null, 2]) {
    assert.equal(availability('501', q).status, 400, `quantity ${q}`);
  }
});
test('unknown and prototype keys are not stock items', () => {
  for (const sku of ['no-such-sku', '__proto__', 'constructor']) assert.equal(availability(sku, '1').status, 404);
});
test('real HTTP contracts including health, methods and query ambiguity', async t => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const [url, method, status] of [
    ['/health', 'GET', 200], ['/api/availability?sku=501&quantity=2', 'GET', 200],
    ['/api/availability?sku=511&quantity=1', 'GET', 200],
    ['/api/availability?sku=unknown&quantity=1', 'GET', 404],
    ['/api/availability?sku=501&quantity=0', 'GET', 400],
    ['/api/availability?sku=501&quantity=1&quantity=2', 'GET', 400],
    ['/api/availability?sku=501&sku=511&quantity=1', 'GET', 400],
    ['/api/availability?sku=501', 'GET', 400],
    ['/api/availability?sku=501&quantity=1&admin=true', 'GET', 400],
    ['/missing', 'GET', 404], ['/api/availability', 'POST', 405]
  ]) {
    const response = await fetch(base + url, { method });
    assert.equal(response.status, status, url);
    assert.match(response.headers.get('content-type'), /application\/json/);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    if (status === 405) assert.equal(response.headers.get('allow'), 'GET');
    await response.json();
  }
});
