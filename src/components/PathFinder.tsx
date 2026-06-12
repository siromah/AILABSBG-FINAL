import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, ArrowRight, RotateCcw, BookOpen, Zap, Target, Layers, Sparkles, Clock, Briefcase, GraduationCap, Users, Lightbulb, Wrench, PenTool, Megaphone, Code, FileText } from 'lucide-react';
import { Button } from './ui/Button';

const STEPS = [
  {
    id: 'level',
    question: 'Какво е нивото ти с AI?',
    options: [
      { id: 'beginner', label: 'Начинаещ', desc: 'Чувал съм за ChatGPT, но нямам система', icon: BookOpen },
      { id: 'intermediate', label: 'Средно напреднал', desc: 'Използвам редовно няколко инструмента', icon: Zap },
      { id: 'advanced', label: 'Напреднал', desc: 'Искам да мащабирам с автоматизации', icon: Target },
    ],
  },
  {
    id: 'goal',
    question: 'Какво искаш да постигнеш с AI?',
    options: [
      { id: 'study', label: 'Да уча по-бързо', desc: 'Учене, изпити, лична продуктивност', icon: GraduationCap },
      { id: 'content', label: 'Да създавам съдържание', desc: 'Текст, видео, социални мрежи', icon: PenTool },
      { id: 'ads', label: 'Да правя реклами', desc: 'Meta Ads, копи, таргетиране', icon: Megaphone },
      { id: 'automation', label: 'Да автоматизирам задачи', desc: 'Make.com, Zapier, workflows', icon: Code },
      { id: 'business', label: 'Да развия бизнес', desc: 'Продажби, процеси, операции', icon: Briefcase },
      { id: 'exam', label: 'Да се подготвя за изпит', desc: 'Системно учене с AI помощ', icon: FileText },
    ],
  },
  {
    id: 'time',
    question: 'Колко време можеш да отделяш седмично?',
    options: [
      { id: 'low', label: 'До 1 час', desc: 'По малко всеки ден', icon: Clock },
      { id: 'medium', label: '2–3 часа', desc: 'Мога да отделям фокусирано време', icon: Layers },
      { id: 'high', label: '4+ часа', desc: 'Искам интензивно и бързо усвояване', icon: Zap },
    ],
  },
  {
    id: 'format',
    question: 'Как предпочиташ да учиш?',
    options: [
      { id: 'course', label: 'Самостоятелни уроци', desc: 'Уча в мое темпо', icon: BookOpen },
      { id: 'coaching', label: '1:1 помощ', desc: 'Персонална подкрепа от експерт', icon: Users },
      { id: 'bootcamp', label: 'Bootcamp', desc: 'Бързо, фокусирано, с резултат', icon: Target },
      { id: 'community', label: 'Общност', desc: 'Дискусии, обратна връзка, мотивация', icon: Sparkles },
    ],
  },
];

type Result = {
  title: string;
  subtitle: string;
  desc: string;
  path: string;
  cta: string;
  lessons: string[];
};

function getResult(answers: string[]): Result {
  const [level, goal, time, format] = answers;

  // 1:1 Coaching priority
  if (format === 'coaching') {
    return {
      title: '1:1 AI Коучинг',
      subtitle: 'Персонален път до резултат',
      desc: 'Работим заедно върху твоя конкретен случай — анализираме workflow-а ти, избираме правилните инструменти и изграждаме система, която работи за теб. Най-бързият път до реален резултат.',
      path: 'coaching',
      cta: 'Запиши 1:1 сесия',
      lessons: ['Персонален AI одит', 'AI Roadmap сесия', 'Имплементация и follow-up'],
    };
  }

  // Bootcamp priority
  if (format === 'bootcamp' || (time === 'high' && goal === 'automation')) {
    return {
      title: 'AI Bootcamp',
      subtitle: 'Интензивен старт за бързи резултати',
      desc: '2-седмична интензивна програма с фокусирани задачи и директна обратна връзка. Идеален за хора, които искат да видят промяна бързо.',
      path: 'lessons',
      cta: 'Започни bootcamp',
      lessons: ['AI Foundations Intensive', 'Workflow Automation', 'Project Implementation'],
    };
  }

  // Community priority
  if (format === 'community' || (level === 'beginner' && goal === 'study')) {
    return {
      title: 'Общностно учене',
      subtitle: 'Не си сам в това',
      desc: 'Започни с безплатните уроци и се включи в общността. Учи заедно с други, задавай въпроси и намирай подкрепа на всяка стъпка.',
      path: 'community',
      cta: 'Присъедини се',
      lessons: ['Въведение в AI инструментите', 'Prompt Engineering основи', 'Първи стъпки в общността'],
    };
  }

  // Goal-based paths for self-paced
  if (goal === 'business') {
    return {
      title: 'AI за Бизнес',
      subtitle: 'По-добри процеси, повече резултати',
      desc: 'Системен подход за внедряване на AI в продажби, операции и комуникация. Адаптирано за българския пазар и реални бизнес задачи.',
      path: 'lessons',
      cta: 'Започни този път',
      lessons: ['AI за продажби', 'Business Automation Stack', 'Customer Support AI'],
    };
  }
  if (goal === 'content') {
    return {
      title: 'AI за Създатели',
      subtitle: 'Създавай повече с по-малко усилие',
      desc: 'Изгради content система, която работи за теб — от идея до публикуване с минимално ръчно вмешателство. За блогъри, видео създатели и маркетинг екипи.',
      path: 'lessons',
      cta: 'Започни този път',
      lessons: ['AI Content System', 'Social Media AI Workflows', 'Video AI Tools'],
    };
  }
  if (goal === 'ads') {
    return {
      title: 'AI за Реклама',
      subtitle: 'По-добри кампании с по-малко време',
      desc: 'Научи как да създаваш, оптимизираш и мащабираш рекламни кампании с помощта на AI инструменти. От копи до анализ — всичко стъпка по стъпка.',
      path: 'lessons',
      cta: 'Започни този път',
      lessons: ['AI за Meta Ads', 'Copywriting с AI', 'Анализ и оптимизация'],
    };
  }
  if (goal === 'automation') {
    return {
      title: 'AI Автоматизации',
      subtitle: 'По-малко ръчна работа, повече системи',
      desc: 'Свържи инструментите си в workflows. Make.com, Zapier и AI agents — стъпка по стъпка, без технически жаргон.',
      path: 'lessons',
      cta: 'Започни този път',
      lessons: ['AI Workflows 101', 'Automation с Make.com', 'Business Automation Stack'],
    };
  }
  if (goal === 'exam' || goal === 'study') {
    return {
      title: 'AI за Студенти',
      subtitle: 'Учи по-умно, не по-тежко',
      desc: 'Използвай AI за по-бързо учене, подготовка за изпити и организация на знанията. Конкретни техники, които работят още от първия ден.',
      path: 'lessons',
      cta: 'Започни този път',
      lessons: ['AI Productivity System', 'Prompt Engineering основи', 'AI за изследвания'],
    };
  }

  // Default / Prompt Engineering
  return {
    title: 'Prompt Engineering Старт',
    subtitle: 'От първи prompt до реален резултат',
    desc: 'Запознай се с най-полезните AI инструменти и научи как да пишеш prompt-и, които връщат точно това, което ти трябва.',
    path: 'lessons',
    cta: 'Започни този път',
    lessons: ['Въведение в AI инструментите', 'Prompt Engineering основи', 'AI Productivity System'],
  };
}

export default function PathFinder({ setPage }: { setPage: (page: string) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (optionId: string) => {
    const newAnswers = [...answers, optionId];
    setAnswers(newAnswers);
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers([]);
    setShowResult(false);
  };

  const result = getResult(answers);

  return (
    <section className="section-shell pb-20 md:pb-28">
      <div className="relative rounded-[24px] bg-[var(--surface-strong)] border border-[var(--border)] shadow-sm overflow-hidden p-8 md:p-12 lg:p-14">

        <div className="relative z-10 max-w-2xl mx-auto">
          {!showResult ? (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-light)] text-[var(--accent-text)] text-[12px] font-medium mb-6">
                <Compass size={12} />
                AI Пътеводител
              </div>
              <h2 className="text-[clamp(24px,3vw,36px)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--ink-900)] mb-3">
                Намери своя AI път
              </h2>
              <p className="text-[16px] text-[var(--text-secondary)] mb-10">
                {STEPS.length} кратки въпроса. Без регистрация. Ще ти предложим къде да започнеш.
              </p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-[15px] font-semibold text-[var(--ink-900)] mb-6">
                      {STEPS[step].question}
                    </div>
                    <div className={`grid grid-cols-1 gap-3 ${STEPS[step].options.length > 4 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-3'}`}>
                      {STEPS[step].options.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleSelect(opt.id)}
                          className="group text-left p-5 rounded-[16px] border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--accent)]/40 hover:shadow-sm hover:-translate-y-0.5 transition-all"
                        >
                          <div className="w-10 h-10 rounded-xl bg-[var(--bg-soft)] group-hover:bg-[var(--accent-light)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors mb-3">
                            <opt.icon size={18} strokeWidth={1.5} />
                          </div>
                          <div className="text-[14px] font-semibold text-[var(--ink-900)] mb-1">{opt.label}</div>
                          <div className="text-[12px] text-[var(--text-secondary)] leading-relaxed">{opt.desc}</div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-center gap-1.5 mt-8">
                  {STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        i === step ? 'w-6 bg-[var(--accent)]' : 'w-1.5 bg-[var(--border-strong)]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] mx-auto mb-5">
                  <Compass size={24} />
                </div>
                <h3 className="text-[22px] md:text-[26px] font-semibold text-[var(--ink-900)] tracking-tight mb-1">
                  {result.title}
                </h3>
                <p className="text-[14px] font-medium text-[var(--accent)] mb-4">{result.subtitle}</p>
                <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto mb-8">
                  {result.desc}
                </p>

                <div className="bg-[var(--bg)] border border-[var(--border)] rounded-[16px] p-5 text-left max-w-md mx-auto mb-8">
                  <div className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
                    Препоръчани стъпки
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {result.lessons.map((lesson, i) => (
                      <div key={i} className="flex items-center gap-3 text-[14px] text-[var(--ink-900)]">
                        <span className="w-5 h-5 rounded-full bg-[var(--accent-light)] text-[var(--accent-text)] text-[10px] font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        {lesson}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button onClick={() => setPage(result.path)}>
                    {result.cta} <ArrowRight size={14} />
                  </Button>
                  <Button variant="ghost" onClick={handleReset}>
                    <RotateCcw size={14} /> Пробвай отново
                  </Button>
                </div>
              </motion.div>
            )}
        </div>
      </div>
    </section>
  );
}
