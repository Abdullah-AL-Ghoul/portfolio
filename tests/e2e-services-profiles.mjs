/*
 * Local test for the CMS-driven Services + Professional Profiles sections
 * (no server changes needed — drives window.PFCMS.apply directly).
 * Modeled on tests/e2e-dynamic-cards.mjs.
 * Run: node tests/e2e-services-profiles.mjs
 * Optionally pass BASE_URL (default http://localhost:8931).
 */
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:8931';
const SHOTS = 'gui-test-screenshots';
fs.mkdirSync(SHOTS, { recursive: true });

const results = [];
function record(id, ok, note = '') {
  results.push({ id, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${id}${note ? ' — ' + note : ''}`);
}

const FAKE_SERVICES = [
  {
    slug: 'qa-service-one',
    title_en: 'QA Service One',
    title_ar: 'خدمة الاختبار الأولى',
    summary_en: 'Summary of the first fake service.',
    summary_ar: 'ملخص الخدمة الأولى الوهمية.',
    features: [
      { en: 'Feature A', ar: 'ميزة أ' },
      { en: 'Feature B', ar: 'ميزة ب' }
    ],
    technologies: ['Node.js', 'Playwright'],
    related_project_keys: [],
    icon: 'code-2',
    cta_label_en: 'Hire me for service one',
    cta_label_ar: 'وظّفني للخدمة الأولى',
    sort_order: 1
  },
  {
    slug: 'qa-service-two',
    title_en: 'QA Service Two',
    title_ar: 'خدمة الاختبار الثانية',
    summary_en: 'Summary of the second fake service.',
    summary_ar: 'ملخص الخدمة الثانية الوهمية.',
    features: [{ en: 'Feature C', ar: 'ميزة ج' }],
    technologies: ['Supabase'],
    related_project_keys: [],
    icon: 'shield-check',
    cta_label_en: '',
    cta_label_ar: '', // falls back to the i18n label
    sort_order: 2
  }
];

const FAKE_PROFILE = {
  platform: 'qa-platform',
  display_name: 'QA Profile',
  username: 'qa_user',
  profile_url: 'https://example.com/qa-profile',
  title_en: 'QA Freelance Title',
  title_ar: 'عنوان العمل الحر',
  description_en: 'Description of the fake profile.',
  description_ar: 'وصف الملف الوهمي.',
  icon: 'globe',
  is_featured: false,
  display_order: 1
};

const payload = (services, profiles) => ({
  enabled: true,
  projects: [],
  certifications: [],
  recommendations: [],
  about: null,
  settings: null,
  services,
  professional_profiles: profiles
});

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });

// Stub the analytics tracker BEFORE applying the payload so every fired
// event is recorded. script.js reads window.PFTrack at call time only.
await page.evaluate(() => {
  window.__pfCalls = [];
  window.PFTrack = (name, target) => {
    window.__pfCalls.push({ name: String(name), target: String(target ?? '') });
  };
});
const calls = () => page.evaluate(() => window.__pfCalls);
const hasCall = async (name, target) => {
  const c = await calls();
  return c.some((x) => x.name === name && x.target === target);
};

// Sanity: both sections ship hidden before any CMS data arrives.
record('services section starts hidden', await page.locator('#services').isHidden());
record('freelance section starts hidden', await page.locator('#freelance').isHidden());

// Inject the CMS payload directly (bypasses fetch — local/offline safe).
await page.evaluate((p) => window.PFCMS.apply(p), payload(FAKE_SERVICES, [FAKE_PROFILE]));
await page.waitForTimeout(500);

// 1. services section: 2 cards with full structure
const svcOne = page.locator('.service-card[data-service="qa-service-one"]');
const svcTwo = page.locator('.service-card[data-service="qa-service-two"]');
record('services section visible', await page.locator('#services').isVisible());
record('exactly 2 service cards', await page.locator('#services .service-card').count() === 2);
record('service one title', (await svcOne.locator('h3').textContent()) === 'QA Service One');
record('service one summary', (await svcOne.locator('.service-summary').textContent()).includes('first fake service'));
record('service one features', (await svcOne.locator('.service-features li').count()) === 2);
record('service one tech chips', (await svcOne.locator('.service-tags span').count()) === 2);
const svcCtaOne = svcOne.locator('a.service-cta');
record('service one CTA label from CMS', (await svcCtaOne.textContent()).trim() === 'Hire me for service one');
record('service one CTA href #contact', (await svcCtaOne.getAttribute('href')) === '#contact');
record('service one CTA carries slug', (await svcCtaOne.getAttribute('data-service-cta')) === 'qa-service-one');
record('service two i18n CTA fallback', (await svcTwo.locator('a.service-cta').textContent()).trim().length > 0);

// 2. freelance section: 1 card linking to the fake URL
const profile = page.locator('.profile-card[data-profile="qa-platform"]');
record('freelance section visible', await page.locator('#freelance').isVisible());
record('exactly 1 profile card', await page.locator('#freelance .profile-card').count() === 1);
record('profile card name', (await profile.locator('.profile-name').textContent()) === 'QA Profile');
record('profile card title', (await profile.locator('.profile-title').textContent()) === 'QA Freelance Title');
record('profile card href is fake URL', (await profile.getAttribute('href')) === 'https://example.com/qa-profile');

// 3. view events: scroll both sections into the viewport (threshold 0.25).
await page.locator('#services .service-card').first().scrollIntoViewIfNeeded();
await page.waitForTimeout(700);
record('service_view fired for qa-service-one', await hasCall('service_view', 'qa-service-one'));
record('service_view fired for qa-service-two', await hasCall('service_view', 'qa-service-two'));
await page.locator('#freelance .profile-card').first().scrollIntoViewIfNeeded();
await page.waitForTimeout(700);
record('freelance_profile_view fired', await hasCall('freelance_profile_view', 'freelance'));

// 4. click events: real click on the service CTA (in-page #contact anchor),
// synthetic bubbling click on the profile card (target=_blank would open a
// popup to example.com — the delegated listener still sees the event).
await svcCtaOne.click();
await page.waitForTimeout(300);
record('service_cta_click fired with slug', await hasCall('service_cta_click', 'qa-service-one'));
record('hire_me_click fired from service CTA', await hasCall('hire_me_click', 'service-cta'));
await profile.evaluate((el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true })));
await page.waitForTimeout(300);
record('freelance_profile_click fired with platform', await hasCall('freelance_profile_click', 'qa-platform'));

// 5. Arabic re-render: cards rebuilt in place, no duplicates
await page.click('#lang-toggle');
await page.waitForTimeout(700);
record('Arabic service title', (await svcOne.locator('h3').textContent()) === 'خدمة الاختبار الأولى');
record('Arabic service summary', (await svcOne.locator('.service-summary').textContent()).includes('الخدمة الأولى'));
record('Arabic service feature', (await svcOne.locator('.service-features li').first().textContent()) === 'ميزة أ');
record('Arabic CTA label from CMS', (await svcCtaOne.textContent()).trim() === 'وظّفني للخدمة الأولى');
record('Arabic profile title', (await profile.locator('.profile-title').textContent()) === 'عنوان العمل الحر');
record('no duplicate service cards', await page.locator('#services .service-card').count() === 2);
record('no duplicate profile cards', await page.locator('#freelance .profile-card').count() === 1);
record('service_view fired only once per slug', (await calls()).filter((c) => c.name === 'service_view' && c.target === 'qa-service-one').length === 1);

// 6. removal: re-apply with empty arrays → both sections hide, no leftovers
await page.evaluate((p) => window.PFCMS.apply(p), payload([], []));
await page.waitForTimeout(500);
record('services section hidden when empty', await page.locator('#services').isHidden());
record('freelance section hidden when empty', await page.locator('#freelance').isHidden());
record('no leftover service cards', await page.locator('#services .service-card').count() === 0);
record('no leftover profile cards', await page.locator('#freelance .profile-card').count() === 0);

record('no uncaught JS errors', errors.length === 0, errors.join(' | ') || 'clean');

// Evidence screenshot of the populated state (sections were hidden by the
// removal check, so re-apply the payload first).
await page.evaluate((p) => window.PFCMS.apply(p), payload(FAKE_SERVICES, [FAKE_PROFILE]));
await page.waitForTimeout(500);
await page.locator('#services').scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.screenshot({ path: `${SHOTS}/services-profiles.png`, fullPage: true });
await browser.close();

const passed = results.filter((r) => r.ok).length;
console.log(`\nRESULTS: ${results.length} checks — ${passed} passed, ${results.length - passed} failed`);
if (results.some((r) => !r.ok)) process.exit(1);
