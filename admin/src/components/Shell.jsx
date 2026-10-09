import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { signOut } from '../lib/api';
import { useSession } from '../App';

const NAV = [
  { group: 'Manage', items: [
    { label: 'Overview', to: '/', icon: '▦' },
    { label: 'Projects', to: '/projects', icon: '◈' },
    { label: 'Services', to: '/services', icon: '◈' },
    { label: 'Freelance Profiles', to: '/profiles', icon: '◈' },
    { label: 'Skills', to: '/skills', icon: '◈' },
    { label: 'Certifications', to: '/certifications', icon: '◈' },
    { label: 'Experience', to: '/experience', icon: '◈' },
    { label: 'Recommendations', to: '/recommendations', icon: '◈' },
    { label: 'About', to: '/about', icon: '◈' }
  ]},
  { group: 'Create with AI', items: [
    { label: 'Smart Assistant', to: '/assistant', icon: '✧' }
  ]},
  { group: 'Communication', items: [
    { label: 'Messages', to: '/messages', icon: '✉' }
  ]},
  { group: 'Intelligence', items: [
    { label: 'Analytics', to: '/analytics', icon: '◔' }
  ]},
  { group: 'System', items: [
    { label: 'Media', to: '/media', icon: '▣' },
    { label: 'CV', to: '/cv', icon: '◫' },
    { label: 'Settings', to: '/settings', icon: '⚙' },
    { label: 'Audit Log', to: '/audit', icon: '⧉' }
  ]}
];

export default function Shell() {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Close the mobile drawer on route change.
  useEffect(() => { setOpen(false); }, [location.pathname]);

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  const current = NAV.flatMap((g) => g.items).find((i) => i.to !== '/' && location.pathname.startsWith(i.to))?.label || 'Overview';

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Admin navigation">
        <span className="brand"><span>&gt;_</span> Admin</span>
        {NAV.map((g) => (
          <div key={g.group} className="nav-group">
            <span className="nav-heading">{g.group}</span>
            {g.items.map((i) => (
              <NavLink key={i.to} to={i.to} end={i.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
                <span className="nav-icon">{i.icon}</span> {i.label}
              </NavLink>
            ))}
          </div>
        ))}
        <div className="spacer" />
        <div className="muted" style={{ padding: '0.4rem 0.8rem', wordBreak: 'break-all' }}>
          {session?.user?.email}
        </div>
        <button className="btn sm" onClick={handleSignOut}>Sign out</button>
      </aside>
      <header className="topbar">
        <button className="btn sm hamburger" aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>☰</button>
        <div className="page-kicker">{current}</div>
        <div className="spacer" />
        <NavLink to="/assistant" className="btn sm primary assistant-cta">✨ Smart Assistant</NavLink>
        <button className="btn sm" onClick={handleSignOut}>Sign out</button>
      </header>
      <main className="content" id="main">
        <Outlet />
      </main>
    </div>
  );
}
