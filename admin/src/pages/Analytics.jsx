import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend, CartesianGrid
} from 'recharts';

const COLORS = ['#06b6d4', '#a855f7', '#34d399', '#fbbf24', '#f87171', '#60a5fa'];
const RANGES = [
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 }
];

function sinceIso(days) {
  return new Date(Date.now() - days * 86400000).toISOString();
}

export default function Analytics() {
  const [range, setRange] = useState(30);
  const [events, setEvents] = useState(null);
  const [visitors, setVisitors] = useState(null);
  const [sessions, setSessions] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    const after = sinceIso(range);
    Promise.all([
      supabase.from('analytics_events').select('*').gte('ts', after).order('ts', { ascending: true }).limit(20000),
      supabase.from('anonymous_visitors').select('*').limit(5000),
      supabase.from('visitor_sessions').select('*').gte('started_at', after).limit(20000)
    ]).then(([e, v, s]) => {
      if (e.error) setError(e.error.message);
      setEvents(e.data || []);
      setVisitors(v.data || []);
      setSessions(s.data || []);
    });
  }, [range]);

  const derived = useMemo(() => {
    if (!events) return null;
    const dayKey = (ts) => new Date(ts).toISOString().slice(0, 10);

    // Views per day
    const perDay = {};
    events.filter((e) => e.event_type === 'page_view').forEach((e) => {
      perDay[dayKey(e.ts)] = (perDay[dayKey(e.ts)] || 0) + 1;
    });
    const viewsSeries = Object.entries(perDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, views]) => ({ day: day.slice(5), views }));

    // Unique visitors per day (first-seen)
    const uniq = {};
    sessions.forEach((s) => {
      const d = dayKey(s.started_at);
      (uniq[d] = uniq[d] || new Set()).add(s.visitor_id);
    });
    const uniqSeries = Object.entries(uniq)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, set]) => ({ day: day.slice(5), visitors: set.size }));

    // Pages
    const pages = {};
    events.filter((e) => e.event_type === 'page_view').forEach((e) => {
      const p = (e.page_path || '/').split('?')[0] || '/';
      pages[p] = (pages[p] || 0) + 1;
    });
    const topPages = Object.entries(pages).map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views).slice(0, 8);

    // Project popularity
    const projects = {};
    events.filter((e) => e.event_type === 'project_view').forEach((e) => {
      projects[e.event_target] = (projects[e.event_target] || 0) + 1;
    });
    const topProjects = Object.entries(projects).map(([name, views]) => ({ name, views }))
      .sort((a, b) => b.views - a.views).slice(0, 8);

    // Conversions
    const conv = {};
    ['cv_download', 'contact_submit', 'contact_open', 'github_click', 'live_demo_click', 'outbound_click', 'social_link_click'].forEach((t) => {
      conv[t] = events.filter((e) => e.event_type === t).length;
    });

    // Audience aggregates
    const byDevice = {};
    const byBrowser = {};
    const byCountry = {};
    visitors.forEach((v) => {
      byDevice[v.device] = (byDevice[v.device] || 0) + 1;
      if (v.browser) byBrowser[v.browser] = (byBrowser[v.browser] || 0) + 1;
      if (v.country) byCountry[v.country] = (byCountry[v.country] || 0) + 1;
    });
    const pie = (obj) => Object.entries(obj).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value).slice(0, 6);

    const returning = visitors.filter((v) => v.session_count > 1).length;

    return {
      viewsSeries, uniqSeries, topPages, topProjects, conv,
      devices: pie(byDevice), browsers: pie(byBrowser), countries: pie(byCountry),
      totalViews: events.filter((e) => e.event_type === 'page_view').length,
      totalSessions: sessions.length,
      totalVisitors: visitors.length,
      returning
    };
  }, [events, sessions, visitors]);

  if (!derived && !error) return <div className="empty">Loading analytics…</div>;
  if (error && !events) return <div><div className="error-banner">{error}</div></div>;

  return (
    <div>
      <h1 className="page-title">Analytics</h1>
      <p className="page-sub">Real, privacy-preserving data — anonymous IDs only, no raw IPs. Events older than 90 days are purged.</p>
      <div className="row wrap" style={{ marginBottom: '1.2rem' }}>
        {RANGES.map((r) => (
          <button key={r.days} className={`btn sm ${range === r.days ? 'primary' : ''}`} onClick={() => setRange(r.days)}>{r.label}</button>
        ))}
      </div>
      <div className="stat-grid">
        <div className="card stat-card"><div className="stat-num">{derived.totalViews}</div><div className="stat-label">Page views</div></div>
        <div className="card stat-card"><div className="stat-num">{derived.totalSessions}</div><div className="stat-label">Sessions</div></div>
        <div className="card stat-card"><div className="stat-num">{derived.totalVisitors}</div><div className="stat-label">Unique visitors</div></div>
        <div className="card stat-card"><div className="stat-num">{derived.totalVisitors ? Math.round((derived.returning / derived.totalVisitors) * 100) : 0}%</div><div className="stat-label">Returning</div></div>
        <div className="card stat-card"><div className="stat-num">{derived.conv.cv_download}</div><div className="stat-label">CV downloads</div></div>
        <div className="card stat-card"><div className="stat-num">{derived.conv.contact_submit}</div><div className="stat-label">Contact submissions</div></div>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3 style={{ marginTop: 0 }}>Page views</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={derived.viewsSeries}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="day" stroke="#9a9ab0" fontSize={11} />
            <YAxis stroke="#9a9ab0" fontSize={11} allowDecimals={false} />
            <Tooltip contentStyle={{ background: '#101020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
            <Area type="monotone" dataKey="views" stroke="#06b6d4" fill="url(#g1)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid2">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Top pages</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={derived.topPages} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="path" type="category" stroke="#9a9ab0" fontSize={11} width={120} />
              <Tooltip contentStyle={{ background: '#101020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
              <Bar dataKey="views" fill="#a855f7" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Project popularity</h3>
          {derived.topProjects.length
            ? <ResponsiveContainer width="100%" height={200}>
                <BarChart data={derived.topProjects} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#9a9ab0" fontSize={11} width={140} />
                  <Tooltip contentStyle={{ background: '#101020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                  <Bar dataKey="views" fill="#34d399" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            : <div className="empty">No project views yet.</div>}
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Devices</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={derived.devices} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                {derived.devices.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip contentStyle={{ background: '#101020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Countries (coarse)</h3>
          {derived.countries.length
            ? <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={derived.countries} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                    {derived.countries.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip contentStyle={{ background: '#101020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            : <div className="empty">No geo data yet.</div>}
        </div>
      </div>
    </div>
  );
}
