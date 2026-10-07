import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from '../App';

export default function Messages() {
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [starredOnly, setStarredOnly] = useState(false);
  const [openId, setOpenId] = useState(null);
  const toast = useToast();

  function load() {
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setMessages(data || []);
      });
  }
  useEffect(load, []);

  async function patch(id, fields) {
    const { error } = await supabase.from('contact_messages').update(patch).eq('id', id);
    if (error) return setError(error.message);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  async function toggleOpen(m) {
    setOpenId(openId === m.id ? null : m.id);
    if (m.status === 'new') patch(m.id, { status: 'in_review', read_at: new Date().toISOString() });
  }

  async function saveNote(id, notes) {
    const { error } = await supabase.from('contact_messages').update({ notes }).eq('id', id);
    if (!error) toast('Notes saved');
  }

  const visible = (messages || []).filter((m) => {
    if (filter !== 'all' && m.status !== filter) return false;
    if (starredOnly && !m.starred) return false;
    if (query) {
      const s = `${m.name} ${m.email} ${m.subject} ${m.message}`.toLowerCase();
      if (!s.includes(query.toLowerCase())) return false;
    }
    return true;
  });

  const unread = (messages || []).filter((m) => m.status === 'new').length;

  return (
    <div>
      <h1 className="page-title">Messages</h1>
      <p className="page-sub">Contact submissions — a lightweight inbox. Reading a “new” message moves it to “in review”.</p>
      {error && <div className="error-banner" role="alert">{error}</div>}
      <div className="row wrap" style={{ marginBottom: '1rem' }}>
        {['all', 'new', 'in_review', 'replied', 'archived'].map((s) => (
          <button key={s} className={`btn sm ${filter === s ? 'primary' : ''}`} onClick={() => setFilter(s)}>
            {s === 'all' ? 'All' : s.replace('_', ' ')}{s === 'new' && unread ? ` (${unread})` : ''}
          </button>
        ))}
        <div className="spacer" />
        <input type="search" placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ maxWidth: 220 }} aria-label="Search messages" />
        <button className="btn sm" onClick={() => setStarredOnly((v) => !v)}>{starredOnly ? '★ Starred' : '☆ All'}</button>
      </div>
      <div style={{ display: 'grid', gap: '0.6rem' }}>
        {visible.map((m) => (
          <div key={m.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <button
              onClick={() => {
                setOpenId(openId === m.id ? null : m.id);
                if (m.status === 'new') patch(m.id, { status: 'in_review', read_at: new Date().toISOString() });
              }}
              style={{ display: 'block', width: '100%', textAlign: 'start', background: 'none', border: 0, color: 'inherit', font: 'inherit', padding: '0.9rem 1.2rem', cursor: 'pointer' }}
              aria-expanded={openId === m.id}
            >
              <div className="row wrap">
                {m.status === 'new' && <span className="badge new">new</span>}
                <strong>{m.name}</strong>
                <span className="muted">&lt;{m.email}&gt;</span>
                <span className="spacer" />
                <span className="muted">{new Date(m.created_at).toLocaleString()}</span>
              </div>
              <div style={{ fontWeight: 600 }}>{m.subject}</div>
              {openId !== m.id && <div className="muted" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.message}</div>}
            </button>
            {openId === m.id && (
              <div style={{ padding: '1rem 1.2rem', borderTop: '1px solid var(--border)' }}>
                <p style={{ whiteSpace: 'pre-wrap' }}>{m.message}</p>
                <div className="muted mono">from {m.email} · {m.source_country || '—'}</div>
                <div className="row wrap" style={{ marginTop: '0.8rem' }}>
                  <button className="btn sm" onClick={() => patch(m.id, { status: m.status === 'replied' ? 'in_review' : 'replied' })}>
                    {m.status === 'replied' ? 'Mark in review' : 'Mark replied'}
                  </button>
                  <button className="btn sm" onClick={() => patch(m.id, { starred: !m.starred })}>{m.starred ? '★ Unstar' : '☆ Star'}</button>
                  <button className="btn sm" onClick={() => patch(m.id, { status: m.status === 'archived' ? 'in_review' : 'archived', archived_at: m.status === 'archived' ? null : new Date().toISOString() })}>
                    {m.status === 'archived' ? 'Unarchive' : 'Archive'}
                  </button>
                  <a className="btn sm" href={`mailto:${m.email}?subject=${encodeURIComponent('Re: ' + m.subject)}`}>Reply by email</a>
                </div>
                <label htmlFor={`n-${m.id}`} style={{ marginTop: '0.8rem' }}>Private notes</label>
                <textarea id={`n-${m.id}`} rows={2} defaultValue={m.notes} onBlur={(e) => patch(m.id, { notes: e.target.value })} />
              </div>
            )}
          </div>
        ))}
        {messages && !visible.length && <div className="empty">No messages match this filter.</div>}
      </div>
    </div>
  );
}
