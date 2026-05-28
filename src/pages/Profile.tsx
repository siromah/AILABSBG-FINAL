import React from 'react';
import { motion } from 'motion/react';
import { LogOut, BookOpen, LayoutTemplate, Star, Calendar, ChevronRight, Clock, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LESSONS_MODS, PROMPTS, EVENTS_DATA } from '../data';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

export function Profile({ db, setPage }: any) {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  const fullName =
    typeof user?.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name
      : 'AILABSBG Member';

  const initials = (fullName[0] || '?').toUpperCase();

  const savedLen = (db?.savedPrompts || []).length;
  const prog = db?.lessonProg || {};
  const allLessons = LESSONS_MODS.flatMap((m:any) => m.lessons);
  const totalL = allLessons.length;
  const doneCount = Object.values(prog).filter(Boolean).length;
  const progressPct = totalL > 0 ? Math.round((doneCount / totalL) * 100) : 0;

  const nextLesson = allLessons.find((l:any) => !prog[l.id]) || allLessons[0];
  const nextEvent = EVENTS_DATA[0];

  const savedPromptsFull = (db?.savedPrompts || []).map((id:string) => PROMPTS.find(p=>p.id===id)).filter(Boolean).slice(0, 4);

  const getCatVariant = (c: string) => {
    if (c === 'marketing') return 'accent';
    if (c === 'automation') return 'default';
    if (c === 'content') return 'info';
    if (c === 'productivity') return 'warning';
    return 'neutral';
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)] grain">
      <div className="section-shell py-10 md:py-14">

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{opacity: 0, scale: 0.9}} animate={{opacity:1, scale: 1}} transition={{duration: 0.5}}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent)] to-[var(--lavender)] rounded-full blur-xl opacity-15 group-hover:opacity-25 transition-opacity"></div>
              <Avatar initials={initials} size="xl" className="relative shadow-xl ring-4 ring-[var(--bg)] h-20 w-20 text-[24px] font-bold" />
            </motion.div>
            <div>
              <h1 className="display-md text-[var(--ink-900)] mb-0.5">
                {fullName}
              </h1>
              <p className="text-[14px] text-[var(--text-secondary)]">{user?.email}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="secondary" className="gap-2 px-5 h-9 text-[13px] self-start">
            <LogOut size={14} /> Изход
          </Button>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="luxury-card spotlight-hover p-4 text-center">
            <div className="text-[26px] font-semibold text-[var(--ink-900)]">{progressPct}%</div>
            <div className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider mt-1">Прогрес</div>
          </div>
          <div className="luxury-card spotlight-hover p-4 text-center">
            <div className="text-[26px] font-semibold text-[var(--ink-900)]">{doneCount}</div>
            <div className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider mt-1">Урока</div>
          </div>
          <div className="luxury-card spotlight-hover p-4 text-center">
            <div className="text-[26px] font-semibold text-[var(--ink-900)]">{savedLen}</div>
            <div className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider mt-1">Prompts</div>
          </div>
          <div className="luxury-card spotlight-hover p-4 text-center">
            <div className="text-[26px] font-semibold text-[var(--ink-900)]">{totalL - doneCount}</div>
            <div className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider mt-1">Остават</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">

          {/* Continue Learning */}
          <div className="lg:col-span-7">
            <div className="luxury-card spotlight-hover p-6 md:p-8 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-[17px] font-semibold text-[var(--ink-900)]">
                  <BookOpen size={18} className="text-[var(--accent)]" /> Продължи обучението
                </div>
                <Badge variant="accent" className="text-[12px] rounded-full">{progressPct}%</Badge>
              </div>

              {nextLesson && (
                <div className="flex items-start gap-4 mb-6 p-4 rounded-2xl bg-[var(--bg-soft)] border border-[var(--border)]">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] shrink-0">
                    <Zap size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-semibold text-[var(--ink-900)] leading-snug truncate">{nextLesson.title}</h3>
                    <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">{nextLesson.dur} • {nextLesson.mod}</p>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <ProgressBar value={progressPct} />
              </div>

              <div className="mt-auto flex items-center gap-3">
                <Button onClick={() => setPage('lessons')} className="flex-1 h-10 text-[13px] luxury-button">
                  Продължи урока <ChevronRight size={14} />
                </Button>
                <Button variant="secondary" onClick={() => setPage('lessons')} className="h-10 text-[13px]">
                  Всички уроци
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* Upcoming Event */}
            {nextEvent && (
              <div className="luxury-card p-6">
                <div className="flex items-center gap-2 text-[17px] font-semibold text-[var(--ink-900)] mb-5">
                  <Calendar size={18} className="text-[var(--amber)]" /> Предстоящо събитие
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--accent-light)] flex flex-col items-center justify-center text-[var(--accent)] border border-[var(--accent)]/10">
                    <span className="text-[18px] font-bold leading-none">{nextEvent.day}</span>
                    <span className="text-[9px] font-semibold uppercase tracking-wider mt-0.5">{nextEvent.mo}</span>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-[var(--ink-900)]">{nextEvent.title}</h3>
                    <p className="text-[12px] text-[var(--text-secondary)] flex items-center gap-1 mt-0.5">
                      <Clock size={11} /> {nextEvent.time}
                    </p>
                  </div>
                </div>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-5">
                  {nextEvent.desc}
                </p>
                <Button size="sm" className="w-full luxury-button" onClick={() => setPage('events')}>
                  Запази място
                </Button>
              </div>
            )}

            {/* Today's Actions */}
            <div className="luxury-card p-6">
              <div className="flex items-center gap-2 text-[17px] font-semibold text-[var(--ink-900)] mb-5">
                <Star size={18} className="text-[var(--emerald)]" /> Бързи действия
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => setPage('prompts')} className="flex items-center justify-between p-3 rounded-xl text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-soft)] hover:text-[var(--text-primary)] transition-colors">
                  <span className="flex items-center gap-2"><LayoutTemplate size={14} /> Разгледай prompts</span>
                  <ChevronRight size={14} />
                </button>
                <button onClick={() => setPage('community')} className="flex items-center justify-between p-3 rounded-xl text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-soft)] hover:text-[var(--text-primary)] transition-colors">
                  <span className="flex items-center gap-2"><BookOpen size={14} /> Виж общността</span>
                  <ChevronRight size={14} />
                </button>
                <button onClick={() => setPage('events')} className="flex items-center justify-between p-3 rounded-xl text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-soft)] hover:text-[var(--text-primary)] transition-colors">
                  <span className="flex items-center gap-2"><Calendar size={14} /> Календар събития</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Prompts */}
        {savedLen > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <span className="label-caps mb-1 block">Библиотека</span>
                <h2 className="display-md text-[var(--ink-900)]">Запазени</h2>
              </div>
              <Button variant="ghost" onClick={() => setPage('prompts')} className="text-[var(--accent)] text-[13px]">Разгледай всички</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedPromptsFull.map((p:any) => (
                <div key={p.id} className="luxury-card p-5 group flex flex-col h-full">
                  <div className="mb-2">
                    <Badge variant={getCatVariant(p.cat) as any} className="uppercase tracking-wider text-[9px] rounded-full">
                      {p.cat}
                    </Badge>
                  </div>
                  <h3 className="text-[15px] font-semibold text-[var(--ink-900)] mb-2 leading-tight">{p.title}</h3>
                  <p className="text-[13px] text-[var(--text-secondary)] line-clamp-3 mb-5 flex-1">{p.text}</p>
                  <Button variant="secondary" onClick={() => setPage('prompts')} className="w-full h-9 text-[13px]">
                    Виж в библиотеката
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}

        {savedLen === 0 && (
          <div className="luxury-card py-14 text-center">
            <h3 className="text-[17px] font-semibold text-[var(--ink-900)] mb-1">Нямате запазени prompts</h3>
            <p className="text-[13px] text-[var(--text-secondary)] mb-6 max-w-md mx-auto">Разгледайте библиотеката и запазете тези, които ви подхождат.</p>
            <Button onClick={() => setPage('prompts')} className="h-9 text-[13px] luxury-button">Разгледай prompts</Button>
          </div>
        )}
      </div>
    </div>
  );
}
