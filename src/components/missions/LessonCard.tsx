import React from 'react';
import { motion } from 'motion/react';
import { Lock, Unlock, CheckCircle2, Play, Star } from 'lucide-react';
import type { MissionLesson } from '../../data';

export default function LessonCard({
  lesson,
  index,
  unlocked,
  completed,
  isNext,
  onClick,
}: {
  lesson: MissionLesson;
  index: number;
  unlocked: boolean;
  completed: boolean;
  isNext: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={unlocked ? { y: -4, scale: 1.02 } : {}}
      whileTap={unlocked ? { scale: 0.98 } : {}}
      onClick={unlocked ? onClick : undefined}
      className={`relative w-full text-left rounded-[20px] p-4 transition-all ${
        completed
          ? 'bg-[var(--green-light)] border border-[var(--green)]/30'
          : unlocked
            ? isNext
              ? 'bg-[var(--accent-light)] border-2 border-[var(--accent)] animate-pulse-glow'
              : 'bg-[var(--surface-strong)] border border-[var(--border)] hover:border-[var(--accent)]/40'
            : 'bg-[var(--bg-soft)] border border-[var(--border)] opacity-60'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
            completed
              ? 'bg-[var(--green)] text-white'
              : unlocked
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--ink-100)] text-[var(--text-tertiary)]'
          }`}
        >
          {completed ? <CheckCircle2 size={20} /> : unlocked ? <Play size={18} fill="currentColor" /> : <Lock size={18} />}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`text-[14px] font-semibold truncate ${completed ? 'text-[var(--green-text)]' : 'text-[var(--ink-900)]'}`}>
            {index + 1}. {lesson.title}
          </h4>
          <p className="text-[12px] text-[var(--text-secondary)] truncate">{lesson.goal}</p>
        </div>
        <div className="shrink-0 flex items-center gap-1 text-[12px] font-medium text-[var(--accent)]">
          <Star size={12} fill="currentColor" /> +{lesson.xp}
        </div>
      </div>
      {isNext && (
        <div className="absolute -top-2 -right-2 bg-[var(--accent)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
          Нов
        </div>
      )}
    </motion.button>
  );
}
