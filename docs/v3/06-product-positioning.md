# V3 Product Positioning

**Position:** Full-stack web application developer first; AI as a differentiator inside that stack; freelance-ready.

## The one-line identity

Before V3 the site said "Computer Science Student". After V3 it says, in both languages:

- EN (index.html:30, title): "Abdullah Ayman AL-Ghoul · Full-Stack Web Application Developer"
- AR (script.js ar dict, 'meta.title'): "عبدالله أيمن الغول · مطوّر تطبيقات ويب متكامل"

The hero role line (`hero.role`), meta description, OG/Twitter descriptions, and JSON-LD `jobTitle`/`description` all carry the same repositioning (index.html diff hunks @@-19, @@-62; script.js 'meta.title'/'meta.desc', 'hero.role', 'hero.desc').

## Evidence hierarchy

1. **Full-stack first.** The hero description claims end-to-end building: "responsive bilingual front ends, dependable APIs, and AI features that do real work" (index.html `.hero-desc`, data-i18n="hero.desc"). The first seeded service is literally *Full-Stack Web Applications* (0003 seed, sort_order 1).
2. **AI as differentiator, not identity.** A dedicated secondary line sits under the hero: "AI integrations are part of the stack — from chat assistants to workflow automation" (`hero.ai`, index.html `.hero-ai` block with a `sparkles` icon). The third seeded service is *AI-Powered Web Applications* (0003 seed row 3) — grounded in real work: Python automation/scheduling, prompt-engineering-driven development, cloud infra modelling (VDI/VPN/Azure). AI is positioned as something the stack *does*, not a buzzword banner.
3. **Freelance readiness.** A new "Work with me" section (`#freelance`) renders verified platform profiles, and every service card ends in a "Discuss a project" CTA → `#contact`. The dashboard ships a Freelance Profiles page whose subtitle enforces the no-fabrication protocol: "Real platforms where you have an active profile — never invent one" (admin/src/lib/schemas.jsx profileSchema.subtitle).

## Positioning ↔ evidence mapping (nothing invented)

| Claim on the page | Grounded in |
|---|---|
| Full-stack web applications | p1 (this site itself) + p4 (AL-Azher IT Hub) — related_project_keys in the 0003 seed |
| Business dashboards & admin panels | p5 (task manager) + p6 (library management system) |
| AI-powered web applications | p3 (smart university virtual lab) + p7 (SmartTimeCoach) |
| "AI integrations are part of the stack" | Real shipped features: the site's own AI assistant panel (`#ai-panel` section, api/chat.js) and the admin Smart Assistant |
| Freelance readiness | `contact.hire` "Hire me" CTA (both dicts), freelance section, Upwork/Khamsat/Mostaql/Freelancer/Contra/LinkedIn/custom platform enum in 0003 |

The seed copy itself states its grounding: "Grounded in the AL-Azher IT Hub and the portfolio site itself" (0003_services_profiles.sql:86) — no metric, client name, or rating was invented anywhere.

## Audience split (from the design docs)

`docs/v3/08-design-system.md` header: the site is read as a **personal portfolio (signature home)** for **technical hiring + freelance clients**. The dials: public site DESIGN_VARIANCE 5 / MOTION 3 / DENSITY 3; admin 4/3/6. This wave moved the site's first-person voice from "student seeking opportunities" to "developer delivering work" while keeping the honest student context (About section unchanged; "CS student at Al-Azhar University" retained inside the JSON-LD description).

## Language surfaces changed

All of these exist in BOTH en and ar dictionaries (verified this session — 17/17 new keys present in each; full-suite check: 185/185 HTML keys in both):

- `hero.role`, `hero.desc`, `hero.ai`, `hero.cta1` ("See my work"), `hero.cta2` ("Contact") — script.js diff
- `services.*` (5 keys) and `freelance.*` (4 keys) — new dictionary entries
- `contact.hire` ("Hire me" / "وظّفني")
- meta title/description, OG/Twitter descriptions, JSON-LD jobTitle/description — index.html + script.js
