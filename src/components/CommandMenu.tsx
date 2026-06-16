import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Home, GraduationCap, MessageSquare, Sparkles, Calendar, Tag, User, Settings, FileText, ArrowUpRight, X, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PROMPTS, LESSONS_MODS, EVENTS_DATA } from '../data';

const PAGES = [
  { id: 'home', label: 'Начало', route: '/', icon: Home },
  { id: 'lessons', label: 'Академия', route: '/lessons', icon: GraduationCap },
  { id: 'missions', label: 'Мисии', route: '/missions', icon: Target },
  { id: 'community', label: 'Общност', route: '/community', icon: MessageSquare },
  { id: 'prompts', label: 'Prompt Library', route: '/prompts', icon: Sparkles },
  { id: 'events', label: 'Събития', route: '/events', icon: Calendar },
  { id: 'pricing', label: 'Цени', route: '/pricing', icon: Tag },
  { id: 'profile', label: 'Профил', route: '/profile', icon: User },
  { id: 'about', label: 'За нас', route: '/about', icon: FileText },
  { id: 'contact', label: 'Контакт', route: '/contact', icon: FileText },
  { id: 'system-check', label: 'Системна проверка', route: '/system-check', icon: Settings },
];

export default function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const allItems = useMemo(() => {
    const items: { type: string; title: string; subtitle: string; route: string; icon: any }[] = [];

    PAGES.forEach(p => {
      items.push({ type: 'Страница', title: p.label, subtitle: 'Навигация', route: p.route, icon: p.icon });
    });

    PROMPTS.forEach(p => {
      items.push({ type: 'Prompt', title: p.title, subtitle: p.cat, route: '/prompts', icon: Sparkles });
    });

    LESSONS_MODS.forEach(mod => {
      mod.lessons.forEach((l: any) => {
        items.push({ type: 'Урок', title: l.title, subtitle: mod.title, route: '/lessons', icon: GraduationCap });
      });
    });

    EVENTS_DATA.forEach(e => {
      items.push({ type: 'Събитие', title: e.title, subtitle: `${e.day} ${e.mo}`, route: '/events', icon: Calendar });
    });

    return items;
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 8);
    const q = query.toLowerCase();
    return allItems.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [query, allItems]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected(prev => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected(prev => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = filtered[selected];
      if (item) {
        navigate(item.route);
        setOpen(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-[var(--ink-900)]/30 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl luxury-glass rounded-[24px] shadow-2xl overflow-hidden border border-[var(--border)]"
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
              <Search size={18} className="text-[var(--text-tertiary)] shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Търси страници, уроци, prompts..."
                className="flex-1 bg-transparent text-[15px] text-[var(--ink-900)] placeholder:text-[var(--text-tertiary)] outline-none"
              />
              <button
                onClick={() => setOpen(false)}
                className="text-[11px] font-medium text-[var(--text-tertiary)] bg-[var(--bg-soft)] px-2 py-1 rounded-md border border-[var(--border)]"
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[380px] overflow-y-auto custom-scrollbar py-2">
              {filtered.length === 0 ? (
                <div className="px-5 py-10 text-center text-[14px] text-[var(--text-secondary)]">
                  Няма резултати за "{query}"
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selected;
                  return (
                    <button
                      key={`${item.type}-${item.title}-${idx}`}
                      onClick={() => { navigate(item.route); setOpen(false); }}
                      onMouseEnter={() => setSelected(idx)}
                      className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                        isSelected ? 'bg-[var(--accent-light)]/60' : 'hover:bg-[var(--bg-soft)]/50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'bg-[var(--bg-soft)] text-[var(--text-tertiary)]'}`}>
                        <Icon size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[14px] font-medium truncate ${isSelected ? 'text-[var(--ink-900)]' : 'text-[var(--text-primary)]'}`}>
                          {item.title}
                        </div>
                        <div className="text-[12px] text-[var(--text-tertiary)] flex items-center gap-1.5">
                          <span className="text-[11px] font-medium uppercase tracking-wider">{item.type}</span>
                          <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]" />
                          <span className="truncate">{item.subtitle}</span>
                        </div>
                      </div>
                      <ArrowUpRight size={14} className={`shrink-0 transition-opacity ${isSelected ? 'opacity-100 text-[var(--accent)]' : 'opacity-0'}`} />
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-5 py-2.5 border-t border-[var(--border)] text-[11px] text-[var(--text-tertiary)]">
              <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-[var(--bg-soft)] border border-[var(--border)] text-[10px]">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-[var(--bg-soft)] border border-[var(--border)] text-[10px]">↓</kbd> Навигация</span>
              <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-soft)] border border-[var(--border)] text-[10px]">Enter</kbd> Избор</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
