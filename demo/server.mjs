import http from 'node:http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const stock = Object.freeze({ '501': 12, '511': 0, '721': 5 });

export function availability(sku, quantity) {
  if (!Object.hasOwn(stock, sku)) return { status: 404, body: { error: 'unknown_sku' } };
  if (typeof quantity !== 'string' || !/^[1-9]\d*$/.test(quantity) ||
      !Number.isSafeInteger(Number(quantity)) || Number(quantity) > 100) {
    return { status: 400, body: { error: 'quantity_must_be_integer_1_to_100' } };
  }
  return {
    status: 200,
    body: { sku, requested: Number(quantity), available: stock[sku], fulfillable: Number(quantity) <= stock[sku] }
  };
}

export function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const send = (status, body) => { res.writeHead(status); res.end(JSON.stringify(body)); };
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return send(405, { error: 'method_not_allowed' });
    }
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/health') return send(200, { status: 'ok', demo: true });
    if (url.pathname !== '/api/availability') return send(404, { error: 'not_found' });
    if (url.searchParams.getAll('sku').length !== 1 || url.searchParams.getAll('quantity').length !== 1 ||
        [...url.searchParams.keys()].some(key => !['sku', 'quantity'].includes(key))) {
      return send(400, { error: 'provide_exactly_one_sku_and_quantity' });
    }
    const result = availability(url.searchParams.get('sku'), url.searchParams.get('quantity'));
    return send(result.status, result.body);
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be 1..65535.');
  const server = createServer();
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, process.env.HOST ?? '127.0.0.1', () =>
    console.log(`Demo API listening on ${process.env.HOST ?? '127.0.0.1'}:${port}`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
}
