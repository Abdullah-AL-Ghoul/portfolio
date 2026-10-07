import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SCHEMAS } from '../lib/schemas';
import { buildDraft } from '../lib/assistant';
import { Field } from '../components/CrudPage';
import { create } from '../lib/api';
import { useToast } from '../App';

const EXAMPLES = {
  projects: 'Task manager app in JavaScript with local storage',
  skills: 'React and Tailwind CSS (frontend)',
  certifications: 'Meta Front-End Developer certificate from Coursera',
  experiences: 'Freelance web developer building WordPress sites',
  recommendations: 'Dr. Ahmed, my lecturer, recommended me for programming'
};

export default function Assistant() {
  const navigate = useNavigate();
  const toast = useToast();
  const [schemaKey, setSchemaKey] = useState('projects');
  const [prompt, setPrompt] = useState('');
  const [draftState, setDraftState] = useState(null); // { schema, entry, draft } from generation
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const entry = SCHEMAS[schemaKey];

  function generate() {
    setError('');
    const q = prompt.trim();
    if (!q) { setError('Describe what you want to add first — in Arabic or English.'); return; }
    try {
      const result = buildDraft(schemaKey, q);
      setDraftState(result);
      // Initialize the editable form from the generated draft.
      const init = { status: 'draft' };
      result.schema.fields.forEach((f) => {
        init[f.key] = result.draft[f.key];
      });
      if (!('status' in result.draft)) init.status = 'draft';
      setForm(init);
    } catch (e) {
      setError(e.message);
    }
  }

  function setField(key, value) { setForm((f) => ({ ...f, [key]: value })); }

  async function saveDraft() {
    if (!form) return;
    setBusy(true);
    setError('');
    try {
      const payload = {};
      const schema = draftState.schema;
      for (const f of schema.fields) {
        if (f.type === 'json') {
          const raw = form[f.key];
          try { payload[f.key] = typeof raw === 'string' ? (raw.trim() ? JSON.parse(raw) : {}) : (raw ?? {}); }
          catch { throw new Error(`“${f.label}” is not valid JSON.`); }
        } else {
          payload[f.key] = form[f.key];
        }
      }
      if (form.status) payload.status = form.status;
      const row = await create(schema.table, { ...schema.defaults, ...payload });
      toast(`${entry.singular.charAt(0).toUpperCase() + entry.singular.slice(1)} created as a draft — edit or publish it whenever you like.`);
      navigate(`/${schema.table === 'experiences' ? 'experience' : schema.table}`, { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1 className="page-title">Smart Assistant</h1>
      <p className="page-sub">
        Describe the content you want — in Arabic or English — and the assistant
        drafts a ready-to-review entry. You can edit every field before saving.
      </p>
      {error && <div className="error-banner" role="alert">{error}</div>}

      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,420px) 1fr', gap: '1.2rem', alignItems: 'start' }}>
        <div className="card">
          <label htmlFor="asst-type">Content type</label>
          <select id="asst-type" value={schemaKey} onChange={(e) => { setSchemaKey(e.target.value); setPrompt(''); setDraftState(null); setForm(null); }}>
            {Object.entries(SCHEMAS).map(([key, e]) => (
              <option key={key} value={key}>{e.label}</option>
            ))}
          </select>
          <label htmlFor="asst-prompt">Describe what to add</label>
          <textarea
            id="asst-prompt"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={EXAMPLES[schemaKey] || 'e.g. ' + entry.prompt}
          />
          <button className="btn primary" style={{ marginTop: '0.9rem', width: '100%' }} onClick={generate}>
            ✨ Generate draft
          </button>
          <p className="muted" style={{ marginTop: '0.8rem', fontSize: '0.82rem' }}>
            The draft generator runs fully in your browser — no data leaves the
            dashboard. It fills bilingual fields and common defaults; review every
            field before saving.
          </p>
        </div>

        <div className="card">
          {!draftState && (
            <div className="empty" style={{ minHeight: 220 }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>🧠</div>
              Your generated draft will appear here for review.
            </div>
          )}
          {draftState && form && (
            <form onSubmit={(e) => { e.preventDefault(); saveDraft(); }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0 }}>Review draft — {entry.label}</h3>
                <div className="row">
                  <button type="button" className="btn sm" onClick={() => { setDraftState(null); setForm(null); }}>Discard</button>
                  <button type="submit" className="btn sm primary" disabled={busy}>{busy ? 'Saving…' : 'Save entry'}</button>
                </div>
              </div>
              {draftState.schema.fields.map((f) => (
                <Field key={f.key} field={f} value={form[f.key]} onChange={(v) => setField(f.key, v)} />
              ))}
              <label>Status</label>
              <select value={form.status || 'draft'} onChange={(e) => setField('status', e.target.value)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              <div className="row" style={{ marginTop: '1.2rem', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn primary" disabled={busy}>{busy ? 'Saving…' : 'Save entry'}</button>
              </div>
            </form>
          )}
          {draftState && !form && <div className="empty">No draft yet — describe content above.</div>}
        </div>
      </div>
    </div>
  );
}
