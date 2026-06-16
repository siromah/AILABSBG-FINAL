import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowLeft, ChevronRight, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { getMissionLevel } from '../../lib/missions';
import { getLevelProgress } from '../../lib/xp';

export default function ResultScreen({
  xpBefore,
  gainedXp,
  quizCorrect,
  quizTotal,
  completedMissions,
  isCompleted,
  onComplete,
  onNext,
  onHome,
  hasNext,
  recap,
}: {
  xpBefore: number;
  gainedXp: number;
  quizCorrect: number;
  quizTotal: number;
  completedMissions: number;
  isCompleted: boolean;
  onComplete: () => void;
  onNext: () => void;
  onHome: () => void;
  hasNext: boolean;
  recap?: string[];
}) {
  const [clickedComplete, setClickedComplete] = useState(false);
  const accuracy = quizTotal > 0 ? Math.round((quizCorrect / quizTotal) * 100) : 0;
  const totalXp = xpBefore + gainedXp;
  const level = getMissionLevel(totalXp);
  const levelProgress = getLevelProgress(totalXp);

  const handleComplete = () => {
    setClickedComplete(true);
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="premium-card p-8 sm:p-12 text-center"
    >
      <div className="w-22 h-22 rounded-full bg-[var(--green-light)] text-[var(--green)] flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={44} />
      </div>

      <h2 className="text-[28px] sm:text-[32px] font-semibold text-[var(--ink-900)] mb-3">
        {isCompleted ? 'Браво! Мисията е завършена.' : 'Готов си да завършиш мисията?'}
      </h2>
      <p className="text-[16px] sm:text-[17px] text-[var(--text-secondary)] mb-7 max-w-lg mx-auto leading-relaxed">
        {isCompleted
          ? `Спечели ${gainedXp} XP. Продължавай със следващата стъпка, когато си готов.`
          : 'Премина през урока, примера, теста и задачата. Завърши мисията, за да запазиш прогреса си.'}
      </p>

      {recap && recap.length > 0 && (
        <div className="max-w-2xl mx-auto mb-8 text-left rounded-2xl p-5 bg-[var(--bg-soft)] border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={18} className="text-[var(--accent)]" />
            <h3 className="text-[15px] font-semibold text-[var(--ink-900)]">Кратко резюме</h3>
          </div>
          <ul className="space-y-2">
            {recap.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-[14px] text-[var(--text-secondary)] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
        <div className="bg-[var(--bg-soft)] rounded-2xl p-5">
          <p className="text-[13px] text-[var(--text-tertiary)] font-medium mb-1.5">Точност</p>
          <p className="text-[26px] font-semibold text-[var(--ink-900)]">{accuracy}%</p>
          <p className="text-[13px] text-[var(--text-secondary)]">{quizCorrect} / {quizTotal} верни</p>
        </div>
        <div className="bg-[var(--bg-soft)] rounded-2xl p-5">
          <p className="text-[13px] text-[var(--text-tertiary)] font-medium mb-1.5">Получени XP</p>
          <p className="text-[26px] font-semibold text-[var(--ink-900)]">+{gainedXp}</p>
          <p className="text-[13px] text-[var(--text-secondary)]">от тази мисия</p>
        </div>
        <div className="bg-[var(--bg-soft)] rounded-2xl p-5">
          <p className="text-[13px] text-[var(--text-tertiary)] font-medium mb-1.5">Ниво {level}</p>
          <p className="text-[26px] font-semibold text-[var(--ink-900)]">{levelProgress} / 100</p>
          <p className="text-[13px] text-[var(--text-secondary)]">{completedMissions} завършени мисии</p>
        </div>
      </div>

      {isCompleted && (
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent-light)] text-[var(--accent-text)] text-[14px] font-medium mb-7">
          <Sparkles size={16} /> Браво! Продължавай напред.
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {!isCompleted ? (
          <Button variant="primary" size="lg" onClick={handleComplete} disabled={clickedComplete}>
            <CheckCircle2 size={20} /> Завърши мисията
          </Button>
        ) : (
          <>
            <Button variant="secondary" size="md" onClick={onHome}>
              <ArrowLeft size={18} /> Обратно към мисиите
            </Button>
            {hasNext && (
              <Button variant="primary" size="md" onClick={onNext}>
                Следваща мисия <ChevronRight size={18} />
              </Button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
