import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { getSession, onAuthChange } from './lib/api';
import Login from './pages/Login.jsx';
import Shell from './components/Shell.jsx';
import Overview from './pages/Overview.jsx';
import Projects from './pages/Projects.jsx';
import Skills from './pages/Skills.jsx';
import Assistant from './pages/Assistant.jsx';
import Certifications from './pages/Certifications.jsx';
import Experience from './pages/Experience.jsx';
import Recommendations from './pages/Recommendations.jsx';
import About from './pages/About.jsx';
import Settings from './pages/Settings.jsx';
import Media from './pages/Media.jsx';
import CV from './pages/CV.jsx';
import Messages from './pages/Messages.jsx';
import Analytics from './pages/Analytics.jsx';
import AuditLog from './pages/AuditLog.jsx';

const SessionCtx = createContext(null);
export const useSession = () => useContext(SessionCtx);

// Toast context: lightweight app-wide notifications.
const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((message, kind = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toast-wrap" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.kind}`}>{t.message}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

function RequireAuth({ children }) {
  const session = useSession();
  const location = useLocation();
  if (session === undefined) return <div className="empty">Loading…</div>;
  if (!session) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

export default function App() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    getSession().then(({ data }) => setSession(data?.session ?? null));
    return onAuthChange((s) => setSession(s));
  }, []);

  return (
    <ToastProvider>
      <SessionCtx.Provider value={session}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RequireAuth><Shell /></RequireAuth>}>
            <Route index element={<Overview />} />
            <Route path="projects" element={<Projects />} />
            <Route path="assistant" element={<Assistant />} />
            <Route path="skills" element={<Skills />} />
            <Route path="certifications" element={<Certifications />} />
            <Route path="experience" element={<Experience />} />
            <Route path="recommendations" element={<Recommendations />} />
            <Route path="about" element={<About />} />
            <Route path="media" element={<Media />} />
            <Route path="cv" element={<CV />} />
            <Route path="messages" element={<Messages />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="audit" element={<AuditLog />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SessionCtx.Provider>
    </ToastProvider>
  );
}
