export const XP_REWARDS = {
  correctAnswer: 10,
  wrongAnswer: 3,
  missionCompleted: 50,
  practicalTaskCompleted: 20,
  perfectMission: 25,
  flashcardReviewed: 5,
  dailyMission: 50,
};

export function addXP(currentXP: number, amount: number) {
  return currentXP + amount;
}

export function getLevel(xp: number) {
  return Math.floor(xp / 100) + 1;
}

export function getLevelProgress(xp: number) {
  return xp % 100;
}

export function xpToNextLevel(xp: number) {
  return 100 - (xp % 100);
}

// Backwards-compatible helpers used by the missions module
export function getMissionLevel(xp: number): number {
  return getLevel(xp);
}

export function getMissionLevelProgress(xp: number): { current: number; next: number; progress: number } {
  const level = getLevel(xp);
  const currentThreshold = (level - 1) * 100;
  const nextThreshold = level * 100;
  const progress = Math.min(100, Math.round(((xp - currentThreshold) / 100) * 100));
  return { current: currentThreshold, next: nextThreshold, progress };
}
