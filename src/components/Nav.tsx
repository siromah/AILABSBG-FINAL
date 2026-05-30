import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGsapNav } from '../hooks/useGsapNav';
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
  Users,
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
  const navRef = useGsapNav();

  const [mobMenu, setMobMenu] = useState(false);
  const [notifPanel, setNotifPanel] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

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

  const go = (p: string) => {
    setPage(p);
    setMobMenu(false);
    setNotifPanel(false);
    setUserDropdown(false);
    window.scrollTo(0, 0);
  };

  const activeClass = "font-semibold text-[var(--text-primary)] bg-[var(--ink-900)]/[0.05]";
  const inactiveClass = "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--ink-900)]/[0.03]";

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
      <nav ref={navRef} className="sticky top-0 z-40 h-[52px] retina-glass transition-all duration-300">
        <div className="section-shell h-full flex items-center justify-between">

          {/* LEFT: Logo */}
          <div className="flex items-center gap-5 h-full">
            <div className="cursor-pointer flex items-center gap-2" onClick={() => go('home')}>
              <div className="w-7 h-7 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] rounded-[10px] flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white/90 rounded-[3px]" />
              </div>
              <span className="font-semibold text-[15px] tracking-[-0.02em] text-[var(--ink-900)]">AILABS.BG</span>
            </div>

            {/* CENTER (Desktop): Nav Links */}
            <div className="hidden md:flex items-center gap-0.5 h-full">
              {navLinks.map(item => (
                <NavLink
                  key={item.id}
                  to={item.route}
                  end={item.route === '/'}
                  className={({ isActive }) => `text-[13px] h-8 px-3 rounded-full flex items-center transition-all duration-200 ${isActive ? activeClass : inactiveClass}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* RIGHT: Search + Notif + Theme + Avatar */}
          <div className="flex items-center gap-0.5 md:gap-1 relative" ref={dropdownRef}>
            <button
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full hover:bg-[var(--ink-900)]/[0.04] transition-colors hidden sm:flex"
              onClick={() => navigate('/prompts')}
              aria-label="Търси в prompt-ите"
            >
              <Search size={16} />
            </button>

            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {currentUser && (
              <div className="relative">
                <button
                  className={`p-2 rounded-full transition-colors relative ${notifPanel ? 'bg-[var(--ink-900)]/[0.05] text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--ink-900)]/[0.04]'}`}
                  onClick={() => { setNotifPanel(!notifPanel); setUserDropdown(false); }}
                >
                  <Bell size={16} />
                  {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--rose)] rounded-full border border-[var(--bg)]" />}
                </button>

                {/* Notifs Dropdown */}
                <AnimatePresence>
                  {notifPanel && (
                    <motion.div
                      initial={{opacity: 0, y: 8, scale: 0.97}} animate={{opacity: 1, y: 0, scale: 1}} exit={{opacity: 0, y: 8, scale: 0.97}} transition={{duration: 0.18, ease: [0.16,1,0.3,1]}}
                      className="absolute top-[calc(100%+6px)] right-0 w-80 retina-card z-50 overflow-hidden"
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
                            <div key={n.id} className={`p-3.5 border-b border-[var(--border)] flex gap-3 ${!n.read ? 'bg-[var(--accent-light)]/20' : ''}`}>
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
                <button className="h-8 px-4 text-[13px] font-medium text-[var(--text-primary)] hover:bg-[var(--ink-900)]/[0.04] rounded-full transition-colors" onClick={() => navigate('/login')}>Вход</button>
                <button className="h-8 px-4 text-[13px] font-medium text-white bg-[var(--ink-900)] hover:bg-[var(--ink-700)] rounded-full transition-colors shadow-sm" onClick={() => navigate('/register')}>Започни безплатно</button>
              </div>
            ) : (
              <div className="relative hidden md:block ml-1">
                <button onClick={() => { setUserDropdown(!userDropdown); setNotifPanel(false); }} className="focus:outline-none">
                  <Avatar size="sm" initials={currentUser.initials} />
                </button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {userDropdown && (
                    <motion.div
                      initial={{opacity: 0, y: 8, scale: 0.97}} animate={{opacity: 1, y: 0, scale: 1}} exit={{opacity: 0, y: 8, scale: 0.97}} transition={{duration: 0.18, ease: [0.16,1,0.3,1]}}
                      className="absolute top-[calc(100%+6px)] right-0 w-52 retina-card z-50 py-2"
                    >
                      <div className="px-3.5 py-2 border-b border-[var(--border)] mb-1.5 truncate">
                        <p className="font-semibold text-[13px] text-[var(--text-primary)]">{currentUser.fname} {currentUser.lname}</p>
                        <p className="text-[11px] text-[var(--text-secondary)] truncate">{currentUser.email || 'user@example.com'}</p>
                      </div>

                      <button onClick={() => go('profile')} className="w-full text-left px-3.5 py-1.5 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--ink-900)]/[0.03] hover:text-[var(--text-primary)] flex items-center gap-2 rounded-lg mx-1">
                        <User size={15} /> Профил
                      </button>
                      <button onClick={() => go('prompts')} className="w-full text-left px-3.5 py-1.5 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--ink-900)]/[0.03] hover:text-[var(--text-primary)] flex items-center gap-2 rounded-lg mx-1">
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
            <button className="md:hidden p-2 text-[var(--text-secondary)] rounded-full hover:bg-[var(--ink-900)]/[0.04] ml-1 transition-colors" onClick={() => setMobMenu(true)}>
              <Menu size={18} />
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
              className="fixed inset-0 bg-[var(--ink-900)]/20 backdrop-blur-sm z-50"
              onClick={() => setMobMenu(false)}
            />
            <motion.div
              initial={{x: '-100%'}} animate={{x: 0}} exit={{x: '-100%'}} transition={{type: 'spring', bounce: 0, duration: 0.4}}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-[var(--surface-strong)] z-[60] shadow-2xl flex flex-col"
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-gradient-to-br from-[var(--accent)] to-[var(--lavender)] rounded-[10px] flex justify-center items-center">
                    <div className="w-2.5 h-2.5 bg-white/90 rounded-[3px]" />
                  </div>
                  <span className="font-semibold text-[15px] text-[var(--ink-900)]">AILABS.BG</span>
                </div>
                <button onClick={() => setMobMenu(false)} className="p-1.5 text-[var(--text-secondary)] hover:bg-[var(--ink-900)]/[0.04] rounded-full transition-colors"><X size={18}/></button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
                {navLinks.map(item => (
                  <NavLink
                    key={item.id}
                    to={item.route}
                    end={item.route === '/'}
                    onClick={() => setMobMenu(false)}
                    className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-colors ${isActive ? 'bg-[var(--ink-900)]/[0.05] text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--ink-900)]/[0.03]'}`}
                  >
                    <item.icon size={17} className={page === item.id ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'} />
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
                    <button className="h-10 text-[14px] font-medium border border-[var(--border)] rounded-xl hover:bg-[var(--ink-900)]/[0.03] transition-colors" onClick={() => { setMobMenu(false); navigate('/login'); }}>Вход</button>
                    <button className="h-10 text-[14px] font-medium rounded-xl bg-[var(--ink-900)] text-white hover:bg-[var(--ink-700)] transition-colors" onClick={() => { setMobMenu(false); navigate('/register'); }}>Започни безплатно</button>
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
                    <button className="flex items-center gap-3 px-3 py-2 rounded-xl text-[14px] text-[var(--text-secondary)] hover:bg-[var(--ink-900)]/[0.03] transition-colors" onClick={() => go('profile')}><User size={17}/> Профил</button>
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
