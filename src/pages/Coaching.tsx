import React, { useState } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { motion } from 'motion/react';
import { Users, Check, ArrowRight, Calendar, Clock, MessageSquare, Target, Zap, BookOpen, Send, Mail, User, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';

const WHO_IS_IT_FOR = [
  { icon: Target, title: 'Предприемачи', desc: 'Искаш да автоматизираш бизнеса си, но не знаеш откъде да започнеш.' },
  { icon: Zap, title: 'Маркетолози', desc: 'Търсиш конкретни AI workflows за content, ads и анализи.' },
  { icon: BookOpen, title: 'Екипи', desc: 'Искаш да внедриш AI в компанията, но нямаш вътрешен експерт.' },
  { icon: Users, title: 'Freelancer-и', desc: 'Искаш да работиш по-бързо и да вдигнеш rates без да работиш повече.' },
];

const WHAT_YOU_GET = [
  'Персонален AI roadmap за твоя бизнес',
  'Live screen-sharing сесия (30-45 мин)',
  'Конкретни prompts и workflows за твоя случай',
  'Запис на разговора за преглед',
  'Follow-up с resources и next steps',
];

const HOW_IT_WORKS = [
  { num: '01', title: 'Запази час', desc: 'Избери удобен слот от календара или пиши ни директно.' },
  { num: '02', title: 'Попълни кратък формуляр', desc: 'Разкажи ни накратко за твоя бизнес и какво искаш да постигнеш.' },
  { num: '03', title: 'Проведи сесията', desc: 'Live разговор с screen-sharing. Решаваме конкретни проблеми, не общи теории.' },
  { num: '04', title: 'Приложи на практика', desc: 'Получаваш запис, prompts и план. Приложи го веднага.' },
];

const TOPICS = [
  'AI automation за repetitive задачи',
  'Content система с AI — от идея до публикуване',
  'Customer support AI — кога и как да го внедриш',
  'AI за sales и lead generation',
  'Избор на AI инструменти за конкретен бизнес',
  'AI workflow за екипна продуктивност',
];

export default function Coaching({ showToast, currentUser, openModal }: any) {
  useDocumentTitle('Coaching');
  const { session } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', company: '', goal: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      openModal('login');
      return;
    }
    if (!form.name || !form.email || !form.goal) return;

    setLoading(true);
    try {
      const res = await fetch('/api/coaching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`,
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          goal: form.goal,
          budget: form.company ? `Компания/роля: ${form.company}` : undefined,
          message: form.goal,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        showToast('Запитването е изпратено. Ще се свържем с теб скоро.');
      } else {
        showToast(data.error || 'Грешка при изпращане. Опитай отново.', true);
      }
    } catch {
      showToast('Грешка при изпращане. Опитай отново.', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)] grain">
      <div className="section-shell py-10 md:py-14">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20"
        >
          <div className="max-w-3xl">
            <Badge variant="accent" className="mb-5 rounded-full">1-на-1 AI Coaching</Badge>
            <h1 className="display-lg text-[var(--ink-900)] mb-5">
              Персонализирана AI стратегия<br />
              <span className="text-[var(--text-tertiary)]">за твоя бизнес.</span>
            </h1>
            <p className="text-[17px] text-[var(--text-secondary)] max-w-xl leading-relaxed mb-8">
              Не е нужно да знаеш всичко за AI. Нужен ти е човек, който да ти покаже какво работи конкретно за твоя случай — с реални примери, не теория.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a href="#book">
                <Button size="lg">Запиши разговор <ArrowRight size={16} /></Button>
              </a>
              <span className="text-[13px] text-[var(--text-tertiary)]">Първият разговор е безплатен</span>
            </div>
          </div>
        </motion.div>

        {/* TRUST BAR */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-20 py-6 border-y border-[var(--border)]"
        >
          <span className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
            <Clock size={15} className="text-[var(--accent)]" /> 30-45 мин сесия
          </span>
          <span className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
            <Users size={15} className="text-[var(--accent)]" /> С screen-sharing
          </span>
          <span className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
            <Check size={15} className="text-[var(--accent)]" /> Следващи стъпки + запис
          </span>
          <span className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
            <MessageSquare size={15} className="text-[var(--accent)]" /> На български
          </span>
        </motion.div>

        {/* FOR WHO */}
        <section className="mb-20 md:mb-24">
          <div className="text-center mb-12">
            <span className="label-caps mb-3 block">За кого е</span>
            <h2 className="display-md text-[var(--ink-900)]">Кой има най-голяма полза?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {WHO_IS_IT_FOR.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="premium-card p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] mb-4">
                  <item.icon size={20} />
                </div>
                <h3 className="text-[17px] font-semibold text-[var(--ink-900)] mb-2">{item.title}</h3>
                <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* WHAT YOU GET */}
        <section className="mb-20 md:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="label-caps mb-3 block">Какво получаваш</span>
              <h2 className="display-md text-[var(--ink-900)] mb-6">
                Не е просто разговор.<br />Получаваш план.
              </h2>
              <ul className="flex flex-col gap-3">
                {WHAT_YOU_GET.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-[var(--text-secondary)]">
                    <Check size={16} className="text-[var(--accent)] mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative"
            >
              <div className="rounded-[24px] border border-[var(--border)] bg-[var(--bg-soft)] p-6 md:p-8">
                <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mb-4">Примерни теми</h3>
                <div className="flex flex-col gap-2">
                  {TOPICS.map((topic) => (
                    <div key={topic} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[14px] text-[var(--text-secondary)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                      {topic}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mb-20 md:mb-24">
          <div className="text-center mb-12">
            <span className="label-caps mb-3 block">Процес</span>
            <h2 className="display-md text-[var(--ink-900)]">Как протича?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative"
              >
                <div className="text-[48px] font-bold text-[var(--ink-900)]/[0.06] leading-none mb-4">{step.num}</div>
                <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mb-2">{step.title}</h3>
                <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* NOT FOR */}
        <section className="mb-20 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-[22px] md:text-[26px] font-semibold text-[var(--ink-900)] tracking-tight mb-4">
              За кого НЕ е
            </h2>
            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed mb-6">
              Не сме за всеки. Ако търсиш "get rich quick" схема, магически prompt, или искаш някой друг да свърши работата вместо теб — това не е мястото. Coaching-ът е за хора, които са готови да научат, тестват и прилагат.
            </p>
            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
              Ако просто искаш да видиш дали AI е за теб — започни с безплатните уроци в академията.
            </p>
          </motion.div>
        </section>

        {/* BOOKING FORM */}
        <section id="book" className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-xl mx-auto"
          >
            <div className="rounded-[24px] border border-[var(--border)] bg-[var(--bg-soft)] p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-2xl bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] mx-auto mb-4">
                  <Calendar size={22} />
                </div>
                <h2 className="text-[24px] font-semibold text-[var(--ink-900)] tracking-tight mb-2">
                  Запиши разговор
                </h2>
                <p className="text-[15px] text-[var(--text-secondary)]">
                  Попълни формата и ще се свържем с теб до 24 часа за уточняване на удобен час.
                </p>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-8"
                >
                  <div className="w-14 h-14 rounded-full bg-[var(--emerald-light)] flex items-center justify-center text-[var(--emerald)] mx-auto mb-4">
                    <Check size={24} />
                  </div>
                  <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mb-2">Получихме запитването!</h3>
                  <p className="text-[14px] text-[var(--text-secondary)]">Ще ти пишем на {form.email} до 24 часа с възможни часове за разговор.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-[14px] font-medium text-[var(--ink-900)] mb-1.5 block">Име</label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                      <Input
                        value={form.name}
                        onChange={(e: any) => setForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Твоето име"
                        className="h-12 pl-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[14px] font-medium text-[var(--ink-900)] mb-1.5 block">Имейл</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e: any) => setForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="you@company.com"
                        className="h-12 pl-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[14px] font-medium text-[var(--ink-900)] mb-1.5 block">Компания / Роля (по желание)</label>
                    <Input
                      value={form.company}
                      onChange={(e: any) => setForm(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Пример: Маркетинг мениджър в IT фирма"
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-[14px] font-medium text-[var(--ink-900)] mb-1.5 block">Какво искаш да постигнеш?</label>
                    <textarea
                      value={form.goal}
                      onChange={(e) => setForm(prev => ({ ...prev, goal: e.target.value }))}
                      placeholder="Разкажи ни накратко какво искаш да автоматизираш или подобриш с AI..."
                      className="w-full bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--border-strong)] rounded-2xl p-4 text-[14px] text-[var(--ink-900)] placeholder:text-[var(--text-disabled)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors min-h-[120px] resize-y custom-scrollbar"
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? <Loader2 size={15} className="mr-2 animate-spin" /> : <Send size={15} className="mr-2" />}
                    {loading ? 'Изпращам...' : 'Изпрати запитване'}
                  </Button>
                  <p className="text-[11px] text-[var(--text-tertiary)] text-center">
                    Не споделяме информацията ти с трети страни. Първият разговор е безплатен и без ангажимент.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </section>

        {/* CTA to Academy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center pb-10"
        >
          <p className="text-[14px] text-[var(--text-secondary)]">
            Още не си сигурен?{' '}
            <button onClick={() => window.location.href = '/lessons'} className="text-[var(--accent)] font-medium hover:underline">
              Започни с безплатните уроци
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
