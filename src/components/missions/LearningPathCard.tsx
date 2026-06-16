import { motion } from 'motion/react';
import { BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import type { LearningModule } from '../../lib/missionTypes';

export default function LearningPathCard({
  module,
  progress,
  onContinue,
}: {
  module: LearningModule;
  progress: Record<string, boolean>;
  onContinue: () => void;
}) {
  const total = module.missions.length;
  const completed = module.missions.filter((m) => progress[m.id]).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isDone = completed === total;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="premium-card p-5 sm:p-6 flex flex-col h-full"
    >
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="w-11 h-11 rounded-xl bg-[var(--bg-soft)] text-[var(--text-secondary)] flex items-center justify-center shrink-0">
          <BookOpen size={22} />
        </div>
        {isDone && <CheckCircle2 size={22} className="text-[var(--green)] shrink-0" />}
      </div>

      <h3 className="text-[18px] font-semibold text-[var(--ink-900)] mb-2">{module.title}</h3>
      <p className="text-[14px] text-[var(--text-secondary)] mb-5 flex-1 leading-relaxed">{module.description}</p>

      <div className="mb-5">
        <div className="flex items-center justify-between text-[13px] mb-2">
          <span className="text-[var(--text-secondary)]">{total} мисии</span>
          <span className="font-medium text-[var(--ink-900)]">{percent}% завършено</span>
        </div>
        <div className="w-full h-2.5 bg-[var(--ink-100)] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="h-full bg-[var(--green)] rounded-full"
          />
        </div>
      </div>

      <Button variant={isDone ? 'secondary' : 'primary'} size="md" onClick={onContinue} className="w-full">
        {isDone ? 'Прегледай' : 'Продължи'} <ChevronRight size={16} />
      </Button>
    </motion.div>
  );
}
