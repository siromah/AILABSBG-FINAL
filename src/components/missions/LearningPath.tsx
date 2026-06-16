import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Lock } from 'lucide-react';
import LessonCard from './LessonCard';
import { MISSIONS_MODULES } from '../../data';
import type { MissionLesson } from '../../data';

export default function LearningPath({
  progress,
  onSelectLesson,
}: {
  progress: Record<string, boolean>;
  onSelectLesson: (lesson: MissionLesson) => void;
}) {
  const allLessons = MISSIONS_MODULES.flatMap(m => m.lessons);

  const isUnlocked = (lessonId: string) => {
    const idx = allLessons.findIndex(l => l.id === lessonId);
    if (idx <= 0) return true;
    return progress[allLessons[idx - 1].id] === true;
  };

  const isNext = (lessonId: string) => {
    const idx = allLessons.findIndex(l => l.id === lessonId);
    if (idx === 0) return !progress[lessonId];
    return progress[allLessons[idx - 1].id] && !progress[lessonId];
  };

  return (
    <div className="space-y-10">
      {MISSIONS_MODULES.map((mod, modIdx) => {
        const modCompleted = mod.lessons.every(l => progress[l.id]);
        const modProgress = Math.round((mod.lessons.filter(l => progress[l.id]).length / mod.lessons.length) * 100);

        return (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: modIdx * 0.1 }}
            className="premium-card p-5 sm:p-6"
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="label-caps">МОДУЛ {modIdx + 1}</span>
                  {modCompleted && <CheckCircle2 size={16} className="text-[var(--green)]" />}
                </div>
                <h3 className="text-[20px] font-semibold text-[var(--ink-900)]">{mod.title.replace('МОДУЛ X — ', '').replace(/^МОДУЛ \d+ — /, '')}</h3>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-medium text-[var(--text-secondary)]">{modProgress}%</p>
                <div className="w-20 h-1.5 bg-[var(--ink-100)] rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-[var(--green)] rounded-full transition-all"
                    style={{ width: `${modProgress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              {mod.lessons.map((lesson, idx) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  index={idx}
                  unlocked={isUnlocked(lesson.id)}
                  completed={!!progress[lesson.id]}
                  isNext={isNext(lesson.id)}
                  onClick={() => onSelectLesson(lesson)}
                />
              ))}
            </div>

            {!modCompleted && (
              <div className="mt-4 flex items-center gap-2 text-[12px] text-[var(--text-tertiary)]">
                <Lock size={12} />
                <span>Завърши всички уроци, за да отключиш следващия модул</span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
