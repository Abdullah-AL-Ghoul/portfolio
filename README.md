# Abdullah Ayman AL-Ghoul · Portfolio

A modern, bilingual (EN/AR), responsive personal portfolio site.
No build step — just HTML, CSS, and vanilla JavaScript (icons served from an inline SVG sprite).

**Live:** https://abdullah-portfolio26.vercel.app/

---

## Features

### Hero
- **Animated typing** — cycles through roles/tags with a blinking caret, restarts cleanly when you switch language
- **Mouse-following glow** — a soft purple blob tracks your cursor inside the hero (desktop only, hidden on touch / reduced motion)
- **Animated background blobs** — three floating gradient blobs
- **Subtle film grain** — SVG noise overlay, very low opacity, animates on a stepped loop for a Linear/OpenAI-style premium feel
- **Gradient text** on the name, with a rotating color animation
- **Eyebrow "Hi, I'm"** rendered as a small uppercase tag above the name
- **Tech stack row** — the key languages and tools shown right under the hero

### Layout & Navigation
- **Bilingual** (English / Arabic) with full RTL support and live toggle
- **5 themes with a picker** — Dark / Light / Cyberpunk / Forest / Sunset. Click the theme icon in the navbar to open the popover (active theme is check-marked). Choice persists in `localStorage`, and system-preference detection applies on first visit
- **Cursor theme follower** — a small label rides the cursor with the current theme color (desktop, hidden on touch / reduced motion)
- **Sticky navbar** with backdrop blur, scrolled-state shadow, and `aria-current="location"` on the active link
- **Scroll progress bar** — thin gradient indicator at the very top of the page
- **Section dividers** with subtle gradient waves between sections
- **Responsive** — mobile, tablet, desktop
- **Keyboard shortcuts** — `Home` jumps to top, `End` jumps to bottom
- **Mobile menu** — closes on outside click, on Escape, and on any nav link tap

### Data visualization & interactivity
- **Skills radar chart** — a pure-SVG radar drawn live from your `data-tier` skill values (4 axes: Programming, Networking & Infra, Tools & Platforms, Currently Learning). Re-renders on theme change and language switch, respects RTL, animates in on scroll
- **Project case-study modals** — each project card has a "Case Study" button that opens a dialog with Problem / Solution / Result sections, tech stack, and links (bilingual, focus-trapped, closes on Escape/backdrop/X)
- **Interactive timeline** — each milestone row has an expander button opening a modal with a full narrative + any supporting links (bilingual)
- **3D parallax project covers** — covers tilt gently with the mouse for depth (desktop, disabled on reduced motion / touch)

### Sections
- **Stats** with circular icon badges, animated counters that respect tab visibility
- **Skill proficiency tiers** — 4-dot tier indicators (Expert / Advanced / Intermediate / Beginner) on each `.skill-row` via `data-tier="1|2|3|4"`. No percentages, language-localized aria-labels, hover micro-interactions
- **Project cards** with unique animated covers (gradient mesh, network nodes, floating clouds, study grid, task lists, library shelves) and smooth hover lift
- **Certificates** — each card shows a per-organization Lucide icon (NVIDIA / OpenAI / Anthropic / Saylor / ICDL / HP), date, title, and a verified badge. Click for lightbox preview and download
- **Recommendations** with avatars and quote styling
- **Contact** with availability pulse ("Replies within 24 hours"), mailto fallback, and a clean form
- **Custom bilingual 404 page**

### Forms
- **Contact form** that opens the visitor's mail client (always works) — optional Formspree endpoint supported
- **Inline validation** with `.field-error` highlighting
- **Focus first invalid field** for keyboard users

### AI Assistant extras
- **LLM-powered answers (optional)** — the assistant first asks `api/chat.js` (a tiny Vercel serverless endpoint). If it returns a real answer it's shown; if no API key is configured or the request fails, it silently falls back to the built-in keyword rules, so the chat always works
- **Keyboard shortcuts** — `/` or `Ctrl/Cmd + K` anywhere on the page opens the assistant and focuses the input
- **Voice input** — microphone button (Web Speech Recognition) fills the chat and sends your message
- **Voice output** — speaker button reads the last assistant reply aloud (speechSynthesis, language-aware)
- Both auto-disable when the browser doesn't support them, and stop cleanly on language switch

### Accessibility & SEO
- Skip link, ARIA labels, semantic HTML, focus management
- Honors `prefers-reduced-motion` throughout
- **Lightweight a11y audit** — press `Ctrl/Cmd + Shift + A` (or open `?a11y`) to run a zero-dependency scan for missing alt text, unlabeled inputs/buttons, heading-order gaps, low-contrast pairs, and duplicate IDs, then toggle a focus-highlight mode for keyboard testing
- Open Graph, Twitter cards (with `og:image` and `summary_large_image`), JSON-LD, sitemap, robots.txt
- `<html lang>` and `og:locale` flip with the language toggle

### Performance & Offline
- **Service Worker** (`sw.js`) — cache-first for same-origin assets, network-first for page loads, full offline support on repeat visits
- **PWA** — `manifest.webmanifest` with real icons (`assets/icons/icon-192.png`, `icon-512.png`, `icon-maskable-512.png` + `apple-touch-icon.png`) for a basic installable app
- **LCP hints** — the hero avatar is preloaded with `fetchpriority="high"`
- Preconnect to Google Fonts and Lucide CDN for faster first paint
- Cache-control for `/assets/*` set to 1-year immutable via Vercel headers; `sw.js` is never cached

---

## Optional LLM API (serverless)

The assistant's smart answers come from a tiny Vercel function at `api/chat.js`. It works with any OpenAI-compatible API. To enable it:

1. Deploy to Vercel (Option A/B/C below)
2. Add these environment variables in **Project → Settings → Environment Variables**:
   - `LLM_API_KEY` — your OpenAI (or compatible) API key
   - `LLM_API_URL` — optional, defaults to `https://api.openai.com/v1/chat/completions`
   - `LLM_MODEL` — optional, defaults to `gpt-4o-mini`
3. Redeploy. No key set? The function returns `{ "fallback": true }` and the site answers from its built-in rules — nothing breaks.

If you prefer to use a standard `OPENAI_API_KEY` instead of `LLM_API_KEY`, that works too.

---

## Project Structure

```
portfolio/
├── index.html          # Main page (includes the inline 56-icon SVG sprite)
├── 404.html            # Custom 404 page (bilingual)
├── styles.css          # Modern CSS (themes, radar, modals, a11y panel)
├── script.js           # i18n + theme picker + reveal + radar + modals + voice + a11y + AI + form
├── sw.js               # Service worker (offline support)
├── manifest.webmanifest # PWA manifest
├── vercel.json         # Vercel config (headers + Permissions-Policy)
├── api/
│   └── chat.js         # Optional LLM endpoint (Vercel serverless)
├── robots.txt          # SEO crawler rules
├── sitemap.xml         # SEO sitemap
└── assets/
    ├── profile-600.jpg # Hero avatar (optimized)
    ├── og-cover.jpg    # Social share preview
    ├── Abdullah_ALGhoul_CV.pdf
    ├── dr-almasri.jpg  # Recommendation photos
    ├── dr-ahmed.jpg
    ├── yazan.jpg
    ├── README.md
    ├── icons/          # PWA + favicon icons
    │   ├── icon-192.png
    │   ├── icon-512.png
    │   ├── icon-maskable-512.png
    │   └── apple-touch-icon.png
    └── certs/          # Certificate images
        ├── google-ai-fundamentals.jpg
        ├── nvidia-ai.jpg
        ├── openai-ai-foundations.jpg
        ├── anthropic-claude101.png
        ├── anthropic-claude-code-101.png
        ├── claude-code-in-action.jpg
        ├── saylor-cs101.jpg
        ├── icdl.jpg
        ├── hp-critical-thinking.jpg
        └── hp-data-science.jpg
```

---

## Required Assets

| File | Purpose | Required? |
|------|---------|-----------|
| `assets/profile-600.jpg` | Hero avatar (optimized) | Recommended |
| `assets/og-cover.jpg` | Social share preview | Optional |
| `assets/Abdullah_ALGhoul_CV.pdf` | Downloadable CV | Optional |
| `assets/dr-almasri.jpg` | Mr. Almasri photo | Optional (falls back to "AB") |
| `assets/dr-ahmed.jpg` | Dr. Ahmed photo | Optional (falls back to "AA") |
| `assets/yazan.jpg` | Yazan photo | Optional (falls back to "YW") |
| `assets/certs/*` | Certificate images | Optional (modal shows "not uploaded") |

See `assets/README.md` for full details.

---

## Deployment to Vercel

### Option A — Drag & Drop (fastest)

1. Zip the `portfolio/` folder contents
2. Go to [vercel.com/new](https://vercel.com/new)
3. Drag the zip into the page
4. Done.

### Option B — GitHub

1. Push this folder to a new GitHub repository
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import the repo
3. Vercel auto-detects it as a static site — click **Deploy**

### Option C — Vercel CLI

```bash
npm i -g vercel
cd portfolio
vercel
```

---

## Local Preview

No build step. Just open `index.html` in a browser, or run a quick local server:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

---

## Customization

### Change colors

Edit the `:root` and the per-theme blocks (`[data-theme='light']`, `[data-theme='dark']`, `[data-theme='cyberpunk']`, `[data-theme='forest']`, `[data-theme='sunset']`) at the top of `styles.css`:

```css
:root {
  --accent: #06b6d4;
  --gradient: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
}
```

To add a new theme: create a `[data-theme='your-name']` block, add it to `THEME_ORDER` + `THEME_ICONS` in `script.js`, and add a choice button in `#theme-menu` in `index.html` (with an `en`/`ar` label under the `theme.*` keys).

### Run the a11y audit

Press `Ctrl/Cmd + Shift + A` or open the site with `?a11y` in the URL. The panel lists issues (alt text, labels, heading order, contrast, duplicate IDs) and offers a focus-highlight mode. The scan runs entirely in the browser — no network calls.

### Add a case study or milestone modal

Case studies come from the `PROJECT_CASES` object in `script.js` (keyed `p1…p7`, with `en`/`ar` content). Timeline milestones come from `MILESTONES` (keyed `m1|m1b|m2|m3|m4`). Each entry supports `title`, `date`, `summary`, `body` (array of `{ heading, text }` blocks), `stack` (array), and `links` (array of `{ label, url }`). The open buttons are wired via `data-case-open` / `.t-open` in `index.html`.

### Wire the contact form to Formspree (optional)

The form is wired to fall back to a `mailto:` link that opens the visitor's
email client — that works out of the box with no setup. If you'd rather use
Formspree:

1. Create a form at [formspree.io](https://formspree.io) and copy the endpoint
2. Open `script.js` and set `FORMSPREE_ENDPOINT` near the top to your endpoint
3. Reload — submissions now go straight to your Formspree inbox, with mailto
   as a fallback if anything fails

### Tune the typing animation

In `script.js`, edit the `TYPED_PHRASES` object near the top — one list per language. The animation auto-stops on reduced motion.

### Add a new section

1. Add the HTML in `index.html` with `data-i18n` attributes on translatable text
2. Add matching translations in `script.js` under both `en` and `ar` objects
3. Add a nav link in the navbar

### Edit content

- **Static content** (e.g. your name) lives in `index.html`
- **Translatable content** lives in `script.js` (i18n object)
- **Skill tiers** live in `data-tier="1|2|3|4"` attributes on each `.skill-row` in `index.html` (1 = Beginner, 2 = Intermediate, 3 = Advanced, 4 = Expert). The 4 dots are rendered automatically; tier 4 gets a gradient + glow

### Add a new certification

1. Drop the cert image into `assets/certs/`
2. Add a `<button class="cert-card">` in the certs grid
3. Set `data-cert="assets/certs/your-file.ext"` and the title/org attributes
4. (Optional) Add a `<span class="cert-icon" aria-hidden="true"><i data-lucide="..."></i></span>` for a per-organization icon (e.g. `cpu`, `sparkles`, `brain-circuit`, `graduation-cap`, `monitor-check`, `lightbulb`, `bar-chart-3`)
5. Add matching translations for the title/org in the i18n dict

---

## Browser Support

- Chrome / Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari iOS 14+
- Chrome Android 90+

---

## License

© 2026 Abdullah Ayman AL-Ghoul. All rights reserved.
