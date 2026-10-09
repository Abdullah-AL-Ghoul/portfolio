// Research capture: screenshots + DOM notes for tool-platform references.
// Usage: node docs/v3/working/capture-refs.mjs
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('gui-test-screenshots/v3-research');
fs.mkdirSync(OUT, { recursive: true });

const DESKTOP_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const MOBILE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1';

const REFS = [
  { name: 'figma', url: 'https://www.figma.com/' },
  { name: 'framer', url: 'https://www.framer.com/' },
  { name: 'webflow', url: 'https://webflow.com/' },
  { name: 'raycast', url: 'https://www.raycast.com/' },
  { name: 'supabase', url: 'https://supabase.com/' },
];

const BOT_WALL_MARKERS = [
  'just a moment', 'attention required', 'access denied', 'verify you are human',
  'cf-chl', 'captcha', 'enable javascript', 'checking your browser',
];

async function shoot(context, url, prefix, notes) {
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
    // Try to let lazy content settle
    try { await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(1200); await page.evaluate(() => window.scrollTo(0, 0)); } catch {}
    await page.waitForTimeout(600);
    const title = await page.title();
    const data = await page.evaluate(() => {
      const txt = (el) => (el?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 120);
      const q = (sel) => Array.from(document.querySelectorAll(sel));
      return {
        h1: q('h1').map(txt).slice(0, 4),
        h2: q('h2').map(txt).slice(0, 10),
        navLinks: q('header a, nav a').map(a => (a.innerText || '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 14),
        buttons: q('a[class*="button" i], a[class*="btn" i], button').map(txt).filter(Boolean).slice(0, 10),
        videos: q('video').length,
        canvases: q('canvas').length,
        sections: q('section, [data-section]').length,
        bodyLen: document.body.innerText.length,
        footerText: (document.querySelector('footer')?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 300),
        logos: q('footer img, section img[alt*="logo" i]').length,
      };
    }).catch(e => ({ error: String(e) }));
    const bodySample = data.bodyLen ? await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').slice(0, 400)) : '';
    const wall = BOT_WALL_MARKERS.filter(m => (title + ' ' + bodySample).toLowerCase().includes(m));
    await page.screenshot({ path: path.join(OUT, `${prefix}.png`), fullPage: true, timeout: 60000 }).catch(e => notes.push(`${prefix} fullpage failed: ${e.message}`));
    await page.screenshot({ path: path.join(OUT, `${prefix}-first-viewport.png`), timeout: 60000 }).catch(() => {});
    notes.push({ prefix, title, wall, data, bodySample });
  } catch (e) {
    notes.push({ prefix, error: String(e) });
  } finally {
    await page.close().catch(() => {});
  }
}

const browser = await chromium.launch({ headless: true });
const report = {};
for (const ref of REFS) {
  const notes = [];
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: DESKTOP_UA, locale: 'en-US', deviceScaleFactor: 1 });
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, userAgent: MOBILE_UA, locale: 'en-US', deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await shoot(desktop, ref.url, ref.name, notes);
  await shoot(mobile, ref.url, `${ref.name}-mobile`, notes);
  await desktop.close(); await mobile.close();
  report[ref.name] = notes;
  console.log(`done ${ref.name}`);
}
await browser.close();
fs.writeFileSync(path.join(OUT, 'capture-notes.json'), JSON.stringify(report, null, 2));
console.log('ALL DONE');
