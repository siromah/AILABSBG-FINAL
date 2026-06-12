import React from 'react';

type BadgeVariant = 'default' | 'accent' | 'luxury' | 'success' | 'warning' | 'danger' | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  const baseClasses = 'inline-flex items-center justify-center text-[12px] px-2 py-0.5 rounded-sm font-medium';

  const variantClasses = {
    default: 'bg-ink-100 text-ink-500',
    accent: 'bg-accent-light text-accent-text',
    luxury: 'bg-green-light text-green-text',
    success: 'bg-emerald-light text-emerald-text',
    warning: 'bg-amber-light text-amber-text',
    danger: 'bg-rose-light text-rose-text',
    outline: 'bg-transparent text-text-secondary border border-border'
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
