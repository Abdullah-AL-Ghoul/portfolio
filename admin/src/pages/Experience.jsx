import CrudPage from '../components/CrudPage';

const KINDS = [
  { value: 'employment', label: 'Employment' },
  { key: 'internship', value: 'internship', label: 'Internship' },
  { value: 'independent', label: 'Independent technical work' },
  { value: 'academic', label: 'Academic project / milestone' },
  { value: 'volunteer', label: 'Volunteer' }
].map((k) => ({ value: k.value ?? k.key, label: k.label }));

export default function Experience() {
  return (
    <CrudPage
      schema={{
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
      }}
    />
  );
}
