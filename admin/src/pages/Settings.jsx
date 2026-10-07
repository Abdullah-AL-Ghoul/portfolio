import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { audit } from '../lib/api';
import { useToast } from '../App';

export default function Settings() {
  const [s, setS] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  useEffect(() => {
    supabase.from('site_settings').select('*').eq('id', 1).single()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setS(data);
      });
  }, []);

  async function save() {
    setBusy(true);
    setError('');
    try {
      let flags = s.feature_flags;
      if (typeof flags === 'string') {
        try { flags = JSON.parse(flags || '{}'); }
        catch { throw new Error('Feature flags is not valid JSON.'); }
      }
      const { error } = await supabase.from('site_settings').update({
        site_title_en: s.site_title_en,
        site_title_ar: s.site_title_ar,
        meta_description_en: s.meta_description_en,
        meta_description_ar: s.meta_description_ar,
        og_image_path: s.og_image_path,
        favicon_path: s.favicon_path,
        footer_en: s.footer_en,
        footer_ar: s.footer_ar,
        analytics_enabled: s.analytics_enabled,
        feature_flags: flags,
        updated_at: new Date().toISOString()
      }).eq('id', 1);
      if (error) throw error;
      await audit('settings', 'site_settings', '1', { keys: ['site_title', 'meta', 'flags'] });
      toast('Settings saved');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!s && !error) return <div className="empty">Loading…</div>;
  if (!s) return <div><div className="error-banner">{error}</div></div>;

  const set = (k) => (e) => setS((prev) => ({ ...prev, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <div>
      <h1 className="page-title">Site Settings</h1>
      <p className="page-sub">Metadata, footer, analytics switch, and feature flags.</p>
      {error && <div className="error-banner" role="alert">{error}</div>}
      <div className="card">
        <div className="grid2">
          <div>
            <label htmlFor="st-en">Site title (EN)</label>
            <input id="st-en" value={s.site_title_en} onChange={set('site_title_en')} />
            <label htmlFor="st-ar">Site title (AR)</label>
            <input id="st-ar" dir="rtl" value={s.site_title_ar} onChange={set('site_title_ar')} />
            <label htmlFor="md-en">Meta description (EN)</label>
            <textarea id="md-en" rows={2} value={s.meta_description_en} onChange={set('meta_description_en')} />
            <label htmlFor="md-ar">Meta description (AR)</label>
            <textarea id="md-ar" dir="rtl" rows={2} value={s.meta_description_ar} onChange={set('meta_description_ar')} />
          </div>
          <div>
            <label htmlFor="og">OG image path</label>
            <input id="og" value={s.og_image_path || ''} onChange={set('og_image_path')} />
            <label htmlFor="fv">Favicon path</label>
            <input id="fv" value={s.favicon_path || ''} onChange={set('favicon_path')} />
            <label htmlFor="ft-en">Footer text (EN)</label>
            <input id="ft-en" value={s.footer_en} onChange={set('footer_en')} />
            <label htmlFor="ft-ar">Footer text (AR)</label>
            <input id="ft-ar" dir="rtl" value={s.footer_ar} onChange={set('footer_ar')} />
            <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '1rem' }}>
              <input type="checkbox" style={{ width: 'auto' }} checked={s.analytics_enabled} onChange={set('analytics_enabled')} />
              Analytics enabled
            </label>
            <label htmlFor="flags">Feature flags (JSON)</label>
            <textarea id="flags" className="mono" rows={2} value={JSON.stringify(s.feature_flags ?? {}, null, 2)} onChange={set('feature_flags')} />
          </div>
        </div>
        <div className="row" style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button className="btn primary" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save settings'}</button>
        </div>
      </div>
    </div>
  );
}
