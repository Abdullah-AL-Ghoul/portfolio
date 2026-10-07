import CrudPage from '../components/CrudPage';

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function Projects() {
  return (
    <CrudPage
      schema={{
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
      }}
    />
  );
}
