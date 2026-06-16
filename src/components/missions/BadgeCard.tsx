import React from 'react';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';
import type { MissionBadgeDef } from '../../data';

export default function BadgeCard({ badge, unlocked }: { badge: MissionBadgeDef; unlocked: boolean }) {
  return (
    <motion.div
      initial={unlocked ? { scale: 0.9, opacity: 0 } : false}
      animate={unlocked ? { scale: 1, opacity: 1 } : {}}
      whileHover={{ y: -3 }}
      className={`premium-card p-4 text-center transition-all ${
        unlocked ? '' : 'opacity-60 grayscale'
      }`}
    >
      <div className="text-[40px] mb-2">{badge.icon}</div>
      <h4 className="text-[14px] font-semibold text-[var(--ink-900)] mb-1">{badge.title}</h4>
      <p className="text-[12px] text-[var(--text-secondary)] leading-snug">{badge.description}</p>
      {!unlocked && (
        <div className="mt-3 inline-flex items-center gap-1 text-[11px] text-[var(--text-tertiary)] bg-[var(--bg-soft)] px-2 py-1 rounded-full">
          <Lock size={11} /> Заключено
        </div>
      )}
    </motion.div>
  );
}
