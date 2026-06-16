import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import type { MissionLesson, MissionQuestion } from '../../data';
import { addMissionXP, rewardQuizAnswer, completeMissionLesson, getMissionXP, getMissionLevel } from '../../lib/missions';

export default function Quiz({
  lesson,
  onComplete,
  onClose,
}: {
  lesson: MissionLesson;
  onComplete: (xpGained: number) => void;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = lesson.questions[idx];
  const isCorrect = selected?.toLowerCase().trim() === question.answer.toLowerCase().trim();

  const normalize = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[.!?]+$/, '');

  const handleCheck = () => {
    if (!selected && question.type !== 'fill') return;
    if (question.type === 'fill' && !selected?.trim()) return;

    const correct =
      question.type === 'mcq'
        ? normalize(selected || '') === normalize(question.answer)
        : question.type === 'truefalse'
          ? normalize(selected || '') === normalize(question.answer)
          : normalize(selected || '') === normalize(question.answer);

    setChecked(true);
    if (correct) setCorrectCount(c => c + 1);
    const gain = rewardQuizAnswer(correct);
    setXpGained(g => g + gain);
    addMissionXP(gain);
  };

  const handleNext = () => {
    if (idx < lesson.questions.length - 1) {
      setIdx(i => i + 1);
      setSelected(null);
      setChecked(false);
    } else {
      completeMissionLesson(lesson.id);
      const lessonBonus = 20;
      addMissionXP(lessonBonus);
      setXpGained(g => g + lessonBonus);
      setFinished(true);
      onComplete(xpGained + lessonBonus);
    }
  };

  const handleRestart = () => {
    setIdx(0);
    setSelected(null);
    setChecked(false);
    setCorrectCount(0);
    setXpGained(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="premium-card p-6 sm:p-8 text-center max-w-xl mx-auto"
      >
        <div className="w-16 h-16 rounded-full bg-[var(--green-light)] text-[var(--green)] flex items-center justify-center mx-auto mb-4">
          <Sparkles size={32} />
        </div>
        <h2 className="text-[24px] font-semibold text-[var(--ink-900)] mb-2">Урокът е завършен! 🎉</h2>
        <p className="text-[16px] text-[var(--text-secondary)] mb-4">
          {correctCount} / {lesson.questions.length} верни отговора
        </p>
        <div className="text-[32px] font-bold text-[var(--accent)] mb-6">+{xpGained} XP</div>
        <div className="flex justify-center gap-3">
          <Button variant="secondary" onClick={handleRestart}><RotateCcw size={16} /> Реши отново</Button>
          <Button onClick={onClose}>Назад към мисиите</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <button onClick={onClose} className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          ← Назад
        </button>
        <span className="text-[13px] text-[var(--text-secondary)]">
          Въпрос {idx + 1} от {lesson.questions.length}
        </span>
      </div>

      <div className="w-full h-1.5 bg-[var(--ink-100)] rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-[var(--accent)] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((idx + (checked ? 1 : 0)) / lesson.questions.length) * 100}%` }}
        />
      </div>

      <div className="premium-card p-6 sm:p-8 mb-4">
        <h3 className="text-[20px] font-semibold text-[var(--ink-900)] mb-6">{question.question}</h3>

        {question.type === 'mcq' && question.options && (
          <div className="grid gap-3">
            {question.options.map((opt, i) => {
              const selectedOption = selected === opt;
              const isAnswer = checked && normalize(opt) === normalize(question.answer);
              const isWrong = checked && selectedOption && !isAnswer;
              return (
                <button
                  key={i}
                  disabled={checked}
                  onClick={() => setSelected(opt)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isAnswer
                      ? 'bg-[var(--green-light)] border-[var(--green)] text-[var(--green-text)]'
                      : isWrong
                        ? 'bg-[var(--rose-light)] border-[var(--rose)] text-[var(--rose-text)]'
                        : selectedOption
                          ? 'bg-[var(--accent-light)] border-[var(--accent)] text-[var(--accent-text)]'
                          : 'bg-[var(--bg-soft)] border-[var(--border)] hover:border-[var(--accent)]/40'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {question.type === 'truefalse' && (
          <div className="grid grid-cols-2 gap-3">
            {['Вярно', 'Невярно'].map((opt) => {
              const selectedOption = selected === opt;
              const isAnswer = checked && normalize(opt) === normalize(question.answer);
              const isWrong = checked && selectedOption && !isAnswer;
              return (
                <button
                  key={opt}
                  disabled={checked}
                  onClick={() => setSelected(opt)}
                  className={`p-4 rounded-xl border text-center font-medium transition-all ${
                    isAnswer
                      ? 'bg-[var(--green-light)] border-[var(--green)] text-[var(--green-text)]'
                      : isWrong
                        ? 'bg-[var(--rose-light)] border-[var(--rose)] text-[var(--rose-text)]'
                        : selectedOption
                          ? 'bg-[var(--accent-light)] border-[var(--accent)] text-[var(--accent-text)]'
                          : 'bg-[var(--bg-soft)] border-[var(--border)] hover:border-[var(--accent)]/40'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {question.type === 'fill' && (
          <div className="space-y-3">
            <input
              type="text"
              value={selected || ''}
              disabled={checked}
              onChange={(e) => setSelected(e.target.value)}
              placeholder="Вашият отговор..."
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-soft)] border border-[var(--border)] text-[var(--ink-900)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
        )}

        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`mt-5 p-4 rounded-xl flex items-start gap-3 ${
                isCorrect ? 'bg-[var(--green-light)] text-[var(--green-text)]' : 'bg-[var(--rose-light)] text-[var(--rose-text)]'
              }`}
            >
              {isCorrect ? <CheckCircle2 size={20} className="shrink-0 mt-0.5" /> : <XCircle size={20} className="shrink-0 mt-0.5" />}
              <div>
                <p className="font-semibold text-[14px]">{isCorrect ? 'Вярно!' : 'Не съвсем'}</p>
                <p className="text-[13px] opacity-90 mt-0.5">{question.explanation}</p>
                <p className="text-[12px] opacity-80 mt-1.5 font-medium">+{rewardQuizAnswer(isCorrect)} XP</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-end">
        {!checked ? (
          <Button onClick={handleCheck} disabled={!selected && question.type !== 'fill'}>
            Провери
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {idx === lesson.questions.length - 1 ? 'Завърши урока' : 'Следващ'} <ArrowRight size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}
