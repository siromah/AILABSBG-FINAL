import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  Users,
  GraduationCap,
  Calendar,
  Bookmark,
  ChevronRight,
  Play,
  Copy,
  Check,
  Zap,
  MessageSquare,
  Trophy,
  HelpCircle,
  Lightbulb,
  Layers,
  Target,
  Clock,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { WorkspacePreview } from '../components/WorkspacePreview';
import { LESSONS_MODS, PROMPTS, EVENTS_DATA, PRICING_PLANS } from '../data';

const LEARNING_PATHS = [
  { id: 'beginner', label: 'AI за начинаещи', icon: BookOpen, desc: 'Основи, инструменти и първи стъпки' },
  { id: 'productivity', label: 'AI за продуктивност', icon: Zap, desc: 'Автоматизирай рутинните задачи' },
  { id: 'marketing', label: 'AI за маркетинг', icon: Target, desc: 'Кампании, анализи и копи' },
  { id: 'business', label: 'AI за бизнес', icon: Layers, desc: 'Продажби, процеси и мащабиране' },
  { id: 'content', label: 'AI за съдържание', icon: Sparkles, desc: 'Създавай повече с по-малко усилие' },
  { id: 'freelancing', label: 'AI за freelancing', icon: Clock, desc: 'По-бързи доставки и по-високи rates' },
  { id: 'career', label: 'AI за кариера', icon: GraduationCap, desc: 'Умения, които работодателите търсят' },
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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const featuredPrompts = PROMPTS.slice(0, 3);
  const academyLessons = LESSONS_MODS.reduce((acc, mod) => acc.concat(mod.lessons), [] as any[]).slice(0, 3);
  const nextEvent = EVENTS_DATA[0];

  const copyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)] overflow-hidden">

      {/* HERO — Dramatic, asymmetric, alive */}
      <section className="relative section-shell pt-20 pb-20 md:pt-32 md:pb-28">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full bg-[var(--accent)]/[0.04] blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[var(--lavender)]/[0.03] blur-[90px]"
          />
        </div>

        <div className="relative max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-light)] text-[var(--accent-text)] text-[13px] font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              Практична AI академия и общност
            </span>

            <h1 className="text-[clamp(40px,6vw,80px)] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--ink-900)] mb-8">
              Научи AI по начина,<br />
              <span className="text-[var(--accent)]">по който работи</span><br />
              в реалността.
            </h1>

            <p className="text-[18px] md:text-[20px] text-[var(--text-secondary)] max-w-xl leading-[1.6] mb-10">
              Уроци, prompts, workflows и live сесии за хора, които искат реални резултати — без шум и без празна теория.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-12">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" onClick={() => checkAuthThenGo('register')}>
                  Започни безплатно
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button variant="ghost" size="lg" onClick={() => setPage('prompts')}>
                  Виж prompt-ите <ArrowRight size={16} />
                </Button>
              </motion.div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[13px] text-[var(--text-tertiary)]">
              {[
                { icon: Users, text: 'Реална общност' },
                { icon: Sparkles, text: 'Подбрани prompts' },
                { icon: GraduationCap, text: 'Практически уроци' },
              ].map((item, i) => (
                <motion.span
                  key={item.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <item.icon size={14} className="text-[var(--accent)]" />
                  {item.text}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="soft-divider section-shell" />

      {/* ECOSYSTEM */}
      <section className="section-shell py-16 md:py-24">
        <motion.div 
          className="mb-10 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="label-caps mb-3 block">Екосистема</span>
          <h2 className="text-[clamp(28px,3.5vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--ink-900)] max-w-xl">
            Това не е просто курс.<br />Това е цялостна система.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: GraduationCap, title: 'Академия', desc: 'Структурирани уроци от нулата до напреднали workflow-ове.', color: 'text-[var(--accent)]', bg: 'bg-[var(--accent-light)]' },
            { icon: Users, title: 'Общност', desc: 'Дискусии, weekly challenges и споделен опит от професионалисти.', color: 'text-[var(--emerald)]', bg: 'bg-[var(--emerald-light)]' },
            { icon: Sparkles, title: 'Prompt Library', desc: 'Тествани prompts за бизнес, маркетинг и автоматизация.', color: 'text-[var(--amber)]', bg: 'bg-[var(--amber-light)]' },
            { icon: Calendar, title: 'Workshops', desc: 'Практически live сесии, където изграждаме реални системи.', color: 'text-[var(--accent)]', bg: 'bg-[var(--accent-light)]' },
            { icon: Layers, title: 'Ресурси', desc: 'Шаблони, checklists и готови workflows за незабавно приложение.', color: 'text-[var(--emerald)]', bg: 'bg-[var(--emerald-light)]' },
            { icon: Target, title: 'Подкрепа', desc: 'Office hours и implementation reviews, за да не си сам.', color: 'text-[var(--amber)]', bg: 'bg-[var(--amber-light)]' },
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <motion.div 
                className="premium-card p-6 h-full group"
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                  <item.icon className={item.color} size={20} />
                </div>
                <h3 className="text-[17px] font-semibold text-[var(--ink-900)] mb-1.5 tracking-tight">{item.title}</h3>
                <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="soft-divider section-shell" />

      {/* ACADEMY PREVIEW */}
      <section className="section-shell py-16 md:py-24">
        <motion.div 
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="label-caps mb-3 block">Академия</span>
            <h2 className="text-[clamp(28px,3.5vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--ink-900)]">Избери своя път</h2>
          </div>
          <Button variant="ghost" onClick={() => setPage('lessons')} className="self-start md:self-auto text-[14px]">
            Виж всички уроци <ChevronRight size={14} />
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {LEARNING_PATHS.slice(0, 4).map((path, idx) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <motion.div
                className="premium-card p-5 cursor-pointer h-full group"
                onClick={() => setPage('lessons')}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)]">
                    <path.icon size={18} />
                  </div>
                  <ChevronRight size={14} className="text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors" />
                </div>
                <h3 className="text-[15px] font-semibold text-[var(--ink-900)] mb-1">{path.label}</h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{path.desc}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {academyLessons.map((lesson: any, idx: number) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <motion.div
                className="group flex items-center gap-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] hover:border-[var(--border-strong)] transition-all cursor-pointer"
                onClick={() => setPage('lessons')}
                whileHover={{ x: 4 }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${idx === 0 ? 'bg-[var(--accent-light)] text-[var(--accent)]' : idx === 1 ? 'bg-[var(--amber-light)] text-[var(--amber)]' : 'bg-[var(--emerald-light)] text-[var(--emerald)]'}`}>
                  <Play size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-semibold text-[var(--ink-900)] leading-snug truncate">
                    {lesson.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[12px] text-[var(--text-tertiary)]">{lesson.dur}</span>
                    <span className="text-[12px] text-[var(--text-tertiary)] bg-[var(--bg-soft)] px-2 py-0.5 rounded-md">Начинаеш</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors shrink-0" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="soft-divider section-shell" />

      {/* COMMUNITY PREVIEW */}
      <section className="section-shell py-16 md:py-24">
        <motion.div 
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="label-caps mb-3 block">Общност</span>
            <h2 className="text-[clamp(28px,3.5vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--ink-900)]">Не си сам в това</h2>
          </div>
          <Button variant="ghost" onClick={() => setPage('community')} className="self-start md:self-auto text-[14px]">
            Виж общността <ChevronRight size={14} />
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Target, title: 'Седмични предизвикателства', desc: 'Всяка седмица ново предизвикателство, което натрупва умения стъпка по стъпка.' },
            { icon: MessageSquare, title: 'Дискусии и Q&A', desc: 'Задавай въпроси, получавай обратна връзка и учи от опита на другите.' },
            { icon: Clock, title: 'Office Hours', desc: 'Редовни live сесии, където разглеждаме конкретни проблеми и решения.' },
            { icon: Trophy, title: 'Member Wins', desc: 'Споделяй успехите си и виж как други прилагат AI в реални проекти.' },
            { icon: HelpCircle, title: 'Implementation Feedback', desc: 'Покажи workflow-а си и получи конкретни предложения за подобрение.' },
            { icon: Users, title: 'Мрежата', desc: 'Свържи се с хора от маркетинг, бизнес, дизайн и development в България.' },
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <motion.div 
                className="premium-card p-5 h-full"
                whileHover={{ y: -4 }}
              >
                <div className="w-9 h-9 rounded-lg bg-[var(--bg-soft)] flex items-center justify-center text-[var(--text-secondary)] mb-3">
                  <item.icon size={17} />
                </div>
                <h3 className="text-[15px] font-semibold text-[var(--ink-900)] mb-1.5">{item.title}</h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="soft-divider section-shell" />

      {/* PROMPTS PREVIEW */}
      <section className="section-shell py-12 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <span className="label-caps mb-3 block">Библиотека</span>
            <h2 className="display-md text-[var(--ink-900)]">Готови prompts, които работят</h2>
          </div>
          <Button variant="ghost" onClick={() => setPage('prompts')} className="self-start md:self-auto text-[14px]">
            Виж всички <ChevronRight size={14} />
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          {featuredPrompts.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
            >
              <div className="group grid grid-cols-[56px_1fr_auto] gap-4 md:gap-5 rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--brand)]/30 cursor-pointer dark:bg-white/[0.04]"
                onClick={() => setPage('prompts')}
              >
                <div className="text-3xl font-semibold text-black/10 dark:text-white/10">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-[var(--brand)]/10 px-3 py-1 text-xs font-medium text-[var(--brand)]">
                      {p.cat}
                    </span>
                    <span className="text-xs text-[var(--text-tertiary)]">{p.saves} запазвания</span>
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--ink-900)]">
                    {p.title}
                  </h3>
                  <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--text-tertiary)]">
                    {p.text}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 self-center">
                  <button
                    className="h-11 w-11 rounded-full border border-[var(--border)] transition group-hover:bg-[var(--ink-900)] group-hover:text-[var(--bg)] flex items-center justify-center shrink-0"
                    onClick={(e) => { e.stopPropagation(); setPage('prompts'); }}
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="soft-divider section-shell" />

      {/* EVENTS PREVIEW */}
      <section className="section-shell py-16 md:py-24">
        <motion.div 
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="label-caps mb-3 block">Събития</span>
            <h2 className="text-[clamp(28px,3.5vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--ink-900)]">Предстоящи workshops</h2>
          </div>
          <Button variant="ghost" onClick={() => setPage('events')} className="self-start md:self-auto text-[14px]">
            Календар <ChevronRight size={14} />
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EVENTS_DATA.slice(0, 3).map((e, idx) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <motion.div 
                className="premium-card p-6 h-full flex flex-col"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--accent-light)] flex flex-col items-center justify-center text-[var(--accent)] border border-[var(--accent)]/10">
                    <span className="text-[18px] font-bold leading-none">{e.day}</span>
                    <span className="text-[9px] font-semibold uppercase tracking-wider mt-0.5">{e.mo}</span>
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-[var(--ink-900)]">{e.title}</div>
                    <div className="text-[12px] text-[var(--text-secondary)] flex items-center gap-1 mt-0.5">
                      <Clock size={11} /> {e.time} · {e.dur}
                    </div>
                  </div>
                </div>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-5 flex-1">
                  {e.desc}
                </p>
                <Button size="sm" className="w-full" onClick={() => setPage('events')}>
                  Научи повече
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="soft-divider section-shell" />

      {/* PRICING PREVIEW */}
      <section className="section-shell py-16 md:py-24">
        <motion.div 
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="label-caps mb-3 block">Цени</span>
            <h2 className="text-[clamp(28px,3.5vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--ink-900)]">Ясни планове, без изненади</h2>
          </div>
          <Button variant="ghost" onClick={() => setPage('pricing')} className="self-start md:self-auto text-[14px]">
            Виж всички цени <ChevronRight size={14} />
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
            >
              <motion.div 
                className={`relative h-full premium-card p-6 flex flex-col overflow-hidden ${plan.highlight ? 'border-[var(--accent)]/25' : ''}`}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                {plan.highlight && (
                  <>
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[var(--accent)] to-[var(--lavender)] rounded-t-[24px]" />
                    <div className="absolute top-4 right-4">
                      <Badge variant="accent" className="text-[10px] rounded-full px-2.5 py-0.5 font-semibold tracking-wide shadow-sm">Популярен</Badge>
                    </div>
                  </>
                )}
                <div className={`mb-6 ${plan.highlight ? 'pt-2' : ''}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <motion.span 
                      className="text-[36px] font-semibold text-[var(--ink-900)] tracking-tight"
                      key={plan.price}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {plan.price}
                    </motion.span>
                    <span className="text-[14px] text-[var(--text-tertiary)]">{plan.period}</span>
                  </div>
                  <p className="text-[13px] text-[var(--text-secondary)] mt-2 leading-relaxed">{plan.desc}</p>
                </div>
                <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[13px] text-[var(--text-secondary)]">
                      <Check size={14} className={`mt-0.5 shrink-0 ${plan.highlight ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.highlight ? 'primary' : 'secondary'} className="w-full h-10" onClick={() => setPage('pricing')}>
                  {plan.cta}
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="soft-divider section-shell" />

      {/* FAQ */}
      <section className="section-shell py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="label-caps mb-3 block">Често задавани въпроси</span>
            <h2 className="text-[clamp(28px,3.5vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--ink-900)]">Всичко, което трябва да знаеш</h2>
          </motion.div>

          <div className="flex flex-col gap-3">
            {FAQS.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
              >
                <div className="premium-card overflow-hidden">
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

      <div className="soft-divider section-shell" />

      {/* FINAL CTA */}
      <section className="section-shell py-16 md:py-24 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative rounded-[32px] bg-[var(--ink-900)] text-[var(--bg)] overflow-hidden p-12 md:p-20">
            <motion.div 
              className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent)] rounded-full opacity-10 blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"
              animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.12, 0.08] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--emerald)] rounded-full opacity-8 blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
              <h2 className="text-[32px] md:text-[48px] font-semibold mb-5 tracking-[-0.02em] leading-[1.1]">
                Готов ли си да<br />започнеш?
              </h2>
              <p className="text-[17px] text-[var(--bg)]/60 mb-10 leading-relaxed max-w-lg">
                Присъедини се към общността, която учи AI практически. Без шум, без празни обещания.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" onClick={() => checkAuthThenGo('register')} className="gap-2 px-8 h-13 bg-[var(--bg)] text-[var(--ink-900)] hover:bg-[var(--bg-soft)] text-[16px] shadow-xl hover:shadow-2xl transition-all">
                    Започни безплатно <ArrowRight size={18} />
                  </Button>
                </motion.div>
                <Button size="lg" variant="ghost" onClick={() => setPage('pricing')} className="gap-2 px-7 h-13 text-[var(--bg)] hover:bg-[var(--bg)]/10 text-[16px]">
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
