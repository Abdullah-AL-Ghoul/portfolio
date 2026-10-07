import { useEffect, useMemo, useState } from 'react';
import { listAll, create, update, softDelete, restore, purge, setStatus } from '../lib/api';

/**
 * Generic CRUD page driven by a field schema.
 * schema = {
 *   table, title, subtitle, orderBy,
 *   columns: [{key, label, render?}],
 *   fields: [{key, label, type: text|textarea|number|select|checkbox|tags|localized, options?, placeholder?}],
 *   defaults: {},
 *   statuses: bool — show draft/published/archived workflow
 * }
 * localized fields store {en, ar} JSON.
 */
export default function CrudPage({ schema }) {
  const [rows, setRows] = useState(null);
  const [trashed, setTrashed] = useState([]);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | row
  const [busy, setBusy] = useState(false);
  const [showTrashed, setShowTrashed] = useState(false);
  const [query, setQuery] = useState('');

  function load() {
    setError('');
    listAll(schema.table, { order: schema.orderBy || 'created_at', asc: false })
      .then((data) => {
        setRows(data.filter((r) => !r.deleted_at));
        setTrashed(data.filter((r) => r.deleted_at));
      })
      .catch((e) => setError(e.message));
  }
  useEffect(load, [schema.table]);

  const visible = useMemo(() => {
    if (!rows) return [];
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => JSON.stringify(r).toLowerCase().includes(q));
  }, [rows, query]);

  async function handleSave(form) {
    setBusy(true);
    try {
      const payload = {};
      for (const f of schema.fields) {
        if (f.type === 'json') {
          // JSON fields come from a textarea: parse and validate before saving.
          const raw = form[f.key];
          if (typeof raw === 'string') {
            try { payload[f.key] = raw.trim() ? JSON.parse(raw) : {}; }
            catch { throw new Error(`“${f.label}” is not valid JSON.`); }
          } else payload[f.key] = raw ?? {};
        } else {
          payload[f.key] = form[f.key];
        }
      }
      payload.status = form.status || 'draft';
      if (editing === 'new') await create(schema.table, { ...schema.defaults, ...payload });
      else await update(schema.table, editing.id, payload);
      setEditing(null);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function act(fn, ...args) {
    setBusy(true);
    try { await fn(...args); load(); } catch (e) { setError(e.message); } finally { setBusy(false); }
  }

  if (!rows && !error) return <div className="empty">Loading…</div>;

  return (
    <div>
      <h1 className="page-title">{schema.title}</h1>
      <p className="page-sub">{schema.subtitle}</p>
      {error && <div className="error-banner" role="alert">{error}</div>}

      <div className="row wrap" style={{ marginBottom: '1rem' }}>
        <input
          style={{ maxWidth: 280 }}
          type="search"
          placeholder="Search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={`Search ${schema.title}`}
        />
        <button className="btn sm" onClick={() => setShowTrashed((v) => !v)}>
          {showTrashed ? 'Hide trash' : `Trash (${trashed.length})`}
        </button>
        <div className="spacer" />
        <button className="btn primary" onClick={() => setEditing('new')}>+ New</button>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="data">
          <thead>
            <tr>
              {schema.columns.map((c) => <th key={c.key}>{c.label}</th>)}
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.id}>
                {schema.columns.map((c) => (
                  <td key={c.key}>{c.render ? c.render(row) : String(row[c.key] ?? '')}</td>
                ))}
                <td><span className={`badge ${row.status}`}>{row.status}</span></td>
                <td>
                  <div className="row-actions">
                    <button className="btn sm" onClick={() => setEditing(row)}>Edit</button>
                    {schema.statuses !== false && row.status !== 'published' && (
                      <button className="btn sm" disabled={busy} onClick={() => act(setStatus, schema.table, row.id, 'published')}>Publish</button>
                    )}
                    {schema.statuses !== false && row.status === 'published' && (
                      <button className="btn sm" disabled={busy} onClick={() => act(setStatus, schema.table, row.id, 'draft')}>Unpublish</button>
                    )}
                    <button className="btn sm danger" disabled={busy} onClick={() => {
                      if (window.confirm('Move to trash? You can restore it later.')) act(softDelete, schema.table, row.id);
                    }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visible.length && <div className="empty">No rows yet. Click “+ New” to add the first one.</div>}
      </div>

      {showTrashed && (
        <div className="card" style={{ padding: 0, overflowX: 'auto', marginTop: '1rem' }}>
          <table className="data">
            <thead><tr><th>Deleted rows</th><th>Actions</th></tr></thead>
            <tbody>
              {trashed.map((row) => (
                <tr key={row.id}>
                  <td>{row.title_en || row.name || row.person_name || row.id.slice(0, 8)}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn sm" disabled={busy} onClick={() => act(restore, schema.table, row.id)}>Restore</button>
                      <button className="btn sm danger" disabled={busy} onClick={() => {
                        if (window.confirm('Permanently delete? This cannot be undone.')) act(purge, schema.table, row.id);
                      }}>Delete forever</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!trashed.length && <div className="empty">Trash is empty.</div>}
        </div>
      )}

      {editing && (
        <EditDialog
          schema={schema}
          row={editing === 'new' ? { status: 'draft' } : editing}
          busy={busy}
          onCancel={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function EditDialog({ schema, row, busy, onCancel, onSave }) {
  const [form, setForm] = useState(() => {
    const init = { status: row.status || 'draft' };
    schema.fields.forEach((f) => {
      init[f.key] = row[f.key] ?? f.default ?? (f.type === 'checkbox' ? false : f.type === 'tags' || f.type === 'localized' ? (f.type === 'localized' ? { en: '', ar: '' } : '') : '');
    });
    return init;
  });

  function set(key, value) { setForm((f) => ({ ...f, [key]: value })); }

  function submit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <div className="dialog-backdrop" role="dialog" aria-modal="true" aria-label={`Edit ${schema.title}`}>
      <form className="dialog" onSubmit={submit}>
        <h3>{editing === 'new' ? 'New' : 'Edit'} — {schema.title}</h3>
        {schema.fields.map((f) => (
          <Field key={f.key} field={f} value={form[f.key]} onChange={(v) => set(f.key, v)} />
        ))}
        <label>Status</label>
        <select value={form.status} onChange={(e) => set('status', e.target.value)}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <div className="row" style={{ marginTop: '1.2rem', justifyContent: 'flex-end' }}>
          <button type="button" className="btn" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}

export function Field({ field, value, onChange }) {
  if (field.type === 'localized') {
    const v = value || { en: '', ar: '' };
    return (
      <fieldset style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '0.2rem 0.9rem 0.7rem', margin: '0.7rem 0 0' }}>
        <legend style={{ fontSize: '0.8rem', color: 'var(--text-dim)', padding: '0 0.3rem' }}>{field.label}</legend>
        <label>EN</label>
        <textarea rows={field.rows || 2} value={v.en || ''} onChange={(e) => onChange({ ...v, en: e.target.value })} />
        <label>AR</label>
        <textarea dir="rtl" rows={field.rows || 2} value={v.ar || ''} onChange={(e) => onChange({ ...v, ar: e.target.value })} />
      </fieldset>
    );
  }
  if (field.type === 'json') {
    const text = typeof value === 'string' ? value : JSON.stringify(value ?? {}, null, 2);
    return (
      <>
        <label htmlFor={`f-${field.key}`}>{field.label}</label>
        <textarea id={`f-${field.key}`} className="mono" rows={field.rows || 6} value={text} onChange={(e) => onChange(e.target.value)} />
      </>
    );
  }
  if (field.type === 'textarea') {
    return (
      <>
        <label htmlFor={`f-${field.key}`}>{field.label}</label>
        <textarea id={`f-${field.key}`} rows={field.rows || 3} value={value || ''} onChange={(e) => onChange(e.target.value)} />
      </>
    );
  }
  if (field.type === 'select') {
    return (
      <>
        <label htmlFor={`f-${field.key}`}>{field.label}</label>
        <select id={`f-${field.key}`} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          {(field.options || []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </>
    );
  }
  if (field.type === 'checkbox') {
    return (
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.8rem' }}>
        <input type="checkbox" style={{ width: 'auto' }} checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        {field.label}
      </label>
    );
  }
  if (field.type === 'tags') {
    return (
      <>
        <label htmlFor={`f-${field.key}`}>{field.label} <span className="muted">(comma-separated)</span></label>
        <input id={`f-${field.key}`} value={Array.isArray(value) ? value.join(', ') : value || ''} onChange={(e) => onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} />
      </>
    );
  }
  return (
    <>
      <label htmlFor={`f-${field.key}`}>{field.label}</label>
      <input id={`f-${field.key}`} type={field.type === 'number' ? 'number' : 'text'} value={value ?? ''} onChange={(e) => onChange(field.type === 'number' ? Number(e.target.value) : e.target.value)} />
    </>
  );
}
