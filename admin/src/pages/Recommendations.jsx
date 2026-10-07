import CrudPage from '../components/CrudPage';

export default function Recommendations() {
  return (
    <CrudPage
      schema={{
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
      }}
    />
  );
}
