import { motion } from 'motion/react';
import { Target, Clock, Zap, ChevronRight, PartyPopper } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Mission } from '../../lib/missionTypes';

export default function TodayMissionCard({
  mission,
  allCompleted,
  onStart,
}: {
  mission: Mission | null;
  allCompleted: boolean;
  onStart: () => void;
}) {
  if (allCompleted || !mission) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card p-8 sm:p-10 text-center bg-[var(--green-light)]/40"
      >
        <div className="w-16 h-16 rounded-2xl bg-[var(--green-light)] text-[var(--green)] flex items-center justify-center mx-auto mb-4">
          <PartyPopper size={32} />
        </div>
        <h2 className="text-[22px] font-semibold text-[var(--ink-900)] mb-2">Браво — завърши всички мисии! 🎉</h2>
        <p className="text-[15px] text-[var(--text-secondary)] max-w-md mx-auto">
          Прегледай пак материала или изчакай нови предизвикателства. Дотогава — продължавай да практикуваш.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card p-6 sm:p-8 bg-gradient-to-br from-[var(--accent-light)]/40 via-[var(--surface-strong)] to-[var(--bg-soft)] border-[var(--accent)]/20"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl bg-[var(--accent)] text-white flex items-center justify-center">
          <Target size={18} />
        </div>
        <span className="label-caps text-[var(--accent)]">Днешна мисия</span>
      </div>

      <h2 className="text-[24px] sm:text-[30px] font-semibold text-[var(--ink-900)] mb-3 tracking-tight">
        {mission.title}
      </h2>
      <p className="text-[16px] sm:text-[17px] text-[var(--text-secondary)] mb-6 max-w-xl leading-relaxed">
        {mission.description}
      </p>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium bg-white border border-[var(--border)] text-[var(--text-secondary)]">
          <Clock size={14} /> {mission.duration}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium bg-[var(--accent-light)] text-[var(--accent-text)]">
          <Zap size={14} /> +{mission.xpReward} XP
        </span>
      </div>

      <Button variant="primary" size="lg" onClick={onStart} className="w-full sm:w-auto">
        Започни мисията <ChevronRight size={18} />
      </Button>
    </motion.div>
  );
}
