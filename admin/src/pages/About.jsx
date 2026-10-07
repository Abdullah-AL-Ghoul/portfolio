import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { audit } from '../lib/api';
import { useToast } from '../App';

/*
 * About is a single JSONB document (about_profile, id=1).
 * The editor edits it as JSON with live validation — simple and lossless.
 */
export default function About() {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  useEffect(() => {
    supabase.from('about_profile').select('data').eq('id', 1).single()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setText(JSON.stringify(data?.data ?? {}, null, 2));
      });
  }, []);

  async function save() {
    setBusy(true);
    setError('');
    try {
      const parsed = JSON.parse(text);
      const { error } = await supabase.from('about_profile')
        .update({ data: parsed, updated_at: new Date().toISOString() })
        .eq('id', 1);
      if (error) throw error;
      await audit('update', 'about_profile', '1', { keys: Object.keys(parsed) });
      toast('About saved — the public site picks it up within a minute');
    } catch (e) {
      setError(e instanceof SyntaxError ? 'Invalid JSON: ' + e.message : e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1 className="page-title">About</h1>
      <p className="page-sub">
        Single JSON document driving the Hero + About + Contact texts (headline, status, paragraphs, strengths, education, availability…).
        Structure: keys with {'{ "en": "...", "ar": "..." }'} values.
      </p>
      {error && <div className="error-banner" role="alert">{error}</div>}
      <div className="card">
        <label htmlFor="about-json">About document (JSON)</label>
        <textarea id="about-json" className="mono" style={{ minHeight: 420 }} value={text} onChange={(e) => setText(e.target.value)} dir="ltr" />
        <div className="row" style={{ marginTop: '1rem', justifyContent: 'flex-end' }}>
          <button className="btn primary" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}
