import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, PenTool } from 'lucide-react';
import { Button } from '../ui/Button';
import type { QuizQuestion, QuizOption } from '../../lib/missionTypes';
import { XP_REWARDS } from '../../lib/xp';

export default function QuizStep({
  questions,
  onComplete,
  onXpEarn,
}: {
  questions: QuizQuestion[];
  onComplete: (stats: { correct: number; total: number; xp: number }) => void;
  onXpEarn?: (amount: number, reason: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuizOption | ''>>({});
  const [correctCount, setCorrectCount] = useState(0);
  const [quizXp, setQuizXp] = useState(0);

  const question = questions[index];
  const answered = !!answers[question.id];
  const selected = answers[question.id];
  const isLast = index === questions.length - 1;
  const isCorrect = selected === question.correctAnswer;

  const handleAnswer = (option: QuizOption) => {
    if (answered) return;
    const correct = option === question.correctAnswer;
    const reward = correct ? XP_REWARDS.correctAnswer : XP_REWARDS.wrongAnswer;
    setAnswers((prev) => ({ ...prev, [question.id]: option }));
    if (correct) setCorrectCount((c) => c + 1);
    setQuizXp((x) => x + reward);
    onXpEarn?.(reward, correct ? 'Верен отговор' : 'Опит');
  };

  const handleNext = () => {
    if (isLast) {
      onComplete({ correct: correctCount, total: questions.length, xp: quizXp });
    } else {
      setIndex((i) => i + 1);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-2.5">
          <PenTool size={20} className="text-[var(--accent)]" />
          <h2 className="text-[20px] font-semibold text-[var(--ink-900)]">Тест</h2>
        </div>
        <span className="text-[14px] font-medium text-[var(--text-secondary)]">
          Въпрос {index + 1} от {questions.length}
        </span>
      </div>

      <p className="text-[20px] sm:text-[22px] font-semibold text-[var(--ink-900)] mb-8 leading-snug">
        {index + 1}. {question.question}
      </p>

      <div className="grid gap-3.5 mb-7">
        {(['A', 'B', 'C', 'D'] as QuizOption[]).map((key) => {
          const isSelected = selected === key;
          const isCorrectOption = key === question.correctAnswer;
          const showAnswer = answered;
          let btnClass = 'border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-soft)]';
          if (showAnswer) {
            if (isCorrectOption) btnClass = 'border border-[var(--green)] bg-[var(--green-light)] text-[var(--green-text)]';
            else if (isSelected) btnClass = 'border border-[var(--rose)] bg-[var(--rose-light)] text-[var(--rose-text)]';
            else btnClass = 'border border-[var(--border)] opacity-60';
          } else if (isSelected) {
            btnClass = 'border border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent-text)]';
          }

          return (
            <button
              key={key}
              onClick={() => handleAnswer(key)}
              disabled={answered}
              className={`w-full text-left px-6 py-4.5 rounded-2xl text-[16px] transition-all ${btnClass}`}
            >
              <span className="font-bold mr-2">{key}.</span>
              {question.options[key]}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl p-5 mb-7 border"
            style={{
              backgroundColor: isCorrect ? 'var(--green-light)' : 'var(--rose-light)',
              borderColor: isCorrect ? 'var(--green)' : 'var(--rose)',
            }}
          >
            <div className="flex items-center gap-2.5 mb-2">
              {isCorrect ? (
                <CheckCircle2 size={20} className="text-[var(--green)]" />
              ) : (
                <XCircle size={20} className="text-[var(--rose)]" />
              )}
              <p className="text-[15px] font-semibold text-[var(--ink-900)]">
                {isCorrect ? 'Вярно — добре помисли.' : 'Не точно — ето защо.'}
              </p>
            </div>
            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed mb-2">{question.explanation}</p>
            {question.whyItMatters && (
              <p className="text-[13px] text-[var(--accent)] leading-relaxed">
                <span className="font-semibold">Защо има значение:</span> {question.whyItMatters}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {answered && (
        <div className="flex justify-end">
          <Button variant="primary" size="md" onClick={handleNext}>
            {isLast ? 'Продължи' : 'Следващ въпрос'}
          </Button>
        </div>
      )}
    </div>
  );
}
