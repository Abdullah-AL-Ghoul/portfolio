/*
 * Live end-to-end check of the DEPLOYED admin dashboard + public site.
 * Run from the project root:  node tests/admin-e2e-live.mjs
 *
 * It creates a throwaway admin user, signs in to the live dashboard,
 * verifies seeded rows render, creates/edits/publishes a clearly-marked
 * test project, checks the public /api/content picks it up, then cleans up
 * the test project + user. Safe to re-run.
 *
 * Requires the secret key from .vercel/.env.production.local (obtained via
 * `vercel pull`). Never prints secrets.
 */
import { chromium } from 'playwright';
import fs from 'node:fs';

/* ---------- loads .vercel/.env.production.local into process.env ---------- */
const envFile = fs.readFileSync('.vercel/.env.production.local', 'utf8');
for (const line of envFile.split(/\r?\n/)) {
  const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)="?([^"]*)"?$/);
  if (m) process.env[m[1]] = m[2];
}
const URL = process.env.SUPABASE_URL;
const SECRET = process.env.SUPABASE_SECRET_KEY;
if (!URL || !SECRET) { console.error('Missing SUPABASE_URL/SECRET — run `vercel pull` first.'); process.exit(2); }

const ADMIN = process.env.ADMIN_URL || 'https://abdullah-dashboard-mauve.vercel.app';
const PUBLIC = process.env.PUBLIC_URL || 'https://abdullah-portfolio26.vercel.app';
const SHOTS = 'gui-test-screenshots/admin-e2e';
fs.mkdirSync(SHOTS, { recursive: true });

/* ---------- throwaway admin user ---------- */
const stamp = Date.now().toString().slice(-6);
const EMAIL = `qa-${stamp}@e2e.local`;
const PASS = 'QaE2e!pass' + stamp;

async function api(path, opts = {}) {
  const res = await fetch(URL + path, {
    ...opts,
    headers: {
      apikey: SECRET,
      Authorization: `Bearer ${SECRET}`,
      'Content-Type': 'application/json',
      ...(opts.headers || {})
    }
  });
  const text = await res.text();
  let json; try { json = text ? JSON.parse(text) : null; } catch { json = text; }
  return { status: res.status, json };
}

let userId = null;
let createdSlug = null;   // set after the project is created — used by cleanup
const results = [];
function record(id, ok, note = '') {
  results.push({ id, ok, note });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${id}${note ? ' — ' + note : ''}`);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(e.message));

try {
  /* 1 — create throwaway admin */
  const r1 = await api('/auth/v1/admin/users', {
    method: 'POST',
    body: JSON.stringify({ email: EMAIL, password: PASS, email_confirm: true })
  });
  userId = r1.json?.id;
  if (!userId) throw new Error('creating auth user failed: ' + JSON.stringify(r1.json).slice(0, 300));
  record('setup auth user', true, userId.slice(0, 8));
  const r2 = await api('/rest/v1/admin_users', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, email: EMAIL, role: 'admin' }),
    headers: { Prefer: 'return=minimal' }
  });
  record('setup admin_users row', r2.status >= 200 && r2.status < 300, `HTTP ${r2.status}`);

  /* 2 — login + overview */
  await page.goto(ADMIN + '/login', { waitUntil: 'networkidle' });
  await page.fill('#email', EMAIL);
  await page.fill('#password', PASS);
  await page.click('button[type="submit"]');
  await page.waitForFunction(() => !location.pathname.startsWith('/login'), null, { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1500);
  const on = await page.locator('.page-title').textContent().catch(() => '');
  record('login + overview', on.length > 0 && !pageErrors.some((e) => /invalid/i.test(e)), on);
  await page.screenshot({ path: `${SHOTS}/01-overview.png` });

  /* 3 — projects list shows seeded rows */
  await page.goto(ADMIN + '/projects', { waitUntil: 'networkidle' });
  await page.waitForSelector('table.data tbody tr', { timeout: 15000 });
  const nRows = await page.locator('table.data tbody tr').count();
  record('projects seeded rows visible', nRows >= 7, `${nRows} rows`);
  await page.screenshot({ path: `${SHOTS}/02-projects.png` });

  /* 4 — create a NEW project via the form */
  const slug = `qa-e2e-${stamp}`;
  createdSlug = slug;
  await page.click('button:has-text("+ New")');
  await page.waitForSelector('.dialog');
  await page.fill('#f-slug', slug);
  await page.fill('#f-title_en', 'QA E2E Project');
  await page.fill('#f-title_ar', 'مشروع اختبار');
  await page.fill('#f-summary_en', 'Temporary end-to-end verification entry — will be removed.');
  await page.fill('#f-summary_ar', 'إدخال مؤقت للتحقق الشامل — سيتم حذفه.');
  await page.fill('#f-stack', 'JavaScript, QA');
  await page.click('.dialog button:has-text("Save")');
  await page.waitForTimeout(1200);
  await page.waitForSelector(`tr:has-text("QA E2E Project")`, { timeout: 15000 });
  record('create project via + New', true, slug);
  await page.screenshot({ path: `${SHOTS}/03-created.png` });

  /* 5 — edit the project and save */
  const rowLoc = page.locator(`tr:has-text("QA E2E Project")`);
  await rowLoc.locator('button:has-text("Edit")').click();
  await page.waitForSelector('.dialog');
  await page.fill('#f-title_en', 'QA E2E Project (edited)');
  await page.click('.dialog button:has-text("Save")');
  await page.waitForSelector('tr:has-text("QA E2E Project (edited)")', { timeout: 15000 });
  record('edit project', true, 'title updated');

  /* 6 — publish → verify public site updates */
  await page.locator('tr:has-text("QA E2E Project (edited)")').locator('button:has-text("Publish")').click();
  await page.waitForTimeout(1500);
  await page.waitForSelector('tr:has-text("QA E2E Project (edited)") .badge.published', { timeout: 15000 });
  // content endpoint is edge-cached; poll up to ~25s for the new slug
  let liveSlug = null;
  for (let i = 0; i < 25; i++) {
    const raw = await fetch(PUBLIC + '/api/content').then((x) => x.json()).catch(() => null);
    const list = (raw && raw.projects) || [];
    const found = list.find((p) => p && p.slug === slug);
    const site = await fetch(PUBLIC + '/').then((r) => r.text()).catch(() => '');
    if (found && site.includes('QA E2E')) { liveSlug = slug; break; }
    await new Promise((r) => setTimeout(r, 1000));
  }
  record('public site reflects publish', !!liveSlug, liveSlug ?? 'not yet visible after 25s');
  await page.screenshot({ path: `${SHOTS}/04-published.png` });
} finally {
  /* ---------- cleanup: purge test project + delete throwaway admin ---------- */
  console.log('\nCleaning up…');
  // find any row whose slug matches the qa project (or is titled QA E2E) at all states
  const sweep = await api('/rest/v1/projects?slug=like.*qa-e2e*', { method: 'GET' });
  const leftover = Array.isArray(sweep.json) ? sweep.json : (sweep.json?.data || []);
  for (const row of leftover) {
    if (row && (String(row.title_en).startsWith('QA E2E') || row.slug === createdSlug)) {
      await api('/rest/v1/projects?id=eq.' + row.id, { method: 'DELETE' });
    }
  }

  if (userId) {
    await api('/rest/v1/admin_users?user_id=eq.' + userId, { method: 'DELETE' });
    await api('/auth/v1/admin/users/' + userId, { method: 'DELETE' });
    console.log('removed throwaway admin + row', userId.slice(0, 8));
  }
  await browser.close();
  record('cleanup done', true);

  const passed = results.filter((r) => r.ok).length;
  console.log(`\nRESULTS: ${results.length} checks — ${passed} passed, ${results.length - passed} failed`);
  if (pageErrors.length) console.log('pageerrors:', pageErrors.join(' | '));
  if (results.some((r) => !r.ok) || pageErrors.length) process.exit(1);
}
