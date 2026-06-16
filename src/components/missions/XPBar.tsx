import React from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';
import { getMissionLevel, getMissionLevelProgress, xpToNextLevel } from '../../lib/missions';

export default function XPBar({ xp }: { xp: number }) {
  const level = getMissionLevel(xp);
  const { progress } = getMissionLevelProgress(xp);
  const remaining = xpToNextLevel(xp);

  return (
    <div className="premium-card p-5 sm:p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center">
            <Zap size={18} fill="currentColor" />
          </div>
          <div>
            <p className="text-[12px] text-[var(--text-tertiary)] font-medium">Ниво {level}</p>
            <p className="text-[18px] font-semibold text-[var(--ink-900)]">{xp} XP</p>
          </div>
        </div>
        <p className="text-[13px] text-[var(--text-secondary)]">още {remaining} XP до следващо ниво</p>
      </div>
      <div className="w-full bg-[var(--ink-100)] h-[10px] rounded-[5px] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-[5px] bg-[var(--accent)]"
        />
      </div>
    </div>
  );
}
