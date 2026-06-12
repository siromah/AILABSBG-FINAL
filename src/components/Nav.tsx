import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import {
  Bell,
  Menu,
  Home,
  MessageSquare,
  Sparkles,
  GraduationCap,
  Calendar,
  Search,
  User,
  Bookmark,
  LogOut,
  X,
  Tag
} from 'lucide-react';
import { Avatar } from './ui/Avatar';

export default function Nav({ page, setPage, openModal, db, updateDb, showToast, currentUser }: any) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const unreadCount = db?.notifs?.filter((n:any) => !n.read).length || 0;

  const [mobMenu, setMobMenu] = useState(false);
  const [notifPanel, setNotifPanel] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdown(false);
        setNotifPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (p: string) => {
    setPage(p);
    setMobMenu(false);
    setNotifPanel(false);
    setUserDropdown(false);
    window.scrollTo(0, 0);
  };

  const activeClass = "font-medium text-[var(--accent)] bg-[var(--accent-light)]";
  const inactiveClass = "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-soft)]";

  const navLinks = [
    {id: 'home', label: 'Начало', icon: Home, route: '/'},
    {id: 'lessons', label: 'Академия', icon: GraduationCap, route: '/lessons'},
    {id: 'prompts', label: 'Prompt-и', icon: Sparkles, route: '/prompts'},
    {id: 'community', label: 'Общност', icon: MessageSquare, route: '/community'},
    {id: 'events', label: 'Събития', icon: Calendar, route: '/events'},
    {id: 'pricing', label: 'Цени', icon: Tag, route: '/pricing'},
  ];

  return (
    <>
      <nav className={`sticky top-0 z-40 h-[56px] transition-all duration-300 ${scrolled ? 'retina-glass nav-scrolled' : 'bg-transparent'}`}>
        <div className="section-shell h-full flex items-center justify-between">

          {/* LEFT: Logo */}
          <div className="flex items-center gap-6 h-full">
            <div className="cursor-pointer flex items-center gap-2.5" onClick={() => go('home')}>
              <div className="w-8 h-8 rounded-xl bg-[var(--gradient-premium)] flex items-center justify-center shadow-sm">
                <div className="w-3 h-3 bg-white/90 rounded-[4px]" />
              </div>
              <span className="font-display font-medium text-[17px] tracking-tight text-[var(--ink-900)]">AILABS.BG</span>
            </div>

            {/* CENTER (Desktop): Nav Links */}
            <div className="hidden md:flex items-center gap-1 h-full">
              {navLinks.map(item => (
                <NavLink
                  key={item.id}
                  to={item.route}
                  end={item.route === '/'}
                  className={({ isActive }) => `text-[13px] h-9 px-3.5 rounded-full flex items-center transition-all duration-200 ${isActive ? activeClass : inactiveClass}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* RIGHT: Search + Notif + Theme + Avatar */}
          <div className="flex items-center gap-1 md:gap-1.5 relative" ref={dropdownRef}>
            <button
              className="p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full hover:bg-[var(--bg-soft)] transition-colors hidden sm:flex"
              onClick={() => navigate('/prompts')}
              aria-label="Търси в prompt-ите"
            >
              <Search size={17} />
            </button>

            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {currentUser && (
              <div className="relative">
                <button
                  className={`p-2.5 rounded-full transition-colors relative ${notifPanel ? 'bg-[var(--bg-soft)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-soft)]'}`}
                  onClick={() => { setNotifPanel(!notifPanel); setUserDropdown(false); }}
                >
                  <Bell size={17} />
                  {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--accent)] rounded-full border-2 border-[var(--bg)]" />}
                </button>

                <AnimatePresence>
                  {notifPanel && (
                    <motion.div
                      initial={{opacity: 0, y: 8, scale: 0.97}} animate={{opacity: 1, y: 0, scale: 1}} exit={{opacity: 0, y: 8, scale: 0.97}} transition={{duration: 0.18, ease: [0.16,1,0.3,1]}}
                      className="absolute top-[calc(100%+8px)] right-0 w-80 retina-card z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-[var(--border)] flex justify-between items-center">
                        <span className="font-semibold text-[13px]">Известия</span>
                        <button className="text-[11px] text-[var(--accent)] font-medium hover:text-[var(--accent-hover)]" onClick={() => updateDb('notifs', db.notifs.map((n:any) => ({...n, read: true})))}>Маркирай всички</button>
                      </div>
                      <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {!db?.notifs?.length ? (
                          <div className="p-5 text-center text-[var(--text-secondary)] text-[13px]">Все още няма известия.</div>
                        ) : (
                          db.notifs.slice(0, 10).map((n:any) => (
                            <div key={n.id} className={`p-3.5 border-b border-[var(--border)] flex gap-3 ${!n.read ? 'bg-[var(--accent-light)]/40' : ''}`}>
                              <div className="flex-1">
                                <p className={`text-[12px] text-[var(--text-primary)] ${!n.read ? 'font-medium' : 'font-normal'}`}>{n.text}</p>
                                <p className="text-[10px] text-[var(--text-tertiary)] mt-1">Току-що</p>
                              </div>
                              {!n.read && <div className="w-2 h-2 rounded-full bg-[var(--accent)] mt-1" />}
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {!currentUser ? (
              <div className="hidden md:flex gap-2 ml-1">
                <button className="h-9 px-4 text-[13px] font-medium text-[var(--text-primary)] hover:bg-[var(--bg-soft)] rounded-full transition-colors" onClick={() => navigate('/login')}>Вход</button>
                <button className="h-9 px-4 text-[13px] font-medium text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-full transition-colors shadow-sm" onClick={() => navigate('/register')}>Започни безплатно</button>
              </div>
            ) : (
              <div className="relative hidden md:block ml-1">
                <button onClick={() => { setUserDropdown(!userDropdown); setNotifPanel(false); }} className="focus:outline-none">
                  <Avatar size="sm" initials={currentUser.initials} />
                </button>

                <AnimatePresence>
                  {userDropdown && (
                    <motion.div
                      initial={{opacity: 0, y: 8, scale: 0.97}} animate={{opacity: 1, y: 0, scale: 1}} exit={{opacity: 0, y: 8, scale: 0.97}} transition={{duration: 0.18, ease: [0.16,1,0.3,1]}}
                      className="absolute top-[calc(100%+8px)] right-0 w-52 retina-card z-50 py-2"
                    >
                      <div className="px-3.5 py-2 border-b border-[var(--border)] mb-1.5 truncate">
                        <p className="font-semibold text-[13px] text-[var(--text-primary)]">{currentUser.fname} {currentUser.lname}</p>
                        <p className="text-[11px] text-[var(--text-secondary)] truncate">{currentUser.email || 'user@example.com'}</p>
                      </div>

                      <button onClick={() => go('profile')} className="w-full text-left px-3.5 py-1.5 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-soft)] hover:text-[var(--text-primary)] flex items-center gap-2 rounded-lg mx-1">
                        <User size={15} /> Профил
                      </button>
                      <button onClick={() => go('prompts')} className="w-full text-left px-3.5 py-1.5 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-soft)] hover:text-[var(--text-primary)] flex items-center gap-2 rounded-lg mx-1">
                        <Bookmark size={15} /> Запазени prompt-и
                      </button>

                      <div className="h-px bg-[var(--border)] my-1.5 mx-3" />

                      <button onClick={async () => { await signOut(); go('home'); showToast('Успешен изход'); }} className="w-full text-left px-3.5 py-1.5 text-[13px] text-[var(--rose)] hover:bg-[var(--rose-light)] flex items-center gap-2 rounded-lg mx-1">
                        <LogOut size={15} /> Изход
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Hamburger Mobile */}
            <button className="md:hidden p-2 text-[var(--text-secondary)] rounded-full hover:bg-[var(--bg-soft)] ml-1 transition-colors" onClick={() => setMobMenu(true)}>
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobMenu && (
          <>
            <motion.div
              initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{duration: 0.2}}
              className="fixed inset-0 bg-[var(--ink-900)]/15 backdrop-blur-sm z-50"
              onClick={() => setMobMenu(false)}
            />
            <motion.div
              initial={{x: '-100%'}} animate={{x: 0}} exit={{x: '-100%'}} transition={{type: 'spring', bounce: 0, duration: 0.4}}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-[var(--surface-strong)] z-[60] shadow-2xl flex flex-col"
            >
              <div className="p-4 flex items-center justify-between border-b border-[var(--border)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[var(--gradient-premium)] flex justify-center items-center">
                    <div className="w-3 h-3 bg-white/90 rounded-[4px]" />
                  </div>
                  <span className="font-display font-medium text-[16px] text-[var(--ink-900)]">AILABS.BG</span>
                </div>
                <button onClick={() => setMobMenu(false)} className="p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-soft)] rounded-full transition-colors"><X size={18}/></button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
                {navLinks.map(item => (
                  <NavLink
                    key={item.id}
                    to={item.route}
                    end={item.route === '/'}
                    onClick={() => setMobMenu(false)}
                    className={({ isActive }) => `flex items-center gap-3 px-3 py-3 rounded-xl text-[14px] font-medium transition-colors ${isActive ? 'bg-[var(--accent-light)] text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-soft)]'}`}
                  >
                    <item.icon size={18} className={page === item.id ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'} />
                    {item.label}
                  </NavLink>
                ))}
              </div>

              <div className="p-3 border-t border-[var(--border)]">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-[13px] text-[var(--text-secondary)]">Тема</span>
                  <ThemeToggle />
                </div>
                {!currentUser ? (
                  <div className="flex flex-col gap-2">
                    <button className="h-10 text-[14px] font-medium border border-[var(--border)] rounded-xl hover:bg-[var(--bg-soft)] transition-colors" onClick={() => { setMobMenu(false); navigate('/login'); }}>Вход</button>
                    <button className="h-10 text-[14px] font-medium rounded-xl bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors" onClick={() => { setMobMenu(false); navigate('/register'); }}>Започни безплатно</button>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-3 px-2">
                      <Avatar size="md" initials={currentUser.initials} />
                      <div>
                        <div className="text-[14px] font-semibold text-[var(--text-primary)]">{currentUser.fname} {currentUser.lname}</div>
                        <div className="text-[12px] text-[var(--text-secondary)]">Член</div>
                      </div>
                    </div>
                    <button className="flex items-center gap-3 px-3 py-2 rounded-xl text-[14px] text-[var(--text-secondary)] hover:bg-[var(--bg-soft)] transition-colors" onClick={() => go('profile')}><User size={17}/> Профил</button>
                    <button className="flex items-center gap-3 px-3 py-2 rounded-xl text-[14px] text-[var(--rose)] hover:bg-[var(--rose-light)] transition-colors" onClick={async () => { await signOut(); go('home'); }}><LogOut size={17}/> Изход</button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
