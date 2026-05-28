/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, lazy, Suspense, type ReactNode } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Nav from './components/Nav';
import ToastContainer from './components/ToastContainer';
import AIAssistant from './components/AIAssistant';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import CommandMenu from './components/CommandMenu';
import CursorGlow from './components/CursorGlow';
import ParticleBackground from './components/ParticleBackground';
import { Spinner } from './components/ui/Spinner';
import { INIT_USERS, INIT_POSTS, INIT_NOTIFS } from './data';
import { Button } from './components/ui/Button';

const Home = lazy(() => import('./pages/Home'));
const Community = lazy(() => import('./pages/Community'));
const Prompts = lazy(() => import('./pages/Prompts'));
const Lessons = lazy(() => import('./pages/Lessons'));
const Events = lazy(() => import('./pages/Events'));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('./pages/ResetPassword').then(m => ({ default: m.ResetPassword })));
const Admin = lazy(() => import('./pages/Admin'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Pricing = lazy(() => import('./pages/Pricing'));
const SystemCheck = lazy(() => import('./pages/SystemCheck'));
const PrivacyPolicy = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.PrivacyPolicy })));
const CookiePolicy = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.CookiePolicy })));
const TermsOfUse = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.TermsOfUse })));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-transition">
      {children}
    </div>
  );
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[70] h-[2px] bg-transparent">
      <div
        className="h-full bg-[var(--accent)] transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function SpotlightEffect() {
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('.spotlight-hover') as HTMLElement | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      target.style.setProperty('--mouse-x', `${x}%`);
      target.style.setProperty('--mouse-y', `${y}%`);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);
  return null;
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname.split('/')[1] || 'home';
  const setPage = (p: string) => navigate(`/${p === 'home' ? '' : p}`);

  const { user } = useAuth();

  const nameParts = user?.user_metadata?.full_name?.split(' ') || [];
  const currentUser = user ? {
    id: user.id,
    email: user.email,
    fname: nameParts[0] || 'Member',
    lname: nameParts.slice(1).join(' ') || '',
    initials: (user.user_metadata?.full_name?.[0] || 'A').toUpperCase(),
    role: 'Member',
    color: 'var(--blue)',
    tc: 'var(--bg-soft)',
    isAdmin: user.user_metadata?.role === 'admin' || user.email === 'admin@ailabsbg.com',
    plan: user.user_metadata?.plan || 'free'
  } : null;

  const [toasts, setToasts] = useState<any[]>([]);
  const [db, setDb] = useState<{users:any[], posts:any[], notifs:any[], lessonProg:any, savedPrompts:any[]}>({
    users: [], posts: [], notifs: [], lessonProg: {}, savedPrompts: []
  });

  useEffect(() => {
    try {
      const isSeeded = localStorage.getItem('ailabs_seeded');
      if (!isSeeded) {
        localStorage.setItem('ailabs_seeded', 'true');
        localStorage.setItem('ailabs_users', JSON.stringify(INIT_USERS));
        localStorage.setItem('ailabs_posts', JSON.stringify(INIT_POSTS));
        localStorage.setItem('ailabs_notifs', JSON.stringify(INIT_NOTIFS));
      }
      setDb({
        users: JSON.parse(localStorage.getItem('ailabs_users') || '[]'),
        posts: JSON.parse(localStorage.getItem('ailabs_posts') || '[]'),
        notifs: JSON.parse(localStorage.getItem('ailabs_notifs') || '[]'),
        lessonProg: JSON.parse(localStorage.getItem('ailabs_lessonProg') || '{}'),
        savedPrompts: JSON.parse(localStorage.getItem('ailabs_savedPrompts') || '[]'),
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const updateDb = (key: keyof typeof db, value: any) => {
    setDb(prev => ({ ...prev, [key]: value }));
    localStorage.setItem(`ailabs_${String(key)}`, JSON.stringify(value));
  };

  const showToast = (msg: string, isError = false) => {
    const t = { id: Date.now(), msg, isError };
    setToasts(prev => [...prev, t]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 3200);
  };

  const checkAuthThenGo = (p: string) => {
    if (!currentUser && (p === 'login' || p === 'register')) {
      navigate(`/${p}`);
      return;
    }
    if (!currentUser) { navigate('/login'); return; }
    navigate(`/${p === 'home' ? '' : p}`);
  };

function RequireAuth({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="section-shell py-20 text-center">
        <div className="premium-card p-10 max-w-md mx-auto">
          <h2 className="text-[18px] font-semibold text-[var(--ink-900)] mb-3">Разделът изисква профил</h2>
          <p className="text-[14px] text-[var(--text-secondary)] mb-6">Влезте, за да видите тази страница.</p>
          <Button variant="primary" onClick={() => navigate('/login')}>Вход</Button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

  const handleModal = (m: string) => {
    const path = m === 'signup' ? 'register' : m;
    navigate(`/${path}`, { state: path === 'login' ? { from: location.pathname } : undefined });
  };

  const props = { page, setPage, showToast, checkAuthThenGo, currentUser, setCurrentUser: () => {}, openModal: handleModal, db, updateDb };

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <ScrollProgress />
      <SpotlightEffect />
      <CursorGlow />
      <ParticleBackground />
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts(prev => prev.filter(x => x.id !== id))} />
      <CookieBanner />
      <CommandMenu />

      <Nav {...props} />

      <div className="flex-1">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <Spinner size="lg" className="text-[var(--accent)]" />
          </div>
        }>
          <Routes>
            <Route path="/" element={<PageTransition><Home {...props} /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
            <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
            <Route path="/community" element={<PageTransition><Community {...props} /></PageTransition>} />
            <Route path="/prompts" element={<PageTransition><Prompts {...props} /></PageTransition>} />
            <Route path="/lessons" element={<PageTransition><Lessons {...props} /></PageTransition>} />
            <Route path="/events" element={<PageTransition><Events {...props} /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About {...props} /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact {...props} /></PageTransition>} />
            <Route path="/pricing" element={<PageTransition><Pricing {...props} /></PageTransition>} />
            <Route path="/system-check" element={<PageTransition><SystemCheck /></PageTransition>} />
            <Route path="/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
            <Route path="/terms" element={<PageTransition><TermsOfUse /></PageTransition>} />
            <Route path="/cookie-policy" element={<PageTransition><CookiePolicy /></PageTransition>} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <PageTransition><Profile {...props} /></PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/admin" element={<PageTransition>{currentUser?.isAdmin ? <Admin {...props} /> : <Home {...props} />}</PageTransition>} />
            <Route path="*" element={<PageTransition><Home {...props} /></PageTransition>} />
          </Routes>
        </Suspense>
      </div>

      <AIAssistant currentPage={page} setPage={setPage} />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
