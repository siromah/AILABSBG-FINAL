import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Brain, CheckCircle2, XCircle, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { FLASHCARDS } from '../../data';
import { addMissionXP, rewardFlashcardReview, getFlashcardState, setFlashcardState } from '../../lib/missions';

export default function FlashcardDeck({ onXPEarn }: { onXPEarn?: (amount: number) => void }) {
  const [state, setState] = useState(() => getFlashcardState());
  const [flipped, setFlipped] = useState(false);
  const [justAnswered, setJustAnswered] = useState(false);

  const remaining = useMemo(
    () => FLASHCARDS.filter(c => !state[c.id] || state[c.id] === 'again').sort(() => Math.random() - 0.5),
    [state]
  );
  const learned = FLASHCARDS.filter(c => state[c.id] && state[c.id] !== 'again');

  const current = remaining[0];

  const handleRate = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!current) return;
    const next = { ...state, [current.id]: rating };
    setState(next);
    setFlashcardState(next);
    setFlipped(false);
    setJustAnswered(true);
    setTimeout(() => setJustAnswered(false), 400);

    if (rating !== 'again') {
      const xp = rewardFlashcardReview();
      addMissionXP(xp);
      onXPEarn?.(xp);
    }
  };

  const handleReset = () => {
    setState({});
    setFlashcardState({});
    setFlipped(false);
  };

  return (
    <div className="premium-card p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-[var(--secondary)]" />
          <span className="label-caps">ФЛАШКАРТИ</span>
        </div>
        <div className="text-[13px] text-[var(--text-secondary)]">
          Научени: <span className="font-semibold text-[var(--green)]">{learned.length}</span> · Оставащи:{' '}
          <span className="font-semibold text-[var(--accent)]">{remaining.length}</span>
        </div>
      </div>

      {current ? (
        <>
          <div
            onClick={() => setFlipped(!flipped)}
            className="relative h-48 sm:h-56 cursor-pointer perspective-1000 group mb-5"
          >
            <AnimatePresence mode="wait">
              {!flipped ? (
                <motion.div
                  key="front"
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 flex items-center justify-center bg-[var(--bg-soft)] border border-[var(--border)] rounded-2xl p-6 text-center"
                >
                  <div>
                    <p className="text-[12px] text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Въпрос</p>
                    <p className="text-[20px] font-semibold text-[var(--ink-900)]">{current.front}</p>
                    <p className="text-[12px] text-[var(--text-tertiary)] mt-4 flex items-center justify-center gap-1">
                      <RotateCcw size={12} /> Кликни, за да обърнеш
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="back"
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 flex items-center justify-center bg-[var(--secondary-light)] border border-[var(--secondary)]/20 rounded-2xl p-6 text-center"
                >
                  <div>
                    <p className="text-[12px] text-[var(--secondary-text)] uppercase tracking-wider mb-3">Отговор</p>
                    <p className="text-[18px] font-medium text-[var(--ink-900)]">{current.back}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <Button variant="danger" size="sm" onClick={() => handleRate('again')}>
              <XCircle size={14} /> Не знам
            </Button>
            <Button variant="secondary" size="sm" onClick={() => handleRate('hard')}>
              Трудно
            </Button>
            <Button variant="primary" size="sm" onClick={() => handleRate('good')}>
              <CheckCircle2 size={14} /> Знам
            </Button>
          </div>
          <div className="mt-3 flex justify-center">
            <Button variant="ghost" size="sm" onClick={() => handleRate('easy')}>
              <Zap size={14} /> Лесно (+{rewardFlashcardReview()} XP)
            </Button>
          </div>

          <AnimatePresence>
            {justAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 text-center text-[13px] text-[var(--green)] font-medium"
              >
                +{rewardFlashcardReview()} XP
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <div className="text-center py-10">
          <div className="w-14 h-14 rounded-full bg-[var(--green-light)] text-[var(--green)] flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={28} />
          </div>
          <h4 className="text-[18px] font-semibold text-[var(--ink-900)] mb-1">Всички флашкарти са научени!</h4>
          <p className="text-[13px] text-[var(--text-secondary)] mb-4">Рестартирай, за да ги преговориш отново.</p>
          <Button variant="secondary" size="sm" onClick={handleReset}>
            <RotateCcw size={14} /> Започни отначало
          </Button>
        </div>
      )}
    </div>
  );
}
