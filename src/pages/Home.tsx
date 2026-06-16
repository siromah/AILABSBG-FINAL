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
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80',
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
  'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800&q=80',
];

const OUTCOMES = [
  { icon: MessageSquare, text: 'Да пишеш по-добри prompt-и' },
  { icon: Sparkles, text: 'Да създаваш съдържание по-бързо' },
  { icon: Megaphone, text: 'Да използваш AI за реклами' },
  { icon: Code, text: 'Да автоматизираш повтарящи се задачи' },
  { icon: BookOpen, text: 'Да учиш по-ефективно' },
  { icon: Zap, text: 'Да създаваш AI workflow-и' },
];

const PATH_COLORS = [
  { accent: 'var(--accent)', light: 'var(--accent-light)' },
  { accent: 'var(--secondary)', light: 'var(--secondary-light)' },
  { accent: 'var(--green)', light: 'var(--green-light)' },
  { accent: 'var(--accent)', light: 'var(--accent-light)' },
  { accent: 'var(--secondary)', light: 'var(--secondary-light)' },
  { accent: 'var(--green)', light: 'var(--green-light)' },
];

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
    localStorage.setItem('ailabs_lead_email', email);
    setEmailSubmitted(true);
    setTimeout(() => setEmail(''), 3000);
  };

  return (
    <div ref={scrollRef} className="min-h-screen text-[var(--text-primary)] bg-[var(--bg)]">
      {/* ═══════════════════════════════════════
          HERO — Soft, warm, inviting
         ═══════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[90vh] md:min-h-[92vh] flex items-center overflow-hidden bg-[var(--gradient-hero)]">
        <div className="section-shell relative z-10 w-full pt-24 md:pt-32 pb-20 md:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left — copy */}
            <div className="lg:col-span-6 xl:col-span-5">
              <div className="hero-brand mb-6 opacity-0">
                <Badge variant="accent" className="rounded-full px-4 py-1.5 text-[11px] tracking-wide mb-4 bg-[var(--accent-light)] text-[var(--accent-text)] border-0">
                  Премиум AI общност
                </Badge>
              </div>

              <h1 className="display-xl text-[var(--ink-900)] mb-6 md:mb-8">
                <span className="hero-title-line block opacity-0">Научи AI</span>
                <span className="hero-title-line block opacity-0">практично.</span>
                <span className="hero-title-line block text-[var(--accent)] opacity-0">
                  <RotatingText />
                </span>
              </h1>

              <p className="hero-desc text-[18px] md:text-[20px] text-[var(--text-secondary)] max-w-xl leading-[1.6] mb-10 opacity-0">
                Уроци, общност и 1:1 помощ за хора, които искат да използват AI в работа, учене, реклама, съдържание и бизнес — без празна теория.
              </p>

              <div className="hero-cta flex flex-wrap items-center gap-4 mb-8 opacity-0">
                <Button size="lg" onClick={() => checkAuthThenGo('register')}>
                  Започни безплатно
                </Button>
                <Button variant="secondary" size="lg" onClick={() => setPage('lessons')}>
                  Виж академията <ArrowRight size={16} />
                </Button>
              </div>

              <div className="hero-rating flex items-center gap-3 mb-10 opacity-0">
                <div className="flex -space-x-2">
                  {[
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
                  ].map((src, i) => (
                    <img key={i} src={src} alt="" className="w-8 h-8 rounded-full border-2 border-[var(--bg)] object-cover" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[var(--accent)]">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                    <span className="text-[13px] font-semibold text-[var(--ink-900)] ml-1">4.8/5</span>
                  </div>
                  <div className="text-[12px] text-[var(--text-secondary)]">от 500+ членове на общността</div>
                </div>
              </div>

              <div className="hero-trust flex flex-wrap items-center gap-x-8 gap-y-3 text-[13px] text-[var(--text-secondary)] opacity-0">
                <span className="flex items-center gap-2">
                  <Check size={14} className="text-[var(--green)]" /> Без кредитна карта
                </span>
                <span className="flex items-center gap-2">
                  <Check size={14} className="text-[var(--accent)]" /> {freeLessonsCount} безплатни урока
                </span>
                <span className="flex items-center gap-2">
                  <Check size={14} className="text-[var(--secondary)]" /> Подходящо за начинаещи
                </span>
              </div>
            </div>

            {/* Right — visual */}
            <div className="hero-visual lg:col-span-6 xl:col-span-7 relative hidden lg:block opacity-0">
              <div className="relative w-full aspect-[4/3] max-w-[560px] ml-auto">
                <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg border border-[var(--border)] bg-[var(--surface-strong)]">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80"
                    alt="AILABS.BG — практическо AI обучение"
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute -bottom-4 -left-4 bg-[var(--surface-strong)] rounded-2xl px-5 py-3.5 shadow-md border border-[var(--border)] flex items-center gap-3">
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
          TRUST BAR
         ═══════════════════════════════════════ */}
      <section className="section-shell pb-12 md:pb-16">
        <div className="text-center gsap-section">
          <p className="text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--text-tertiary)] mb-5">
            Инструментите, които изучаваме
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-80">
            {['ChatGPT', 'Claude', 'Gemini', 'Midjourney', 'Make.com', 'Notion AI'].map((tool) => (
              <span key={tool} className="text-[16px] font-medium text-[var(--text-secondary)]">{tool}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          STATS BAR
         ═══════════════════════════════════════ */}
      <section className="relative z-20 mx-4 md:mx-8 lg:mx-auto max-w-5xl">
        <div className="bg-[var(--surface-strong)] rounded-2xl shadow-sm border border-[var(--border)] p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '500+', label: 'Членове на общността' },
            { value: `${totalLessons}+`, label: 'Практически урока' },
            { value: '50+', label: 'Готови prompt-а' },
            { value: '4.8/5', label: 'Средна оценка' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-[28px] md:text-[34px] font-semibold text-[var(--accent)] tracking-tight">{stat.value}</div>
              <div className="text-[14px] text-[var(--text-secondary)] mt-1.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHAT IS AILABS.BG
         ═══════════════════════════════════════ */}
      <section className="py-24 md:py-32">
        <div className="section-shell">
          <div className="text-center mb-16 md:mb-20 gsap-section">
            <p className="text-[13px] font-semibold tracking-[0.15em] uppercase text-[var(--accent)] mb-4">За платформата</p>
            <h2 className="display-lg text-[var(--ink-900)] mb-5">
              Какво е AILABS.BG?
            </h2>
            <p className="text-[18px] md:text-[20px] text-[var(--text-secondary)] leading-[1.6] max-w-2xl mx-auto">
              Българска AI академия и общност, създадена за практическо учене — без излишна теория,
              без сложни термини и без объъркване. Учим се да използваме AI в реални задачи, заедно.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 gsap-stagger">
            {[
              { title: 'Практически уроци', desc: 'Кратки видеа с реални примери, които можеш да приложиш веднага.', icon: Play, color: 'accent' },
              { title: 'Жива общност', desc: 'Питай, споделяй резултати и учи заедно с други любопитни хора.', icon: Users, color: 'secondary' },
              { title: 'Premium достъп', desc: 'Workshops, prompt библиотека, шаблони и 1:1 менторство.', icon: Star, color: 'green' },
            ].map((card, i) => {
              const colorMap: any = {
                accent: { bg: 'bg-[var(--accent-light)]', text: 'text-[var(--accent)]' },
                secondary: { bg: 'bg-[var(--secondary-light)]', text: 'text-[var(--secondary)]' },
                green: { bg: 'bg-[var(--green-light)]', text: 'text-[var(--green)]' },
              };
              const c = colorMap[card.color];
              return (
                <div key={i} className="gsap-item bg-[var(--surface-strong)] border border-[var(--border)] rounded-xl p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-2xl ${c.bg} ${c.text} flex items-center justify-center mb-5`}>
                    <card.icon size={22} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mb-2">{card.title}</h3>
                  <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TESTIMONIALS
         ═══════════════════════════════════════ */}
      <section className="section-shell pb-24 md:pb-32">
        <div className="text-center mb-14 md:mb-16 gsap-section">
          <p className="text-[13px] font-semibold tracking-[0.15em] uppercase text-[var(--accent)] mb-4">Мнения</p>
          <h2 className="display-lg text-[var(--ink-900)] mb-5">
            Какво казват членовете
          </h2>
          <p className="text-[17px] text-[var(--text-secondary)] max-w-2xl mx-auto">
            Реални хора, реални резултати. Без платени отзиви.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 gsap-stagger">
          {[
            {
              name: 'Мария К.',
              role: 'Маркетинг мениджър',
              text: 'За две седмици намалих времето за писане на имейли и социални постове с поне 60%. Уроците са директни и приложими.',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
            },
            {
              name: 'Георги П.',
              role: 'Предприемач',
              text: 'Най-накрая някой обяснява AI на български и с реални бизнес примери. Вече автоматизирам част от операциите си с Make.com.',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
            },
            {
              name: 'Даниела Т.',
              role: 'Студентка',
              text: 'Ползвам AI за учене и подготовка за изпити. Общността е страхотна — винаги има кой да отговори на въпрос.',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
            },
          ].map((t, i) => (
            <div key={i} className="gsap-item bg-[var(--surface-strong)] border border-[var(--border)] rounded-xl p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-1 text-[var(--accent)] mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
              </div>
              <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed mb-6">
                „{t.text}“
              </p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <div className="text-[14px] font-semibold text-[var(--ink-900)]">{t.name}</div>
                  <div className="text-[12px] text-[var(--text-tertiary)]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TOOLS MARQUEE
         ═══════════════════════════════════════ */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-soft)] py-5 overflow-hidden">
        <div className="marquee-track">
          {[...TOOLS, ...TOOLS, ...TOOLS, ...TOOLS].map((tool, i) => (
            <div key={i} className="flex items-center gap-3 px-8 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/40" />
              <span className="text-[14px] font-medium text-[var(--text-secondary)] whitespace-nowrap">{tool}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          LEARNING PATHS
         ═══════════════════════════════════════ */}
      <section className="section-shell py-24 md:py-32">
        <div className="text-center mb-16 md:mb-20 gsap-section">
          <p className="text-[13px] font-semibold tracking-[0.15em] uppercase text-[var(--accent)] mb-4">Обучение</p>
          <h2 className="display-lg text-[var(--ink-900)] mb-5">
            Избери своя AI път
          </h2>
          <p className="text-[17px] text-[var(--text-secondary)] max-w-2xl mx-auto">
            Шест ясни посоки. Без объркване. Започни оттам, където си днес.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 gsap-stagger">
          {LEARNING_PATHS.map((path, idx) => {
            const { accent, light } = PATH_COLORS[idx];
            return (
              <div
                key={path.id}
                className="gsap-item group cursor-pointer bg-[var(--surface-strong)] rounded-xl border border-[var(--border)] p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                onClick={() => setPage('lessons')}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300" style={{ backgroundColor: light, color: accent }}>
                  <path.icon size={22} strokeWidth={1.5} />
                </div>
                <h3 className="text-[17px] font-semibold text-[var(--ink-900)] mb-1.5 group-hover:text-[var(--accent)] transition-colors duration-300">
                  {path.label}
                </h3>
                <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed mb-4">{path.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-[var(--text-tertiary)]">{path.count}</span>
                  <span className="flex items-center gap-1 text-[12px] font-medium text-[var(--accent)] group-hover:translate-x-0.5 transition-transform">
                    Започни <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS
         ═══════════════════════════════════════ */}
      <section className="section-shell py-24 md:py-32 bg-[var(--bg-soft)] rounded-2xl md:rounded-[40px] my-8 md:my-12">
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20 gsap-section">
          <p className="text-[13px] font-semibold tracking-[0.15em] uppercase text-[var(--accent)] mb-4">Процес</p>
          <h2 className="display-lg text-[var(--ink-900)] mb-5">
            Как работи?
          </h2>
          <p className="text-[17px] text-[var(--text-secondary)]">
            Пет стъпки. От първия урок до първия реален резултат.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-6 gsap-stagger">
          <div className="hidden md:block absolute top-7 left-[10%] right-[10%] h-[2px] bg-[var(--border-strong)]" />

          {[
            { num: '01', icon: BookMarked, title: 'Избираш ниво', desc: 'Намери къде си и къде искаш да стигнеш.' },
            { num: '02', icon: BookOpen, title: 'Гледаш урок', desc: 'Кратък, практичен и на български.' },
            { num: '03', icon: Wand2, title: 'Правиш задача', desc: 'Прилагаш веднага с реален пример.' },
            { num: '04', icon: MessageSquare, title: 'Получаваш помощ', desc: 'Питаш в общността или на 1:1 сесия.' },
            { num: '05', icon: Rocket, title: 'Надграждаш', desc: 'Всяка следваща стъпка е по-уверена.' },
          ].map((step) => (
            <div key={step.num} className="gsap-item text-center group relative z-10">
              <div className="w-14 h-14 rounded-full bg-[var(--surface-strong)] border-2 border-[var(--border-strong)] flex items-center justify-center mx-auto mb-4 group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] transition-colors duration-300 shadow-sm">
                <step.icon size={22} strokeWidth={1.5} />
              </div>
              <div className="text-[11px] font-bold text-[var(--accent)] tracking-wider mb-1.5">{step.num}</div>
              <h3 className="text-[16px] font-semibold text-[var(--ink-900)] mb-1.5">{step.title}</h3>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed max-w-[220px] mx-auto">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ACADEMY PREVIEW
         ═══════════════════════════════════════ */}
      <section className="section-shell py-24 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 md:mb-16 gsap-section">
          <div>
            <p className="text-[13px] font-semibold tracking-[0.15em] uppercase text-[var(--accent)] mb-4">Академия</p>
            <h2 className="display-lg text-[var(--ink-900)] mb-3">
              Започни с тези уроци
            </h2>
            <p className="text-[17px] text-[var(--text-secondary)] max-w-xl">
              Избрани уроци, с които да усетиш практическия подход на AILABS.BG.
            </p>
          </div>
          <Button variant="secondary" onClick={() => setPage('lessons')} className="self-start md:self-auto">
            Виж всички <ChevronRight size={14} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 gsap-stagger">
          {academyLessons.map((lesson: any, idx: number) => (
            <div
              key={lesson.id}
              className="gsap-item group cursor-pointer bg-[var(--surface-strong)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              onClick={() => setPage('lessons')}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={COURSE_IMAGES[idx]}
                  alt={lesson.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-[var(--accent)] shadow-md">
                    <Play size={20} fill="currentColor" className="ml-0.5" />
                  </div>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/90 text-[var(--ink-900)]">
                    {lesson.isFree ? 'Безплатно' : 'Pro'}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-[12px] text-[var(--text-tertiary)] mb-2">
                  <Clock size={12} /> {lesson.dur}
                </div>
                <h3 className="text-[17px] font-semibold text-[var(--ink-900)] mb-1.5 group-hover:text-[var(--accent)] transition-colors duration-300">
                  {lesson.title}
                </h3>
                <p className="text-[14px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {lesson.desc || 'Научи практически техники, които можеш да приложиш веднага в работата си.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          AI ПЪТЕВОДИТЕЛ
         ═══════════════════════════════════════ */}
      <section className="section-shell pb-24 md:pb-32">
        <PathFinder setPage={setPage} />
      </section>

      {/* ═══════════════════════════════════════
          PROMPTS + EVENTS
         ═══════════════════════════════════════ */}
      <section className="section-shell py-24 md:py-32 bg-[var(--bg-soft)] rounded-2xl md:rounded-[40px] my-8 md:my-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Prompts */}
          <div className="gsap-section">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-[13px] font-semibold tracking-[0.15em] uppercase text-[var(--accent)] mb-4">Библиотека</p>
                <h2 className="display-md text-[var(--ink-900)]">
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
                  <div className="py-6 flex items-start gap-4">
                    <span className="text-[28px] font-bold text-[var(--ink-900)]/[0.04] leading-none shrink-0 w-8">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--accent)]">
                          {p.cat}
                        </span>
                        <span className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1">
                          <Heart size={11} /> {p.saves}
                        </span>
                      </div>
                      <h3 className="text-[16px] font-semibold text-[var(--ink-900)] group-hover:text-[var(--accent)] transition-colors duration-300 mb-1">
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
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-[13px] font-semibold tracking-[0.15em] uppercase text-[var(--accent)] mb-4">Събития</p>
                <h2 className="display-md text-[var(--ink-900)]">
                  Предстоящи
                </h2>
              </div>
              <Button variant="ghost" onClick={() => setPage('events')} className="shrink-0">
                Календар <ChevronRight size={14} />
              </Button>
            </div>

            <div className="space-y-4">
              {EVENTS_DATA.slice(0, 3).map((e) => (
                <div
                  key={e.id}
                  className="group cursor-pointer"
                  onClick={() => setPage('events')}
                >
                  <div className="flex gap-4 p-4 rounded-xl bg-[var(--surface-strong)] hover:bg-[var(--bg)] transition-colors duration-300 border border-[var(--border)] shadow-xs">
                    <div className="shrink-0 w-14 h-14 rounded-xl bg-[var(--bg-soft)] flex flex-col items-center justify-center border border-[var(--border)]">
                      <div className="text-[18px] font-bold text-[var(--ink-900)] leading-none">{e.day}</div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">{e.mo}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-semibold text-[var(--ink-900)] mb-1 group-hover:text-[var(--accent)] transition-colors duration-300">
                        {e.title}
                      </h3>
                      <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed line-clamp-2">{e.desc}</p>
                      <div className="flex items-center gap-3 mt-2 text-[12px] text-[var(--text-tertiary)]">
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
      <section className="section-shell py-24 md:py-32">
        <div className="text-center mb-16 md:mb-20 gsap-section">
          <p className="text-[13px] font-semibold tracking-[0.15em] uppercase text-[var(--accent)] mb-4">Резултати</p>
          <h2 className="display-lg text-[var(--ink-900)] mb-5">
            Какво ще можеш след това?
          </h2>
          <p className="text-[17px] text-[var(--text-secondary)] max-w-2xl mx-auto">
            Не обещаваме чудеса. Обещаваме ясни, приложими умения.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gsap-stagger">
          {OUTCOMES.map((item) => (
            <div
              key={item.text}
              className="gsap-item group flex items-center gap-4 p-5 rounded-xl bg-[var(--surface-strong)] border border-[var(--border)] shadow-xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center shrink-0">
                <item.icon size={18} strokeWidth={1.5} />
              </div>
              <span className="text-[15px] font-medium text-[var(--ink-900)]">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          COMMUNITY + COACHING
         ═══════════════════════════════════════ */}
      <section className="section-shell pb-24 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="gsap-section">
            <div className="rounded-xl bg-[var(--surface-strong)] p-8 md:p-10 h-full border border-[var(--border)] shadow-sm">
              <p className="text-[13px] font-semibold tracking-[0.15em] uppercase text-[var(--accent)] mb-4">Общност</p>
              <h2 className="display-md text-[var(--ink-900)] mb-4">
                Не си сам в това
              </h2>
              <p className="text-[16px] text-[var(--text-secondary)] leading-[1.7] mb-8">
                Присъедини се към хора, които вече прилагат AI в работата си. Споделяй опит, задавай въпроси и учи заедно с други българи.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { icon: Target, text: 'Седмични предизвикателства' },
                  { icon: MessageSquare, text: 'Дискусии и Q&A' },
                  { icon: Trophy, text: 'Споделени успехи' },
                  { icon: HelpCircle, text: 'Обратна връзка' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5 text-[13px] text-[var(--text-secondary)]">
                    <item.icon size={14} className="text-[var(--accent)]" strokeWidth={1.5} />
                    {item.text}
                  </div>
                ))}
              </div>
              <Button onClick={() => setPage('community')}>Влез в общността <ArrowRight size={16} /></Button>
            </div>
          </div>

          <div className="gsap-section">
            <div className="rounded-xl bg-[var(--surface-strong)] p-8 md:p-10 h-full border border-[var(--border)] shadow-sm">
              <p className="text-[13px] font-semibold tracking-[0.15em] uppercase text-[var(--green)] mb-4">Коучинг</p>
              <h2 className="display-md text-[var(--ink-900)] mb-4">
                1:1 AI Коучинг
              </h2>
              <p className="text-[16px] text-[var(--text-secondary)] leading-[1.7] mb-8">
                Персонализирани сесии с нашия екип. Анализираме твоя workflow, избираме правилните инструменти и изграждаме система, която работи за теб.
              </p>
              <ul className="flex flex-col gap-2.5 mb-8">
                {[
                  'Персонален AI roadmap',
                  'Live screen-sharing сесии',
                  'Имплементация в реално време',
                  'Follow-up и подкрепа',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[14px] text-[var(--text-secondary)]">
                    <Check size={14} className="text-[var(--green)] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" onClick={() => setPage('coaching')}>Запиши се за разговор</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          EMAIL CAPTURE
         ═══════════════════════════════════════ */}
      <section className="section-shell pb-24 md:pb-32">
        <div className="max-w-3xl mx-auto text-center gsap-section p-8 md:p-14 rounded-2xl bg-[var(--gradient-soft)] border border-[var(--border)] relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent)] text-white text-[11px] font-medium mb-6">
              <Mail size={11} />
              Безплатен ресурс
            </div>
            <h2 className="display-lg text-[var(--ink-900)] mb-5">
              5 prompt-а, които спестяват<br />
              <span className="text-[var(--accent)]">5 часа седмично</span>
            </h2>
            <p className="text-[16px] md:text-[17px] text-[var(--text-secondary)] leading-[1.7] mb-10 max-w-md mx-auto">
              Практически PDF с готови prompt-и за email, срещи, content и automation. Плюс достъп до първия урок.
            </p>

            {emailSubmitted ? (
              <div className="text-center p-10 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] max-w-md mx-auto">
                <div className="w-14 h-14 rounded-full bg-[var(--green-light)] flex items-center justify-center text-[var(--green)] mx-auto mb-4">
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
                    className="w-full h-[56px] pl-12 pr-4 rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] text-[15px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all"
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
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PRICING
         ═══════════════════════════════════════ */}
      <section className="section-shell pb-24 md:pb-32">
        <div className="text-center mb-16 md:mb-20 gsap-section">
          <p className="text-[13px] font-semibold tracking-[0.15em] uppercase text-[var(--accent)] mb-4">Цени</p>
          <h2 className="display-lg text-[var(--ink-900)] mb-5">
            Ясни планове, без изненади
          </h2>
          <p className="text-[17px] text-[var(--text-secondary)] max-w-2xl mx-auto">
            Започни безплатно. Надгради, когато си готов.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto gsap-stagger items-stretch">
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
          ].map((plan) => {
            const isPro = plan.plan === 'pro';
            const isPremium = plan.plan === 'premium';
            return (
              <div
                key={plan.name}
                className={`gsap-item relative h-full rounded-xl p-7 md:p-8 flex flex-col bg-[var(--surface-strong)] border transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                  isPro ? 'border-[var(--accent)] shadow-sm' : 'border-[var(--border)] shadow-xs'
                }`}
              >
                {isPro && (
                  <div className="absolute -top-3 left-6">
                    <Badge className="text-[10px] rounded-full px-3 py-1 font-semibold tracking-wide bg-[var(--accent)] text-white border-0">Популярен</Badge>
                  </div>
                )}
                {isPremium && (
                  <div className="absolute -top-3 left-6">
                    <Badge className="text-[10px] rounded-full px-3 py-1 font-semibold tracking-wide bg-[var(--green)] text-white border-0">Premium</Badge>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider mb-3 text-[var(--text-tertiary)]">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[38px] font-semibold tracking-tight text-[var(--ink-900)]">{plan.price}</span>
                    <span className="text-[14px] text-[var(--text-tertiary)]">{plan.period}</span>
                  </div>
                  <p className="text-[14px] text-[var(--text-secondary)] mt-3 leading-relaxed">{plan.desc}</p>
                </div>
                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[14px] text-[var(--text-secondary)]">
                      <Check size={15} className={`mt-0.5 shrink-0 ${isPro ? 'text-[var(--accent)]' : isPremium ? 'text-[var(--green)]' : 'text-[var(--text-tertiary)]'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={isPro ? 'primary' : 'secondary'}
                  onClick={() => setPage('pricing')}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </div>
            );
          })}
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
      <section className="section-shell pb-24 md:pb-32">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16 md:mb-20 gsap-section">
            <p className="text-[13px] font-semibold tracking-[0.15em] uppercase text-[var(--accent)] mb-4">FAQ</p>
            <h2 className="display-lg text-[var(--ink-900)] mb-5">
              Всичко, което трябва да знаеш
            </h2>
            <p className="text-[17px] text-[var(--text-secondary)]">
              Ясни отговори на чести въпроси.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="gsap-item">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] overflow-hidden">
                  <button
                    className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-[var(--bg-soft)]/50 transition-colors"
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
                        <div className="px-5 pb-5 text-[15px] text-[var(--text-secondary)] leading-relaxed">
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
          <div className="relative rounded-2xl overflow-hidden bg-[var(--gradient-luxury)]">
            <div className="absolute inset-0 bg-[var(--ink-900)]/10" />

            <div className="relative z-10 p-10 md:p-16 lg:p-20 text-center">
              <h2 className="text-[clamp(32px,5vw,52px)] font-semibold mb-5 tracking-[-0.03em] leading-[1.08] text-white max-w-2xl mx-auto">
                Готов ли си да започнеш?
              </h2>
              <p className="text-[17px] md:text-[18px] text-white/80 mb-10 leading-relaxed max-w-lg mx-auto">
                Влез в AILABS.BG и започни с първите практически AI уроци още днес. Без шум, без празни обещания.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" className="gap-2 px-8 bg-white text-[var(--accent)] hover:bg-[var(--bg)] text-[14px] border-0" onClick={() => checkAuthThenGo('register')}>
                  Започни безплатно <ArrowRight size={16} />
                </Button>
                <Button size="lg" variant="ghost" onClick={() => setPage('pricing')} className="gap-2 px-6 text-white hover:bg-white/10 text-[14px]">
                  Виж цените
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
