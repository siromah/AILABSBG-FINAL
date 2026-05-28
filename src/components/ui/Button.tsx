import React from 'react';

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type BtnSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: BtnSize;
  isLoading?: boolean;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  className = '', 
  children,
  disabled,
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all rounded-full gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] active:scale-[0.98]';
  
  const sizeClasses = {
    sm: 'h-8 px-4 text-[13px]',
    md: 'h-10 px-5 text-[14px]',
    lg: 'h-12 px-7 text-[15px]'
  };

  const variantClasses = {
    primary: 'bg-[var(--ink-900)] text-white hover:bg-[var(--ink-700)] border-none shadow-sm',
    secondary: 'bg-[var(--surface-strong)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--bg-soft)] shadow-xs',
    ghost: 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-soft)] border-none',
    danger: 'bg-[var(--rose-light)] text-[var(--rose)] border border-[var(--rose)]/20 hover:bg-[var(--rose)]/10'
  };

  const disabledClasses = (disabled || isLoading) ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-[1px]';

  return (
    <button 
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : children}
    </button>
  );
}
