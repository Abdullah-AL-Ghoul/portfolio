// Shared CRUD field schemas — used by CrudPage pages AND the Assistant
// so content can be created from a natural-language request the same way
// the "New" form does.

const slugify = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const projectSchema = {
  table: 'projects',
  title: 'Projects',
  subtitle: 'Case studies shown on the public site. Featured rank 1 takes the hero slot.',
  orderBy: 'sort_order',
  columns: [
    { key: 'title_en', label: 'Title' },
    { key: 'slug', label: 'Slug', render: (r) => <span className="mono">{r.slug}</span> },
    { key: 'stack', label: 'Stack', render: (r) => (r.stack || []).slice(0, 3).join(', ') },
    { key: 'is_featured', label: 'Featured', render: (r) => (r.is_featured ? `★ ${r.featured_rank || ''}` : '—') }
  ],
  defaults: { legacy_key: '', featured_rank: 0, sort_order: 0, case_study: {} },
  fields: [
    { key: 'slug', label: 'Slug (URL key)', type: 'text', placeholder: 'my-project' },
    { key: 'legacy_key', label: 'Legacy key (p1…p7 — must match the static site key)', type: 'text' },
    { key: 'title_en', label: 'Title (EN)', type: 'text' },
    { key: 'title_ar', label: 'Title (AR)', type: 'text' },
    { key: 'badge_en', label: 'Badge (EN)', type: 'text', default: '' },
    { key: 'badge_ar', label: 'Badge (AR)', type: 'text', default: '' },
    { key: 'summary_en', label: 'Summary (EN)', type: 'textarea', rows: 3 },
    { key: 'summary_ar', label: 'Summary (AR)', type: 'textarea', rows: 3 },
    { key: 'stack', label: 'Technologies', type: 'tags' },
    { key: 'live_url', label: 'Live URL', type: 'text' },
    { key: 'repo_url', label: 'Repository URL', type: 'text' },
    { key: 'extra_url', label: 'Extra link (e.g. diagram)', type: 'text' },
    { key: 'cover_path', label: 'Cover image (media path)', type: 'text' },
    { key: 'is_featured', label: 'Featured project', type: 'checkbox' },
    { key: 'featured_rank', label: 'Featured rank (1 = primary)', type: 'number', default: 0 },
    { key: 'sort_order', label: 'Sort order', type: 'number', default: 0 },
    { key: 'case_study', label: 'Case study (JSON: problem/approach/implementation/outcome ×en/ar, challenges[])', type: 'json', rows: 8, default: {} }
  ]
};

export const skillSchema = {
  table: 'skills',
  title: 'Skills',
  subtitle: 'Grouped by category on the public site. Tiers only where supportable (1=Beginner … 4=Expert).',
  orderBy: 'sort_order',
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category', render: (r) => <span className="mono">{r.category}</span> },
    { key: 'tier', label: 'Tier', render: (r) => r.tier ?? '—' },
    { key: 'enabled', label: 'Enabled', render: (r) => (r.enabled ? '✓' : '—') }
  ],
  defaults: { tier: null, sort_order: 0, enabled: true, related_projects: [] },
  fields: [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'name_ar', label: 'Name (AR)', type: 'text', default: '' },
    { key: 'category', label: 'Category key (programming/networking/tools/frontend/ai/learning)', type: 'text' },
    { key: 'tier', label: 'Tier 1-4 (only if you can honestly support it)', type: 'number', default: null },
    { key: 'note_en', label: 'Note (EN)', type: 'text', default: '' },
    { key: 'note_ar', label: 'Note (AR)', type: 'text', default: '' },
    { key: 'related_projects', label: 'Related project slugs', type: 'tags' },
    { key: 'enabled', label: 'Enabled', type: 'checkbox' },
    { key: 'sort_order', label: 'Sort order', type: 'number', default: 0 }
  ]
};

export const certificationSchema = {
  table: 'certifications',
  title: 'Certifications',
  subtitle: 'Only verified credentials. Never invent dates or issuers.',
  orderBy: 'sort_order',
  columns: [
    { key: 'title_en', label: 'Title' },
    { key: 'issuer_en', label: 'Issuer' },
    { key: 'issued_on', label: 'Issued' }
  ],
  defaults: { icon: 'badge-check', sort_order: 0 },
  fields: [
    { key: 'title_en', label: 'Title (EN)', type: 'text' },
    { key: 'title_ar', label: 'Title (AR)', type: 'text' },
    { key: 'issuer_en', label: 'Issuer (EN)', type: 'text', default: '' },
    { key: 'issuer_ar', label: 'Issuer (AR)', type: 'text', default: '' },
    { key: 'issued_on', label: 'Issued on (as written on the certificate, e.g. "Aug 2026")', type: 'text', default: '' },
    { key: 'credential_url', label: 'Credential URL', type: 'text', default: '' },
    { key: 'credential_id', label: 'Credential ID', type: 'text', default: '' },
    { key: 'image_path', label: 'Certificate image (media path)', type: 'text', default: '' },
    { key: 'icon', label: 'Icon (lucide name)', type: 'text', default: 'badge-check' },
    { key: 'relevance_en', label: 'Relevance (EN)', type: 'text', default: '' },
    { key: 'relevance_ar', label: 'Relevance (AR)', type: 'text', default: '' },
    { key: 'sort_order', label: 'Sort order', type: 'number', default: 0 }
  ]
};

export const experienceSchema = {
  table: 'experiences',
  title: 'Experience',
  subtitle: 'Clearly distinguish employment, internships, independent work, academic projects, and volunteering.',
  orderBy: 'sort_order',
  columns: [
    { key: 'title_en', label: 'Title' },
    { key: 'kind', label: 'Kind', render: (r) => <span className="badge">{r.kind}</span> },
    { key: 'period_en', label: 'Period' }
  ],
  defaults: { details_en: [], details_ar: [] },
  fields: [
    { key: 'kind', label: 'Kind', type: 'select', options: [
      { value: 'employment', label: 'Employment' },
      { value: 'internship', label: 'Internship' },
      { value: 'independent', label: 'Independent technical work' },
      { value: 'academic', label: 'Academic project' },
      { value: 'volunteer', label: 'Volunteer' }
    ]},
    { key: 'title_en', label: 'Title (EN)', type: 'text' },
    { key: 'title_ar', label: 'Title (AR)', type: 'text' },
    { key: 'org_en', label: 'Organization (EN)', type: 'text', default: '' },
    { key: 'org_ar', label: 'Organization (AR)', type: 'text', default: '' },
    { key: 'period_en', label: 'Period (EN)', type: 'text', default: '' },
    { key: 'period_ar', label: 'Period (AR)', type: 'text', default: '' },
    { key: 'summary_en', label: 'Summary (EN)', type: 'textarea', rows: 2 },
    { key: 'summary_ar', label: 'Summary (AR)', type: 'textarea', rows: 2 },
    { key: 'details_en', label: 'Details (EN)', type: 'tags' },
    { key: 'details_ar', label: 'Details (AR)', type: 'tags' },
    { key: 'sort_order', label: 'Sort order', type: 'number', default: 0 }
  ]
};

export const recommendationSchema = {
  table: 'recommendations',
  title: 'Recommendations',
  subtitle: 'Genuine professional evidence only. The strongest one is featured.',
  orderBy: 'sort_order',
  columns: [
    { key: 'person_name', label: 'Person' },
    { key: 'role_en', label: 'Role' },
    { key: 'is_featured', label: 'Featured', render: (r) => (r.is_featured ? '★' : '—') }
  ],
  defaults: { is_featured: false, sort_order: 0 },
  fields: [
    { key: 'person_name', label: 'Person name', type: 'text' },
    { key: 'role_en', label: 'Role (EN)', type: 'text', default: '' },
    { key: 'role_ar', label: 'Role (AR)', type: 'text', default: '' },
    { key: 'org_en', label: 'Organization (EN)', type: 'text', default: '' },
    { key: 'org_ar', label: 'Organization (AR)', type: 'text', default: '' },
    { key: 'relationship', label: 'Relationship (e.g. Lecturer, Teammate)', type: 'text', default: '' },
    { key: 'quote_en', label: 'Recommendation (EN)', type: 'textarea', rows: 4 },
    { key: 'quote_ar', label: 'Recommendation (AR)', type: 'textarea', rows: 4 },
    { key: 'avatar_path', label: 'Avatar (media path)', type: 'text', default: '' },
    { key: 'profile_url', label: 'Profile link (LinkedIn…)', type: 'text', default: '' },
    { key: 'recommended_on', label: 'Date', type: 'text', default: '' },
    { key: 'is_featured', label: 'Feature prominently', type: 'checkbox' },
    { key: 'sort_order', label: 'Sort order', type: 'number', default: 0 }
  ]
};

export const SCHEMAS = {
  projects: { label: 'Project', singular: 'project', plural: 'projects', schema: projectSchema, prompt: 'Add a project with a title, summary, tech stack, and optional links.' },
  skills: { label: 'Skill', singular: 'skill', plural: 'skills', schema: skillSchema, prompt: 'Add a skill with a name and category (programming/networking/tools/frontend/ai/learning).' },
  certifications: { label: 'Certification', singular: 'certification', plural: 'certifications', schema: certificationSchema, prompt: 'Add a certification with title, issuer, and issue date.' },
  experiences: { label: 'Experience', singular: 'experience', plural: 'experiences', schema: experienceSchema, prompt: 'Add an experience entry (employment/internship/academic/volunteer) with title, org, and summary.' },
  recommendations: { label: 'Recommendation', singular: 'recommendation', plural: 'recommendations', schema: recommendationSchema, prompt: 'Add a recommendation from a person with their role and a quote.' }
};

export { slugify };
