import React, { useState, useRef, useCallback } from 'react';
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
  Wand2,
  Rocket,
  BookMarked,
  Heart,
  Mail,
  Lock,
  Shield,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LESSONS_MODS, PROMPTS, EVENTS_DATA } from '../data';
import FloatingShapes from '../components/FloatingShapes';
import PathFinder from '../components/PathFinder';
import RotatingText from '../components/RotatingText';

const LEARNING_PATHS = [
  { id: 'beginner', label: 'AI за начинаещи', icon: BookOpen, desc: 'Основи, инструменти и първи стъпки', count: '5 урока' },
  { id: 'productivity', label: 'AI за продуктивност', icon: Zap, desc: 'Автоматизирай рутинните задачи', count: '4 урока' },
  { id: 'marketing', label: 'AI за маркетинг', icon: Target, desc: 'Кампании, анализи и копи', count: '3 урока' },
  { id: 'business', label: 'AI за бизнес', icon: Layers, desc: 'Продажби, процеси и мащабиране', count: '5 урока' },
  { id: 'content', label: 'AI за съдържание', icon: Sparkles, desc: 'Създавай повече с по-малко усилие', count: '4 урока' },
  { id: 'automation', label: 'AI автоматизация', icon: Clock, desc: 'Make.com, workflows и agents', count: '3 урока' },
];

const FAQS = [
  {
    q: 'Кой стои зад Craative?',
    a: 'Craative е създадена от хора, които работят с AI инструменти всеки ден. Не сме университетски преподаватели — тестваме, чупим и намираме какво работи в реални български проекти.',
  },
  {
    q: 'Какво точно получавам с членството?',
    a: 'Структурирани уроци с конкретни примери, библиотека с prompts, които сме тествали, практически workshops и общност от професионалисти, които споделят реален опит. Без теория за теория.',
  },
  {
    q: 'Подходящо ли е за начинаещи?',
    a: 'Да. Започваме от нулата — кой инструмент за какво служи, как да пишеш prompt, който връща смислен отговор. Не са нужни технически познания.',
  },
  {
    q: 'Мога ли да спра членството си?',
    a: 'Разбира се. Няма договори със срок. Можеш да спреш или смениш плана по всяко време. Ако не си доволен в рамките на 7 дни, връщаме парите без въпроси.',
  },
  {
    q: 'Има ли live сесии?',
    a: 'Да. Провеждаме office hours и workshops, където можеш да задаваш въпроси на живо. Графикът е в календара — виж датите и запази място.',
  },
  {
    q: 'Колко време отнема?',
    a: 'Всеки урок е между 12 и 30 минути. Можеш да учиш в свое темпо. Повечето хора започват да виждат разлика в работата си още в първите седмици.',
  },
  {
    q: 'Работи ли за български компании?',
    a: 'Абсолютно. Всички примери, prompts и workflows са адаптирани за българския пазар и европейския бизнес контекст. Не превеждаме американски курс — правим наш.',
  },
];

const TOOLS = ['ChatGPT', 'Claude', 'Midjourney', 'Make.com', 'Notion AI', 'Perplexity', 'ElevenLabs', 'Runway'];

const COURSE_IMAGES = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
];

const EVENT_IMAGE = 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?w=800&q=80';

function MagneticButton({ children, className = '', onClick }: any) {
  const ref = useRef<HTMLButtonElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  }, []);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translate(0, 0)';
  }, []);

  return (
    <button
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={`magnetic-button ${className}`}
      style={{ transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      {children}
    </button>
  );
}

export default function Home({ checkAuthThenGo, setPage }: any) {
  const { user: currentUser } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
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
    <div className="min-h-screen text-[var(--text-primary)]">

      {/* HERO */}
      <section className="relative min-h-[85vh] md:min-h-[100vh] flex items-center overflow-hidden">
        <FloatingShapes />

        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover opacity-[0.12] dark:opacity-[0.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg)]/80 to-[var(--bg)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-transparent to-transparent" />
        </div>

        <div className="section-shell relative z-10 w-full pt-20 md:pt-24 pb-12 md:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left content */}
            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-light)] text-[var(--accent-text)] text-[13px] font-medium mb-6 md:mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                Практическа AI академия за българи
              </motion.div>

              <h1 className="text-[clamp(40px,8vw,90px)] font-semibold leading-[0.95] tracking-[-0.04em] text-[var(--ink-900)] mb-6 md:mb-8">
                Научи AI<br />
                <span className="text-[var(--text-tertiary)]">практически</span><br />
                <RotatingText />
              </h1>

              <p className="text-[17px] md:text-[20px] text-[var(--text-secondary)] max-w-xl leading-[1.65] mb-8 md:mb-10">
                Кратки практически уроци, готови prompts и реални примери — от Meta Ads и бизнес автоматизация до учене, съдържание, дизайн и работа с AI инструменти.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-10 md:mb-12">
                <MagneticButton onClick={() => checkAuthThenGo('register')}>
                  <Button size="lg">Започни безплатно</Button>
                </MagneticButton>
                <MagneticButton onClick={() => setPage('lessons')}>
                  <Button variant="ghost" size="lg">Виж първи урок <ArrowRight size={16} /></Button>
                </MagneticButton>
              </div>

              {/* Trust micro-bar */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-[var(--text-tertiary)]">
                <span className="flex items-center gap-1.5">
                  <Check size={13} className="text-[var(--accent)]" /> Без кредитна карта
                </span>
                <span className="flex items-center gap-1.5">
                  <Check size={13} className="text-[var(--accent)]" /> {freeLessonsCount} безплатни урока
                </span>
                <span className="flex items-center gap-1.5">
                  <Check size={13} className="text-[var(--accent)]" /> 7 дни гаранция
                </span>
              </div>
            </motion.div>

            {/* Right — Platform preview composition */}
            <motion.div
              className="lg:col-span-5 relative hidden lg:block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative w-full aspect-[4/5] max-w-[420px] ml-auto">
                {/* Main image card */}
                <motion.div
                  className="absolute top-[5%] right-[5%] w-[75%] h-[55%] rounded-[24px] overflow-hidden shadow-2xl border border-[var(--border)]"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80"
                    alt="Learning"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </motion.div>

                {/* Secondary image card */}
                <motion.div
                  className="absolute bottom-[10%] left-[0%] w-[60%] h-[40%] rounded-[20px] overflow-hidden shadow-xl border-4 border-[var(--bg)]"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80"
                    alt="Working"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Lesson card */}
                <motion.div
                  className="absolute top-[45%] left-[5%] glass-card rounded-2xl p-4 flex items-center gap-3 shadow-lg border border-[var(--border)]"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)]">
                    <Play size={18} fill="currentColor" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[var(--ink-900)]">Въведение в AI</div>
                    <div className="text-[11px] text-[var(--text-tertiary)]">12 мин • Безплатно</div>
                  </div>
                </motion.div>

                {/* Prompt card */}
                <motion.div
                  className="absolute bottom-[5%] right-[10%] glass-card rounded-2xl p-4 shadow-lg border border-[var(--border)]"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[var(--emerald-light)] flex items-center justify-center text-[var(--emerald)]">
                      <Zap size={16} />
                    </div>
                    <span className="text-[13px] font-semibold text-[var(--ink-900)]">Готов prompt</span>
                  </div>
                  <div className="w-32 h-1.5 bg-[var(--bg-soft)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[var(--emerald)] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.5, delay: 1 }}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-[11px] text-[var(--text-tertiary)] tracking-wider uppercase">Scroll</span>
          <div className="w-[1px] h-6 md:h-8 bg-gradient-to-b from-[var(--text-tertiary)] to-transparent" />
        </motion.div>
      </section>

      {/* MARQUEE — Tools */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-soft)]/50 py-5 overflow-hidden">
        <div className="marquee-track">
          {[...TOOLS, ...TOOLS, ...TOOLS, ...TOOLS].map((tool, i) => (
            <div key={i} className="flex items-center gap-3 px-8 shrink-0">
              <div className="w-2 h-2 rounded-full bg-[var(--accent)]/40" />
              <span className="text-[14px] font-medium text-[var(--text-secondary)] whitespace-nowrap">{tool}</span>
            </div>
          ))}
        </div>
      </section>

      {/* HONEST VALUE PROPOSITION — What makes us different */}
      <section className="section-shell py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {[
            { title: 'За българския пазар', desc: 'Примерите, prompts и workflows са адаптирани за работа тук — не преведени от чужд курс.' },
            { title: 'Кратко и практично', desc: 'Уроците са 12–30 минути. Без filler. Вземаш и прилагаш още днес.' },
            { title: 'Общност, не аудитория', desc: 'Питаш, споделяш, получаваш обратна връзка. Не си сам с tutorial-а.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="text-[15px] font-semibold text-[var(--ink-900)] mb-2">{item.title}</div>
              <div className="text-[14px] text-[var(--text-secondary)] leading-relaxed">{item.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FREE HOOK — What you get for free */}
      <section className="section-shell pb-20 md:pb-28">
        <motion.div
          className="rounded-[24px] border border-[var(--border)] bg-[var(--bg-soft)] p-8 md:p-12 lg:p-16 overflow-hidden relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[var(--accent)]/5 blur-[80px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <Badge variant="accent" className="mb-4 text-[11px] tracking-wide">Free Forever</Badge>
              <h2 className="text-[clamp(28px,4vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--ink-900)] mb-4">
                Пробвай безплатно.<br />
                <span className="text-[var(--accent)]">Реши после дали ти пасва.</span>
              </h2>
              <p className="text-[16px] text-[var(--text-secondary)] leading-[1.7] mb-8">
                Не е нужна кредитна карта. Получаваш достъп до безплатни уроци, prompts и общността веднага.
                Ако харесаш — ъпгрейдваш. Ако не — поне си спестил време в търсене.
              </p>
              <MagneticButton onClick={() => checkAuthThenGo('register')}>
                <Button size="lg">Създай безплатен профил</Button>
              </MagneticButton>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: BookOpen, title: `${freeLessonsCount} безплатни урока`, desc: 'Пълни уроци от академията — без ограничения във времето.' },
                { icon: Zap, title: '10+ готови prompts', desc: 'Тествани prompts за email, social media и продуктивност. Копирай и ползвай.' },
                { icon: Users, title: 'Community preview', desc: 'Виж какво споделят другите членове. Питай и ти.' },
                { icon: Calendar, title: 'Workshop preview', desc: 'Гледай записи от избрани събития, за да усетиш атмосферата.' },
              ].map((item, idx) => (
                <motion.div
                  key={item.title}
                  className="p-5 rounded-[16px] border border-[var(--border)] bg-[var(--bg)] group hover:border-[var(--accent)]/30 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                >
                  <item.icon size={20} className="text-[var(--accent)] mb-3" strokeWidth={1.5} />
                  <h4 className="text-[14px] font-semibold text-[var(--ink-900)] mb-1">{item.title}</h4>
                  <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-shell pb-20 md:pb-28">
        <div className="text-center mb-14 md:mb-16">
          <span className="text-[12px] font-medium tracking-[0.2em] uppercase text-[var(--accent)]">Как работи</span>
          <h2 className="text-[clamp(28px,4vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--ink-900)] mt-4">
            От нулата до резултат
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {[
            { num: '01', icon: BookMarked, title: 'Научи', desc: 'Гледай кратки уроци с реални примери. Без filler content, без 2 часа теория.' },
            { num: '02', icon: Wand2, title: 'Приложи', desc: 'Вземи готов prompt или workflow и го използвай директно в работата си. Днес.' },
            { num: '03', icon: Rocket, title: 'Автоматизирай', desc: 'Свържи инструментите в система, която работи за теб, докато ти правиш други неща.' },
          ].map((step, i) => (
            <motion.div
              key={step.num}
              className="relative text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-[24px] bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] mx-auto mb-6">
                  <step.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-[22px] font-semibold text-[var(--ink-900)] mb-3">{step.title}</h3>
                <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
              {i < 2 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-[1px]">
                  <div className="w-full h-full bg-gradient-to-r from-[var(--border-strong)] to-transparent" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED LESSONS */}
      <section className="section-shell pb-20 md:pb-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-[12px] font-medium tracking-[0.2em] uppercase text-[var(--accent)]">Академия</span>
            <h2 className="text-[clamp(28px,4vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--ink-900)] mt-4">
              Започни с тези уроци
            </h2>
          </div>
          <Button variant="ghost" onClick={() => setPage('lessons')} className="self-start md:self-auto">
            Виж всички уроци <ChevronRight size={14} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {academyLessons.map((lesson: any, idx: number) => (
            <motion.div
              key={lesson.id}
              className="group cursor-pointer hover-lift"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.12 }}
              onClick={() => setPage('lessons')}
            >
              <div className="relative aspect-[16/10] rounded-[20px] overflow-hidden mb-5">
                <img
                  src={COURSE_IMAGES[idx]}
                  alt={lesson.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[var(--accent)] shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Play size={24} fill="currentColor" className="ml-1" />
                  </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 text-white/90 text-[13px]">
                    <Clock size={13} /> {lesson.dur}
                    <span className="w-1 h-1 rounded-full bg-white/50" />
                    <span>{lesson.isFree ? 'Безплатно' : 'Pro'}</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-[var(--accent)]/0 group-hover:bg-[var(--accent)]/10 transition-colors duration-500" />
              </div>
              <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mb-1.5 group-hover:text-[var(--accent)] transition-colors">
                {lesson.title}
              </h3>
              <p className="text-[14px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                {lesson.desc || 'Научи практически техники, които можеш да приложиш веднага в работата си.'}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LEARNING PATHS */}
      <section className="section-shell pb-20 md:pb-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-[12px] font-medium tracking-[0.2em] uppercase text-[var(--accent)]">Пътеки</span>
            <h2 className="text-[clamp(28px,4vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--ink-900)] mt-4">
              Избери своя фокус
            </h2>
          </div>
          <Button variant="ghost" onClick={() => setPage('lessons')} className="self-start md:self-auto">
            Виж всички <ChevronRight size={14} />
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
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-soft)] flex items-center justify-center text-[var(--text-secondary)] group-hover:bg-[var(--accent-light)] group-hover:text-[var(--accent)] transition-colors shrink-0">
                  <path.icon size={18} strokeWidth={1.5} />
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

      {/* PATH FINDER — Creative Touch */}
      <PathFinder setPage={setPage} />

      {/* PROMPTS */}
      <section className="section-shell pb-20 md:pb-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-[12px] font-medium tracking-[0.2em] uppercase text-[var(--accent)]">Библиотека</span>
            <h2 className="text-[clamp(28px,4vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--ink-900)] mt-4">
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
              <div className="py-7 md:py-9 flex items-start gap-5 md:gap-8">
                <span className="text-[clamp(40px,5vw,68px)] font-bold text-[var(--ink-900)]/[0.05] leading-none shrink-0 w-[70px] md:w-[100px]">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[var(--accent)] px-2.5 py-1 rounded-full bg-[var(--accent-light)]">
                      {p.cat}
                    </span>
                    <span className="text-[12px] text-[var(--text-tertiary)] flex items-center gap-1">
                      <Heart size={12} /> {p.saves} запазвания
                    </span>
                  </div>
                  <h3 className="text-[18px] md:text-[22px] font-semibold text-[var(--ink-900)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed line-clamp-2 max-w-2xl">
                    {p.text}
                  </p>
                </div>
                <div className="shrink-0 pt-1 hidden md:block">
                  <div className="w-12 h-12 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-tertiary)] group-hover:bg-[var(--ink-900)] group-hover:text-[var(--bg)] group-hover:border-[var(--ink-900)] transition-all">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          <div className="border-t border-[var(--border)]" />
        </div>
      </section>

      {/* EVENTS */}
      <section className="section-shell pb-20 md:pb-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-[12px] font-medium tracking-[0.2em] uppercase text-[var(--accent)]">Събития</span>
            <h2 className="text-[clamp(28px,4vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--ink-900)] mt-4">
              Предстоящи workshops
            </h2>
          </div>
          <Button variant="ghost" onClick={() => setPage('events')} className="self-start md:self-auto">
            Календар <ChevronRight size={14} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {EVENTS_DATA.slice(0, 3).map((e, idx) => (
            <motion.div
              key={e.id}
              className="group cursor-pointer hover-lift"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => setPage('events')}
            >
              <div className="relative h-full rounded-[20px] border border-[var(--border)] bg-[var(--bg)] overflow-hidden flex flex-col">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={EVENT_IMAGE}
                    alt={e.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] to-transparent" />
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 text-center shadow-sm">
                      <div className="text-[20px] font-bold text-[var(--ink-900)] leading-none">{e.day}</div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">{e.mo}</div>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-[17px] font-semibold text-[var(--ink-900)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                    {e.title}
                  </h3>
                  <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed mb-4 flex-1">{e.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[var(--text-tertiary)] flex items-center gap-1">
                      <Clock size={11} /> {e.time}
                    </span>
                    <span className="text-[12px] text-[var(--text-tertiary)]">{e.spots} места</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="section-shell pb-20 md:pb-28">
        <div className="rounded-[24px] border border-[var(--border)] overflow-hidden relative">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
              alt="Community"
              className="w-full h-full object-cover opacity-[0.06] dark:opacity-[0.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/95 to-[var(--bg)]/80" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8 md:p-12 lg:p-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[12px] font-medium tracking-[0.2em] uppercase text-[var(--accent)]">Общност</span>
              <h2 className="text-[clamp(28px,4vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--ink-900)] mt-4 mb-6">
                Не си сам в това
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.7] mb-8">
                Присъедини се към хора, които вече прилагат AI в работата си.
                Споделяй опит, задавай въпроси и учи заедно с други професионалисти.
              </p>
              <Button onClick={() => setPage('community')}>Влез в общността <ArrowRight size={16} /></Button>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Target, title: 'Седмични предизвикателства', desc: 'Всяка седмица ново предизвикателство.' },
                { icon: MessageSquare, title: 'Дискусии и Q&A', desc: 'Задавай въпроси и получавай обратна връзка.' },
                { icon: Trophy, title: 'Member Wins', desc: 'Споделяй успехите си с общността.' },
                { icon: HelpCircle, title: 'Implementation Feedback', desc: 'Покажи workflow-а си за review.' },
              ].map((item, idx) => (
                <motion.div
                  key={item.title}
                  className="p-5 rounded-[16px] border border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-sm group hover:border-[var(--accent)]/30 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                >
                  <item.icon size={20} className="text-[var(--accent)] mb-3" strokeWidth={1.5} />
                  <h4 className="text-[14px] font-semibold text-[var(--ink-900)] mb-1">{item.title}</h4>
                  <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 1-ON-1 COACHING */}
      <section className="section-shell pb-20 md:pb-28">
        <motion.div
          className="relative rounded-[24px] overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=80"
              alt="1-on-1 coaching"
              className="w-full h-full object-cover opacity-[0.10] dark:opacity-[0.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/95 to-[var(--bg)]/80" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8 md:p-12 lg:p-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-light)] text-[var(--accent-text)] text-[12px] font-medium mb-4">
                <Users size={12} />
                Персонализирано обучение
              </div>
              <h2 className="text-[clamp(28px,4vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--ink-900)] mb-4">
                1-на-1 AI Coaching
              </h2>
              <p className="text-[17px] text-[var(--text-secondary)] leading-[1.7] mb-6">
                Персонализирани сесии с нашия екип. Ще анализираме твоя workflow, ще ти помогнем да избереш правилните инструменти и ще изградим заедно система, която работи за теб.
              </p>
              <ul className="flex flex-col gap-3 mb-8">
                {[
                  'Персонален AI roadmap',
                  'Live screen-sharing сесии',
                  'Имплементация в реално време',
                  'Follow-up и подкрепа',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-[14px] text-[var(--text-secondary)]">
                    <Check size={16} className="text-[var(--accent)] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <MagneticButton onClick={() => setPage('pricing')}>
                <Button size="lg">Запиши се за разговор</Button>
              </MagneticButton>
            </motion.div>

            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative w-full aspect-square max-w-[400px] mx-auto">
                <div className="absolute inset-0 rounded-[24px] overflow-hidden shadow-2xl border border-[var(--border)]">
                  <img
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80"
                    alt="Coaching session"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <motion.div
                  className="absolute -bottom-4 -left-4 glass-card rounded-2xl p-4 shadow-lg border border-[var(--border)]"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-white">
                      <Shield size={18} />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-[var(--ink-900)]">7 дни гаранция</div>
                      <div className="text-[11px] text-[var(--text-tertiary)]">Ако не си доволен, връщаме парите</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* EMAIL CAPTURE — Lead magnet */}
      <section className="section-shell pb-20 md:pb-28">
        <motion.div
          className="relative rounded-[24px] border border-[var(--border)] bg-[var(--bg-soft)] p-8 md:p-12 lg:p-16 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-[var(--accent)]/5 blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-[var(--emerald)]/5 blur-[80px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-light)] text-[var(--accent-text)] text-[12px] font-medium mb-4">
                <Mail size={12} />
                Безплатен ресурс
              </div>
              <h2 className="text-[clamp(24px,3vw,40px)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--ink-900)] mb-4">
                5 prompts, които спестяват<br />
                <span className="text-[var(--accent)]">5 часа седмично</span>
              </h2>
              <p className="text-[16px] text-[var(--text-secondary)] leading-[1.7] mb-6">
                Практически PDF с готови prompts за email, срещи, content и automation. Плюс достъп до първия урок от академията.
              </p>
              <div className="flex items-center gap-4 text-[12px] text-[var(--text-tertiary)]">
                <span className="flex items-center gap-1.5"><Check size={13} className="text-[var(--accent)]" /> Моментален достъп</span>
                <span className="flex items-center gap-1.5"><Check size={13} className="text-[var(--accent)]" /> Без спам</span>
              </div>
            </div>

            <div>
              {emailSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-8 rounded-[20px] border border-[var(--border)] bg-[var(--bg)]"
                >
                  <div className="w-14 h-14 rounded-full bg-[var(--emerald-light)] flex items-center justify-center text-[var(--emerald)] mx-auto mb-4">
                    <Check size={24} />
                  </div>
                  <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mb-2">Готово!</h3>
                  <p className="text-[14px] text-[var(--text-secondary)]">Провери email-а си. Изпратихме ти PDF-а и линк към първия урок.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                    <input
                      type="email"
                      placeholder="твоят@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-14 pl-12 pr-4 rounded-[16px] border border-[var(--border)] bg-[var(--bg)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] text-[15px] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all"
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    Изпрати ми PDF-а
                  </Button>
                  <p className="text-[11px] text-[var(--text-tertiary)] text-center">
                    Не споделяме email-а ти с никого. Можеш да се отпишеш по всяко време.
                  </p>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* PRICING */}
      <section className="section-shell pb-20 md:pb-28">
        <div className="text-center mb-12">
          <span className="text-[12px] font-medium tracking-[0.2em] uppercase text-[var(--accent)]">Цени</span>
          <h2 className="text-[clamp(28px,4vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--ink-900)] mt-4">
            Ясни планове, без изненади
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {[
            {
              name: 'Free',
              price: '0 €',
              period: '/месец',
              desc: 'Разгледай платформата, опитай безплатните уроци и виж дали ти пасва.',
              features: [`${freeLessonsCount} безплатни урока`, '10+ готови prompts', 'Community preview', 'Записи от избрани събития'],
              cta: 'Започни',
              plan: 'free',
            },
            {
              name: 'Pro',
              price: '25 €',
              period: '/месец',
              desc: 'Пълен достъп до академията, prompts и общността. За хора, които ще прилагат.',
              features: [`Всички ${totalLessons} урока`, '50+ тествани prompts', 'Пълен достъп до общността', 'Седмични workshops', 'Предизвикателства', 'Шаблони и workflows'],
              cta: 'Избери Pro',
              plan: 'pro',
              highlight: true,
            },
            {
              name: 'Premium',
              price: '65 €',
              period: '/месец',
              desc: 'Pro + лична подкрепа от екипа ни. За хора, които искат резултати бързо.',
              features: ['Всичко от Pro', '1-на-1 AI Coaching', 'Личен AI roadmap', 'Преглед на твоите workflows', 'Приоритет при въпроси'],
              cta: 'Избери Premium',
              plan: 'premium',
            },
          ].map((plan, idx) => (
            <motion.div
              key={plan.name}
              className="hover-lift"
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
                    <span className="text-[40px] font-semibold text-[var(--ink-900)] tracking-tight">{plan.price}</span>
                    <span className="text-[14px] text-[var(--text-tertiary)]">{plan.period}</span>
                  </div>
                  <p className="text-[14px] text-[var(--text-secondary)] mt-2 leading-relaxed">{plan.desc}</p>
                </div>
                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[13px] text-[var(--text-secondary)]">
                      <Check size={15} className={`mt-0.5 shrink-0 ${plan.highlight ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'}`} />
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

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-[12px] text-[var(--text-tertiary)]">
          <span className="flex items-center gap-1.5"><Lock size={13} /> Сигурно плащане</span>
          <span className="flex items-center gap-1.5"><Shield size={13} /> 7 дни гаранция</span>
          <span className="flex items-center gap-1.5"><Check size={13} /> Без договор</span>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-shell pb-20 md:pb-28">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[12px] font-medium tracking-[0.2em] uppercase text-[var(--accent)]">FAQ</span>
            <h2 className="text-[clamp(28px,4vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--ink-900)] mt-4">
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
                    <motion.div
                      animate={{ rotate: openFaq === idx ? 90 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronRight size={18} className="text-[var(--text-tertiary)] shrink-0" />
                    </motion.div>
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

      {/* FINAL CTA */}
      <section className="section-shell pb-20 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative rounded-[24px] overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=80"
                alt=""
                className="w-full h-full object-cover opacity-[0.12] dark:opacity-[0.08]"
              />
              <div className="absolute inset-0 bg-[var(--ink-900)]" />
            </div>

            <div className="relative z-10 p-10 md:p-16 lg:p-20">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent)] rounded-full opacity-[0.06] blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />

              <div className="max-w-2xl">
                <motion.h2
                  className="text-[clamp(36px,5vw,60px)] font-semibold mb-6 tracking-[-0.03em] leading-[1.05] text-[var(--bg)]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  Готов ли си<br />да започнеш?
                </motion.h2>
                <p className="text-[17px] md:text-[18px] text-[var(--bg)]/50 mb-10 leading-relaxed max-w-lg">
                  Присъедини се към общността, която учи AI практически. Без шум, без празни обещания.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <MagneticButton onClick={() => checkAuthThenGo('register')}>
                    <Button size="lg" className="gap-2 px-8 bg-[var(--bg)] text-[var(--ink-900)] hover:bg-[var(--bg-soft)] text-[15px]">
                      Започни безплатно <ArrowRight size={18} />
                    </Button>
                  </MagneticButton>
                  <Button size="lg" variant="ghost" onClick={() => setPage('pricing')} className="gap-2 px-7 text-[var(--bg)] hover:bg-[var(--bg)]/10 text-[15px]">
                    Виж цените
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
