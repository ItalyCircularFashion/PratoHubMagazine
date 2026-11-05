import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const artifacts = path.join(root, 'test-results');
await mkdir(artifacts, { recursive: true });
const mount = '/PratoHubMagazine/';
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.xml':'application/xml; charset=utf-8', '.txt':'text/plain; charset=utf-8' };
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (!pathname.startsWith(mount)) { res.writeHead(404).end(); return; }
    let file = path.resolve(dist, pathname.slice(mount.length));
    if (file !== dist && !file.startsWith(dist + path.sep)) { res.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store' });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch { res.writeHead(404).end('Not found'); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = process.env.SITE_BASE || `http://127.0.0.1:${server.address().port}${mount}`;
console.log('BROWSER TEST TARGET:', base);
try {
  for (const [file, name] of [['magazine-interactions.mjs','interactions'], ['distretto.cjs','distretto'], ['magazine-smoke.mjs','smoke']]) {
    const out = path.join(artifacts, name);
    await mkdir(out, { recursive: true });
    const code = await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [path.join(root, 'tests', file)], {
        cwd: root, stdio: 'inherit',
        env: { ...process.env, SITE_BASE: base, DISTRETTO_BASE: base + 'distretto/', TEST_ARTIFACTS: out }
      });
      child.once('error', reject);
      child.once('exit', code => resolve(code ?? 1));
    });
    if (code !== 0) throw new Error(`${name}: exit ${code}`);
  }
  console.log('BROWSER TESTS PASS: Magazine, Distretto e responsive sul sito integrato.');
} finally {
  await new Promise(resolve => server.close(resolve));
}
