import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useGsapHero } from '../hooks/useGsapHero';
import { useGsapScroll } from '../hooks/useGsapScroll';
import {
  ArrowRight, Sparkles, Users, Calendar, ChevronRight, Play, Check,
  Zap, MessageSquare, Trophy, HelpCircle, Layers, Target, Clock,
  BookOpen, Wand2, Rocket, BookMarked, Heart, Mail, Lock, Shield,
  Star, FileText, PenTool, Megaphone, Code, Briefcase, GraduationCap,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LESSONS_MODS, PROMPTS, EVENTS_DATA } from '../data';
import PathFinder from '../components/PathFinder';
import RotatingText from '../components/RotatingText';

const LEARNING_PATHS = [
  { id: 'beginner', label: 'AI за начинаещи', icon: BookOpen, desc: 'Основи, инструменти и първи стъпки', count: '5 урока' },
  { id: 'creators', label: 'AI за създатели', icon: PenTool, desc: 'Съдържание, видео, социални мрежи', count: '4 урока' },
  { id: 'business', label: 'AI за бизнес', icon: Briefcase, desc: 'Продажби, процеси и мащабиране', count: '5 урока' },
  { id: 'ads', label: 'AI за реклама', icon: Megaphone, desc: 'Meta Ads, копи, таргетиране', count: '3 урока' },
  { id: 'automation', label: 'AI автоматизации', icon: Code, desc: 'Make.com, workflows и agents', count: '3 урока' },
  { id: 'students', label: 'AI за студенти', icon: GraduationCap, desc: 'Учене, изпити, продуктивност', count: '4 урока' },
];

const FAQS = [
  {
    q: 'Кой стои зад AILABS.BG?',
    a: 'Екип от хора, които работят с AI инструменти всеки ден. Не сме университетски преподаватели — тестваме, чупим и намираме какво работи в реални български проекти.',
  },
  {
    q: 'Какво точно получавам с членството?',
    a: 'Структурирани уроци с конкретни примери, библиотека с prompts, практически workshops и общност от професионалисти. Без теория за теория.',
  },
  {
    q: 'Подходящо ли е за начинаещи?',
    a: 'Да. Започваме от нулата — кой инструмент за какво служи, как да пишеш prompt, който връща смислен отговор. Не са нужни технически познания.',
  },
  {
    q: 'Мога ли да спра членството си?',
    a: 'Разбира се. Няма договори със срок. Можеш да спреш или смениш плана по всяко време. Ако не си доволен в рамките на 7 дни, връщаме парите.',
  },
  {
    q: 'Има ли live сесии?',
    a: 'Да. Провеждаме office hours и workshops, където можеш да задаваш въпроси на живо. Графикът е в календара — виж датите и запази място.',
  },
  {
    q: 'Колко време отнема?',
    a: 'Всеки урок е между 12 и 30 минути. Можеш да учиш в свое темпо. Повечето хора започват да виждат разлика още в първите седмици.',
  },
  {
    q: 'Работи ли за български компании?',
    a: 'Абсолютно. Всички примери, prompts и workflows са адаптирани за българския пазар и европейския бизнес контекст.',
  },
];

const TOOLS = ['ChatGPT', 'Claude', 'Gemini', 'Midjourney', 'Runway', 'ElevenLabs', 'Perplexity', 'Notion AI', 'Canva AI', 'Make.com'];

const COURSE_IMAGES = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
];

const OUTCOMES = [
  { icon: MessageSquare, text: 'Да пишеш по-добри prompt-и' },
  { icon: Sparkles, text: 'Да създаваш съдържание по-бързо' },
  { icon: Megaphone, text: 'Да използваш AI за реклами' },
  { icon: Code, text: 'Да автоматизираш повтарящи се задачи' },
  { icon: BookOpen, text: 'Да учиш по-ефективно' },
  { icon: Zap, text: 'Да създаваш AI workflow-и' },
];

function BrandPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden brand-pattern">
      <div className="absolute inset-0 brand-mesh opacity-[0.02]" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--accent)]/4 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/4 animate-float-slow" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--accent)]/3 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4 animate-float" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[var(--accent)]/5 via-transparent to-[var(--blue)]/5 rounded-full blur-[100px] animate-gradient-shift opacity-60" />
    </div>
  );
}

export default function Home({ checkAuthThenGo, setPage }: any) {
  useDocumentTitle('Начало');
  const { user: currentUser } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const heroRef = useGsapHero();
  const scrollRef = useGsapScroll();

  const featuredPrompts = PROMPTS.slice(0, 3);
  const academyLessons = LESSONS_MODS.reduce((acc, mod) => acc.concat(mod.lessons), [] as any[]).slice(0, 3);
  const totalLessons = LESSONS_MODS.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const freeLessonsCount = LESSONS_MODS.flatMap(m => m.lessons).filter((l: any) => l.isFree).length;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    localStorage.setItem('craative_lead_email', email);
    setEmailSubmitted(true);
    setTimeout(() => setEmail(''), 3000);
  };

  return (
    <div ref={scrollRef} className="min-h-screen text-[var(--text-primary)]">
      {/* ═══════════════════════════════════════
          HERO
         ═══════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[92vh] md:min-h-[95vh] flex items-center overflow-hidden">
        <BrandPattern />

        <div className="section-shell relative z-10 w-full pt-32 md:pt-40 pb-20 md:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
            {/* Left — copy */}
            <div className="lg:col-span-6 xl:col-span-5">
              <span className="hero-brand text-[11px] font-semibold tracking-[0.3em] uppercase text-[var(--text-tertiary)] block mb-10 md:mb-12 opacity-0">
                AILABS.BG — БЪЛГАРСКА AI АКАДЕМИЯ
              </span>

              <h1 className="text-[clamp(40px,6vw,76px)] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--ink-900)] mb-8 md:mb-10">
                <span className="hero-title-line block opacity-0">Научи AI</span>
                <span className="hero-title-line block opacity-0">практично.</span>
                <span className="hero-title-line block text-[var(--accent)] opacity-0">
                  <RotatingText />
                </span>
              </h1>

              <p className="hero-desc text-[18px] md:text-[20px] text-[var(--text-secondary)] max-w-lg leading-[1.6] mb-12 md:mb-14 opacity-0">
                Уроци, общност и 1:1 помощ за хора, които искат да използват AI в работа, учене, реклама, съдържание и бизнес — без празна теория.
              </p>

              <div className="hero-cta flex flex-wrap items-center gap-4 mb-12 opacity-0">
                <Button size="lg" onClick={() => checkAuthThenGo('register')}>
                  Започни безплатно
                </Button>
                <Button variant="ghost" size="lg" onClick={() => setPage('lessons')}>
                  Виж академията <ArrowRight size={16} />
                </Button>
              </div>

              <div className="hero-trust flex flex-wrap items-center gap-x-8 gap-y-3 text-[13px] text-[var(--text-tertiary)] opacity-0">
                <span className="flex items-center gap-2">
                  <Check size={14} className="text-[var(--accent)]" /> Без кредитна карта
                </span>
                <span className="flex items-center gap-2">
                  <Check size={14} className="text-[var(--accent)]" /> {freeLessonsCount} безплатни урока
                </span>
                <span className="flex items-center gap-2">
                  <Check size={14} className="text-[var(--accent)]" /> Подходящо за начинаещи
                </span>
              </div>
            </div>

            {/* Right — visual */}
            <div className="hero-visual lg:col-span-6 xl:col-span-7 relative hidden lg:block opacity-0">
              <div className="relative w-full aspect-[4/3] max-w-[580px] ml-auto animate-float">
                <div className="absolute inset-0 rounded-[32px] overflow-hidden shadow-2xl border border-[var(--border)]">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80"
                    alt="AILABS.BG — практическо AI обучение"
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
                </div>

                <div className="absolute -bottom-5 -left-5 retina-card rounded-2xl px-5 py-3.5 shadow-xl flex items-center gap-3 stat-bubble">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)]">
                    <Play size={16} fill="currentColor" />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[var(--ink-900)]">Въведение в AI</div>
                    <div className="text-[12px] text-[var(--text-tertiary)]">12 мин • Безплатно</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHAT IS AILABS.BG
         ═══════════════════════════════════════ */}
      <section className="section-shell py-28 md:py-40">
        <div className="max-w-3xl mx-auto text-center gsap-section">
          <p className="text-[12px] font-medium tracking-[0.2em] uppercase text-[var(--accent)] mb-5">
            За платформата
          </p>
          <h2 className="text-[clamp(28px,3.5vw,44px)] font-semibold leading-[1.1] tracking-[-0.03em] text-[var(--ink-900)] mb-8">
            Какво е AILABS.BG?
          </h2>
          <p className="text-[18px] md:text-[20px] text-[var(--text-secondary)] leading-[1.7]">
            AILABS.BG е българска AI академия и общност, създадена за практическо учене — без излишна теория, 
            без сложни термини и без объркване. Учим се да използваме AI в реални задачи, заедно.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TOOLS MARQUEE
         ═══════════════════════════════════════ */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-soft)]/30 py-5 overflow-hidden">
        <div className="marquee-track">
          {[...TOOLS, ...TOOLS, ...TOOLS, ...TOOLS].map((tool, i) => (
            <div key={i} className="flex items-center gap-3 px-8 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/30" />
              <span className="text-[14px] font-medium text-[var(--text-secondary)] whitespace-nowrap">{tool}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          LEARNING PATHS
         ═══════════════════════════════════════ */}
      <section className="section-shell py-28 md:py-40">
        <div className="text-center mb-16 md:mb-20 gsap-section">
          <p className="text-[12px] font-medium tracking-[0.2em] uppercase text-[var(--accent)] mb-4">Обучение</p>
          <h2 className="text-[clamp(32px,4vw,48px)] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--ink-900)]">
            Избери своя AI път
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 gsap-stagger">
          {LEARNING_PATHS.map((path) => (
            <div
              key={path.id}
              className="gsap-item group cursor-pointer retina-card p-7 md:p-8 card-hover-glow shine-hover"
              onClick={() => setPage('lessons')}
            >
              <div className="w-12 h-12 rounded-2xl bg-[var(--bg-soft)] flex items-center justify-center text-[var(--text-secondary)] group-hover:bg-[var(--accent-light)] group-hover:text-[var(--accent)] transition-colors duration-300 mb-5">
                <path.icon size={22} strokeWidth={1.5} className="icon-pop" />
              </div>
              <h3 className="text-[17px] font-semibold text-[var(--ink-900)] mb-2 group-hover:text-[var(--accent)] transition-colors duration-300">
                {path.label}
              </h3>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed mb-4">{path.desc}</p>
              <span className="text-[12px] font-medium text-[var(--text-tertiary)]">{path.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS
         ═══════════════════════════════════════ */}
      <section className="section-shell py-28 md:py-40">
        <div className="max-w-3xl mx-auto text-center mb-20 md:mb-24 gsap-section">
          <p className="text-[12px] font-medium tracking-[0.2em] uppercase text-[var(--accent)] mb-4">Процес</p>
          <h2 className="text-[clamp(32px,4vw,48px)] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--ink-900)]">
            Как работи?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-6 gsap-stagger">
          {[
            { num: '01', icon: BookMarked, title: 'Избираш ниво', desc: 'Намери къде си и къде искаш да стигнеш.' },
            { num: '02', icon: BookOpen, title: 'Гледаш урок', desc: 'Кратък, практичен и на български.' },
            { num: '03', icon: Wand2, title: 'Правиш задача', desc: 'Прилагаш веднага с реален пример.' },
            { num: '04', icon: MessageSquare, title: 'Получаваш помощ', desc: 'Питаш в общността или на 1:1 сесия.' },
            { num: '05', icon: Rocket, title: 'Надграждаш', desc: 'Всяка следваща стъпка е по-уверена.' },
          ].map((step) => (
            <div key={step.num} className="gsap-item text-center group">
              <div className="w-16 h-16 rounded-[20px] bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <step.icon size={24} strokeWidth={1.5} className="icon-pop" />
              </div>
              <div className="text-[11px] font-bold text-[var(--text-tertiary)] tracking-wider mb-2">{step.num}</div>
              <h3 className="text-[17px] font-semibold text-[var(--ink-900)] mb-2">{step.title}</h3>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed max-w-[220px] mx-auto">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ACADEMY PREVIEW
         ═══════════════════════════════════════ */}
      <section className="section-shell py-28 md:py-40">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16 md:mb-20 gsap-section">
          <div>
            <p className="text-[12px] font-medium tracking-[0.2em] uppercase text-[var(--accent)] mb-4">Академия</p>
            <h2 className="text-[clamp(32px,4vw,48px)] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--ink-900)]">
              Започни с тези уроци
            </h2>
          </div>
          <Button variant="ghost" onClick={() => setPage('lessons')} className="self-start md:self-auto">
            Виж всички <ChevronRight size={14} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 gsap-stagger">
          {academyLessons.map((lesson: any, idx: number) => (
            <div
              key={lesson.id}
              className="gsap-item group cursor-pointer"
              onClick={() => setPage('lessons')}
            >
              <div className="relative aspect-[16/10] rounded-[24px] overflow-hidden mb-6 border border-[var(--border)] shadow-sm">
                <img
                  src={COURSE_IMAGES[idx]}
                  alt={lesson.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[var(--accent)] shadow-lg">
                    <Play size={24} fill="currentColor" className="ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-2 text-white/90 text-[13px]">
                    <Clock size={13} /> {lesson.dur}
                    <span className="w-1 h-1 rounded-full bg-white/50" />
                    <span>{lesson.isFree ? 'Безплатно' : 'Pro'}</span>
                  </div>
                </div>
              </div>
              <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mb-2 group-hover:text-[var(--accent)] transition-colors duration-300">
                {lesson.title}
              </h3>
              <p className="text-[15px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                {lesson.desc || 'Научи практически техники, които можеш да приложиш веднага в работата си.'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          AI ПЪТЕВОДИТЕЛ
         ═══════════════════════════════════════ */}
      <PathFinder setPage={setPage} />

      {/* ═══════════════════════════════════════
          PROMPTS + EVENTS
         ═══════════════════════════════════════ */}
      <section className="section-shell py-28 md:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-24">
          {/* Prompts */}
          <div className="gsap-section">
            <div className="flex items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-[12px] font-medium tracking-[0.2em] uppercase text-[var(--accent)] mb-4">Библиотека</p>
                <h2 className="text-[clamp(26px,3vw,36px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--ink-900)]">
                  Готови prompt-и
                </h2>
              </div>
              <Button variant="ghost" onClick={() => setPage('prompts')} className="shrink-0">
                Всички <ChevronRight size={14} />
              </Button>
            </div>

            <div className="space-y-0">
              {featuredPrompts.map((p, idx) => (
                <div
                  key={p.id}
                  className="group cursor-pointer border-t border-[var(--border)]"
                  onClick={() => setPage('prompts')}
                >
                  <div className="py-7 flex items-start gap-4">
                    <span className="text-[32px] font-bold text-[var(--ink-900)]/[0.04] leading-none shrink-0 w-10">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--accent)]">
                          {p.cat}
                        </span>
                        <span className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1">
                          <Heart size={11} /> {p.saves}
                        </span>
                      </div>
                      <h3 className="text-[17px] font-semibold text-[var(--ink-900)] group-hover:text-[var(--accent)] transition-colors duration-300 mb-1.5">
                        {p.title}
                      </h3>
                      <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                        {p.text}
                      </p>
                    </div>
                    <ArrowRight size={16} className="text-[var(--text-tertiary)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all duration-300 shrink-0 mt-1" />
                  </div>
                </div>
              ))}
              <div className="border-t border-[var(--border)]" />
            </div>
          </div>

          {/* Events */}
          <div className="gsap-section">
            <div className="flex items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-[12px] font-medium tracking-[0.2em] uppercase text-[var(--accent)] mb-4">Събития</p>
                <h2 className="text-[clamp(26px,3vw,36px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--ink-900)]">
                  Предстоящи
                </h2>
              </div>
              <Button variant="ghost" onClick={() => setPage('events')} className="shrink-0">
                Календар <ChevronRight size={14} />
              </Button>
            </div>

            <div className="space-y-5">
              {EVENTS_DATA.slice(0, 3).map((e) => (
                <div
                  key={e.id}
                  className="group cursor-pointer"
                  onClick={() => setPage('events')}
                >
                  <div className="flex gap-4 p-5 rounded-[20px] bg-[var(--bg-soft)]/50 hover:bg-[var(--bg-soft)] transition-colors duration-300 border border-[var(--border)] solid-card card-hover-glow">
                    <div className="shrink-0 w-16 h-16 rounded-2xl bg-[var(--bg)] flex flex-col items-center justify-center border border-[var(--border)]">
                      <div className="text-[20px] font-bold text-[var(--ink-900)] leading-none">{e.day}</div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">{e.mo}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[16px] font-semibold text-[var(--ink-900)] mb-1.5 group-hover:text-[var(--accent)] transition-colors duration-300">
                        {e.title}
                      </h3>
                      <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed line-clamp-2">{e.desc}</p>
                      <div className="flex items-center gap-3 mt-2.5 text-[12px] text-[var(--text-tertiary)]">
                        <span className="flex items-center gap-1"><Clock size={11} /> {e.time}</span>
                        <span>{e.spots} места</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          OUTCOMES
         ═══════════════════════════════════════ */}
      <section className="section-shell py-28 md:py-40">
        <div className="text-center mb-16 md:mb-20 gsap-section">
          <p className="text-[12px] font-medium tracking-[0.2em] uppercase text-[var(--accent)] mb-4">Резултати</p>
          <h2 className="text-[clamp(32px,4vw,48px)] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--ink-900)]">
            Какво ще можеш след това?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 gsap-stagger">
          {OUTCOMES.map((item) => (
            <div
              key={item.text}
              className="gsap-item group flex items-center gap-5 p-6 rounded-[20px] solid-card border border-[var(--border)] bg-[var(--bg)] hover:bg-[var(--bg-soft)] transition-colors duration-300 card-hover-glow"
            >
              <div className="w-11 h-11 rounded-xl bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] shrink-0 group-hover:scale-110 transition-transform duration-300">
                <item.icon size={20} strokeWidth={1.5} className="icon-pop" />
              </div>
              <span className="text-[16px] font-medium text-[var(--ink-900)]">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          COMMUNITY + COACHING
         ═══════════════════════════════════════ */}
      <section className="section-shell py-28 md:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          <div className="gsap-section">
            <div className="rounded-[24px] bg-[var(--bg-soft)] p-10 md:p-12 relative overflow-hidden h-full border border-[var(--border)] solid-card card-hover-glow">
              <div className="relative z-10">
                <p className="text-[12px] font-medium tracking-[0.2em] uppercase text-[var(--accent)] mb-4">Общност</p>
                <h2 className="text-[clamp(26px,3vw,36px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--ink-900)] mb-5">
                  Не си сам в това
                </h2>
                <p className="text-[16px] text-[var(--text-secondary)] leading-[1.7] mb-10">
                  Присъедини се към хора, които вече прилагат AI в работата си. Споделяй опит, задавай въпроси и учи заедно с други българи.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-10">
                  {[
                    { icon: Target, text: 'Седмични предизвикателства' },
                    { icon: MessageSquare, text: 'Дискусии и Q&A' },
                    { icon: Trophy, text: 'Споделени успехи' },
                    { icon: HelpCircle, text: 'Обратна връзка' },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-2.5 text-[14px] text-[var(--text-secondary)]">
                      <item.icon size={15} className="text-[var(--accent)]" strokeWidth={1.5} />
                      {item.text}
                    </div>
                  ))}
                </div>
                <Button onClick={() => setPage('community')}>Влез в общността <ArrowRight size={16} /></Button>
              </div>
            </div>
          </div>

          <div className="gsap-section">
            <div className="rounded-[24px] border border-[var(--border)] p-10 md:p-12 relative overflow-hidden h-full bg-[var(--bg)] solid-card card-hover-glow">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-light)] text-[var(--accent-text)] text-[11px] font-medium mb-4">
                  <Users size={11} />
                  Персонализирано обучение
                </div>
                <h2 className="text-[clamp(26px,3vw,36px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--ink-900)] mb-5">
                  1:1 AI Коучинг
                </h2>
                <p className="text-[16px] text-[var(--text-secondary)] leading-[1.7] mb-8">
                  Персонализирани сесии с нашия екип. Анализираме твоя workflow, избираме правилните инструменти и изграждаме система, която работи за теб.
                </p>
                <ul className="flex flex-col gap-3 mb-10">
                  {[
                    'Персонален AI roadmap',
                    'Live screen-sharing сесии',
                    'Имплементация в реално време',
                    'Follow-up и подкрепа',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[14px] text-[var(--text-secondary)]">
                      <Check size={15} className="text-[var(--accent)] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button size="lg" onClick={() => setPage('coaching')}>Запиши се за разговор</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          EMAIL CAPTURE
         ═══════════════════════════════════════ */}
      <section className="section-shell pb-28 md:pb-40">
        <div className="max-w-2xl mx-auto text-center gsap-section">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-light)] text-[var(--accent-text)] text-[11px] font-medium mb-6">
            <Mail size={11} />
            Безплатен ресурс
          </div>
          <h2 className="text-[clamp(30px,3.5vw,42px)] font-semibold leading-[1.1] tracking-[-0.03em] text-[var(--ink-900)] mb-5">
            5 prompt-а, които спестяват<br />
            <span className="text-[var(--accent)]">5 часа седмично</span>
          </h2>
          <p className="text-[16px] md:text-[17px] text-[var(--text-secondary)] leading-[1.7] mb-10 max-w-md mx-auto">
            Практически PDF с готови prompt-и за email, срещи, content и automation. Плюс достъп до първия урок.
          </p>

          {emailSubmitted ? (
            <div className="text-center p-10 rounded-[24px] border border-[var(--border)] bg-[var(--bg)] max-w-md mx-auto">
              <div className="w-14 h-14 rounded-full bg-[var(--emerald-light)] flex items-center justify-center text-[var(--emerald)] mx-auto mb-4">
                <Check size={24} />
              </div>
              <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mb-1">Готово!</h3>
              <p className="text-[14px] text-[var(--text-secondary)]">Провери email-а си. Изпратихме ти PDF-а и линк към първия урок.</p>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto space-y-4">
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                <input
                  type="email"
                  placeholder="твоят@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[56px] pl-12 pr-4 rounded-[16px] border border-[var(--border)] bg-[var(--bg)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] text-[15px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all"
                  required
                />
              </div>
              <Button type="submit" size="lg" className="w-full">
                Изпрати ми PDF-а
              </Button>
              <p className="text-[12px] text-[var(--text-tertiary)] text-center">
                Не споделяме email-а ти с никого. Можеш да се отпишеш по всяко време.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PRICING
         ═══════════════════════════════════════ */}
      <section className="section-shell pb-28 md:pb-40">
        <div className="text-center mb-16 md:mb-20 gsap-section">
          <p className="text-[12px] font-medium tracking-[0.2em] uppercase text-[var(--accent)] mb-4">Цени</p>
          <h2 className="text-[clamp(32px,4vw,48px)] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--ink-900)]">
            Ясни планове, без изненади
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto gsap-stagger">
          {[
            {
              name: 'Free',
              price: '0 €',
              period: '/месец',
              desc: 'Разгледай платформата, опитай безплатните уроци и виж дали ти пасва.',
              features: [`${freeLessonsCount} безплатни урока`, '10+ готови prompt-а', 'Общност — preview', 'Записи от избрани събития'],
              cta: 'Започни',
              plan: 'free',
            },
            {
              name: 'Pro',
              price: '25 €',
              period: '/месец',
              desc: 'Пълен достъп до академията, prompt-ите и общността. За хора, които ще прилагат.',
              features: [`Всички ${totalLessons} урока`, '50+ тествани prompt-а', 'Пълен достъп до общността', 'Седмични workshops', 'Предизвикателства', 'Шаблони и workflows'],
              cta: 'Избери Pro',
              plan: 'pro',
              highlight: true,
            },
            {
              name: 'Premium',
              price: '65 €',
              period: '/месец',
              desc: 'Pro + лична подкрепа от екипа ни. За хора, които искат резултати бързо.',
              features: ['Всичко от Pro', '1:1 AI Коучинг', 'Личен AI roadmap', 'Преглед на твоите workflows', 'Приоритет при въпроси'],
              cta: 'Избери Premium',
              plan: 'premium',
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`gsap-item relative h-full rounded-[24px] p-8 md:p-10 flex flex-col card-hover-glow ${
                plan.highlight
                  ? 'bg-[var(--accent-light)]/30 border border-[var(--accent)]/20 retina-card shine-hover'
                  : 'bg-[var(--bg-soft)]/50 border border-[var(--border)] solid-card'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-8">
                  <Badge variant="accent" className="text-[10px] rounded-full px-3 py-1 font-semibold tracking-wide">Популярен</Badge>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-4">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-[40px] font-semibold text-[var(--ink-900)] tracking-tight">{plan.price}</span>
                  <span className="text-[14px] text-[var(--text-tertiary)]">{plan.period}</span>
                </div>
                <p className="text-[14px] text-[var(--text-secondary)] mt-3 leading-relaxed">{plan.desc}</p>
              </div>
              <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px] text-[var(--text-secondary)]">
                    <Check size={15} className={`mt-0.5 shrink-0 ${plan.highlight ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant={plan.highlight ? 'primary' : 'secondary'} className="w-full" onClick={() => setPage('pricing')}>
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-[13px] text-[var(--text-tertiary)]">
          <span className="flex items-center gap-2"><Lock size={14} /> Сигурно плащане</span>
          <span className="flex items-center gap-2"><Shield size={14} /> 7 дни гаранция</span>
          <span className="flex items-center gap-2"><Check size={14} /> Без договор</span>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FAQ
         ═══════════════════════════════════════ */}
      <section className="section-shell pb-28 md:pb-40">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16 md:mb-20 gsap-section">
            <p className="text-[12px] font-medium tracking-[0.2em] uppercase text-[var(--accent)] mb-4">FAQ</p>
            <h2 className="text-[clamp(32px,4vw,48px)] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--ink-900)]">
              Всичко, което трябва да знаеш
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="gsap-item">
                <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg)] overflow-hidden">
                  <button
                    className="w-full text-left p-6 flex items-center justify-between gap-4"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  >
                    <span className="text-[15px] font-semibold text-[var(--ink-900)]">{faq.q}</span>
                    <motion.div
                      animate={{ rotate: openFaq === idx ? 90 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ChevronRight size={16} className="text-[var(--text-tertiary)] shrink-0" />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-[15px] text-[var(--text-secondary)] leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FINAL CTA
         ═══════════════════════════════════════ */}
      <section className="section-shell pb-24 md:pb-32">
        <div className="gsap-section">
          <div className="relative rounded-[32px] overflow-hidden bg-[var(--ink-900)]">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent)] rounded-full opacity-[0.05] blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />

            <div className="relative z-10 p-12 md:p-20 lg:p-24">
              <div className="max-w-xl">
                <h2 className="text-[clamp(36px,5vw,56px)] font-semibold mb-6 tracking-[-0.035em] leading-[1.05] text-[var(--bg)]">
                  Готов ли си<br />да започнеш?
                </h2>
                <p className="text-[17px] md:text-[18px] text-[var(--bg)]/40 mb-12 leading-relaxed max-w-md">
                  Влез в AILABS.BG и започни с първите практически AI уроци още днес. Без шум, без празни обещания.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="lg" className="gap-2 px-8 bg-[var(--bg)] text-[var(--ink-900)] hover:bg-[var(--bg-soft)] text-[14px]" onClick={() => checkAuthThenGo('register')}>
                    Започни безплатно <ArrowRight size={16} />
                  </Button>
                  <Button size="lg" variant="ghost" onClick={() => setPage('pricing')} className="gap-2 px-6 text-[var(--bg)] hover:bg-[var(--bg)]/8 text-[14px]">
                    Виж цените
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
