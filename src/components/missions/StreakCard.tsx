import React from 'react';
import { motion } from 'motion/react';
import { Flame } from 'lucide-react';
import type { StreakData } from '../../lib/missions';

export default function StreakCard({ streak }: { streak: StreakData }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="premium-card p-5 sm:p-6 h-full"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-[var(--orange)]/10 text-[var(--orange)] flex items-center justify-center animate-pulse-glow">
          <Flame size={20} fill="currentColor" />
        </div>
        <div>
          <p className="text-[12px] text-[var(--text-tertiary)] font-medium uppercase tracking-wider">Стрийк</p>
          <p className="text-[22px] font-semibold text-[var(--ink-900)]">{streak.streak} дни</p>
        </div>
      </div>
      <p className="text-[13px] text-[var(--text-secondary)]">
        {streak.streak === 0
          ? 'Започни днес и изгради навик.'
          : streak.streak < 3
            ? 'Добро начало! Продължавай всеки ден.'
            : streak.streak < 7
              ? 'Стабилен ритъм! Още малко до 7 дни.'
              : 'Невероятна последователност! 🔥'}
      </p>
    </motion.div>
  );
}
