import type { Plan } from '../lib/access';

interface PlanBadgeProps {
  plan: Plan;
  className?: string;
}

const planStyles: Record<Plan, string> = {
  free: 'bg-[var(--ink-100)] border-[var(--ink-200)] text-[var(--ink-500)]',
  pro: 'bg-[var(--accent-light)] border-[var(--accent)]/20 text-[var(--accent-text)]',
  premium: 'bg-[#f3eefc] border-[#8b5cf6]/20 text-[#6d28d9] dark:bg-[#1e1c2e] dark:border-[#8b5cf6]/20 dark:text-[#b7a7ff]',
};

export function PlanBadge({ plan, className = '' }: PlanBadgeProps) {
  const label = plan === 'free' ? 'Free' : plan === 'pro' ? 'Pro' : 'Premium';

  return (
    <span
      className={`inline-flex items-center justify-center text-[12px] px-2 py-0.5 rounded-sm font-medium border ${planStyles[plan]} ${className}`}
    >
      {label}
    </span>
  );
}
