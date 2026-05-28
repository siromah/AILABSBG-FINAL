import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, Users, Video, CheckCircle2, ArrowRight, CalendarDays, Sparkles } from 'lucide-react';
import { EVENTS_DATA } from '../data';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export default function Events({ currentUser, openModal, showToast }: any) {
  const [joined, setJoined] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('ailabs_joinedEvents');
      if (raw) setJoined(JSON.parse(raw));
    } catch { /* silently ignore */ }
  }, []);

  useEffect(() => {
    localStorage.setItem('ailabs_joinedEvents', JSON.stringify(joined));
  }, [joined]);

  const handleJoin = (id: string) => {
    if (!currentUser) { openModal('login'); return; }
    if (joined.includes(id)) return;
    setJoined([...joined, id]);
    showToast('Успешна регистрация. Провери имейла си.');
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)] grain">
      <div className="section-shell py-10 md:py-14">

        <div className="mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
          >
            <div>
              <span className="label-caps mb-3 block">Календар</span>
              <h1 className="display-lg text-[var(--ink-900)]">
                Предстоящи събития
              </h1>
            </div>
            <div>
              <p className="text-[16px] text-[var(--text-secondary)] leading-relaxed max-w-sm">
                Практически AI workshops, live сесии и консултации с екипа ни. Без теория — само работа.
              </p>
              <div className="flex items-center gap-3 mt-3 text-[13px] text-[var(--text-tertiary)]">
                <span>{EVENTS_DATA.length} предстоящи</span>
                <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]" />
                <span>{joined.length} записани</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EVENTS_DATA.length === 0 ? (
            <div className="premium-card py-14 text-center col-span-full">
              <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mb-1">Няма предстоящи събития</h3>
              <p className="text-[14px] text-[var(--text-secondary)]">Провери отново скоро.</p>
            </div>
          ) : EVENTS_DATA.map((e:any, idx:number) => {
            const isJoined = joined.includes(e.id);
            return (
              <motion.div
                initial={{opacity: 0, y: 12}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.35, delay: idx * 0.05}}
                key={e.id}
              >
                <div className={`group relative premium-card p-5 md:p-6 flex flex-col h-full ${isJoined ? 'border-[var(--emerald)]/20' : ''}`}>
                  <div className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full ${isJoined ? 'bg-[var(--emerald)]' : 'bg-[var(--border-strong)] group-hover:bg-[var(--accent)] transition-colors'}`} />

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`flex flex-col items-center justify-center shrink-0 w-14 h-14 rounded-2xl border ${isJoined ? 'bg-[var(--emerald-light)] border-[var(--emerald)]/20 text-[var(--emerald)]' : 'bg-[var(--bg-soft)] border-[var(--border)] text-[var(--ink-900)]'}`}>
                      <span className="text-[22px] font-semibold leading-none tracking-tight">{e.day}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-widest opacity-70 mt-0.5">{e.mo}</span>
                    </div>
                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-1">
                        {isJoined ? (
                          <Badge variant="success" className="gap-1 px-2 rounded-full text-[10px]"><CheckCircle2 size={10} /> Записан</Badge>
                        ) : (
                          <Badge variant="outline" className="rounded-full text-[10px]">Предстоящо</Badge>
                        )}
                      </div>
                      <div className="text-[12px] text-[var(--text-secondary)] flex items-center gap-1">
                        <Video size={11} className="text-[var(--text-tertiary)]" /> {e.platform}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-[17px] md:text-[18px] font-semibold text-[var(--ink-900)] leading-tight mb-2 tracking-tight">
                    {e.title}
                  </h3>

                  <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed mb-4 flex-1">
                    {e.desc}
                  </p>

                  <div className="flex flex-wrap gap-3 text-[12px] font-medium text-[var(--text-tertiary)] mb-5">
                    <span className="flex items-center gap-1.5"><Clock size={13} /> {e.time}</span>
                    <span className="flex items-center gap-1.5"><Clock size={13} /> {e.dur}</span>
                    <span className="flex items-center gap-1.5 text-[var(--ink-900)]"><Users size={13} className="text-[var(--accent)]" /> {e.spots} места</span>
                  </div>

                  <div className="mt-auto">
                    {isJoined ? (
                      <div className="w-full py-2.5 px-4 rounded-xl font-medium text-center bg-[var(--emerald-light)] text-[var(--emerald)] text-[13px] border border-[var(--emerald)]/10">
                        Записан
                      </div>
                    ) : (
                      <Button onClick={() => handleJoin(e.id)} className="w-full">
                        Запази място <ArrowRight size={13} />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
