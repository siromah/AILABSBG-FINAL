import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  Users,
  GraduationCap,
  Calendar,
  ChevronRight,
  Play,
  Check,
  Zap,
  MessageSquare,
  Trophy,
  HelpCircle,
  Layers,
  Target,
  Clock,
  BookOpen,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LESSONS_MODS, PROMPTS, EVENTS_DATA } from '../data';

const LEARNING_PATHS = [
  { id: 'beginner', label: 'AI за начинаещи', icon: BookOpen, desc: 'Основи, инструменти и първи стъпки', count: '8 урока' },
  { id: 'productivity', label: 'AI за продуктивност', icon: Zap, desc: 'Автоматизирай рутинните задачи', count: '6 урока' },
  { id: 'marketing', label: 'AI за маркетинг', icon: Target, desc: 'Кампании, анализи и копи', count: '7 урока' },
  { id: 'business', label: 'AI за бизнес', icon: Layers, desc: 'Продажби, процеси и мащабиране', count: '5 урока' },
  { id: 'content', label: 'AI за съдържание', icon: Sparkles, desc: 'Създавай повече с по-малко усилие', count: '6 урока' },
  { id: 'freelancing', label: 'AI за freelancing', icon: Clock, desc: 'По-бързи доставки и по-високи rates', count: '4 урока' },
  { id: 'career', label: 'AI за кариера', icon: GraduationCap, desc: 'Умения, които работодателите търсят', count: '5 урока' },
];

const FAQS = [
  {
    q: 'Какво точно получавам с членството?',
    a: 'Достъп до структурирани уроци, библиотека с тествани prompts, практически workshops, седмични предизвикателства и общност от професионалисти, които споделят реален опит.',
  },
  {
    q: 'Подходящо ли е за начинаещи?',
    a: 'Да. Започваме от основите и изграждаме системно. Не са нужни технически познания — фокусът е върху практическо приложение в работата.',
  },
  {
    q: 'Мога ли да отменя членството си?',
    a: 'Разбира се. Няма договори със срок. Можеш да спреш или смениш плана по всяко време.',
  },
  {
    q: 'Има ли live сесии?',
    a: 'Да. Провеждаме редовни office hours и workshops, където можеш да задаваш въпроси на живо и да получаваш обратна връзка.',
  },
  {
    q: 'Колко време отнема обучението?',
    a: 'Всеки урок е между 12 и 30 минути. Можеш да учиш в свое темпо — повечето членове виждат реални резултати в рамките на първите няколко седмици.',
  },
  {
    q: 'Работи ли за български компании?',
    a: 'Абсолютно. Всички примери, prompts и workflows са адаптирани за българския пазар и европейския бизнес контекст.',
  },
];

export default function Home({ checkAuthThenGo, setPage }: any) {
  const { user: currentUser } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const featuredPrompts = PROMPTS.slice(0, 3);
  const academyLessons = LESSONS_MODS.reduce((acc, mod) => acc.concat(mod.lessons), [] as any[]).slice(0, 3);
  const nextEvent = EVENTS_DATA[0];

  return (
    <div className="min-h-screen text-[var(--text-primary)]">

      {/* HERO — Editorial, asymmetric, typographic */}
      <section className="relative min-h-[90vh] flex items-end pb-16 md:pb-24 pt-32 overflow-hidden">
        {/* Abstract background shape */}
        <div className="absolute top-0 right-0 w-[55vw] h-full pointer-events-none overflow-hidden">
          <div
            className="absolute -top-[20%] -right-[10%] w-[80vw] h-[80vw] rounded-full opacity-[0.07]"
            style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
          />
          <svg className="absolute top-[15%] right-[5%] w-[40vw] h-[40vw] opacity-[0.04]" viewBox="0 0 400 400">
            <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="200" cy="200" r="100" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <line x1="20" y1="200" x2="380" y2="200" stroke="currentColor" strokeWidth="0.3" />
            <line x1="200" y1="20" x2="200" y2="380" stroke="currentColor" strokeWidth="0.3" />
          </svg>
        </div>

        <div className="section-shell relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end">
            {/* Main headline — takes 8 columns */}
            <motion.div
              className="lg:col-span-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-[1px] bg-[var(--accent)]" />
                <span className="text-[12px] font-medium tracking-[0.15em] uppercase text-[var(--accent)]">
                  AI Академия · България
                </span>
              </div>

              <h1 className="text-[clamp(48px,8vw,96px)] font-semibold leading-[0.95] tracking-[-0.04em] text-[var(--ink-900)] mb-8">
                Научи AI<br />
                <span className="text-[var(--text-tertiary)]">по начина,</span><br />
                <span className="text-[var(--accent)]">по който работи.</span>
              </h1>

              <p className="text-[18px] md:text-[20px] text-[var(--text-secondary)] max-w-lg leading-[1.6] mb-10">
                Уроци, prompts и live сесии за хора, които искат реални резултати — без шум и без празна теория.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Button size="lg" onClick={() => checkAuthThenGo('register')}>
                  Започни безплатно
                </Button>
                <Button variant="ghost" size="lg" onClick={() => setPage('prompts')}>
                  Виж prompt-ите <ArrowRight size={16} />
                </Button>
              </div>
            </motion.div>

            {/* Side info — takes 4 columns */}
            <motion.div
              className="lg:col-span-4 hidden lg:flex flex-col gap-6 pb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="border-l border-[var(--border)] pl-5">
                <div className="text-[36px] font-semibold text-[var(--ink-900)] leading-none tracking-tight">40+</div>
                <div className="text-[13px] text-[var(--text-secondary)] mt-1.5">структурирани уроци</div>
              </div>
              <div className="border-l border-[var(--border)] pl-5">
                <div className="text-[36px] font-semibold text-[var(--ink-900)] leading-none tracking-tight">120+</div>
                <div className="text-[13px] text-[var(--text-secondary)] mt-1.5">тествани prompts</div>
              </div>
              <div className="border-l border-[var(--border)] pl-5">
                <div className="text-[36px] font-semibold text-[var(--ink-900)] leading-none tracking-tight">∞</div>
                <div className="text-[13px] text-[var(--text-secondary)] mt-1.5">възможности с AI</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MARQUEE STRIP — stats on mobile */}
      <div className="lg:hidden border-y border-[var(--border)] bg-[var(--bg-soft)]">
        <div className="section-shell py-6 flex justify-around text-center">
          <div>
            <div className="text-[24px] font-semibold text-[var(--ink-900)]">40+</div>
            <div className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wider">уроци</div>
          </div>
          <div>
            <div className="text-[24px] font-semibold text-[var(--ink-900)]">120+</div>
            <div className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wider">prompts</div>
          </div>
          <div>
            <div className="text-[24px] font-semibold text-[var(--ink-900)]">∞</div>
            <div className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wider">възможности</div>
          </div>
        </div>
      </div>

      {/* EDITORIAL STATEMENT */}
      <section className="section-shell py-24 md:py-32">
        <motion.div
          className="max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-[clamp(28px,4vw,52px)] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--ink-900)] mb-8">
            AI не е бъдеще. <span className="text-[var(--accent)]">Вече е тук.</span><br />
            Въпросът е дали ще го използваш,<br />
            или ще те изпревари.
          </h2>
          <p className="text-[17px] text-[var(--text-secondary)] leading-[1.7] max-w-2xl">
            Craative е мястото, където професионалисти от България учат AI практически. 
            Без „ disruption“, без buzzwords — само работещи методи, които можеш да приложиш още днес.
          </p>
        </motion.div>
      </section>

      {/* ECOSYSTEM — Bold grid with icons */}
      <section className="section-shell pb-24 md:pb-32">
        <div className="mb-16">
          <span className="text-[12px] font-medium tracking-[0.15em] uppercase text-[var(--accent)]">Екосистема</span>
          <h2 className="text-[clamp(24px,3vw,40px)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--ink-900)] mt-4 max-w-md">
            Това не е просто курс. Това е система.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border)] rounded-[20px] overflow-hidden">
          {[
            { icon: GraduationCap, title: 'Академия', desc: 'Структурирани уроци от нулата до напреднали workflow-ове.' },
            { icon: Users, title: 'Общност', desc: 'Дискусии, weekly challenges и споделен опит от професионалисти.' },
            { icon: Sparkles, title: 'Prompt Library', desc: 'Тествани prompts за бизнес, маркетинг и автоматизация.' },
            { icon: Calendar, title: 'Workshops', desc: 'Практически live сесии, където изграждаме реални системи.' },
            { icon: Layers, title: 'Ресурси', desc: 'Шаблони, checklists и готови workflows за незабавно приложение.' },
            { icon: Target, title: 'Подкрепа', desc: 'Office hours и implementation reviews, за да не си сам.' },
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              className="bg-[var(--bg)] p-8 md:p-10 group cursor-default"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              whileHover={{ backgroundColor: 'var(--bg-soft)' }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-11 h-11 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white group-hover:border-[var(--accent)] transition-all duration-300">
                  <item.icon size={18} strokeWidth={1.5} />
                </div>
                <ArrowUpRight size={16} className="text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mb-2 tracking-tight">{item.title}</h3>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LEARNING PATHS — Editorial table of contents style */}
      <section className="section-shell pb-24 md:pb-32">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-[12px] font-medium tracking-[0.15em] uppercase text-[var(--accent)]">Академия</span>
            <h2 className="text-[clamp(24px,3vw,40px)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--ink-900)] mt-4">
              Избери своя път
            </h2>
          </div>
          <Button variant="ghost" onClick={() => setPage('lessons')} className="self-start md:self-auto">
            Виж всички уроци <ChevronRight size={14} />
          </Button>
        </div>

        <div className="border-t border-[var(--border)]">
          {LEARNING_PATHS.map((path, idx) => (
            <motion.div
              key={path.id}
              className="border-b border-[var(--border)] group cursor-pointer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => setPage('lessons')}
              onMouseEnter={() => setHoveredPath(path.id)}
              onMouseLeave={() => setHoveredPath(null)}
            >
              <div className="py-5 md:py-6 flex items-center gap-4 md:gap-8">
                <span className="text-[13px] text-[var(--text-tertiary)] font-mono w-8 shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="w-9 h-9 rounded-full bg-[var(--bg-soft)] flex items-center justify-center text-[var(--text-secondary)] group-hover:bg-[var(--accent-light)] group-hover:text-[var(--accent)] transition-colors shrink-0">
                  <path.icon size={16} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-[16px] md:text-[18px] font-semibold text-[var(--ink-900)] tracking-tight group-hover:text-[var(--accent)] transition-colors">
                      {path.label}
                    </h3>
                    <AnimatePresence>
                      {hoveredPath === path.id && (
                        <motion.span
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -5 }}
                          className="text-[12px] text-[var(--text-tertiary)] hidden md:inline"
                        >
                          {path.desc}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <p className="text-[13px] text-[var(--text-secondary)] md:hidden mt-0.5">{path.desc}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-[12px] text-[var(--text-tertiary)] hidden sm:block">{path.count}</span>
                  <ChevronRight size={16} className="text-[var(--text-tertiary)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED LESSONS — Horizontal scroll on mobile, grid on desktop */}
      <section className="section-shell pb-24 md:pb-32">
        <div className="mb-10">
          <span className="text-[12px] font-medium tracking-[0.15em] uppercase text-[var(--accent)]">Най-нови</span>
          <h2 className="text-[clamp(24px,3vw,40px)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--ink-900)] mt-4">
            Започни с тези уроци
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {academyLessons.map((lesson: any, idx: number) => (
            <motion.div
              key={lesson.id}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => setPage('lessons')}
            >
              <div className="aspect-[16/10] rounded-[16px] bg-[var(--bg-soft)] border border-[var(--border)] mb-4 overflow-hidden relative">
                <div className={`absolute inset-0 opacity-40 ${
                  idx === 0 ? 'bg-gradient-to-br from-[var(--accent)]/20 to-transparent' :
                  idx === 1 ? 'bg-gradient-to-br from-[var(--emerald)]/15 to-transparent' :
                  'bg-gradient-to-br from-[var(--amber)]/15 to-transparent'
                }`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm ${
                    idx === 0 ? 'bg-[var(--accent)]/10 text-[var(--accent)]' :
                    idx === 1 ? 'bg-[var(--emerald)]/10 text-[var(--emerald)]' :
                    'bg-[var(--amber)]/10 text-[var(--amber)]'
                  }`}>
                    <Play size={20} fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 text-[11px] text-[var(--text-tertiary)] bg-[var(--bg)]/80 backdrop-blur-sm px-2 py-1 rounded-md">
                  {lesson.dur}
                </div>
              </div>
              <h3 className="text-[16px] font-semibold text-[var(--ink-900)] mb-1 group-hover:text-[var(--accent)] transition-colors">
                {lesson.title}
              </h3>
              <p className="text-[13px] text-[var(--text-secondary)] line-clamp-2">{lesson.desc || 'Научи практически техники, които можеш да приложиш веднага.'}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROMPTS — Editorial numbered list */}
      <section className="section-shell pb-24 md:pb-32">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-[12px] font-medium tracking-[0.15em] uppercase text-[var(--accent)]">Библиотека</span>
            <h2 className="text-[clamp(24px,3vw,40px)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--ink-900)] mt-4">
              Готови prompts
            </h2>
          </div>
          <Button variant="ghost" onClick={() => setPage('prompts')} className="self-start md:self-auto">
            Виж всички <ChevronRight size={14} />
          </Button>
        </div>

        <div className="flex flex-col">
          {featuredPrompts.map((p, idx) => (
            <motion.div
              key={p.id}
              className="group cursor-pointer border-t border-[var(--border)]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              onClick={() => setPage('prompts')}
            >
              <div className="py-6 md:py-8 flex items-start gap-5 md:gap-8">
                <span className="text-[clamp(32px,4vw,56px)] font-semibold text-[var(--ink-900)]/[0.06] leading-none shrink-0 w-[60px] md:w-[80px]">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-[var(--accent)]">
                      {p.cat}
                    </span>
                    <span className="text-[11px] text-[var(--text-tertiary)]">{p.saves} запазвания</span>
                  </div>
                  <h3 className="text-[18px] md:text-[20px] font-semibold text-[var(--ink-900)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                    {p.text}
                  </p>
                </div>
                <div className="shrink-0 pt-1 hidden md:block">
                  <div className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-tertiary)] group-hover:bg-[var(--ink-900)] group-hover:text-[var(--bg)] group-hover:border-[var(--ink-900)] transition-all">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          <div className="border-t border-[var(--border)]" />
        </div>
      </section>

      {/* EVENTS — Side by side editorial */}
      <section className="section-shell pb-24 md:pb-32">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-[12px] font-medium tracking-[0.15em] uppercase text-[var(--accent)]">Събития</span>
            <h2 className="text-[clamp(24px,3vw,40px)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--ink-900)] mt-4">
              Предстоящи workshops
            </h2>
          </div>
          <Button variant="ghost" onClick={() => setPage('events')} className="self-start md:self-auto">
            Календар <ChevronRight size={14} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EVENTS_DATA.slice(0, 3).map((e, idx) => (
            <motion.div
              key={e.id}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              onClick={() => setPage('events')}
            >
              <div className="p-6 md:p-8 rounded-[20px] border border-[var(--border)] bg-[var(--bg)] hover:bg-[var(--bg-soft)] transition-colors h-full flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-[42px] font-semibold text-[var(--ink-900)] leading-none tracking-tight">{e.day}</div>
                    <div className="text-[11px] font-medium tracking-[0.15em] uppercase text-[var(--accent)] mt-1">{e.mo}</div>
                  </div>
                  <div className="text-[12px] text-[var(--text-tertiary)] flex items-center gap-1.5">
                    <Clock size={12} /> {e.time}
                  </div>
                </div>
                <h3 className="text-[17px] font-semibold text-[var(--ink-900)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                  {e.title}
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-6 flex-1">{e.desc}</p>
                <div className="flex items-center gap-2 text-[13px] text-[var(--accent)] font-medium">
                  Научи повече <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="section-shell pb-24 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[12px] font-medium tracking-[0.15em] uppercase text-[var(--accent)]">Общност</span>
            <h2 className="text-[clamp(24px,3vw,40px)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--ink-900)] mt-4 mb-6">
              Не си сам в това
            </h2>
            <p className="text-[16px] text-[var(--text-secondary)] leading-[1.7] mb-8">
              Присъедини се към хора, които вече прилагат AI в работата си. 
              Споделяй опит, задавай въпроси и учи заедно с други професионалисти.
            </p>
            <Button onClick={() => setPage('community')}>Влез в общността <ArrowRight size={16} /></Button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Target, title: 'Седмични предизвикателства', desc: 'Всяка седмица ново предизвикателство.' },
              { icon: MessageSquare, title: 'Дискусии и Q&A', desc: 'Задавай въпроси и получавай обратна връзка.' },
              { icon: Trophy, title: 'Member Wins', desc: 'Споделяй успехите си с общността.' },
              { icon: HelpCircle, title: 'Implementation Feedback', desc: 'Покажи workflow-а си за review.' },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                className="p-5 rounded-[16px] border border-[var(--border)] bg-[var(--bg-soft)]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <item.icon size={18} className="text-[var(--accent)] mb-3" strokeWidth={1.5} />
                <h4 className="text-[14px] font-semibold text-[var(--ink-900)] mb-1">{item.title}</h4>
                <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING — Minimal, clean */}
      <section className="section-shell pb-24 md:pb-32">
        <div className="text-center mb-12">
          <span className="text-[12px] font-medium tracking-[0.15em] uppercase text-[var(--accent)]">Цени</span>
          <h2 className="text-[clamp(24px,3vw,40px)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--ink-900)] mt-4">
            Ясни планове, без изненади
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            {
              name: 'Free',
              price: '0 лв.',
              period: '/месец',
              desc: 'За разглеждане, newsletter и основни ресурси.',
              features: ['Достъп до ограничени уроци', 'Ограничена prompt library', 'Community preview', 'Избрани workshop превюта'],
              cta: 'Започни',
              plan: 'free',
            },
            {
              name: 'Pro',
              price: '49 лв.',
              period: '/месец',
              desc: 'Community, workshops, prompt library, templates и challenges.',
              features: ['Пълна академия', 'Пълна prompt library', 'Пълна общност', 'Workshops', 'Challenges', 'Шаблони'],
              cta: 'Избери Pro',
              plan: 'pro',
              highlight: true,
            },
            {
              name: 'Premium',
              price: '129 лв.',
              period: '/месец',
              desc: 'Pro плюс office hours, implementation reviews и priority Q&A.',
              features: ['Всичко от Pro', 'Office hours', 'Implementation reviews', 'Priority Q&A', 'Персонализирани съвети'],
              cta: 'Избери Premium',
              plan: 'premium',
            },
          ].map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className={`relative h-full rounded-[20px] border p-6 md:p-8 flex flex-col ${
                plan.highlight
                  ? 'border-[var(--accent)] bg-[var(--accent-light)]/30'
                  : 'border-[var(--border)] bg-[var(--bg)]'
              }`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-6">
                    <Badge variant="accent" className="text-[10px] rounded-full px-3 py-1 font-semibold tracking-wide">Популярен</Badge>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-3">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[36px] font-semibold text-[var(--ink-900)] tracking-tight">{plan.price}</span>
                    <span className="text-[14px] text-[var(--text-tertiary)]">{plan.period}</span>
                  </div>
                  <p className="text-[13px] text-[var(--text-secondary)] mt-2 leading-relaxed">{plan.desc}</p>
                </div>
                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[13px] text-[var(--text-secondary)]">
                      <Check size={14} className={`mt-0.5 shrink-0 ${plan.highlight ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.highlight ? 'primary' : 'secondary'} className="w-full" onClick={() => setPage('pricing')}>
                  {plan.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section-shell pb-24 md:pb-32">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[12px] font-medium tracking-[0.15em] uppercase text-[var(--accent)]">FAQ</span>
            <h2 className="text-[clamp(24px,3vw,40px)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--ink-900)] mt-4">
              Всичко, което трябва да знаеш
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {FAQS.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
              >
                <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg)] overflow-hidden">
                  <button
                    className="w-full text-left p-5 flex items-center justify-between gap-4"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  >
                    <span className="text-[15px] font-semibold text-[var(--ink-900)]">{faq.q}</span>
                    <ChevronRight
                      size={16}
                      className={`text-[var(--text-tertiary)] shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-90' : ''}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-[14px] text-[var(--text-secondary)] leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA — Warm, editorial */}
      <section className="section-shell pb-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative rounded-[24px] bg-[var(--ink-900)] text-[var(--bg)] overflow-hidden p-10 md:p-16 lg:p-20">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--accent)] rounded-full opacity-[0.08] blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[var(--accent)] rounded-full opacity-[0.05] blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            <div className="relative z-10 max-w-2xl">
              <h2 className="text-[clamp(32px,5vw,56px)] font-semibold mb-6 tracking-[-0.03em] leading-[1.05]">
                Готов ли си<br />да започнеш?
              </h2>
              <p className="text-[16px] md:text-[18px] text-[var(--bg)]/50 mb-10 leading-relaxed max-w-lg">
                Присъедини се към общността, която учи AI практически. Без шум, без празни обещания.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="lg" onClick={() => checkAuthThenGo('register')} className="gap-2 px-8 bg-[var(--bg)] text-[var(--ink-900)] hover:bg-[var(--bg-soft)] text-[15px]">
                  Започни безплатно <ArrowRight size={18} />
                </Button>
                <Button size="lg" variant="ghost" onClick={() => setPage('pricing')} className="gap-2 px-7 text-[var(--bg)] hover:bg-[var(--bg)]/10 text-[15px]">
                  Виж цените
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
