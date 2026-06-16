/**
 * Missions module — XP, levels, streaks, badges, progress
 */

import { MISSIONS_MODULES as OLD_MISSIONS_MODULES, MISSIONS_BADGES, type MissionBadgeDef } from '../data';
import { MISSION_MODULES } from './missionsData';
import { XP_REWARDS } from './xp';

const LS_KEYS = {
  xp: 'ailabs_missions_xp',
  streak: 'ailabs_missions_streak',
  badges: 'ailabs_missions_badges',
  progress: 'ailabs_missions_progress',
  daily: 'ailabs_missions_daily',
  flashcards: 'ailabs_missions_flashcards',
  rank: 'ailabs_missions_rank',
};

export type StreakData = {
  lastActive: string;
  streak: number;
};

export type DailyState = {
  date: string;
  completedIds: string[];
};

export type FlashcardState = Record<string, 'again' | 'hard' | 'good' | 'easy'>;

// ---------- XP / Level ----------

export function getMissionXP(): number {
  try {
    return parseInt(localStorage.getItem(LS_KEYS.xp) || '0', 10);
  } catch {
    return 0;
  }
}

export function setMissionXP(xp: number): number {
  const safe = Math.max(0, xp);
  localStorage.setItem(LS_KEYS.xp, String(safe));
  return safe;
}

export function addMissionXP(gain: number): number {
  return setMissionXP(getMissionXP() + gain);
}

export function getMissionLevel(xp: number = getMissionXP()): number {
  return Math.floor(xp / 100) + 1;
}

export function getMissionLevelProgress(xp: number = getMissionXP()): { current: number; next: number; progress: number } {
  const level = getMissionLevel(xp);
  const currentThreshold = (level - 1) * 100;
  const nextThreshold = level * 100;
  const progress = Math.min(100, Math.round(((xp - currentThreshold) / 100) * 100));
  return { current: currentThreshold, next: nextThreshold, progress };
}

export function xpToNextLevel(xp: number = getMissionXP()): number {
  return 100 - (xp % 100);
}

// ---------- Streak ----------

export function getMissionStreak(): StreakData {
  try {
    const raw = localStorage.getItem(LS_KEYS.streak);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { lastActive: new Date(0).toISOString(), streak: 0 };
}

export function setMissionStreak(data: StreakData): StreakData {
  localStorage.setItem(LS_KEYS.streak, JSON.stringify(data));
  return data;
}

export function updateMissionStreak(data?: StreakData): { data: StreakData; changed: boolean; reward: number } {
  const current = data || getMissionStreak();
  const today = new Date().toDateString();
  const last = new Date(current.lastActive).toDateString();

  if (today === last) return { data: current, changed: false, reward: 0 };

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const isConsecutive = last === yesterday.toDateString();

  const nextStreak = isConsecutive ? current.streak + 1 : 1;
  const next: StreakData = {
    lastActive: new Date().toISOString(),
    streak: nextStreak,
  };
  setMissionStreak(next);

  let reward = 0;
  if (nextStreak === 3) reward = 20;
  else if (nextStreak === 7) reward = 50;

  return { data: next, changed: true, reward };
}

// ---------- Progress (legacy lessons) ----------

export function getMissionProgress(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(LS_KEYS.progress) || '{}');
  } catch {
    return {};
  }
}

export function setMissionProgress(progress: Record<string, boolean>): Record<string, boolean> {
  localStorage.setItem(LS_KEYS.progress, JSON.stringify(progress));
  return progress;
}

export function completeMissionLesson(lessonId: string): Record<string, boolean> {
  const progress = getMissionProgress();
  progress[lessonId] = true;
  return setMissionProgress(progress);
}

export function isMissionLessonUnlocked(lessonId: string, progress: Record<string, boolean>): boolean {
  const allLessons = OLD_MISSIONS_MODULES.flatMap(m => m.lessons);
  const idx = allLessons.findIndex(l => l.id === lessonId);
  if (idx <= 0) return true;
  return progress[allLessons[idx - 1].id] === true;
}

export function getNextLessonId(lessonId: string): string | null {
  const allLessons = OLD_MISSIONS_MODULES.flatMap(m => m.lessons);
  const idx = allLessons.findIndex(l => l.id === lessonId);
  if (idx === -1 || idx >= allLessons.length - 1) return null;
  return allLessons[idx + 1].id;
}

// ---------- New Mission progress helpers ----------

const ALL_NEW_MISSIONS = MISSION_MODULES.flatMap((m) => m.missions).sort((a, b) => a.order - b.order);

export function completeMission(missionId: string): Record<string, boolean> {
  const progress = getMissionProgress();
  progress[missionId] = true;
  return setMissionProgress(progress);
}

export function isMissionUnlocked(missionId: string, progress: Record<string, boolean> = getMissionProgress()): boolean {
  const idx = ALL_NEW_MISSIONS.findIndex((m) => m.id === missionId);
  if (idx <= 0) return true;
  return progress[ALL_NEW_MISSIONS[idx - 1].id] === true;
}

export function getNextMissionId(missionId: string): string | null {
  const idx = ALL_NEW_MISSIONS.findIndex((m) => m.id === missionId);
  if (idx === -1 || idx >= ALL_NEW_MISSIONS.length - 1) return null;
  return ALL_NEW_MISSIONS[idx + 1].id;
}

export function getModuleProgress(moduleId: string, progress: Record<string, boolean> = getMissionProgress()): { completed: number; total: number; percent: number } {
  const mod = MISSION_MODULES.find((m) => m.id === moduleId);
  if (!mod) return { completed: 0, total: 0, percent: 0 };
  const total = mod.missions.length;
  const completed = mod.missions.filter((m) => progress[m.id]).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percent };
}

export function getOverallStats(progress: Record<string, boolean> = getMissionProgress()): { total: number; completed: number; percent: number } {
  const total = ALL_NEW_MISSIONS.length;
  const completed = ALL_NEW_MISSIONS.filter((m) => progress[m.id]).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, percent };
}

// ---------- Daily Missions ----------

export function getDailyState(): DailyState {
  try {
    const raw = localStorage.getItem(LS_KEYS.daily);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { date: new Date().toDateString(), completedIds: [] };
}

export function setDailyState(state: DailyState): DailyState {
  localStorage.setItem(LS_KEYS.daily, JSON.stringify(state));
  return state;
}

export function completeDailyMission(missionId: string): DailyState {
  const today = new Date().toDateString();
  const state = getDailyState();
  if (state.date !== today) {
    state.date = today;
    state.completedIds = [];
  }
  if (!state.completedIds.includes(missionId)) {
    state.completedIds.push(missionId);
  }
  return setDailyState(state);
}

// ---------- Flashcards ----------

export function getFlashcardState(): FlashcardState {
  try {
    return JSON.parse(localStorage.getItem(LS_KEYS.flashcards) || '{}');
  } catch {
    return {};
  }
}

export function setFlashcardState(state: FlashcardState): FlashcardState {
  localStorage.setItem(LS_KEYS.flashcards, JSON.stringify(state));
  return state;
}

// ---------- Badges ----------

export function getMissionBadges(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEYS.badges) || '[]');
  } catch {
    return [];
  }
}

export function setMissionBadges(badges: string[]): string[] {
  localStorage.setItem(LS_KEYS.badges, JSON.stringify(badges));
  return badges;
}

export function checkMissionBadges(
  xp: number = getMissionXP(),
  streak: StreakData = getMissionStreak(),
  progress: Record<string, boolean> = getMissionProgress()
): { badges: string[]; newBadges: MissionBadgeDef[] } {
  const current = getMissionBadges();
  const allCompleted = OLD_MISSIONS_MODULES.flatMap(m => m.lessons).filter(l => progress[l.id]).length;
  const moduleCompleted = OLD_MISSIONS_MODULES.some(m => m.lessons.every(l => progress[l.id]));

  const newBadges: MissionBadgeDef[] = [];

  for (const badge of MISSIONS_BADGES) {
    if (current.includes(badge.id)) continue;
    let unlocked = false;
    if (badge.condition === 'firstLesson' && allCompleted >= 1) unlocked = true;
    if (badge.condition === 'streak7' && streak.streak >= 7) unlocked = true;
    if (badge.condition === 'xp100' && xp >= 100) unlocked = true;
    if (badge.condition === 'moduleComplete' && moduleCompleted) unlocked = true;
    if (badge.condition === 'referrals5') unlocked = false; // manual
    if (badge.condition === 'streak30' && streak.streak >= 30) unlocked = true;

    if (unlocked) {
      current.push(badge.id);
      newBadges.push(badge);
    }
  }

  if (newBadges.length) setMissionBadges(current);
  return { badges: current, newBadges };
}

// ---------- Rank ----------

export function getMissionRank(): number {
  try {
    return parseInt(localStorage.getItem(LS_KEYS.rank) || '12', 10);
  } catch {
    return 12;
  }
}

// ---------- Reward helpers ----------

export function rewardQuizAnswer(isCorrect: boolean): number {
  return isCorrect ? XP_REWARDS.correctAnswer : XP_REWARDS.wrongAnswer;
}

export function rewardLessonCompletion(): number {
  return XP_REWARDS.missionCompleted;
}

export function rewardFlashcardReview(): number {
  return XP_REWARDS.flashcardReviewed;
}

export function rewardDailyMission(): number {
  return XP_REWARDS.dailyMission;
}

// ---------- Reset ----------

export function resetMissionProgress(): void {
  localStorage.removeItem(LS_KEYS.xp);
  localStorage.removeItem(LS_KEYS.streak);
  localStorage.removeItem(LS_KEYS.badges);
  localStorage.removeItem(LS_KEYS.progress);
  localStorage.removeItem(LS_KEYS.daily);
  localStorage.removeItem(LS_KEYS.flashcards);
}

// Re-export new mission data for convenience
export { MISSION_MODULES };
