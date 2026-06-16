import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

export default function QuickPracticeCard({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="w-full text-left premium-card p-4 flex items-center gap-4 transition-colors hover:border-[var(--border-strong)]"
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[var(--bg-soft)] text-[var(--text-secondary)]">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[15px] font-semibold text-[var(--ink-900)] truncate">{title}</h4>
        <p className="text-[13px] text-[var(--text-secondary)] truncate">{subtitle}</p>
      </div>
      <ChevronRight size={18} className="text-[var(--text-tertiary)] shrink-0" />
    </motion.button>
  );
}
