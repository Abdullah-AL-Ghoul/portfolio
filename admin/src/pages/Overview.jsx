import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [liveSessions, setLiveSessions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const since30 = new Date(Date.now() - 30 * 86400000).toISOString();
      const since5m = new Date(Date.now() - 5 * 60000).toISOString();

      const [ev, msgs, cv, sess, vis] = await Promise.all([
        supabase.from('analytics_events').select('event_type,ts').gte('ts', since30).limit(20000),
        supabase.from('contact_messages').select('status,created_at').limit(1000),
        supabase.from('cv_versions').select('download_count,is_active').order('uploaded_at', { ascending: false }).limit(20),
        supabase.from('visitor_sessions').select('last_seen,page_count,exit_page,country,device').gte('last_seen', since5m).limit(50),
        supabase.from('anonymous_visitors').select('id', { count: 'exact', head: true })
      ]);

      if (sess.error) { setError(sess.error.message); return; }
      const events = (ev.data || []).filter((e) => e.event_type === 'page_view');
      if (!cancelled) setLiveSessions(sess.data || []);
      setStats({
        views30: events.length,
        visitors: vis.count || 0,
        unread: (msgs.data || []).filter((m) => m.status === 'new').length,
        cv: (cv.data || []).reduce((sum, v) => sum + (v.download_count || 0), 0),
        liveCount: (sess.data || []).length
      });
    }

    load();
    const timer = setInterval(load, 30000); // live view refreshes every 30s
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);

  if (error) return <div><div className="error-banner">{error}</div></div>;
  if (!stats) return <div className="empty">Loading overview…</div>;

  return (
    <div>
      <h1 className="page-title">Overview</h1>
      <p className="page-sub">Last 30 days · real, privacy-preserving analytics.</p>
      <div className="stat-grid">
        <div className="card stat-card"><div className="stat-num">{stats.views30}</div><div className="stat-label">Page views · 30d</div></div>
        <div className="card stat-card"><div className="stat-num">{stats.unread}</div><div className="stat-label">New messages</div></div>
        <div className="card stat-card"><div className="stat-num">{stats.cv}</div><div className="stat-label">CV downloads (all versions)</div></div>
        <div className="card stat-card"><div className="stat-num">{liveSessions.length}</div><div className="stat-label">Live now</div></div>
      </div>

      <div className="grid2">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Live activity</h3>
          <p className="muted">Sessions active in the last 5 minutes.</p>
          {liveSessions.length ? (
            <table className="data">
              <thead><tr><th>Page</th><th>Country</th><th>Device</th><th>Last seen</th></tr></thead>
              <tbody>
                {liveSessions.map((s) => (
                  <tr key={s.last_seen + s.exit_page}>
                    <td className="mono">{s.exit_page || '/'}</td>
                    <td>{s.country || '—'}</td>
                    <td>{s.device}</td>
                    <td className="muted">{new Date(s.last_seen).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="empty">No active visitors right now.</div>}
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Quick links</h3>
          <p className="muted">Common owner tasks.</p>
          <div className="row wrap">
            <Link className="btn sm" to="/projects">Manage projects</Link>
            <Link className="btn sm" to="/cv">Upload CV</Link>
            <Link className="btn sm" to="/messages">Inbox</Link>
            <Link className="btn sm" to="/analytics">Analytics</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
