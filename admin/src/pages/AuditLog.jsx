import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuditLog() {
  const [logs, setLogs] = useState(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(500)
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setLogs(data || []);
      });
  }, []);

  const visible = (logs || []).filter((l) =>
    !query || `${l.actor_email} ${l.action} ${l.entity} ${l.entity_id}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h1 className="page-title">Audit Log</h1>
      <p className="page-sub">Every sensitive dashboard action: who, what, when. Latest 500 entries.</p>
      {error && <div className="error-banner" role="alert">{error}</div>}
      <input type="search" placeholder="Search actor / action / entity…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ maxWidth: 320, marginBottom: '1rem' }} aria-label="Search audit log" />
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="data">
          <thead>
            <tr><th>When</th><th>Actor</th><th>Action</th><th>Entity</th><th>Details</th></tr>
          </thead>
          <tbody>
            {visible.map((l) => (
              <tr key={l.id}>
                <td className="muted">{new Date(l.created_at).toLocaleString()}</td>
                <td>{l.actor_email || '—'}</td>
                <td><span className="badge">{l.action}</span></td>
                <td className="mono">{l.entity}{l.entity_id ? `:${l.entity_id.slice(0, 12)}` : ''}</td>
                <td className="mono muted" style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {JSON.stringify(l.summary)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs && !visible.length && <div className="empty">No audit entries yet.</div>}
      </div>
    </div>
  );
}
