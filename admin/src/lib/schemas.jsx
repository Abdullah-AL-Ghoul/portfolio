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

export const serviceSchema = {
  table: 'services',
  title: 'Services',
  subtitle: 'What I build — shown on the public site. Published rows only; order by sort_order.',
  orderBy: 'sort_order',
  columns: [
    { key: 'title_en', label: 'Title' },
    { key: 'slug', label: 'Slug', render: (r) => <span className="mono">{r.slug}</span> },
    { key: 'technologies', label: 'Stack', render: (r) => (r.technologies || []).slice(0, 3).join(', ') }
  ],
  defaults: { features: [], technologies: [], related_project_keys: [], icon: 'code', cta_label_en: '', cta_label_ar: '', sort_order: 0 },
  fields: [
    { key: 'slug', label: 'Slug (URL key)', type: 'text', placeholder: 'my-service' },
    { key: 'title_en', label: 'Title (EN)', type: 'text' },
    { key: 'title_ar', label: 'Title (AR)', type: 'text' },
    { key: 'summary_en', label: 'Summary (EN)', type: 'textarea', rows: 2 },
    { key: 'summary_ar', label: 'Summary (AR)', type: 'textarea', rows: 2 },
    { key: 'features', label: 'Features (JSON array of {en, ar} objects)', type: 'json', rows: 8, default: [] },
    { key: 'technologies', label: 'Technologies', type: 'tags' },
    { key: 'related_project_keys', label: 'Related project slugs', type: 'tags' },
    { key: 'icon', label: 'Icon (lucide name)', type: 'text', default: 'code' },
    { key: 'cta_label_en', label: 'CTA label (EN)', type: 'text', default: '' },
    { key: 'cta_label_ar', label: 'CTA label (AR)', type: 'text', default: '' },
    { key: 'sort_order', label: 'Sort order', type: 'number', default: 0 }
  ]
};

export const profileSchema = {
  table: 'professional_profiles',
  title: 'Freelance Profiles',
  subtitle: 'Real platforms where you have an active profile — never invent one. Published freely to the public site.',
  orderBy: 'display_order',
  columns: [
    { key: 'platform', label: 'Platform', render: (r) => <span className="badge">{r.platform}</span> },
    { key: 'display_name', label: 'Name' },
    { key: 'username', label: 'Username', render: (r) => <span className="mono">{r.username}</span> },
    { key: 'is_featured', label: 'Featured', render: (r) => (r.is_featured ? '★' : '—') }
  ],
  defaults: { is_active: true, is_featured: false, display_order: 0, icon: 'external-link', title_en: '', title_ar: '', description_en: '', description_ar: '' },
  fields: [
    { key: 'platform', label: 'Platform', type: 'select', options: [
      { value: 'upwork', label: 'Upwork' },
      { value: 'khamsat', label: 'Khamsat' },
      { value: 'mostaql', label: 'Mostaql' },
      { value: 'freelancer', label: 'Freelancer' },
      { value: 'contra', label: 'Contra' },
      { value: 'linkedin', label: 'LinkedIn' },
      { value: 'custom', label: 'Custom' }
    ]},
    { key: 'display_name', label: 'Display name', type: 'text' },
    { key: 'username', label: 'Username/handle', type: 'text', default: '' },
    { key: 'profile_url', label: 'Profile URL', type: 'text' },
    { key: 'title_en', label: 'Title (EN)', type: 'text', default: '' },
    { key: 'title_ar', label: 'Title (AR)', type: 'text', default: '' },
    { key: 'description_en', label: 'Description (EN)', type: 'textarea', rows: 2, default: '' },
    { key: 'description_ar', label: 'Description (AR)', type: 'textarea', rows: 2, default: '' },
    { key: 'icon', label: 'Icon (lucide name)', type: 'text', default: 'external-link' },
    { key: 'is_active', label: 'Active', type: 'checkbox' },
    { key: 'is_featured', label: 'Featured', type: 'checkbox' },
    { key: 'display_order', label: 'Display order', type: 'number', default: 0 }
  ]
};

export const SCHEMAS = {
  projects: { label: 'Project', singular: 'project', plural: 'projects', schema: projectSchema, prompt: 'Add a project with a title, summary, tech stack, and optional links.' },
  services: { label: 'Service', singular: 'service', plural: 'services', schema: serviceSchema, prompt: 'Add a service (e.g. a full-stack web app) with a title, summary, and tech stack.' },
  skills: { label: 'Skill', singular: 'skill', plural: 'skills', schema: skillSchema, prompt: 'Add a skill with a name and category (programming/networking/tools/frontend/ai/learning).' },
  certifications: { label: 'Certification', singular: 'certification', plural: 'certifications', schema: certificationSchema, prompt: 'Add a certification with title, issuer, and issue date.' },
  experiences: { label: 'Experience', singular: 'experience', plural: 'experiences', schema: experienceSchema, prompt: 'Add an experience entry (employment/internship/academic/volunteer) with title, org, and summary.' },
  recommendations: { label: 'Recommendation', singular: 'recommendation', plural: 'recommendations', schema: recommendationSchema, prompt: 'Add a recommendation from a person with their role and a quote.' }
};

export { slugify };
