import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Mail, Send, User, MessageSquare, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Contact({ showToast }: any) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<{name?:string, email?:string, message?:string}>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Въведи име';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Въведи валиден имейл';
    if (!form.message.trim() || form.message.trim().length < 10) e.message = 'Съобщението трябва да е поне 10 символа';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    showToast('Съобщението е изпратено успешно');
    timerRef.current = setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)] grain">
      <div className="section-shell py-10 md:py-14">

        {/* HEADER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14 items-end">
          <div className="lg:col-span-7">
            <span className="label-caps mb-3 block">Контакт</span>
            <h1 className="display-lg text-[var(--ink-900)]">
              Свържи се с нас
            </h1>
          </div>
          <div className="lg:col-span-5">
            <p className="text-[16px] text-[var(--text-secondary)] leading-relaxed">
              Имаш въпроси за обученията, курсовете или бизнес колаборация? Пиши ни и ще ти отговорим до 24 часа.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* FORM */}
          <div className="lg:col-span-7">
            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="h-full flex flex-col items-center justify-center text-center py-16 rounded-3xl border border-[var(--border)] bg-[var(--surface-strong)] px-8">
                <div className="w-14 h-14 rounded-full bg-[var(--emerald-light)] flex items-center justify-center mb-5">
                  <CheckCircle size={28} className="text-[var(--emerald)]" />
                </div>
                <h2 className="text-[20px] font-semibold text-[var(--ink-900)] mb-2">Съобщението е изпратено</h2>
                <p className="text-[var(--text-secondary)] max-w-sm leading-relaxed text-[14px]">Благодарим ти. Ще се свържем с теб до 24 часа.</p>
                <Button variant="secondary" className="mt-6" onClick={() => setSent(false)}>
                  Ново съобщение <ArrowRight size={14} />
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="premium-card p-6 md:p-10">
                <div className="space-y-5">
                  <div>
                    <label htmlFor="contact-name" className="label-caps block mb-2">Твоето име</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                      <input
                        id="contact-name"
                        type="text"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Иван Петров"
                        className={`w-full h-11 pl-10 pr-4 rounded-xl border bg-[var(--bg-soft)] text-[var(--ink-900)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-1 transition-all ${errors.name ? 'border-[var(--rose)] focus:ring-[var(--rose)]' : 'border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent)]'}`}
                      />
                    </div>
                    {errors.name && <p className="text-[12px] text-[var(--rose)] mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="label-caps block mb-2">Имейл адрес</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                      <input
                        id="contact-email"
                        type="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="ivan@example.com"
                        className={`w-full h-11 pl-10 pr-4 rounded-xl border bg-[var(--bg-soft)] text-[var(--ink-900)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-1 transition-all ${errors.email ? 'border-[var(--rose)] focus:ring-[var(--rose)]' : 'border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent)]'}`}
                      />
                    </div>
                    {errors.email && <p className="text-[12px] text-[var(--rose)] mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="label-caps block mb-2">Съобщение</label>
                    <div className="relative">
                      <MessageSquare size={16} className="absolute left-3.5 top-3.5 text-[var(--text-tertiary)]" />
                      <textarea
                        id="contact-message"
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        placeholder="Опиши въпроса си..."
                        rows={5}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-[var(--bg-soft)] text-[var(--ink-900)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-1 transition-all resize-none ${errors.message ? 'border-[var(--rose)] focus:ring-[var(--rose)]' : 'border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent)]'}`}
                      />
                    </div>
                    {errors.message && <p className="text-[12px] text-[var(--rose)] mt-1">{errors.message}</p>}
                  </div>

                  <Button type="submit" size="lg" className="w-full h-12 text-[15px] gap-2">
                    <Send size={16} /> Изпрати съобщение
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* SIDEBAR INFO */}
          <div className="lg:col-span-5 space-y-4">
            <div className="premium-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)]">
                  <Clock size={18} />
                </div>
                <h3 className="text-[16px] font-semibold text-[var(--ink-900)] tracking-tight">Време за отговор</h3>
              </div>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                Отговаряме в рамките на <strong className="text-[var(--ink-900)]">1–2 работни дни</strong>. Предпочитаме детайлен отговор пред бърз.
              </p>
            </div>

            <div className="premium-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--amber-light)] text-[var(--amber)] flex items-center justify-center">
                  <Mail size={18} />
                </div>
                <h3 className="text-[16px] font-semibold text-[var(--ink-900)] tracking-tight">Имейл директно</h3>
              </div>
              <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                hello@craative.bg
              </p>
            </div>

            <div className="rounded-3xl overflow-hidden h-40 relative border border-[var(--border)]">
              <div className="absolute inset-0 bg-[var(--accent)]/5" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[28px] font-semibold text-[var(--ink-900)]/10 tracking-tight">Craative</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
