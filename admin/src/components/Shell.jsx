import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { signOut } from '../lib/api';
import { useSession } from '../App';

const NAV = [
  ['Overview', '/'],
  ['Projects', '/projects'],
  ['Skills', '/skills'],
  ['Certifications', '/certifications'],
  ['Experience', '/experience'],
  ['Recommendations', '/recommendations'],
  ['About', '/about'],
  ['Messages', '/messages'],
  ['Analytics', '/analytics'],
  ['Media', '/media'],
  ['CV', '/cv'],
  ['Settings', '/settings'],
  ['Audit Log', '/audit']
];

export default function Shell() {
  const session = useSession();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <div className="shell">
      <aside className="sidebar" aria-label="Admin navigation">
        <span className="brand"><span>&gt;_</span> Admin</span>
        {NAV.map(([label, to]) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
            {label}
          </NavLink>
        ))}
        <div className="spacer" />
        <div className="muted" style={{ padding: '0.4rem 0.8rem', wordBreak: 'break-all' }}>
          {session?.user?.email}
        </div>
        <button className="btn sm" onClick={handleSignOut}>Sign out</button>
      </aside>
      <main className="content" id="main">
        <Outlet />
      </main>
    </div>
  );
}
