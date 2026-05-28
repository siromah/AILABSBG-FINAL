import React from 'react';

export function Card({ className = '', children, hover = false, glass = false, ...props }: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean; glass?: boolean }) {
  const baseClasses = glass
    ? 'glass-card rounded-[28px]'
    : 'premium-card';
  const hoverClasses = hover ? 'cursor-pointer' : '';
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-6 pt-6 pb-0 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-6 pb-6 pt-0 border-t border-[var(--border)] mt-auto ${className}`} {...props}>
      {children}
    </div>
  );
}
