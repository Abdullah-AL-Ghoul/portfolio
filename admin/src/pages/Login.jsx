import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSession, useToast } from '../App';
import { signIn } from '../lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const session = useSession();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (session) navigate(location.state?.from || '/', { replace: true });
  }, [session]);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const { error } = await signIn(email.trim(), password);
    setBusy(false);
    if (error) {
      setError(error.message === 'Invalid login credentials' ? 'Invalid email or password.' : error.message);
      return;
    }
    toast('Welcome back');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '1rem' }}>
      <form onSubmit={submit} className="card" style={{ width: 'min(400px, 100%)' }} aria-labelledby="login-title">
        <h1 id="login-title" className="page-title" style={{ marginBottom: 0 }}>
          <span style={{ fontFamily: 'var(--mono)', color: 'var(--accent)' }}>&gt;_</span> Portfolio Admin
        </h1>
        <p className="page-sub">Sign in to manage your portfolio.</p>
        {error && <div className="error-banner" role="alert">{error}</div>}
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn primary" style={{ marginTop: '1.2rem', width: '100%' }} disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
