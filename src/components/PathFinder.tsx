import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, ArrowRight, RotateCcw, BookOpen, Zap, Target, Layers, Sparkles, Clock } from 'lucide-react';
import { Button } from './ui/Button';

const STEPS = [
  {
    id: 'experience',
    question: 'Къде си с AI в момента?',
    options: [
      { id: 'beginner', label: 'Правя първи стъпки', desc: 'ChatGPT, но без система', icon: BookOpen },
      { id: 'intermediate', label: 'Използвам редовно', desc: 'Имам любими инструменти', icon: Zap },
      { id: 'advanced', label: 'Искам да мащабирам', desc: 'Автоматизации и екипни процеси', icon: Target },
    ],
  },
  {
    id: 'goal',
    question: 'Какво искаш да постигнеш първо?',
    options: [
      { id: 'time', label: 'Повече време', desc: 'Автоматизирам рутинни задачи', icon: Clock },
      { id: 'content', label: 'Повече съдържание', desc: 'Content система с AI', icon: Sparkles },
      { id: 'business', label: 'По-добри процеси', desc: 'Sales, support, operations', icon: Layers },
    ],
  },
];

const RESULTS: Record<string, { title: string; desc: string; path: string; lessons: string[] }> = {
  'beginner-time': {
    title: 'AI за продуктивност',
    desc: 'Започни с основите и изгради първите си AI навици. Ще спестиш часове още от първата седмица.',
    path: 'lessons',
    lessons: ['Въведение в AI инструментите', 'Prompt Engineering основи', 'AI Productivity System'],
  },
  'beginner-content': {
    title: 'AI за съдържание',
    desc: 'Научи се да създаваш текст, идеи и планове с AI — без да звучиш като робот.',
    path: 'lessons',
    lessons: ['Prompt Engineering основи', 'AI Content System', 'Social Media AI Workflows'],
  },
  'beginner-business': {
    title: 'AI за бизнес',
    desc: 'Разбери как AI може да помогне в конкретни бизнес задачи — без технически жаргон.',
    path: 'lessons',
    lessons: ['Въведение в AI инструментите', 'AI Workflows 101', 'AI за продажби'],
  },
  'intermediate-time': {
    title: 'Automation пътека',
    desc: 'Свържи инструментите си в workflows. Make.com, Zapier и AI agents — стъпка по стъпка.',
    path: 'lessons',
    lessons: ['AI Workflows 101', 'Automation с Make.com', 'Business Automation Stack'],
  },
  'intermediate-content': {
    title: 'Content система',
    desc: 'Изгради пълна content машина: от идея до публикуване с минимално ръчно вмешателство.',
    path: 'lessons',
    lessons: ['AI Content System', 'Social Media AI Workflows', 'Video AI Tools'],
  },
  'intermediate-business': {
    title: 'AI Sales & Support',
    desc: 'Внедри AI в комуникацията с клиенти, продажбите и вътрешните процеси.',
    path: 'lessons',
    lessons: ['AI за продажби', 'Customer Support AI', 'Business Automation Stack'],
  },
  'advanced-time': {
    title: 'Scaling с AI',
    desc: 'Мащабирай резултатите си с AI agents, екипни workflows и системен подход.',
    path: 'lessons',
    lessons: ['AI Agents — следващото ниво', 'Scaling с AI', 'Business Automation Stack'],
  },
  'advanced-content': {
    title: 'AI Content Scale',
    desc: 'Построй content операция, която работи почти сама — с екип или като соло криейтър.',
    path: 'lessons',
    lessons: ['Video AI Tools', 'Social Media AI Workflows', 'Scaling с AI'],
  },
  'advanced-business': {
    title: 'AI Business Stack',
    desc: 'Превърни AI в конкурентно предимство. Пълен stack за малък екип или растящ бизнес.',
    path: 'lessons',
    lessons: ['Business Automation Stack', 'Scaling с AI', 'Твоят AI Roadmap'],
  },
};

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

  const key = `${answers[0]}-${answers[1]}`;
  const result = RESULTS[key] || RESULTS['beginner-time'];

  return (
    <section className="section-shell pb-20 md:pb-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-[24px] border border-[var(--border)] bg-[var(--bg-soft)] overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/[0.04] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--emerald)]/[0.03] rounded-full blur-[60px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 p-8 md:p-12 lg:p-14">
          <div className="max-w-2xl mx-auto">
            {!showResult ? (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-light)] text-[var(--accent-text)] text-[12px] font-medium mb-6">
                  <Compass size={12} />
                  AI Path Finder
                </div>
                <h2 className="text-[clamp(24px,3vw,36px)] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--ink-900)] mb-3">
                  Намери своята пътека
                </h2>
                <p className="text-[16px] text-[var(--text-secondary)] mb-10">
                  Два кратки въпроса. Без регистрация. Ще ти предложим къде да започнеш.
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
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {STEPS[step].options.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleSelect(opt.id)}
                          className="group text-left p-5 rounded-[16px] border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--accent)]/30 hover:shadow-sm transition-all"
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
                <h3 className="text-[22px] md:text-[26px] font-semibold text-[var(--ink-900)] tracking-tight mb-2">
                  {result.title}
                </h3>
                <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto mb-8">
                  {result.desc}
                </p>

                <div className="bg-[var(--bg)] rounded-[16px] border border-[var(--border)] p-5 text-left max-w-md mx-auto mb-8">
                  <div className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
                    Препоръчани уроци
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
                    Към уроците <ArrowRight size={14} />
                  </Button>
                  <Button variant="ghost" onClick={handleReset}>
                    <RotateCcw size={14} /> Пробвай отново
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
