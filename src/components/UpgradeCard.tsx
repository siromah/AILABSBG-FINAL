import { Lock } from 'lucide-react';
import { Button } from './ui/Button';

interface UpgradeCardProps {
  title?: string;
  description?: string;
  onUpgrade?: () => void;
  className?: string;
}

export function UpgradeCard({
  title = 'Отключи пълния достъп',
  description = 'Включено в Pro плана.',
  onUpgrade,
  className = '',
}: UpgradeCardProps) {
  return (
    <div
      className={`premium-card flex items-center gap-4 px-5 py-4 border-l-[3px] border-l-[var(--accent)] ${className}`}
    >
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--accent-light)] shrink-0">
        <Lock size={18} className="text-[var(--accent-text)]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[var(--text-primary)] leading-tight">
          {title}
        </p>
        <p className="text-[13px] text-[var(--text-secondary)] leading-tight mt-0.5">
          {description}
        </p>
      </div>
      {onUpgrade && (
        <Button variant="secondary" size="sm" onClick={onUpgrade}>
          Научи повече
        </Button>
      )}
    </div>
  );
}
