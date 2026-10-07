import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { audit } from '../lib/api';
import { useToast } from '../App';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'];

function safeName(name) {
  const ext = (name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
  const base = name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60);
  return `${Date.now()}-${base || 'file'}.${ext}`;
}

export default function Media() {
  const [assets, setAssets] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);
  const toast = useToast();

  function load() {
    supabase.from('media_assets').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setAssets(data || []);
      });
  }
  useEffect(load, []);

  async function upload(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError('');
    // Client-side pre-checks; the storage bucket + RLS re-check server-side.
    if (!ALLOWED.includes(file.type)) return setError(`Type not allowed: ${file.type}`);
    if (file.size > MAX_SIZE) return setError('File exceeds 5 MB.');
    setBusy(true);
    try {
      const path = `uploads/${safeName(file.name)}`;
      const { error } = await supabase.storage.from('media').upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      await supabase.from('media_assets').insert({
        bucket: 'media', path, mime: file.type, size_bytes: file.size, used_by: ''
      });
      await audit('media', 'media_assets', path, { size: file.size, mime: file.type });
      toast('Uploaded');
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(asset) {
    if (!window.confirm(`Delete ${asset.path}?`)) return;
    setBusy(true);
    try {
      const { error } = await supabase.storage.from('media').remove([asset.path]);
      if (error) throw error;
      await supabase.from('media_assets').delete().eq('id', asset.id);
      await audit('delete', 'media_assets', asset.path);
      load();
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }

  function publicUrl(path) {
    const { data } = supabase.storage.from('media').getPublicUrl(path);
    return data?.publicUrl || '';
  }

  return (
    <div>
      <h1 className="page-title">Media</h1>
      <p className="page-sub">Project images, certificate scans, avatars. Max 5 MB — JPEG/PNG/WebP/SVG/PDF.</p>
      {error && <div className="error-banner" role="alert">{error}</div>}
      <div className="row" style={{ marginBottom: '1rem' }}>
        <input ref={fileRef} type="file" accept={ALLOWED.join(',')} onChange={upload} disabled={busy} style={{ maxWidth: 320 }} />
        {busy && <span className="muted">Uploading…</span>}
      </div>
      <div className="grid3">
        {(assets || []).map((a) => (
          <div key={a.id} className="card">
            {a.mime.startsWith('image/') && (
              <img src={publicUrl(a.path)} alt={a.alt_en || a.path} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: '0.6rem' }} loading="lazy" />
            )}
            <div className="mono" style={{ wordBreak: 'break-all' }}>{a.path}</div>
            <div className="muted">{Math.round(a.size_bytes / 1024)} KB · {a.mime}</div>
            <div className="row" style={{ marginTop: '0.6rem' }}>
              <input placeholder="used_by e.g. projects:my-slug" value={a.used_by} onChange={async (e) => {
                await supabase.from('media_assets').update({ used_by: e.target.value }).eq('id', a.id);
                setAssets((prev) => prev.map((x) => (x.id === a.id ? { ...x, used_by: e.target.value } : x)));
              }} style={{ fontSize: '0.8rem' }} />
              <button className="btn sm danger" onClick={() => remove(a)} disabled={busy}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {assets && !assets.length && <div className="empty">No media uploaded yet.</div>}
    </div>
  );
}
