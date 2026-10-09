# V3 Design System — Binding Implementation Spec (Winner: **A — Minimal Precision**)

**Status:** BINDING. Every implementer action on the public site and the admin dashboard must conform.
**Source of authority:** `docs/v3/05-design-directions.md` (directional), `docs/v3/04-design-research-matrix.md` (references), `docs/v3/01-recon-audit.md` (live baseline), the three skills digests in `docs/v3/working/` (rules), and direct reads of `styles.css` / `admin/src/styles.css` / `index.html` performed this session.

Per design-system skill: reading this as a **personal portfolio (signature home)** for **technical hiring + freelance clients**, with a **"Dark Precision Engineering"** voice, leaning **minimalist / editorial-precision**.

## Dials (design-system skill §3)

| Surface | DESIGN_VARIANCE | MOTION_INTENSITY | VISUAL_DENSITY |
|---|---|---|---|
| Public site (marketing / vitrine) | 5 | 3 | 3 — room to breathe |
| Admin dashboard (app surface) | 4 | 3 | 6 (denser by convention) |

---

## 1. Primitives — shared DNA, mapped to the EXISTING `styles.css`

The existing 4,800-line sheet is the source of truth. **Do not rename what ships; add, don't fork.** Every token below references an existing custom property on `styles.css:101-140` (dark), `:143-168` (light), `:171-195` (cyberpunk), `:198-222` (forest), `:4192-4217` (sunset).

### 1.1 Type scale (exact clamps — the winner's headline system)

| Role | CSS | Value | Notes / map to |
|---|---|---|---|
| `display` (h1, hero) | `font-size: clamp(2.4rem, 6vw, 4rem)` · `font-weight: 600` · `letter-spacing: -0.03em` · `line-height: 1.05` | replaces current `clamp(1.6rem, 5vw, 3.8rem)` (styles.css:795) | keep `.hero-title`, remove typed gradient text fill → plain `var(--text)` |
| `section-title` (h2) | `font-size: clamp(1.75rem, 4vw, 2.5rem)` · weight 700 · `letter-spacing: -0.02em` · `line-height: 1.2` | current clamp kept (styles.css:343); weight 800→700; **remove the gradient text clip** → solid `var(--text)` | `background-clip` block at styles.css:348-352 removed; `.section-title::after` hairline 3px→1px |
| `h3` / project name | `clamp(1.25rem, 2vw, 1.5rem)` · weight 600 · `line-height: 1.25` | bound for all component h3s | the one-line scope under it |
| `lead` / hero sub | `clamp(1rem, 1.5vw, 1.25rem)` · weight 400 | current `hero-desc` scale (styles.css:864) | keep |
| `body` | `1rem` · `line-height: 1.6` | styles.css:228 | unchanged |
| `meta` | `0.875rem` (0.9 on AR) · 1.5 lh | secondary text, dim | `.hero-meta`, card descriptions |
| `label` (mono overline) | `0.75rem` · `font-family: var(--font-mono)` · weight 500 · `letter-spacing: 0.08em` · uppercase where EN-appropriate, never uppercase-only in AR | NEW overline token — applies to `.eyebrow`, `.status-pill`, section labels | brittanychiang //-comment pattern (P3), darkroom mono labels (P2) |
| `micro` | `0.68rem` · `0.1em` tracking | existing theme-menu label (styles.css:592) | unchanged |

**Arabic rules:** display/section keep the SAME clamps (clamps already bend for AR string length), but AR raises `line-height` by +0.1 (Cairo needs it; AR font is `--font-ar` styles.css:131) and drops `letter-spacing` to 0 on display lines (Arabic joining doesn't accept letter-spacing):

```
[dir='rtl'] .hero-title { line-height: 1.15; letter-spacing: 0; }
[dir='rtl'] .section-title { line-height: 1.3; letter-spacing: 0; }
```

### 1.2 Spacing scale (8 px base → rem; all new layout uses these + logical properties)

`--space-1: 0.25rem` (4) · `--space-2: 0.5rem` (8) · `--space-3: 0.75rem` (12) · `--space-4: 1rem` (16) · `--space-5: 1.5rem` (24) · `--space-6: 2rem` (32) · `--space-7: 3rem` (48) · `--space-8: 4rem` (64) · `--space-9: 5rem` (80) · `--space-10: 6rem` (96).

- Section rhythm: `padding-block: clamp(4rem, 10vw, 6.5rem)` — replaces flat `6rem 0` (styles.css:355). Section-head gap `--space-7` (3rem; current 3rem at styles.css:378 stays).
- Card internal padding: `--space-5` (1.5rem) default, `--space-6` (2rem) for featured.
- Off-scale values (e.g. an arbitrary 13px padding) are defects per frontend-ui-engineering :133-143.

### 1.3 Radius / borders / shadows

- Keep `--radius-sm: 8px`, `--radius: 14px`, `--radius-lg: 20px` (styles.css:134-136). New components pick from these three only.
- Border ink: `1px solid var(--border)` for structural separators; `var(--glass-border)` only for overlays/dialogs. **Prefer flat fills over glass** — glassmorphism is a cliché ban; the existing `--glass-*` tokens remain for the theme menu, modals, toasts where a real layer distinction is needed.
- Shadows: `--shadow` for raised cards, `--shadow-lg` for the modal; no colored shadow outside `--accent-glow` (single accent). Remove the gradient box-shadow + sheen on primary buttons (styles.css:417, 420-435).

### 1.4 Typefaces & fonts

- `--font-en` (Inter/system) is the **body** face but NOT the display voice; the display voice is specified in the token layer and must be a characterful tight grotesque (frontend-design skill: never Inter-only flatness; web-artifacts-builder: no Inter flatness; avoid Space Grotesk per the AI-slop list).
- **Display face proposition** (subject to the ~100KB font-payload cap, web-performance skill): a tight grotesque variable face (e.g. Instrument Sans / General Sans / Sora family), used for display/section-title/h3 only. If constrained, pairing it only on `display` lines still breaks "Inter-only flatness".
  - **Loading constraint:** preconnect + woff2 slices ≤ 100KB combined for EN + AR, `font-display: swap`, separate AR subset via `unicode-range` (web-performance skill L197-229).
- Mono (JetBrains Mono) is structural for overlines/metadata. `--font-mono` value unchanged.

---

## 2. Semantic color & surface tokens, per theme (must survive: dark default + light/cyberpunk/forest/sunset)

Reuses the existing names in every theme root. The MINIMAL-PRECISION reading changes **values**, not token names.

### Dark (default `:root`, styles.css:101-140) — target values

| Token | Current (dark) | Binding target | Evidence |
|---|---|---|---|
| `--bg` | #06060e | **#08090a** — near-black | linear bg #08090A (P0) |
| `--bg-elev` | #0d0d1a | **keep** | flat raised surface |
| `--bg-elev-2` | #12122a | **#141428** | subtle step |
| `--border` | rgba(255,255,255,0.06) | keep | hairline |
| `--text` | #e8e8f0 | **#f7f8f8** | linear text (P0) |
| `--text-dim` | #9a9ab8 | **#8b93a7** | muted secondary — brittanychiang slate (P0) |
| `--text-faint` | #7b7b96 | keep | tertiary |
| `--accent` | #06b6d4 | **#35c4e8** (cyan-strong, the single accent) | one dominant accent (frontend-design) |
| `--accent-2` | #22d3ee | same family — hover/primary lift only | — |
| `--accent-glow` | rgba(6,182,212,0.35) | **keep, used ≤ 3 places** (preloader, hairline, focus aid) | restrained |
| `--accent-purple/pink/blue` | #a855f7/#ec4899/#3b82f6 | **retired from component surfaces** — only exist as theme vars for system integrity; no component references them | single-accent rule |
| `--success` | #10b981 | keep (form + toast) | — |
| `--gradient` | 3-stop cyan→blue→purple | **not used on surfaces** — flat `--accent` replaces the primary button fill; token kept alive for legacy only | anti-gradients |
| `--gradient-soft` | keep (subtle section tint allowed) | keep | — |
| `--font-*` / `--radius*` / `--container` / `--nav-h` | see §1 | keep | — |
| `--transition` | 0.3s cubic-bezier(0.4,0,0.2,1) | **replaced** by the motion tokens in §4 (keep the name as `var(--transition)` = `--dur-routine` curve for backward compat) | — |

### Light (`[data-theme='light']`, styles.css:143-168) — delta only
- `--bg: #f4f5f9`, `--text: #0a0a14`, `--border: rgba(0,0,0,0.10)`, `--accent: #0675b0`, `--accent-2: #0b7fae`. All new components resolve through the same names. **Do not add new glass**: the existing light-card flat rule `inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 3px rgba(15,23,42,0.06)` (styles.css:4700-4705) IS the flat-surface spec — keep it.
  - **Corrected during implementation (WCAG 4.5:1 verified: 4.11:1 fails, 5.02:1 passes):** the accent value originally prescribed here was `#0a84c4` (with `#ffffff` primary-button labels and `#0675b0` as accent-2). Computed contrast: `#ffffff` on `#0a84c4` = 4.11:1 — below the binding 4.5:1 text invariant, and no provided text color passes on it (dark-on-accent is 3.77:1). Per the run owner (2026-10-09): the accessibility invariant wins over the literal hex; light `--accent` is `#0675b0` (5.02:1 white label, 4.61:1 as text on bg) and `--accent-2` is `#0b7fae` (4.51:1 white label) so the hover state still passes. Do not darken `--accent` beyond `#0675b0`.

### Cyberpunk (`[data-theme='cyberpunk']`, styles.css:171-195)
No value changes. Its neon magenta/cyan is that theme's identity; even there the single-accent-discipline applies at component level inside the theme (components use `var(--accent)`/`--accent-2`; the extras stay as the theme's own definition).

### Forest (`[data-theme='forest']`, styles.css:198-222)
No value changes. `--accent: #7dcea0` moss green is the dominant accent; `--accent-2: #52c41a` for hover. Keep.

### Sunset (`[data-theme='sunset']`, styles.css:4192-4217)
No value changes. `--accent: #ff8c42` ember is the dominant accent; `--accent-2: #ffb25e` for hover. Keep.

**Contrast invariants (binding):** 4.5:1 body text, 3:1 large text & UI components across **5 themes × EN/AR** (skills-digest contrast rule; web-accessibility L101-127). New values must be verified with actual computation, not eyeballed. The clean existing a11y base (0 unnamed controls, 0 alt failures, clean heading order — audit) must not regress.

---

## 3. Component specs

### 3.1 Buttons
| Variant | Spec (binding) |
|---|---|
| `.btn-primary` | `background: var(--accent)` flat (no gradient); color in dark themes `#0a0a14` (dark-on-accent → contrast check), in light themes `#ffffff`; `border-radius: var(--radius)`; padding `0.75rem 1.5rem`; hover = `background: var(--accent-2)` + `box-shadow: 0 4px 16px var(--accent-glow)` — **no translateY, no sheen sweep** (remove styles.css:420-435). Focus `:focus-visible { outline: 2px solid currentColor; outline-offset: 2px }` |
| `.btn-ghost` | secondary — keep `background: var(--glass-bg)`→`var(--glass-bg-hover)`, `border: var(--glass-border)`→hover `var(--accent)`, scoped (background, border, color only) |
| `.btn-outline` | tertiary (CV/footer) — keep border `var(--glass-border)`, hover border+color `var(--accent)`, no shadow on hover (remove styles.css:455) |

Rule: **never `transition: all`** on a button (current styles.css:393 is the defect).

Touch target: ≥ 44×44 effective (frontend skills). If visual height is 36px, add invisible padding to reach 44.

### 3.2 Cards (project / skill / service / capability)
- Background: `var(--bg-elev)`; border: `1px solid var(--border)`; radius: `var(--radius)`; padding `--space-5` (1.5rem); internal gaps `--space-3`.
- Title block: `h3` at §1.1 size, weight 600 — for projects, one-line scope below → reuse `.project-body p` class (cms.js writes it) and the layout just changes LTR/RTL flow from 3-col to 1-col.
- Tag/chip row: `.project-tags`, each tag = mono `0.78rem`, `var(--text-faint)`, `1px solid var(--border)`, `--radius-sm`, padding `0.2rem 0.55rem`.
- **CMS names unchanged** (`.project-card[data-project]`, `.project-tag`, `.project-body p`, `.project-links`, cms.js:45-68) → the redesigned card is CSS-different but DOM-equivalent to what cms.js writes.
- Hover (desktop only): `border-color: var(--accent)` + `box-shadow: 0 2px 12px var(--accent-glow)`, 150ms.

### 3.3 Chips (skills, certifications)
- `background: transparent`; `border: 1px solid var(--border)`; `color: var(--text-dim)`; `font-family: var(--font-mono)` `0.8rem`; `padding: 0.2rem 0.55rem`; `border-radius: 999px`.
- Cert chips keep the string-match `c.title_en === title` data (cms.js:222-224) — do not change cert markup.

### 3.4 Section overline
- EN: `// Projects` — mono overline, dim text. AR: `# مشاريع` — same visual weight, `#` mark on the inline-end side (system comment marker side flips with RTL). Where `.eyebrow` already exists (styles.css:333-340), reuse it and apply §1.1 `label` values.

---

## 4. Motion rules (binding)

Animate only `transform` and `opacity`; never layout props; never `transition: all`; one global duration/easing set (ui-animation L43-65, web-animation L36).

### 4.1 Duration tokens
| Token | Value | Use |
|---|---|---|
| `--dur-micro` | 150ms | hovers, focus, tiny state |
| `--dur-routine` | 300ms | theme-switch fade, panels, toast in/out (≤300ms per ui-animation L45) |
| `--dur-reveal` | 500ms | one-time scroll reveal below the fold |
| `--dur-load` | 1000ms total (30-50ms stair) | the ONE authored hero entrance |

### 4.2 Easing
- Enter/confident arrivals: `cubic-bezier(0.16, 1, 0.3, 1)` — already in the codebase at styles.css:4244.
- Exits: ~60-70% of enter duration, `cubic-bezier(0.4, 0, 0.2, 1)`.
- No `ease-in` entrances (ui-animation L45).

### 4.3 What animates / what must NOT

| DOES animate | MUST NOT |
|---|---|
| `opacity` + `transform` on reveal | `width`, `height`, `top`, `left`, `margin`, `padding`, `gap` (layout reflow) |
| `color`, `background-color`, `border-color` on hover/focus (scoped) | `transition: all` anywhere (grep gate) |
| `box-shadow` on focus/card hover, 150ms | `filter: blur(> 20px)` (ui-animation) |
| preloader fadeout (opacity 300ms) | looping background blobs — delete `.hero-blobs` (styles.css:685-751) and `.avatar-ring` pulse |

- **Theme switch:** add `[data-theme-switching] * { transition: none !important; animation: none !important }` toggled in script.js — otherwise all 5 themes animate at once (ui-animation L69). ~2 lines in script.js.
- **Reveal:** sections reveal at most once (IntersectionObserver disconnects after fire); never re-animate on scroll-up (ui-animation L41). Late-arriving CMS nodes must go through the same reveal path — the observer must pick up appended nodes (audit P1-03 cms.js:142-145).
- **Hover gating:** all hover effects inside `@media (hover: hover) and (pointer: fine)` (ui-animation L128).
- **Above the fold:** no animation above the fold after the load moment; the hero load sequence is the single exception (one dominant effect per viewport — frontend-craft :100-101).
- **Load orchestration:** one staggered hero entrance (status 0ms, title 50ms, lead 100ms, CTA 150ms, total ≤ 1000ms) executed in CSS keyframe delay, no JS animation engine.

### 4.4 Reduced motion (binding, hard rule)

```
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
    --dur-load: 0.01ms; /* also collapse the orchestrated hero */
  }
}
```

- Collapse y-travel to 0 and duration to 0 — don't just leave the animation running (framer-motion L534-551).
- Hide any element whose only purpose is motion (`.hero-blobs`, `.avatar-ring`, `.blob-cursor` already gated at styles.css:743-745).

---

## 5. RTL (binding)

- New layout uses logical properties everywhere (`margin-inline`, `padding-block`, `inset-inline-start/end`, `border-inline-*`); `dir=rtl` on `<html>` must reflow without new rules (audit-04 passes today — keep it green).
- `letter-spacing: 0` on all AR display lines; `line-height` bump per §1.1 (RTL rule).
- The `//` overline flips to `#` on the inline-end side (see §3.4).
- Every new surface gets an overflow check at 390px: `scrollWidth <= clientWidth` (audit-02/04 already established this gate; keep it).

---

## 6. i18n (binding per hard rule)

Every new user-facing string added by this redesign MUST exist in **both** EN and AR dictionaries in `script.js` (5 en/ar pairs at script.js:105/334, 1877/1946, 2087/2214, 2930/3003, 3186/3239 per audit) and the 227 HTML `data-i18n` keys stay within the existing keyset unless a new key is added to both dictionaries. `aria-label`s for icon-only controls also go through both dictionaries. Do not hardcode EN strings in markup (audit P2-10). Same rule applies to admin's side.

---

## 7. Admin dashboard — the same language

`admin/src/styles.css:1-18` already mirrors a subset of the public tokens (`--bg`, `--bg-elev`, `--text`, `--text-dim`, `--accent`, `--border`, `--radius`, `--font`, `--mono`, `--transition`). Bindings:

- **One token source:** the public `styles.css` `:root` entries in §2 are source-of-truth; the admin consumes the *same names/values* for shared primitives. Admin is its own surface (DENSITY 6 per dials), but the shared primitives — fonts (§1.4), spacing scale (§1.2), radius (§1.3), type roles (§1.1 body/label/micro), and motion durations/easings (§4) — must match values where the admin declares them.
- **Alignment diff:** admin `--bg` currently `#06060e` → must equal `#08090a`; `--border` keep but tune `--accent-soft` → define as the same `rgba(softer accent)`; `--radius` 12px → align to 14px `var(--radius)` unless a comment explains the compact exception; add the missing `--bg-elev-2`, `--text-faint`, `--accent-2`, `--dur-micro/--dur-routine`, `--ease-out` tokens so the dashboard and site share one vocabulary.
- **Type:** admin surfaces use the same mono `label` for section headings (nav-group already uses it, admin styles.css:68-76) and `meta` role for dim text; body stays 15px/1.55 for density — exempt from the public 16px floor by the dashboard-surface dial, noted in a comment (the lower floor comes from ui-ux-pro-max's table — the app surface dial gives it; but 15px is what the admin ships today and the admin is not the marketing surface).
- Never hardcode hex in admin components where a token exists (frontend-engineering :83-88, 161) — keep using `var()`.

---

## 8. Ship gates (non-negotiable; run at the scale the change demands)

1. **E2E:** `node tests/serve.mjs 8931` background, then the gate (or manually) `BASE_URL=http://localhost:8931` — assert `.hero-title` (:27), `#lang-toggle` (:30), `html[dir=rtl]` (:32), `[data-case-open="p4"]` (:36), `#case-modal` (:38,43), `#contact-form`/`#form-status` (:47-58), `#company` honeypot (:62-64), `#theme-toggle` + `[data-theme-choice]` + `html[data-theme]` (:67-75), `#nav-toggle` + `.nav-links` at 390 (:84-86), 0 uncaught pageerrors (:91). Keep the pin contract or update the test in the same change (audit P1-04). **`sw.js:8` cache version MUST be bumped** (audit P2-08) or QA sees stale CSS/JS.
2. **Contrast** verified per theme × locale for the new values (§2).
3. **RTL overflow** verified at 390px and 1440px.
4. **Reduced-motion** run: nothing animates, layout holds.
5. **Grep gates:** `transition: all`; layout-property transitions; `filter: blur( > 20px)` — run the exact greps.
6. **Capability grid collapses** under 720px to 1 col (mobile-first, verify at 320px/768px/1024px/1440px per frontend-ui-engineering).
