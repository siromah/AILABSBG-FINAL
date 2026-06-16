import { motion } from 'motion/react';
import { Zap, Flame, Trophy, Target } from 'lucide-react';
import { getMissionLevel, getMissionLevelProgress, xpToNextLevel } from '../../lib/missions';
import type { StreakData } from '../../lib/missions';

export default function MissionHeader({
  xp,
  streak,
  badges,
  completedMissions,
}: {
  xp: number;
  streak: StreakData;
  badges: string[];
  completedMissions: number;
}) {
  const level = getMissionLevel(xp);
  const { progress } = getMissionLevelProgress(xp);
  const remaining = xpToNextLevel(xp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card p-6 sm:p-8 mb-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="md:max-w-lg">
          <h1 className="text-[30px] sm:text-[38px] font-semibold text-[var(--ink-900)] mb-3 tracking-tight">
            Здравей 👋
          </h1>
          <p className="text-[17px] sm:text-[18px] text-[var(--text-secondary)] leading-relaxed">
            Готов ли си за 5 минути AI практика?
          </p>
          <p className="text-[15px] sm:text-[16px] text-[var(--text-tertiary)] mt-1.5 leading-relaxed">
            Избери мисия, отговори на кратък тест и приложи наученото веднага.
          </p>
        </div>

        <div className="premium-card px-5 py-4 min-w-[260px] border-[var(--border-strong)]">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center">
                <Zap size={20} fill="currentColor" />
              </div>
              <div>
                <p className="text-[13px] text-[var(--text-tertiary)] font-medium">Ниво {level}</p>
                <p className="text-[20px] font-semibold text-[var(--ink-900)]">{xp} XP</p>
              </div>
            </div>
            <p className="text-[13px] text-[var(--text-secondary)]">{remaining} до {level + 1}</p>
          </div>
          <div className="w-full bg-[var(--ink-100)] h-[8px] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full bg-[var(--accent)]"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-[var(--border)]">
        <div className="flex items-center justify-center gap-2 rounded-xl bg-[var(--bg-soft)] px-3 py-3">
          <Flame size={18} className="text-[var(--orange)]" />
          <span className="text-[14px] font-medium text-[var(--ink-900)]">{streak.streak} дни стрийк</span>
        </div>
        <div className="flex items-center justify-center gap-2 rounded-xl bg-[var(--bg-soft)] px-3 py-3">
          <Trophy size={18} className="text-[var(--accent)]" />
          <span className="text-[14px] font-medium text-[var(--ink-900)]">{badges.length} значки</span>
        </div>
        <div className="flex items-center justify-center gap-2 rounded-xl bg-[var(--bg-soft)] px-3 py-3">
          <Target size={18} className="text-[var(--green)]" />
          <span className="text-[14px] font-medium text-[var(--ink-900)]">{completedMissions} завършени</span>
        </div>
      </div>
    </motion.div>
  );
}
