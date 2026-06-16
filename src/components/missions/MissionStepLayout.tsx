import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

export default function MissionStepLayout({
  step,
  totalSteps,
  steps,
  children,
  onBack,
  onContinue,
  continueLabel = 'Продължи',
  continueDisabled = false,
  hideBack = false,
  hideContinue = false,
}: {
  step: number;
  totalSteps: number;
  steps: { id: string; label: string }[];
  children: React.ReactNode;
  onBack?: () => void;
  onContinue?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  hideBack?: boolean;
  hideContinue?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="max-w-3xl mx-auto"
    >
      {/* Progress header */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[14px] font-medium text-[var(--text-secondary)]">
            Стъпка {step + 1} от {totalSteps}
          </p>
          <p className="text-[14px] font-semibold text-[var(--accent)]">{steps[step]?.label}</p>
        </div>
        <div className="w-full h-2 bg-[var(--ink-100)] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.4 }}
            className="h-full rounded-full bg-[var(--accent)]"
          />
        </div>
      </div>

      {/* Content card */}
      <div className="premium-card p-7 sm:p-9 mb-7">
        {children}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        {!hideBack && onBack ? (
          <Button variant="secondary" onClick={onBack}>
            <ArrowLeft size={18} /> Назад
          </Button>
        ) : (
          <div />
        )}
        {!hideContinue && onContinue && (
          <Button variant="primary" onClick={onContinue} disabled={continueDisabled}>
            {continueLabel}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
