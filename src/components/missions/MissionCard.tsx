import React from 'react';
import { motion } from 'motion/react';
import { Target, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import type { DailyMission } from '../../data';

export default function MissionCard({
  mission,
  completed,
  onStart,
}: {
  mission: DailyMission;
  completed: boolean;
  onStart: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`premium-card p-5 sm:p-6 relative overflow-hidden ${
        completed ? 'border-[var(--green)]/40' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-[var(--accent)]" />
            <span className="label-caps">ДНЕВНА МИСИЯ</span>
          </div>
          <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mb-1">{mission.title}</h3>
          <p className="text-[14px] text-[var(--text-secondary)] mb-4">{mission.description}</p>
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-medium text-[var(--accent)]">+{mission.xp} XP</span>
            {completed && (
              <span className="inline-flex items-center gap-1 text-[12px] text-[var(--green)] font-medium">
                <CheckCircle2 size={13} /> Завършена
              </span>
            )}
          </div>
        </div>
        <div className="shrink-0">
          <Button variant={completed ? 'secondary' : 'primary'} size="sm" onClick={onStart} disabled={completed}>
            {completed ? 'Готово' : mission.action}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
