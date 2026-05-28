import { Lock } from 'lucide-react';
import { Button } from './ui/Button';

interface LockedOverlayProps {
  title?: string;
  description?: string;
  ctaText?: string;
  onUpgrade?: () => void;
  className?: string;
}

export function LockedOverlay({
  title = 'Съдържанието е част от Pro',
  description = 'Това съдържание е включено в Pro плана.',
  ctaText = 'Виж Pro плановете',
  onUpgrade,
  className = '',
}: LockedOverlayProps) {
  return (
    <div
      className={`absolute inset-0 z-10 flex items-center justify-center rounded-[var(--r-xl)] backdrop-blur-sm bg-[var(--bg)]/60 ${className}`}
    >
      <div className="flex flex-col items-center text-center max-w-xs px-6 py-8 bg-[var(--surface-strong)] border border-[var(--border)] rounded-[var(--r-lg)] shadow-md">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--ink-100)] mb-4">
          <Lock size={32} className="text-[var(--text-tertiary)]" strokeWidth={1.5} />
        </div>
        <h3 className="text-[16px] font-semibold text-[var(--text-primary)] mb-1">
          {title}
        </h3>
        <p className="text-[13px] text-[var(--text-secondary)] mb-5 leading-relaxed">
          {description}
        </p>
        {onUpgrade && (
          <Button variant="primary" size="md" onClick={onUpgrade}>
            {ctaText}
          </Button>
        )}
      </div>
    </div>
  );
}
