import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`relative overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface-strong)] px-8 py-14 md:py-16 ${className}`}>
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-[var(--amber)]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-[var(--accent)]/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        {icon && (
          <div className="mb-4 text-[var(--text-tertiary)] opacity-50">
            {icon}
          </div>
        )}
        <h3 className="text-[18px] md:text-[20px] font-medium text-[var(--ink-900)] mb-1.5 tracking-tight">{title}</h3>
        <p className="text-[13px] text-[var(--text-secondary)] max-w-sm mb-6 leading-relaxed">{description}</p>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
