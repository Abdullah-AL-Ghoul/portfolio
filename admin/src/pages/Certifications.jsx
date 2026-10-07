import CrudPage from '../components/CrudPage';

export default function Certifications() {
  return (
    <CrudPage
      schema={{
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
      }}
    />
  );
}
