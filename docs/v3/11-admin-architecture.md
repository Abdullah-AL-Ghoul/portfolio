# V3 Admin Dashboard Architecture

## Shape

React 18 + Vite SPA, deployed as a separate Vercel project (root dir `admin/`). Session-gated (`RequireAuth`), 16 routes inside Shell (admin/src/App.jsx route table — `services` and `profiles` added this wave at the paths shown in the diff). Pages are thin wrappers over `CrudPage`, which is driven by declarative schemas in `admin/src/lib/schemas.jsx`.

## What V3 added

### New pages (routes + sidebar)
- `/services` → `admin/src/pages/Services.jsx` (6 lines: `<CrudPage schema={serviceSchema} />`), route added in App.jsx diff, sidebar entry "Services" in Shell.jsx's Manage group.
- `/profiles` → `admin/src/pages/Profiles.jsx`, sidebar label "Freelance Profiles" (Shell.jsx diff).

### Schemas (admin/src/lib/schemas.jsx, +64 lines)
- **serviceSchema**: table `services`, orderBy `sort_order`; fields slug, title_en/ar, summary_en/ar, features (JSON textarea of `{en,ar}`), technologies (tags), related_project_keys (tags), icon (lucide name), cta_label_en/ar, sort_order. Defaults: empty arrays, icon 'code', sort_order 0.
- **profileSchema**: table `professional_profiles`, orderBy `display_order`; platform select (upwork/khamsat/mostaql/freelancer/contra/linkedin/custom), display_name, username, profile_url, bilingual title/description, icon, is_active, is_featured, display_order. Subtitle encodes the protocol: "Real platforms where you have an active profile — never invent one."
- **Judgment call (flagged in the wave):** the pinned `/api/content` contract uses separate `_en`/`_ar` DB columns, so both schemas use separate `_en`/`_ar` text fields (like projectSchema) rather than the CrudPage `localized` type, which would store `{en,ar}` into a single column and break the contract.

### Smart Assistant (admin/src/lib/assistant.js, +5 lines)
- `buildDraft` switch: `technologies` ← detected stack; `related_project_keys` ← `[]`; `features` ← bilingual `[{en, ar}]` from the request text (AR detection picks which side gets the raw text).
- Only `'services'` was added to the SCHEMAS assistant registry (schemas.jsx SCHEMAS diff) — the plan line covers "Assistant generates service drafts" only. `professional_profiles` is exported and routed but intentionally absent from the assistant dropdown. Caveat for later: `Assistant.jsx saveDraft` navigates to `/${schema.table}`; for `professional_profiles` that hits the catch-all `/` redirect — a route alias or nav tweak would be needed first.

### Analytics (admin/src/pages/Analytics.jsx, +49/−6)
- Two new breakdowns computed from `analytics_events`, grouped by `event_target`, top-8 sorted, guarded for empty data (render "No … yet." empty states):
  - **Service CTA clicks** — `service_cta_click` rows → horizontal bar chart (amber), event_target = service slug (Analytics.jsx diff hunk @@-78).
  - **Freelance profile clicks** — `freelance_profile_click` rows → bar chart (red fill), event_target = platform.
- Conversions list extended with `hire_me_click`; one new stat tile **"Hire-me clicks"** joins CV downloads and Contact submissions.
- Breakdowns derive from event types already in the api/track.js whitelist, so charts populate only once those events actually fire (post-deployment, post-migration).

## Build status

`npm --prefix admin run build` run this session: **passes** (vite build, output: index CSS 7.27 kB, index JS 65.93 kB gzip 18.67 kB, vendor 390.95 kB, charts 411.54 kB; built in 42.64s). The workflow gate reruns it as authoritative.

## Not changed

Login/RequireAuth, api.js CRUD helpers, AuditLog, Media, CV, Messages, Settings, Assistant page itself — untouched by this wave's diff (git diff --stat: admin changes confined to App.jsx, Shell.jsx, assistant.js, schemas.jsx, Analytics.jsx + two new page files).
