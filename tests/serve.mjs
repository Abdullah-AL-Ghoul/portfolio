/*
 * Tiny static server for local E2E runs (no dependencies).
 * Start:  node tests/serve.mjs [port]   (default 8931)
 * Then:   BASE_URL=http://localhost:8931 node tests/e2e-public.mjs
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const port = Number(process.argv[2]) || 8931;
const mime = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.pdf': 'application/pdf',
  '.webmanifest': 'application/webmanifest', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.txt': 'text/plain', '.xml': 'application/xml',
};

http
  .createServer((req, res) => {
    let u = decodeURIComponent((req.url || '/').split('?')[0]);
    if (u.endsWith('/')) u += 'index.html';
    const f = path.join(root, u);
    if (!f.startsWith(root)) {
      res.writeHead(403);
      return res.end();
    }
    fs.readFile(f, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('not found');
      } else {
        res.writeHead(200, { 'Content-Type': mime[path.extname(f).toLowerCase()] || 'application/octet-stream' });
        res.end(data);
      }
    });
  })
  .listen(port, () => console.log(`serving ${root} at http://localhost:${port}`));
