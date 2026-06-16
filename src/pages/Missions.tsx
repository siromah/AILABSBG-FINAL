import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { motion } from 'motion/react';
import { HelpCircle, PenTool, RotateCcw } from 'lucide-react';
import MissionHeader from '../components/missions/MissionHeader';
import TodayMissionCard from '../components/missions/TodayMissionCard';
import LearningPathCard from '../components/missions/LearningPathCard';
import QuickPracticeCard from '../components/missions/QuickPracticeCard';
import ProgressSummary from '../components/missions/ProgressSummary';
import AITutor from '../components/missions/AITutor';
import { useMissionProgress } from '../hooks/useMissionProgress';
import {
  MISSION_MODULES,
  updateMissionStreak,
  getOverallStats,
  isMissionUnlocked,
} from '../lib/missions';

export default function Missions({ showToast }: { showToast: (msg: string, isError?: boolean) => void }) {
  useDocumentTitle('Мисии');
  const navigate = useNavigate();
  const { progress, xp, streak, badges, loading, setXp, setStreak, resetAll } = useMissionProgress();

  useEffect(() => {
    const result = updateMissionStreak();
    if (result.changed) {
      setStreak(result.data);
      if (result.reward > 0) {
        setXp(xp + result.reward);
        showToast(`🔥 Бонус за стрийк: +${result.reward} XP`);
      }
    }
  }, []);

  const overall = useMemo(() => getOverallStats(progress), [progress]);

  const allMissions = useMemo(
    () => MISSION_MODULES.flatMap((m) => m.missions).sort((a, b) => a.order - b.order),
    []
  );

  const todayMission = useMemo(() => {
    const next = allMissions.find((m) => !progress[m.id] && isMissionUnlocked(m.id, progress));
    if (next) return next;
    const first = allMissions[0];
    return first || null;
  }, [allMissions, progress]);

  const lastLessonTitle = useMemo(() => {
    const completed = allMissions.filter((m) => progress[m.id]);
    if (completed.length === 0) return null;
    return completed.sort((a, b) => b.order - a.order)[0].title;
  }, [allMissions, progress]);

  const allCompleted = useMemo(() => allMissions.length > 0 && allMissions.every((m) => progress[m.id]), [allMissions, progress]);

  const getFirstUnlockedInModule = (moduleId: string) => {
    const mod = MISSION_MODULES.find((m) => m.id === moduleId);
    if (!mod) return null;
    const next = mod.missions.find((m) => !progress[m.id] && isMissionUnlocked(m.id, progress));
    return next || mod.missions[0] || null;
  };

  const handleStartMission = (missionId: string | null) => {
    if (!missionId) return;
    navigate(`/missions/${missionId}`);
  };

  const handleQuickPractice = (step: 'quiz' | 'task') => {
    if (!todayMission) return;
    navigate(`/missions/${todayMission.id}?step=${step}`);
  };

  const handleReset = () => {
    if (confirm('Сигурен ли си, че искаш да нулираш прогреса в Мисии?')) {
      resetAll();
      showToast('Прогресът е нулиран');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen text-[var(--text-primary)] pb-24 flex items-center justify-center">
        <div className="text-[15px] text-[var(--text-secondary)]">Зареждане на прогреса...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[var(--text-primary)] pb-24">
      <div className="section-shell py-10 md:py-14">
        {/* Block 1: Header */}
        <MissionHeader xp={xp} streak={streak} badges={badges} completedMissions={overall.completed} />

        {/* Block 2: Today's mission */}
        <section className="mb-8 md:mb-10">
          <TodayMissionCard
            mission={todayMission}
            allCompleted={allCompleted}
            onStart={() => handleStartMission(todayMission?.id ?? null)}
          />
        </section>

        {/* Block 3: Learning paths */}
        <section className="mb-8 md:mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-semibold text-[var(--ink-900)]">Пътеки за учене</h2>
            <p className="text-[13px] text-[var(--text-secondary)]">
              {overall.completed} / {overall.total} мисии
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {MISSION_MODULES.map((mod) => {
              const firstMission = getFirstUnlockedInModule(mod.id);
              return (
                <LearningPathCard
                  key={mod.id}
                  module={mod}
                  progress={progress}
                  onContinue={() => handleStartMission(firstMission?.id ?? null)}
                />
              );
            })}
          </div>
        </section>

        {/* Block 4: Quick practice */}
        <section className="mb-8 md:mb-10">
          <h2 className="text-[18px] font-semibold text-[var(--ink-900)] mb-4">Бърза практика</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <QuickPracticeCard
              icon={<HelpCircle size={20} />}
              title="5 въпроса"
              subtitle="Реши бърз тест"
              onClick={() => handleQuickPractice('quiz')}
            />
            <QuickPracticeCard
              icon={<PenTool size={20} />}
              title="Практична задача"
              subtitle="Пробвай на практика"
              onClick={() => handleQuickPractice('task')}
            />
          </div>
        </section>

        {/* Block 5: Progress summary */}
        <ProgressSummary
          completedMissions={overall.completed}
          totalMissions={overall.total}
          xp={xp}
          streak={streak.streak}
          lastLessonTitle={lastLessonTitle}
        />

        {/* Reset */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center pt-4"
        >
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-[12px] text-[var(--text-tertiary)] hover:text-[var(--rose)] py-2 transition-colors"
          >
            <RotateCcw size={12} /> Нулирай прогреса
          </button>
        </motion.div>
      </div>

      <AITutor currentLessonTitle={todayMission?.title || 'Мисии'} />
    </div>
  );
}
