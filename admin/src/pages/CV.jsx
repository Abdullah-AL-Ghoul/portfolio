import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { audit } from '../lib/api';
import { useToast } from '../App';

/*
 * CV management: upload → list versions → set active.
 * The public site always receives the active published version via
 * /api/cv-download (counts downloads; storage stays private).
 */
export default function CVPage() {
  const [versions, setVersions] = useState(null);
  const [label, setLabel] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  function load() {
    supabase.from('cv_versions').select('*').order('uploaded_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setVersions(data || []);
      });
  }
  useEffect(load, []);

  async function upload(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError('');
    if (file.type !== 'application/pdf') return setError('CV must be a PDF.');
    if (file.size > 10 * 1024 * 1024) return setError('CV exceeds 10 MB.');
    setBusy(true);
    try {
      const path = `cv/${Date.now()}-cv.pdf`;
      const { error } = await supabase.storage.from('cv').upload(path, file, { contentType: 'application/pdf', upsert: false });
      if (error) throw error;
      const { error: dbError } = await supabase.from('cv_versions').insert({
        storage_path: path,
        version_label: label || file.name.replace(/\.pdf$/i, ''),
        file_size: file.size,
        is_active: false,
        is_published: true
      });
      if (dbError) throw dbError;
      await audit('cv', 'cv_versions', path, { size: file.size });
      setLabel('');
      toast('CV uploaded — activate it to publish');
      load();
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }

  async function activate(v) {
    setBusy(true);
    try {
      // Single active version: deactivate all, then activate the chosen one.
      await supabase.from('cv_versions').update({ is_active: false }).neq('id', v.id);
      const { error } = await supabase.from('cv_versions').update({ is_active: true, is_published: true }).eq('id', v.id);
      if (error) throw error;
      await audit('cv_activate', 'cv_versions', v.storage_path);
      toast('CV activated — public downloads now use this version');
      load();
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }

  async function unpublish(v) {
    setBusy(true);
    try {
      const { error } = await supabase.from('cv_versions').update({ is_published: false }).eq('id', v.id);
      if (error) throw error;
      await audit('cv_unpublish', 'cv_versions', v.storage_path);
      load();
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }

  return (
    <div>
      <h1 className="page-title">CV</h1>
      <p className="page-sub">
        All versions are kept. The active published version is what visitors download.
        If no version is active, the bundled static CV is served.
      </p>
      {error && <div className="error-banner" role="alert">{error}</div>}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <label htmlFor="cv-label">Version label</label>
        <input id="cv-label" placeholder="e.g. 2026-10 update" value={label} onChange={(e) => setLabel(e.target.value)} style={{ maxWidth: 320 }} />
        <label htmlFor="cv-file">Upload PDF (max 10 MB)</label>
        <input id="cv-file" type="file" accept="application/pdf" onChange={upload} disabled={busy} />
        {busy && <p className="muted">Uploading…</p>}
      </div>
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="data">
          <thead>
            <tr><th>Version</th><th>Uploaded</th><th>Size</th><th>Downloads</th><th>State</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {(versions || []).map((v) => (
              <tr key={v.id}>
                <td>{v.version_label}</td>
                <td>{new Date(v.uploaded_at).toLocaleString()}</td>
                <td>{Math.round((v.file_size || 0) / 1024)} KB</td>
                <td>{v.download_count}</td>
                <td>
                  {v.is_active ? <span className="badge published">active</span> : <span className="badge archived">stored</span>}
                  {!v.is_published && <span className="badge draft"> unpublished</span>}
                </td>
                <td>
                  <div className="row-actions">
                    {!v.is_active && <button className="btn sm" disabled={busy} onClick={() => activate(v)}>Activate</button>}
                    {v.is_active && v.is_published && <button className="btn sm" disabled={busy} onClick={() => unpublish(v)}>Unpublish</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {versions && !versions.length && <div className="empty">No CV versions uploaded yet — the bundled static CV is served.</div>}
      </div>
    </div>
  );
}
