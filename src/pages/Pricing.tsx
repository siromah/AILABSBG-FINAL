import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    desc: 'За разглеждане, newsletter и основни ресурси.',
    monthly: 0,
    yearly: 0,
    features: [
      'Достъп до ограничени уроци',
      'Ограничена prompt library',
      'Community preview',
      'Избрани workshop превюта',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    desc: 'Community, workshops, prompt library, templates и challenges.',
    monthly: 49,
    yearly: 490,
    features: [
      'Пълна академия',
      'Пълна prompt library',
      'Пълна общност',
      'Workshops',
      'Challenges',
      'Шаблони',
    ],
    highlight: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    desc: 'Pro плюс office hours, implementation reviews и priority Q&A.',
    monthly: 129,
    yearly: 1290,
    features: [
      'Всичко от Pro',
      'Office hours',
      'Implementation reviews',
      'Priority Q&A',
      'Персонализирани съвети',
    ],
  },
];

export default function Pricing({ currentUser, openModal, showToast }: any) {
  const [yearly, setYearly] = useState(false);

  const handleCta = (planId: string) => {
    if (!currentUser) {
      openModal('register');
      return;
    }
    if (planId === 'free') {
      showToast('Вече сте на безплатния план');
      return;
    }
    showToast(`Избрахте план ${planId} — плащането идва скоро`);
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)] grain">
      <div className="section-shell py-10 md:py-14">

        {/* Header */}
        <div className="mb-14 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
          >
            <div>
              <span className="label-caps mb-3 block">Цени</span>
              <h1 className="display-lg text-[var(--ink-900)]">
                Ясни планове, без изненади
              </h1>
            </div>
            <div>
              <p className="text-[16px] text-[var(--text-secondary)] leading-relaxed mb-4">
                Изберете план, който пасва на вашия workflow. Всички цени са в лева. Без скрити такси.
              </p>

              <div className="inline-flex items-center gap-1 bg-[var(--surface-strong)] border border-[var(--border)] rounded-full p-1">
                <button
                  onClick={() => setYearly(false)}
                  className={`px-5 py-2 rounded-full text-[13px] font-medium transition-colors ${!yearly ? 'bg-[var(--ink-900)] text-[var(--bg)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                  Месечно
                </button>
                <button
                  onClick={() => setYearly(true)}
                  className={`px-5 py-2 rounded-full text-[13px] font-medium transition-colors ${yearly ? 'bg-[var(--ink-900)] text-[var(--bg)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                  Годишно
                </button>
              </div>
              {yearly && <p className="text-[13px] text-[var(--emerald)] font-medium mt-2">Спестете до 2 месеца с годишно плащане</p>}
            </div>
          </motion.div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {PLANS.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative"
            >
              {plan.highlight && (
                <div className="absolute -inset-px bg-gradient-to-b from-[var(--accent)]/10 to-transparent rounded-[24px] blur-sm pointer-events-none" />
              )}
              <div className={`relative h-full premium-card p-6 flex flex-col ${plan.highlight ? 'border-[var(--accent)]/20' : ''}`}>
                {plan.highlight && (
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[var(--accent)] to-[var(--lavender)] rounded-t-[24px]" />
                )}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">{plan.name}</h3>
                    {plan.highlight && <Badge variant="accent" className="text-[9px] rounded-full px-2 py-0.5">Популярен</Badge>}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[38px] font-semibold text-[var(--ink-900)] tracking-tight">
                      {yearly ? plan.yearly : plan.monthly} лв.
                    </span>
                    <span className="text-[14px] text-[var(--text-tertiary)]">{yearly ? '/година' : '/месец'}</span>
                  </div>
                  <p className="text-[14px] text-[var(--text-secondary)] mt-2 leading-relaxed">{plan.desc}</p>
                </div>
                <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[13px] text-[var(--text-secondary)]">
                      <Check size={14} className={`mt-0.5 shrink-0 ${plan.highlight ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlight ? 'primary' : 'secondary'}
                  className="w-full h-10"
                  onClick={() => handleCta(plan.id)}
                >
                  {plan.id === 'free' ? 'Започни' : 'Избери план'} <ArrowRight size={13} />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center">
          <p className="text-[14px] text-[var(--text-tertiary)]">
            Нуждаете се от персонализиран план?{' '}
            <button onClick={() => openModal('contact')} className="text-[var(--accent)] font-medium hover:underline">
              Пишете ни
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
