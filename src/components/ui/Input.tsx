import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, className = '', ...props }, ref) => {
    const errorClasses = error 
      ? 'border-rose focus:border-rose focus:shadow-[0_0_0_3px_var(--color-rose-light)]' 
      : 'border-border focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-light)]';

    return (
      <div className="flex flex-col w-full">
        {label && (
          <label className="text-[13px] font-medium text-text-primary mb-1.5" htmlFor={props.id}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`h-10 px-3 border rounded-md text-[14px] bg-[var(--bg-soft)] transition-all outline-none ${errorClasses} disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-bg-subtle ${className}`}
          {...props}
        />
        {error && <span className="text-[12px] text-rose mt-1">{error}</span>}
        {!error && helperText && <span className="text-[12px] text-text-tertiary mt-1">{helperText}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, className = '', ...props }, ref) => {
    const errorClasses = error 
      ? 'border-rose focus:border-rose focus:shadow-[0_0_0_3px_var(--color-rose-light)]' 
      : 'border-border focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-light)]';

    return (
      <div className="flex flex-col w-full">
        {label && (
          <label className="text-[13px] font-medium text-text-primary mb-1.5" htmlFor={props.id}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`px-3 py-2 border rounded-md text-[14px] bg-[var(--bg-soft)] transition-all outline-none min-h-[80px] resize-y ${errorClasses} disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-bg-subtle ${className}`}
          {...props}
        />
        {error && <span className="text-[12px] text-rose mt-1">{error}</span>}
        {!error && helperText && <span className="text-[12px] text-text-tertiary mt-1">{helperText}</span>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, className = '', children, ...props }, ref) => {
    const errorClasses = error 
      ? 'border-rose focus:border-rose focus:shadow-[0_0_0_3px_var(--color-rose-light)]' 
      : 'border-border focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-light)]';

    return (
      <div className="flex flex-col w-full">
        {label && (
          <label className="text-[13px] font-medium text-text-primary mb-1.5" htmlFor={props.id}>
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full h-10 pl-3 pr-10 border rounded-md text-[14px] bg-[var(--bg-soft)] transition-all outline-none appearance-none ${errorClasses} disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-bg-subtle ${className}`}
            {...props}
          >
            {children}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-text-tertiary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
        {error && <span className="text-[12px] text-rose mt-1">{error}</span>}
        {!error && helperText && <span className="text-[12px] text-text-tertiary mt-1">{helperText}</span>}
      </div>
    );
  }
);
Select.displayName = 'Select';
