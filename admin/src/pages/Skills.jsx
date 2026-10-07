import CrudPage from '../components/CrudPage';

export default function Skills() {
  return (
    <CrudPage
      schema={{
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
      }}
    />
  );
}
