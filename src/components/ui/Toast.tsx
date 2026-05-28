import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string | number;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onDismiss: (id: string | number) => void;
}

export function Toast({ id, message, variant = 'info', duration = 4000, onDismiss }: ToastProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => onDismiss(id), 300); // 300ms for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onDismiss]);

  const variantStyles = {
    success: 'bg-[var(--surface-strong)] border-emerald/20 text-emerald-text shadow-sm',
    error: 'bg-[var(--surface-strong)] border-rose/20 text-rose-text shadow-sm',
    info: 'bg-[var(--surface-strong)] border-accent/20 text-accent-text shadow-sm',
    warning: 'bg-[var(--surface-strong)] border-amber/20 text-amber-text shadow-sm'
  };

  const progressColors = {
    success: 'bg-emerald',
    error: 'bg-rose',
    info: 'bg-accent',
    warning: 'bg-amber'
  };

  const iconColors = {
    success: 'text-emerald',
    error: 'text-rose',
    info: 'text-accent',
    warning: 'text-amber'
  };

  const renderIcon = () => {
    switch (variant) {
      case 'success': return <CheckCircle size={20} className={iconColors[variant]} />;
      case 'error': return <XCircle size={20} className={iconColors[variant]} />;
      case 'warning': return <AlertTriangle size={20} className={iconColors[variant]} />;
      case 'info': return <Info size={20} className={iconColors[variant]} />;
    }
  };

  return (
    <div 
      className={`relative flex items-start gap-3 w-full max-w-[360px] p-4 rounded-lg border overflow-hidden ${variantStyles[variant]} transition-all duration-300 pointer-events-auto ${isClosing ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0 animate-[slideUp_0.3s_ease-out]'}`}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">
        {renderIcon()}
      </div>
      <div className="flex-1 text-[14px] font-medium leading-relaxed pr-2">
        {message}
      </div>
      <button 
        onClick={() => {
          setIsClosing(true);
          setTimeout(() => onDismiss(id), 300);
        }}
        className="flex-shrink-0 text-text-tertiary hover:text-text-primary transition-colors opacity-70 hover:opacity-100 mt-0.5"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-ink-100 opacity-50">
        <div 
          className={`h-full ${progressColors[variant]}`}
          style={{ 
            animation: `shrink ${duration}ms linear forwards` 
          }}
        />
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
