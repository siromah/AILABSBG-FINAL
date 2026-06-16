import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link, useSearchParams } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Target, Zap, BookOpen, Lightbulb, CheckCircle2, XCircle, CheckCircle, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import MissionStepLayout from '../components/missions/MissionStepLayout';
import QuizStep from '../components/missions/QuizStep';
import PracticalTaskStep from '../components/missions/PracticalTaskStep';
import { getMissionQuizQuestions } from '../lib/quizBank';
import ResultScreen from '../components/missions/ResultScreen';
import AITutor from '../components/missions/AITutor';
import AITutorPanel from '../components/missions/AITutorPanel';
import { getMissionById, getModuleForMission } from '../lib/missionsData';
import {
  isMissionUnlocked,
  getNextMissionId,
} from '../lib/missions';
import { useMissionProgress } from '../hooks/useMissionProgress';
import { XP_REWARDS } from '../lib/xp';

const steps = [
  { id: 'learn', label: 'Научи' },
  { id: 'example', label: 'Пример' },
  { id: 'test', label: 'Тест' },
  { id: 'task', label: 'Задача' },
  { id: 'result', label: 'Резултат' },
];

const stepIndexById: Record<string, number> = Object.fromEntries(steps.map((s, i) => [s.id, i]));

export default function MissionDetail({ showToast }: { showToast: (msg: string, isError?: boolean) => void }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { progress, xp, loading: progressLoading, completeMission, addMissionXP } = useMissionProgress();

  const mission = useMemo(() => (id ? getMissionById(id) : null), [id]);
  const module = useMemo(() => (mission ? getModuleForMission(mission.id) : null), [mission]);
  const isUnlocked = useMemo(() => (mission ? isMissionUnlocked(mission.id, progress) : false), [mission, progress]);
  const quizQuestions = useMemo(
    () => (mission ? getMissionQuizQuestions(mission, mission.quiz.length) : []),
    [mission]
  );

  const [step, setStep] = useState(0);

  const [testCorrect, setTestCorrect] = useState(0);
  const [testTotal, setTestTotal] = useState(0);
  const [gainedXp, setGainedXp] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [xpBefore, setXpBefore] = useState(0);

  useEffect(() => {
    if (mission) {
      const startStepId = searchParams.get('step');
      const startStep = startStepId && stepIndexById[startStepId] !== undefined ? stepIndexById[startStepId] : 0;
      setStep(startStep);
      setTestCorrect(0);
      setTestTotal(0);
      setGainedXp(0);
      setCompleted(false);
      setXpBefore(xp);
    }
  }, [mission?.id, searchParams]);

  useDocumentTitle(mission ? mission.title : 'Мисия');

  const handleXpEarn = async (amount: number, reason: string) => {
    await addMissionXP(amount);
    setGainedXp((x) => x + amount);
    showToast(`${reason}: +${amount} XP`);
  };

  const handleQuizComplete = async (stats: { correct: number; total: number; xp: number }) => {
    setTestCorrect(stats.correct);
    setTestTotal(stats.total);
    // XP already awarded during quiz via handleXpEarn
    if (stats.correct === stats.total && stats.total > 0) {
      await handleXpEarn(XP_REWARDS.perfectMission, 'Перфектна мисия');
    }
    setStep(steps.findIndex((s) => s.id === 'task'));
  };

  const handleTaskComplete = async () => {
    await handleXpEarn(XP_REWARDS.practicalTaskCompleted, 'Практична задача');
    setStep(steps.findIndex((s) => s.id === 'result'));
  };

  const handleCompleteMission = async () => {
    if (!mission || completed) return;
    if (!isAlreadyCompleted) {
      await completeMission(mission.id);
      const missionXp = XP_REWARDS.missionCompleted;
      await addMissionXP(missionXp);
      setGainedXp((x) => x + missionXp);
      showToast(`Мисията е завършена! +${missionXp} XP`);
    }
    setCompleted(true);
  };

  const handleNextMission = () => {
    if (!mission) return;
    const nextId = getNextMissionId(mission.id);
    navigate(nextId ? `/missions/${nextId}` : '/missions');
  };

  const handleHome = () => {
    navigate('/missions');
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleContinue = () => {
    if (step < steps.length - 1) setStep((s) => s + 1);
  };

  if (progressLoading) {
    return (
      <div className="min-h-screen text-[var(--text-primary)] pb-24 flex items-center justify-center">
        <div className="text-[15px] text-[var(--text-secondary)]">Зареждане на прогреса...</div>
      </div>
    );
  }

  if (!mission || !module) {
    return (
      <div className="min-h-screen text-[var(--text-primary)] pb-24">
        <div className="section-shell py-20 text-center">
          <div className="premium-card p-10 max-w-md mx-auto">
            <h1 className="text-[20px] font-semibold text-[var(--ink-900)] mb-3">Мисията не е намерена</h1>
            <p className="text-[14px] text-[var(--text-secondary)] mb-6">Провери дали ID-то е правилно или се върни към мисиите.</p>
            <Button variant="primary" onClick={() => navigate('/missions')}>
              <ArrowLeft size={16} /> Обратно към мисиите
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen text-[var(--text-primary)] pb-24">
        <div className="section-shell py-20 text-center">
          <div className="premium-card p-10 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-[var(--rose-light)] text-[var(--rose)] flex items-center justify-center mx-auto mb-4">
              <XCircle size={28} />
            </div>
            <h1 className="text-[20px] font-semibold text-[var(--ink-900)] mb-3">Мисията е заключена</h1>
            <p className="text-[14px] text-[var(--text-secondary)] mb-6">Завърши предишните мисии, за да отключиш тази.</p>
            <Button variant="primary" onClick={() => navigate('/missions')}>
              <ArrowLeft size={16} /> Обратно към мисиите
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isAlreadyCompleted = !!progress[mission.id];
  const nextMissionId = getNextMissionId(mission.id);

  const renderStepContent = () => {
    switch (steps[step].id) {
      case 'learn':
        return (
          <MissionStepLayout
            step={step}
            totalSteps={steps.length}
            steps={steps}
            onContinue={handleContinue}
            hideBack
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={18} className="text-[var(--accent)]" />
              <h2 className="text-[18px] font-semibold text-[var(--ink-900)]">{mission.title}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="text-[12px] px-2.5 py-1 rounded-full bg-[var(--bg-soft)] text-[var(--text-secondary)]">
                {module.title}
              </span>
              <span className="text-[12px] px-2.5 py-1 rounded-full bg-[var(--accent-light)] text-[var(--accent-text)]">
                <Zap size={11} className="inline mr-1" />+{mission.xpReward} XP
              </span>
              <span className="text-[12px] px-2.5 py-1 rounded-full bg-[var(--green-light)] text-[var(--green-text)]">
                {mission.duration}
              </span>
            </div>
            <div className="text-[15px] sm:text-[16px] leading-relaxed text-[var(--text-primary)] whitespace-pre-line">
              {mission.shortLesson}
            </div>
          </MissionStepLayout>
        );

      case 'example':
        return (
          <MissionStepLayout
            step={step}
            totalSteps={steps.length}
            steps={steps}
            onBack={handleBack}
            onContinue={handleContinue}
          >
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={18} className="text-[var(--accent)]" />
              <h2 className="text-[18px] font-semibold text-[var(--ink-900)]">Реален пример</h2>
            </div>
            <div className="grid gap-4">
              {mission.badExample && (
                <div className="rounded-xl p-5 bg-[var(--rose-light)] border-l-4 border-[var(--rose)]">
                  <div className="flex items-center gap-2 mb-2">
                    <X size={16} className="text-[var(--rose)]" />
                    <h3 className="text-[15px] font-semibold text-[var(--ink-900)]">Слаб пример</h3>
                  </div>
                  <p className="text-[14px] text-[var(--text-secondary)] whitespace-pre-wrap">{mission.badExample}</p>
                </div>
              )}
              {mission.goodExample && (
                <div className="rounded-xl p-5 bg-[var(--green-light)] border-l-4 border-[var(--green)]">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={16} className="text-[var(--green)]" />
                    <h3 className="text-[15px] font-semibold text-[var(--ink-900)]">Добър пример</h3>
                  </div>
                  <p className="text-[14px] text-[var(--text-secondary)] whitespace-pre-wrap">{mission.goodExample}</p>
                </div>
              )}
            </div>
            <p className="mt-4 text-[14px] text-[var(--text-secondary)]">
              Забележи разликата: добрият пример е конкретен и дава контекст.
            </p>
          </MissionStepLayout>
        );

      case 'test':
        return (
          <MissionStepLayout
            step={step}
            totalSteps={steps.length}
            steps={steps}
            onBack={handleBack}
            hideContinue
          >
            <QuizStep
              questions={quizQuestions}
              onComplete={handleQuizComplete}
              onXpEarn={handleXpEarn}
            />
          </MissionStepLayout>
        );

      case 'task':
        return (
          <MissionStepLayout
            step={step}
            totalSteps={steps.length}
            steps={steps}
            onBack={handleBack}
            hideContinue
          >
            <PracticalTaskStep
              task={mission.practicalTask}
              missionTitle={mission.title}
              onComplete={handleTaskComplete}
            />
          </MissionStepLayout>
        );

      case 'result':
        return (
          <ResultScreen
            xpBefore={xpBefore}
            gainedXp={gainedXp}
            quizCorrect={testCorrect}
            quizTotal={testTotal}
            completedMissions={Object.values(progress).filter(Boolean).length}
            isCompleted={completed || isAlreadyCompleted}
            onComplete={handleCompleteMission}
            onNext={handleNextMission}
            onHome={handleHome}
            hasNext={!!nextMissionId}
            recap={mission.recap}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)] pb-24">
      <div className="section-shell py-6 md:py-10">
        {/* Breadcrumb */}
        <div className="mb-4 md:mb-6">
          <Link to="/missions" className="inline-flex items-center gap-1 text-[13px] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
            <ArrowLeft size={14} /> Мисии
          </Link>
        </div>

        {/* Mission title card */}
        <div className="premium-card p-5 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target size={14} className="text-[var(--accent)]" />
                <span className="label-caps">{module.title}</span>
              </div>
              <h1 className="text-[20px] md:text-[24px] font-semibold text-[var(--ink-900)]">{mission.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              {isAlreadyCompleted && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-medium bg-[var(--green-light)] text-[var(--green-text)]">
                  <CheckCircle2 size={12} /> Завършена
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-medium bg-[var(--accent-light)] text-[var(--accent-text)]">
                <Zap size={12} /> +{mission.xpReward} XP
              </span>
            </div>
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div key={step}>{renderStepContent()}</motion.div>
        </AnimatePresence>

        {/* Inline AI Tutor */}
        <AITutorPanel missionTitle={mission.title} />
      </div>

      <AITutor currentLessonTitle={mission.title} />
    </div>
  );
}
