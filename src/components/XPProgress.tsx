import { ProgressBar } from './ui/ProgressBar';
import { getXP, getLevelFromXP, getXPForNextLevel, getLevelName } from '../lib/progress';

interface XPProgressProps {
  xp?: number;
  className?: string;
}

export function XPProgress({ xp, className = '' }: XPProgressProps) {
  const currentXP = xp ?? getXP();
  const level = getLevelFromXP(currentXP);
  const levelName = getLevelName(level);
  const { next, progress } = getXPForNextLevel(currentXP);

  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      <div className="flex justify-between items-center text-[13px]">
        <span className="font-semibold text-[var(--text-primary)]">{levelName}</span>
        <span className="text-[var(--text-secondary)]">
          {currentXP} / {next} XP
        </span>
      </div>
      <ProgressBar value={progress} />
    </div>
  );
}
