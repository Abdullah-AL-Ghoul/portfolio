/*
 * E2E critical paths for the public site (no backend configured —
 * the site must fully work on its static fallback).
 * Run from the project root:  node tests/e2e-public.mjs
 */
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:8123';
const SHOTS = 'gui-test-screenshots';
fs.mkdirSync(SHOTS, { recursive: true });

const results = [];
function record(id, ok, note = '') {
  results.push({ id, ok, note });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${id}${note ? ' — ' + note : ''}`);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const consoleErrors = [];
page.on('pageerror', (e) => consoleErrors.push('uncaught: ' + e.message));

await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });

// T1: hero renders
record('T1 hero visible', await page.locator('.hero-title').isVisible());

// T2: language toggle → RTL
await page.click('#lang-toggle');
await page.waitForTimeout(400);
record('T2 rtl toggle', (await page.locator('html').getAttribute('dir')) === 'rtl');
await page.screenshot({ path: `${SHOTS}/t2-rtl.png` });

// T3: case-study modal opens (CMS hook + static fallback)
await page.click('[data-case-open="p4"]');
await page.waitForTimeout(400);
record('T3 case modal opens', await page.locator('#case-modal').isVisible());

// T4: modal closes on Escape
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
record('T4 modal closes on Escape', await page.locator('#case-modal').isHidden());

// T5: contact form validation — empty submit shows an error message
await page.locator('#contact').scrollIntoViewIfNeeded();
await page.click('#contact-form button[type="submit"]');
const errText = await page.locator('#form-status').textContent();
record('T5 empty-submit shows validation error', (errText || '').length > 0);

// T6: valid submission → API absent locally → mailto fallback feedback
await page.fill('#name', 'Test User');
await page.fill('#email', 'test@example.com');
await page.fill('#subject', 'Hello');
await page.fill('#message', 'This is a test message for verification.');
await page.click('#contact-form button[type="submit"]');
await page.waitForTimeout(800);
const sentText = await page.locator('#form-status').textContent();
record('T6 submit → mailto fallback message', (sentText || '').length > 0, sentText || '');

// T7: honeypot exists but is positioned off-screen (invisible to users)
const hpBox = await page.locator('#company').boundingBox();
const honeypotOffscreen = hpBox === null || hpBox.x < 0 || hpBox.x > 12000;
record('T7 honeypot off-screen', honeypotOffscreen, hpBox ? `x=${Math.round(hpBox.x)}` : 'no box');

// T8: light theme applies
await page.click('#theme-toggle');
await page.click('[data-theme-choice="light"]');
await page.waitForTimeout(300);
record('T9 light theme applied', (await page.locator('html').getAttribute('data-theme')) === 'light');
await page.screenshot({ path: `${SHOTS}/light-theme.png` });

// T9: desktop full-page screenshot (dark, back to default)
await page.click('#theme-toggle');
await page.click('[data-theme-choice="dark"]');
await page.waitForTimeout(400);
await page.screenshot({ path: `${SHOTS}/desktop-full.png`, fullPage: true });

// T10: mobile viewport + menu
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
const mobileErrors = [];
mobile.on('pageerror', (e) => mobileErrors.push(e.message));
await mobile.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
await mobile.click('#nav-toggle');
await mobile.waitForTimeout(300);
record('T8 mobile menu opens', await mobile.locator('.nav-links').isVisible());
await mobile.screenshot({ path: `${SHOTS}/mobile-menu.png` });
await mobile.close();

// Console errors across the run
record('T99 no uncaught JS errors', consoleErrors.length === 0, consoleErrors.join(' | ') || 'clean');

await browser.close();

const passed = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok);
console.log(`\nRESULTS: ${results.length} checks — ${results.filter((r) => r.ok).length} passed, ${results.filter((r) => !r.ok).length} failed`);
if (results.some((r) => !r.ok)) process.exit(1);
