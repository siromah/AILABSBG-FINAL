import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, CheckCircle2, Circle, ChevronLeft, ChevronRight, Paperclip, X, Save, Lock } from 'lucide-react';
import { LESSONS_MODS } from '../data';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Input } from '../components/ui/Input';
import { getUserPlan, canAccessLesson } from '../lib/access';
import { getXP, addXP, setLessonDone, getLevelFromXP, getLevelName } from '../lib/progress';
import { XPProgress } from '../components/XPProgress';
import { LockedOverlay } from '../components/LockedOverlay';
import { UpgradeCard } from '../components/UpgradeCard';

function getVideoEmbedUrl(url: string): { type: 'youtube' | 'vimeo' | 'mp4' | 'unknown'; src: string } {
  if (!url) return { type: 'unknown', src: '' };
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return { type: 'youtube', src: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0` };
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return { type: 'vimeo', src: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) return { type: 'mp4', src: url };
  return { type: 'unknown', src: url };
}

export default function Lessons({ db, updateDb, showToast, currentUser, setPage }: any) {
  const allLessons = LESSONS_MODS.flatMap((m: any) => m.lessons);
  const [currentLesson, setCurrentLesson] = useState(allLessons[0]);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [attachUrl, setAttachUrl] = useState('');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [xp, setXp] = useState(getXP());

  const plan = getUserPlan(currentUser);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('ailabs_lessonNotes');
      if (raw) setNotes(JSON.parse(raw));
    } catch { /* silently ignore */ }
  }, []);

  useEffect(() => {
    localStorage.setItem('ailabs_lessonNotes', JSON.stringify(notes));
  }, [notes]);

  const prog = db.lessonProg || {};
  const total = allLessons.length;
  const doneCount = Object.values(prog).filter(Boolean).length;
  const isDone = prog[currentLesson.id];
  const isAccessible = canAccessLesson(currentLesson, plan);

  const currentModuleIdx = LESSONS_MODS.findIndex((m: any) => m.lessons.some((l: any) => l.id === currentLesson.id));
  const currentModule = LESSONS_MODS[currentModuleIdx];

  const idx = allLessons.findIndex((l: any) => l.id === currentLesson.id);
  const prev = idx > 0 ? allLessons[idx - 1] : null;
  const next = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;
  const nextAccessible = next ? canAccessLesson(next, plan) : true;

  const attachedVideos = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('ailabs_attachedVideos') || '{}');
    } catch { return {}; }
  }, [showAttachModal, currentLesson.id]);

  const currentVideo = attachedVideos[currentLesson.id] || '';
  const videoInfo = getVideoEmbedUrl(currentVideo);

  const markLesson = (id: string) => {
    if (!prog[id]) {
      const lesson = allLessons.find((l: any) => l.id === id);
      const xpAmount = lesson?.xp || 25;
      const newXP = addXP(xpAmount);
      setXp(newXP);
      const newProg = setLessonDone(id, true);
      updateDb('lessonProg', newProg);
      showToast(`+${xpAmount} XP — Урокът е завършен`);
    } else {
      const newProg = setLessonDone(id, false);
      updateDb('lessonProg', newProg);
      showToast('Маркиран като незавършен');
    }
  };

  const saveAttachedVideo = () => {
    if (!attachUrl.trim()) return;
    const existing = JSON.parse(localStorage.getItem('ailabs_attachedVideos') || '{}');
    existing[currentLesson.id] = attachUrl.trim();
    localStorage.setItem('ailabs_attachedVideos', JSON.stringify(existing));
    setAttachUrl('');
    setShowAttachModal(false);
    showToast('Видеото е прикачено');
  };

  const removeAttachedVideo = () => {
    const existing = JSON.parse(localStorage.getItem('ailabs_attachedVideos') || '{}');
    delete existing[currentLesson.id];
    localStorage.setItem('ailabs_attachedVideos', JSON.stringify(existing));
    setShowAttachModal(false);
    showToast('Видеото е премахнато');
  };

  const handleLessonClick = (lesson: any) => {
    setCurrentLesson(lesson);
  };

  const levelNum = getLevelFromXP(xp);
  const levelName = getLevelName(levelNum);

  return (
    <div className="min-h-screen text-[var(--text-primary)] grain">
      <div className="section-shell py-6 md:py-10">

        {/* PAGE HEADER */}
        <div className="mb-8 md:mb-10">
          <span className="label-caps mb-3 block">AI Академия</span>
          <h1 className="display-md text-[var(--ink-900)] mb-3">
            AI инженеринг за предприемачи
          </h1>
          <p className="text-[16px] text-[var(--text-secondary)] max-w-xl leading-relaxed">
            Научете се да автоматизирате workflows и да изграждате AI системи от нулата — с ясни стъпки и практически упражнения.
          </p>
        </div>

        {/* TOP BAR */}
        <div className="premium-card p-5 mb-8 flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-[var(--ink-900)]">{levelName}</div>
            <div className="text-[12px] text-[var(--text-secondary)] mt-0.5">
              Завършени {doneCount} от {total} урока
            </div>
          </div>
          <div className="w-full md:w-[280px]">
            <XPProgress xp={xp} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* SIDEBAR */}
          <div className="w-full lg:w-[320px] lg:sticky lg:top-[88px] flex flex-col gap-6 lg:h-[calc(100vh-120px)] lg:overflow-y-auto custom-scrollbar pr-1">

            {/* Progress Card */}
            <div className="premium-card p-5">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[13px] font-semibold text-[var(--ink-900)]">Прогрес</span>
                <span className="text-[12px] font-medium text-[var(--text-secondary)]">{doneCount} / {total}</span>
              </div>
              <ProgressBar value={Math.round((doneCount / total) * 100)} />
              <div className="text-[12px] text-[var(--text-tertiary)] mt-2">
                {doneCount === total ? 'Курсът е завършен. Отлична работа.' : 'Продължавайте, вървите добре.'}
              </div>
            </div>

            {/* Content Outline */}
            <div className="flex flex-col gap-6">
              {LESSONS_MODS.map((mod: any, mIdx: number) => (
                <div key={mod.title} className="flex flex-col">
                  <div className="flex items-baseline gap-2.5 mb-3">
                    <span className="text-[28px] font-medium text-[var(--ink-200)] leading-none">{String(mIdx + 1).padStart(2, '0')}</span>
                    <div>
                      <h4 className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Модул {mIdx + 1}</h4>
                      <div className="text-[15px] font-semibold text-[var(--ink-900)] mt-0.5">{mod.title}</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5 ml-1 border-l border-[var(--border)] pl-4">
                    {mod.lessons.map((l: any) => {
                      const done = prog[l.id];
                      const active = currentLesson.id === l.id;
                      const accessible = canAccessLesson(l, plan);
                      return (
                        <button
                          key={l.id}
                          onClick={() => handleLessonClick(l)}
                          className={`
                            group flex items-start gap-2.5 py-2.5 pr-2 rounded-xl text-left transition-colors
                            ${active ? 'bg-[var(--bg-soft)]' : 'hover:bg-[var(--bg-soft)]/50'}
                          `}
                        >
                          <div className="mt-0.5 shrink-0">
                            {done ? (
                              <CheckCircle2 size={16} className="text-[var(--emerald)]" />
                            ) : active ? (
                              <Circle size={16} className="text-[var(--accent)] fill-[var(--accent)]/20" />
                            ) : accessible ? (
                              <Play size={16} className="text-[var(--text-disabled)] group-hover:text-[var(--text-tertiary)]" />
                            ) : (
                              <Lock size={16} className="text-[var(--text-tertiary)]" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-[13px] font-medium leading-snug ${active ? 'text-[var(--ink-900)]' : 'text-[var(--text-secondary)]'}`}>
                              {l.title}
                            </div>
                            <div className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1 mt-0.5">
                              <Play size={8} /> {l.dur}
                              {!accessible && <span className="ml-1 text-[10px] uppercase tracking-wide">Pro</span>}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 w-full min-w-0 flex flex-col gap-6">

            {/* VIDEO PLAYER */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`video-${currentLesson.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="w-full aspect-video bg-[#111113] rounded-[24px] overflow-hidden relative shadow-lg border border-[var(--border)]"
              >
                {videoInfo.type === 'youtube' && (
                  <iframe
                    src={videoInfo.src}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Видео урок"
                  />
                )}
                {videoInfo.type === 'vimeo' && (
                  <iframe
                    src={videoInfo.src}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title="Видео урок"
                  />
                )}
                {videoInfo.type === 'mp4' && (
                  <video src={videoInfo.src} className="w-full h-full" controls />
                )}
                {videoInfo.type === 'unknown' && (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white gap-3">
                    <div className="w-14 h-14 rounded-full bg-white/8 flex items-center justify-center backdrop-blur-sm">
                      <Play size={24} className="fill-white ml-0.5 opacity-80" />
                    </div>
                    <div className="text-[13px] text-white/60">Няма прикачено видео</div>
                    <Button size="sm" variant="secondary" className="rounded-full bg-white/10 text-white border-white/10 hover:bg-white/20" onClick={() => setShowAttachModal(true)}>
                      <Paperclip size={13} /> Прикачи видео
                    </Button>
                  </div>
                )}

                {videoInfo.type !== 'unknown' && (
                  <div className="absolute top-3 right-3 z-10">
                    <Button size="sm" variant="secondary" className="bg-black/40 text-white border-white/8 hover:bg-black/60 rounded-full backdrop-blur-sm" onClick={() => setShowAttachModal(true)}>
                      <Paperclip size={13} /> Смени видео
                    </Button>
                  </div>
                )}

                {!isAccessible && (
                  <LockedOverlay
                    title="Този урок е заключен"
                    description="Включено в Pro плана. Отключи пълен достъп до всички уроци."
                    ctaText="Отключи с Pro"
                    onUpgrade={() => setPage('pricing')}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* LESSON CONTENT */}
            <div className="premium-card overflow-hidden">
              <div className="p-5 md:p-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-5 mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="rounded-full text-[10px] uppercase tracking-wider">Модул</Badge>
                      <Badge variant="outline" className="rounded-full text-[10px] uppercase tracking-wider">{currentLesson.dur}</Badge>
                    </div>
                    <h2 className="text-[22px] md:text-[28px] font-semibold text-[var(--ink-900)] tracking-tight leading-tight">
                      {currentLesson.h}
                    </h2>
                  </div>
                  {isAccessible && (
                    <Button
                      variant={isDone ? 'secondary' : 'primary'}
                      onClick={() => markLesson(currentLesson.id)}
                      className="shrink-0"
                    >
                      {isDone ? (
                        <><CheckCircle2 size={15} /> Завършен</>
                      ) : (
                        'Маркирай като завършен'
                      )}
                    </Button>
                  )}
                </div>

                {!isAccessible ? (
                  <div className="relative">
                    <div className="text-[15px] text-[var(--text-secondary)] leading-[1.75] space-y-5">
                      <p>{currentLesson.p1}</p>
                      <p>{currentLesson.p2}</p>
                      <p>{currentLesson.p3}</p>
                    </div>
                    <div className="absolute inset-0 top-auto h-[60%] bg-gradient-to-t from-[var(--surface-strong)] to-transparent pointer-events-none" />
                    <div className="relative z-10 flex justify-center pt-4 pb-2">
                      <UpgradeCard
                        title="Отключи пълния урок"
                        description="Включено в Pro плана. Получи достъп до всички уроци и материали."
                        onUpgrade={() => setPage('pricing')}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-[15px] text-[var(--text-secondary)] leading-[1.75] space-y-5">
                    <p>{currentLesson.p1}</p>
                    <p>{currentLesson.p2}</p>
                    <p>{currentLesson.p3}</p>
                  </div>
                )}

                {/* NOTES */}
                {isAccessible && (
                  <div className="mt-10 pt-6 border-t border-[var(--border)]">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[14px] font-semibold text-[var(--ink-900)]">Моите бележки</h3>
                      <span className="text-[11px] text-[var(--text-tertiary)]">Запазва се автоматично</span>
                    </div>
                    <textarea
                      aria-label="Бележки за урока"
                      className="w-full bg-[var(--bg-soft)] border border-[var(--border)] rounded-2xl p-4 text-[13px] text-[var(--ink-900)] placeholder:text-[var(--text-disabled)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors min-h-[120px] resize-y custom-scrollbar"
                      placeholder="Напишете вашите бележки..."
                      value={notes[currentLesson.id] || ''}
                      onChange={(e) => setNotes(prev => ({ ...prev, [currentLesson.id]: e.target.value }))}
                    />
                  </div>
                )}

                {/* NAVIGATION */}
                <div className="mt-10 pt-6 border-t border-[var(--border)]">
                  <div className="flex justify-between items-center">
                    {prev ? (
                      <Button variant="ghost" onClick={() => setCurrentLesson(prev)}>
                        <ChevronLeft size={15} /> Предишен урок
                      </Button>
                    ) : <div />}
                    {next ? (
                      <Button onClick={() => setCurrentLesson(next)} className={!canAccessLesson(next, plan) ? 'opacity-60' : ''}>
                        Следващ урок <ChevronRight size={15} />
                      </Button>
                    ) : (
                      <div className="text-[var(--emerald)] font-medium text-[14px] flex items-center gap-2">
                        <CheckCircle2 size={15} /> Модулът е завършен
                      </div>
                    )}
                  </div>
                  {next && !nextAccessible && (
                    <div className="mt-4">
                      <UpgradeCard
                        title="Следващият урок е заключен"
                        description="Отключи пълен достъп до всички уроци с Pro плана."
                        onUpgrade={() => setPage('pricing')}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ATTACH VIDEO MODAL */}
      <AnimatePresence>
        {showAttachModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[var(--ink-900)]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAttachModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--surface-strong)] border border-[var(--border)] rounded-[24px] shadow-xl w-full max-w-md p-7"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[17px] font-semibold text-[var(--ink-900)]">Прикачи видео</h3>
                <button onClick={() => setShowAttachModal(false)} className="p-1 text-[var(--text-tertiary)] hover:text-[var(--ink-900)]"><X size={17} /></button>
              </div>
              <p className="text-[13px] text-[var(--text-secondary)] mb-4">
                YouTube, Vimeo или директен MP4 линк за този урок.
              </p>
              <Input
                value={attachUrl}
                onChange={(e: any) => setAttachUrl(e.target.value)}
                placeholder="https://..."
                className="h-11 mb-4 rounded-xl"
              />
              <div className="flex gap-3">
                {currentVideo && (
                  <Button variant="danger" className="flex-1" onClick={removeAttachedVideo}>
                    Премахни
                  </Button>
                )}
                <Button className="flex-1" onClick={saveAttachedVideo} disabled={!attachUrl.trim()}>
                  <Save size={15} /> Запази
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
