/*
 * Local test for dynamic CMS project cards (no server changes needed —
 * drives window.PFCMS.apply directly). Run: node tests/e2e-dynamic-cards.mjs
 * Optionally pass BASE_URL (default http://localhost:8123).
 */
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:8123';
const SHOTS = 'gui-test-screenshots';
fs.mkdirSync(SHOTS, { recursive: true });

const results = [];
function record(id, ok, note = '') {
  results.push({ id, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${id}${note ? ' — ' + note : ''}`);
}

const NEW_PROJECT = {
  id: '11111111-1111-1111-1111-111111111111',
  slug: 'qa-dynamic-card',
  legacy_key: '',
  title_en: 'Dynamic QA Project',
  title_ar: 'مشروع ديناميكي',
  badge_en: 'New',
  badge_ar: 'جديد',
  summary_en: 'Rendered by the CMS dynamic card path.',
  summary_ar: 'يُعرض عبر مسار البطاقات الديناميكية.',
  stack: ['JavaScript', 'CMS'],
  live_url: 'https://example.com/',
  cover_path: '',
  is_featured: false,
  featured_rank: 0,
  status: 'published',
  case_study: { problem: { en: 'Test problem statement.', ar: 'بيان المشكلة.' } }
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });

// Inject the CMS payload directly (bypasses fetch — local/offline safe).
await page.evaluate((p) => {
  window.PFCMS.apply({ enabled: true, projects: [p], certifications: [], recommendations: [], about: null, settings: null });
}, NEW_PROJECT);
await page.waitForTimeout(500);

// 1. dynamic card exists with expected structure
const card = page.locator('.project-card[data-dynamic][data-project="qa-dynamic-card"]');
record('dynamic card rendered', await card.count() === 1);
record('card title correct', (await card.locator('h3').textContent()) === 'Dynamic QA Project');
record('card badge correct', (await card.locator('.project-tag').textContent()) === 'New');
record('card summary correct', (await card.locator('p').textContent()).includes('dynamic card path'));
record('card stack tags', (await card.locator('.project-tags span').count()) === 2);
record('card live link', (await card.locator('a.btn-primary').getAttribute('href')) === 'https://example.com/');
record('icon rendered as svg', await card.locator('.project-icon svg').count() === 1);
record('link icon rendered', await card.locator('a.btn-primary svg').count() === 1);

// 2. case modal opens from the dynamic card
await card.locator('[data-case-open]').click();
await page.waitForTimeout(500);
record('case modal opens from dynamic card', await page.locator('#case-modal').isVisible());
record('modal shows problem text', (await page.locator('#case-modal-body').textContent()).includes('Test problem statement.'));
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
record('modal closes on Escape', await page.locator('#case-modal').isHidden());

// 3. language switch re-renders the dynamic card in Arabic
await page.click('#lang-toggle');
await page.waitForTimeout(600);
const cardAr = page.locator('.project-card[data-dynamic][data-project="qa-dynamic-card"]');
record('Arabic title after lang switch', (await cardAr.locator('h3').textContent()) === 'مشروع ديناميكي');
record('Arabic badge', (await cardAr.locator('.project-tag').textContent()) === 'جديد');
record('no duplicate cards after re-apply', await page.locator('.project-card[data-dynamic]').count() === 1);

// 4. static cards untouched
record('static cards still present', await page.locator('.project-card[data-project]').count() >= 8);

// 5. removal: re-apply without the project → dynamic card disappears
await page.evaluate(() => {
  window.PFCMS.apply({ enabled: true, projects: [], certifications: [], recommendations: [], about: null, settings: null });
});
await page.waitForTimeout(300);
record('dynamic card removed when project removed', await page.locator('.project-card[data-dynamic]').count() === 0);

record('no uncaught JS errors', errors.length === 0, errors.join(' | ') || 'clean');
await page.screenshot({ path: `${SHOTS}/dynamic-card.png` });
await browser.close();

const passed = results.filter((r) => r.ok).length;
console.log(`\nRESULTS: ${results.length} checks — ${passed} passed, ${results.length - passed} failed`);
if (results.some((r) => !r.ok)) process.exit(1);
