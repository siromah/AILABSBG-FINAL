import { motion } from 'motion/react';
import { CheckCircle2, Zap, Flame, BookOpen } from 'lucide-react';
import type { Mission } from '../../lib/missionTypes';

export default function ProgressSummary({
  completedMissions,
  totalMissions,
  xp,
  streak,
  lastLessonTitle,
}: {
  completedMissions: number;
  totalMissions: number;
  xp: number;
  streak: number;
  lastLessonTitle: string | null;
}) {
  const items = [
    {
      icon: <CheckCircle2 size={20} />,
      label: 'Завършени мисии',
      value: `${completedMissions} / ${totalMissions}`,
      color: 'text-[var(--green)] bg-[var(--green-light)]',
    },
    {
      icon: <Zap size={20} />,
      label: 'Общо XP',
      value: xp,
      color: 'text-[var(--accent)] bg-[var(--accent-light)]',
    },
    {
      icon: <Flame size={20} />,
      label: 'Стрийк',
      value: streak > 0 ? `${streak} дни` : 'Стартирай днес',
      color: 'text-[var(--orange)] bg-[var(--orange-light)]',
    },
    {
      icon: <BookOpen size={20} />,
      label: 'Последен урок',
      value: lastLessonTitle ?? '—',
      color: 'text-[var(--secondary)] bg-[var(--secondary-light)]',
    },
  ];

  return (
    <section className="mb-8 md:mb-10">
      <h2 className="text-[18px] font-semibold text-[var(--ink-900)] mb-4">Твоят прогрес</h2>
      <div className="premium-card p-5 sm:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-start gap-3"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] text-[var(--text-tertiary)] mb-0.5">{item.label}</p>
                <p className="text-[16px] font-semibold text-[var(--ink-900)] truncate">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
