import React, { useState } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, Shield, Lock, X, HelpCircle, ChevronRight } from 'lucide-react';
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
    monthly: 25,
    yearly: 250,
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
    desc: 'Pro плюс 1-на-1 AI Coaching, office hours и priority Q&A.',
    monthly: 65,
    yearly: 650,
    features: [
      'Всичко от Pro',
      '1-на-1 AI Coaching',
      'Office hours',
      'Implementation reviews',
      'Priority Q&A',
    ],
  },
];

const COMPARISON_FEATURES = [
  { name: 'Уроци', free: '3 безплатни', pro: 'Всички 15', premium: 'Всички 15' },
  { name: 'Prompts', free: '10+', pro: '50+', premium: '50+' },
  { name: 'Community', free: 'Preview', pro: 'Пълен достъп', premium: 'Пълен достъп' },
  { name: 'Workshops', free: 'Превюта', pro: 'Всички', premium: 'Всички' },
  { name: 'Challenges', free: false, pro: true, premium: true },
  { name: 'Шаблони', free: false, pro: true, premium: true },
  { name: '1-на-1 Coaching', free: false, pro: false, premium: true },
  { name: 'Office Hours', free: false, pro: false, premium: true },
  { name: 'Priority Support', free: false, pro: false, premium: true },
];

const PRICING_FAQS = [
  {
    q: 'Има ли скрити такси?',
    a: 'Не. Цената, която виждаш, е крайната цена. Без setup fees, без такси за поддръжка. Плащаш само за плана, който си избрал.',
  },
  {
    q: 'Мога ли да сменя плана си по всяко време?',
    a: 'Да. Можеш да ъпгрейдваш или даунгрейдваш плана си по всяко време. При ъпгрейд получаваш незабавен достъп до новите функции.',
  },
  {
    q: 'Как работи 7-дневната гаранция?',
    a: 'Ако в рамките на 7 дни след плащането решиш, че AILABS.BG не е за теб, пишеш ни на hello@ailabs.bg и връщаме парите без въпроси.',
  },
  {
    q: 'Приемате ли български карти?',
    a: 'Да. Работим със Stripe и приемаме всички основни карти (Visa, Mastercard, Amex), както и Revolut, Wise и други дигитални портфейли.',
  },
];

export default function Pricing({ currentUser, openModal, showToast }: any) {
  useDocumentTitle('Цени');
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
                Просто и честно
              </h1>
            </div>
            <div>
              <p className="text-[16px] text-[var(--text-secondary)] leading-relaxed mb-4">
                Избери план, който пасва на твоя ритъм. Всички цени са в евро. Без скрити такси, без договори.
              </p>

              <div className="inline-flex items-center gap-1 bg-[var(--surface-strong)] border border-[var(--border)] rounded-full p-1 relative">
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute top-1 bottom-1 rounded-full bg-[var(--ink-900)]"
                  style={{ width: 'calc(50% - 4px)', left: yearly ? 'calc(50% + 2px)' : '4px' }}
                />
                <button
                  onClick={() => setYearly(false)}
                  className={`relative z-10 px-5 py-2 rounded-full text-[13px] font-medium transition-colors ${!yearly ? 'text-[var(--bg)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                  Месечно
                </button>
                <button
                  onClick={() => setYearly(true)}
                  className={`relative z-10 px-5 py-2 rounded-full text-[13px] font-medium transition-colors ${yearly ? 'text-[var(--bg)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                  Годишно
                </button>
              </div>
              {yearly && <p className="text-[13px] text-[var(--emerald)] font-medium mt-2">Спести 2 месеца с годишно плащане</p>}
            </div>
          </motion.div>
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-12"
        >
          <span className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
            <Shield size={15} className="text-[var(--accent)]" /> 7 дни гаранция
          </span>
          <span className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
            <Lock size={15} className="text-[var(--accent)]" /> Сигурно плащане със Stripe
          </span>
          <span className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
            <Check size={15} className="text-[var(--accent)]" /> Без договор — отказ по всяко време
          </span>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {PLANS.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative"
            >
              {plan.highlight && (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: [0, 0.6, 0.3], scale: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="absolute -inset-1 bg-gradient-to-b from-[var(--accent)]/10 to-transparent rounded-[26px] blur-sm pointer-events-none"
                  />
                  <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -inset-px bg-gradient-to-b from-[var(--accent)]/8 to-transparent rounded-[24px] blur-sm pointer-events-none"
                  />
                </>
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
                    <motion.span
                      key={yearly ? 'y' : 'm'}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-[38px] font-semibold text-[var(--ink-900)] tracking-tight"
                    >
                      {yearly ? plan.yearly : plan.monthly} €
                    </motion.span>
                    <span className="text-[14px] text-[var(--text-tertiary)]">{yearly ? '/година' : '/месец'}</span>
                  </div>
                  <p className="text-[14px] text-[var(--text-secondary)] mt-2 leading-relaxed">{plan.desc}</p>
                </div>
                <motion.ul
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.06, delayChildren: idx * 0.1 + 0.2 } }
                  }}
                  className="flex flex-col gap-2.5 mb-6 flex-1"
                >
                  {plan.features.map((f) => (
                    <motion.li
                      key={f}
                      variants={{
                        hidden: { opacity: 0, x: -8 },
                        visible: { opacity: 1, x: 0 }
                      }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-start gap-3 text-[13px] text-[var(--text-secondary)]"
                    >
                      <Check size={14} className={`mt-0.5 shrink-0 ${plan.highlight ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'}`} />
                      {f}
                    </motion.li>
                  ))}
                </motion.ul>
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

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-[22px] md:text-[26px] font-semibold text-[var(--ink-900)] tracking-tight mb-8 text-center">
            Сравнение на плановете
          </h2>
          <div className="rounded-[20px] border border-[var(--border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--bg-soft)]">
                    <th className="text-left p-4 font-semibold text-[var(--ink-900)]">Функция</th>
                    <th className="text-center p-4 font-semibold text-[var(--text-secondary)] w-[120px]">Free</th>
                    <th className="text-center p-4 font-semibold text-[var(--accent)] w-[120px]">Pro</th>
                    <th className="text-center p-4 font-semibold text-[var(--text-secondary)] w-[120px]">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_FEATURES.map((feature, i) => (
                    <tr key={feature.name} className="border-b border-[var(--border)] last:border-0">
                      <td className="p-4 text-[var(--text-primary)] font-medium">{feature.name}</td>
                      <td className="p-4 text-center">
                        {feature.free === true ? (
                          <Check size={16} className="mx-auto text-[var(--emerald)]" />
                        ) : feature.free === false ? (
                          <X size={16} className="mx-auto text-[var(--text-tertiary)]" />
                        ) : (
                          <span className="text-[var(--text-secondary)]">{feature.free}</span>
                        )}
                      </td>
                      <td className="p-4 text-center bg-[var(--accent-light)]/10">
                        {feature.pro === true ? (
                          <Check size={16} className="mx-auto text-[var(--accent)]" />
                        ) : feature.pro === false ? (
                          <X size={16} className="mx-auto text-[var(--text-tertiary)]" />
                        ) : (
                          <span className="text-[var(--accent)] font-medium">{feature.pro}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {feature.premium === true ? (
                          <Check size={16} className="mx-auto text-[var(--emerald)]" />
                        ) : feature.premium === false ? (
                          <X size={16} className="mx-auto text-[var(--text-tertiary)]" />
                        ) : (
                          <span className="text-[var(--text-secondary)]">{feature.premium}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Pricing FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-[22px] md:text-[26px] font-semibold text-[var(--ink-900)] tracking-tight mb-8 text-center">
            Въпроси за цените
          </h2>
          <div className="flex flex-col gap-3">
            {PRICING_FAQS.map((faq, idx) => (
              <div key={idx} className="rounded-[16px] border border-[var(--border)] bg-[var(--bg)] overflow-hidden">
                <button
                  className="w-full text-left p-5 flex items-center justify-between gap-4"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span className="text-[15px] font-semibold text-[var(--ink-900)] flex items-center gap-2">
                    <HelpCircle size={16} className="text-[var(--accent)] shrink-0" />
                    {faq.q}
                  </span>
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
            ))}
          </div>
        </motion.div>

        {/* Footer note */}
        <div className="text-center">
          <p className="text-[14px] text-[var(--text-tertiary)]">
            Нуждаеш се от персонализиран план?{' '}
            <button onClick={() => openModal('contact')} className="text-[var(--accent)] font-medium hover:underline">
              Пиши ни
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
