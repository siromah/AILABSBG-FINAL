/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-transition">
      {children}
    </div>
  );
}
import Home from './pages/Home';
import Community from './pages/Community';
import Prompts from './pages/Prompts';
import Lessons from './pages/Lessons';
import Events from './pages/Events';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Admin from './pages/Admin';
import About from './pages/About';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import SystemCheck from './pages/SystemCheck';
import Nav from './components/Nav';
import ToastContainer from './components/ToastContainer';
import AIAssistant from './components/AIAssistant';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import CommandMenu from './components/CommandMenu';

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
import { PrivacyPolicy, CookiePolicy, TermsOfUse } from './pages/LegalPages';
import { INIT_USERS, INIT_POSTS, INIT_NOTIFS } from './data';
import { Button } from './components/ui/Button';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname.split('/')[1] || 'home';
  const setPage = (p: string) => navigate(`/${p === 'home' ? '' : p}`);

  const { user } = useAuth();

  const currentUser = user ? {
    id: user.id,
    email: user.email,
    fname: user.user_metadata?.full_name?.split(' ')[0] || 'Member',
    lname: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
    initials: (user.user_metadata?.full_name?.[0] || 'A').toUpperCase(),
    role: 'Member',
    color: 'var(--blue)',
    tc: 'var(--bg-soft)',
    isAdmin: false
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

  const RequireAuth = ({ children }: any) => {
    if (!currentUser) {
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
    return children;
  };

  const handleModal = (m: string) => {
    navigate(`/${m === 'signup' ? 'register' : m}`);
  };

  const props = { page, setPage, showToast, checkAuthThenGo, currentUser, setCurrentUser: () => {}, openModal: handleModal, db, updateDb };

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollProgress />
      <SpotlightEffect />
      <ToastContainer toasts={toasts} />
      <CookieBanner />
      <CommandMenu />

      <Nav {...props} />

      <div className="flex-1">
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
