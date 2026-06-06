import React, { useState } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { motion } from 'motion/react';
import { LogOut, BookOpen, LayoutTemplate, Star, Calendar, ChevronRight, Clock, Zap, Check, Users, MessageSquare, Target, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LESSONS_MODS, PROMPTS, EVENTS_DATA } from '../data';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

const GOALS = [
  { id: 'business', label: 'Автоматизирам бизнеса си', icon: Target },
  { id: 'marketing', label: 'По-добър маркетинг с AI', icon: Sparkles },
  { id: 'productivity', label: 'По-продуктивен на работа', icon: Zap },
  { id: 'team', label: 'Внедрявам AI в екипа', icon: Users },
];

export function Profile({ db, setPage }: any) {
  useDocumentTitle('Профил');
  const { user, profile, signOut } = useAuth();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const handleLogout = async () => {
    await signOut();
  };

  const fullName = profile?.full_name || user?.user_metadata?.full_name || 'AILABS.BG Member';
  const initials = profile?.initials || (fullName[0] || '?').toUpperCase();

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

  // Check if user is new (no progress, no saved prompts)
  const isNewUser = doneCount === 0 && savedLen === 0;

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId);
    localStorage.setItem('craative_goal', goalId);
  };

  // ONBOARDING for new users
  if (isNewUser) {
    return (
      <div className="min-h-screen text-[var(--text-primary)]">
        <div className="section-shell py-10 md:py-14">

          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center text-white text-[24px] font-bold mx-auto mb-4">
              {initials}
            </div>
            <h1 className="display-md text-[var(--ink-900)] mb-2">
              Добре дошъл, {fullName.split(' ')[0]}
            </h1>
            <p className="text-[16px] text-[var(--text-secondary)] max-w-md mx-auto">
              Готов ли си да получиш първата си малка победа с AI? Следвай тези стъпки.
            </p>
          </motion.div>

          {/* Step 1: Choose Goal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold ${selectedGoal ? 'bg-[var(--emerald)] text-white' : 'bg-[var(--accent)] text-white'}`}>
                {selectedGoal ? <Check size={16} /> : '1'}
              </div>
              <h2 className="text-[18px] font-semibold text-[var(--ink-900)]">Каква е твоята цел?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-11">
              {GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGoalSelect(goal.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                    selectedGoal === goal.id
                      ? 'border-[var(--accent)] bg-[var(--accent-light)]/30'
                      : 'border-[var(--border)] bg-[var(--bg)] hover:border-[var(--accent)]/30'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${selectedGoal === goal.id ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-soft)] text-[var(--text-secondary)]'}`}>
                    <goal.icon size={16} />
                  </div>
                  <span className="text-[14px] font-medium text-[var(--ink-900)]">{goal.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Step 2: Start First Lesson */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-[13px] font-semibold">2</div>
              <h2 className="text-[18px] font-semibold text-[var(--ink-900)]">Започни първия безплатен урок</h2>
            </div>
            <div className="ml-11">
              <div className="premium-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] shrink-0">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-[var(--ink-900)]">{nextLesson.title}</div>
                    <div className="text-[12px] text-[var(--text-secondary)]">{nextLesson.dur} • Безплатно</div>
                  </div>
                </div>
                <Button onClick={() => setPage('lessons')} className="shrink-0">
                  Започни урока <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Step 3: Save First Prompt */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-[13px] font-semibold">3</div>
              <h2 className="text-[18px] font-semibold text-[var(--ink-900)]">Запази първия си prompt</h2>
            </div>
            <div className="ml-11">
              <div className="premium-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-soft)] flex items-center justify-center text-[var(--text-secondary)] shrink-0">
                    <LayoutTemplate size={18} />
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-[var(--ink-900)]">Библиотека с prompts</div>
                    <div className="text-[12px] text-[var(--text-secondary)]">10+ безплатни готови prompts</div>
                  </div>
                </div>
                <Button variant="secondary" onClick={() => setPage('prompts')} className="shrink-0">
                  Разгледай prompts
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Step 4: Community Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-[13px] font-semibold">4</div>
              <h2 className="text-[18px] font-semibold text-[var(--ink-900)]">Виж какво споделят другите</h2>
            </div>
            <div className="ml-11">
              <div className="premium-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-soft)] flex items-center justify-center text-[var(--text-secondary)] shrink-0">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-[var(--ink-900)]">Community preview</div>
                    <div className="text-[12px] text-[var(--text-secondary)]">Виж как други прилагат AI в работата си</div>
                  </div>
                </div>
                <Button variant="secondary" onClick={() => setPage('community')} className="shrink-0">
                  Виж общността
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Step 5: Book 1:1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-[13px] font-semibold">5</div>
              <h2 className="text-[18px] font-semibold text-[var(--ink-900)]">Нуждаеш се от насока?</h2>
            </div>
            <div className="ml-11">
              <div className="premium-card p-5 flex flex-col sm:flex-row sm:items-center gap-4 border-l-[3px] border-l-[var(--accent)]">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] shrink-0">
                    <Users size={18} />
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-[var(--ink-900)]">Безплатен 1:1 разговор</div>
                    <div className="text-[12px] text-[var(--text-secondary)]">15 минути — без ангажимент</div>
                  </div>
                </div>
                <Button onClick={() => setPage('coaching')} className="shrink-0">
                  Запиши разговор
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Skip */}
          <div className="text-center">
            <button onClick={handleLogout} className="text-[13px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors">
              Изход от акаунта
            </button>
          </div>
        </div>
      </div>
    );
  }

  // REGULAR DASHBOARD for users with progress
  return (
    <div className="min-h-screen text-[var(--text-primary)]">
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
          <div className="luxury-card p-4 text-center">
            <div className="text-[26px] font-semibold text-[var(--ink-900)]">{progressPct}%</div>
            <div className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider mt-1">Прогрес</div>
          </div>
          <div className="luxury-card p-4 text-center">
            <div className="text-[26px] font-semibold text-[var(--ink-900)]">{doneCount}</div>
            <div className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider mt-1">Уроци</div>
          </div>
          <div className="luxury-card p-4 text-center">
            <div className="text-[26px] font-semibold text-[var(--ink-900)]">{savedLen}</div>
            <div className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider mt-1">Prompts</div>
          </div>
          <div className="luxury-card p-4 text-center">
            <div className="text-[26px] font-semibold text-[var(--ink-900)]">{totalL - doneCount}</div>
            <div className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider mt-1">Остават</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">

          {/* Continue Learning */}
          <div className="lg:col-span-7">
            <div className="luxury-card p-6 md:p-8 h-full flex flex-col">
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
                    <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">{nextLesson.dur}</p>
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
                  <span className="flex items-center gap-2"><LayoutTemplate size={14} /> Виж prompt-ите</span>
                  <ChevronRight size={14} />
                </button>
                <button onClick={() => setPage('community')} className="flex items-center justify-between p-3 rounded-xl text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-soft)] hover:text-[var(--text-primary)] transition-colors">
                  <span className="flex items-center gap-2"><BookOpen size={14} /> Виж общността</span>
                  <ChevronRight size={14} />
                </button>
                <button onClick={() => setPage('coaching')} className="flex items-center justify-between p-3 rounded-xl text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-soft)] hover:text-[var(--text-primary)] transition-colors">
                  <span className="flex items-center gap-2"><Users size={14} /> Резервирай 1:1 разговор</span>
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
            <h3 className="text-[17px] font-semibold text-[var(--ink-900)] mb-1">Нямаш запазени prompts</h3>
            <p className="text-[13px] text-[var(--text-secondary)] mb-6 max-w-md mx-auto">Разгледай библиотеката и запази тези, които ти подхождат.</p>
            <Button onClick={() => setPage('prompts')} className="h-9 text-[13px] luxury-button">Виж prompt-ите</Button>
          </div>
        )}
      </div>
    </div>
  );
}
