const XP_KEY = 'ailabs_xp';
const LEVEL_THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1400, 1900];

const LEVEL_NAMES = [
  'AI Основи',
  'Продуктивност',
  'Prompt мислене',
  'Маркетинг и съдържание',
  'Бизнес workflows',
  'Автоматизации',
  'Реални проекти',
];

export function getLevelName(level: number): string {
  return LEVEL_NAMES[Math.max(0, Math.min(level - 1, LEVEL_NAMES.length - 1))] ?? 'AI Основи';
}

export function getXP(): number {
  try { return parseInt(localStorage.getItem(XP_KEY) || '0', 10); } catch { return 0; }
}

export function addXP(amount: number): number {
  const next = getXP() + amount;
  localStorage.setItem(XP_KEY, String(next));
  return next;
}

export function getLevelFromXP(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getXPForNextLevel(xp: number): { current: number; next: number; progress: number } {
  const level = getLevelFromXP(xp);
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? currentThreshold + 500;
  const progress = Math.min(100, Math.round(((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100));
  return { current: currentThreshold, next: nextThreshold, progress };
}

export function getLessonProgress(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem('ailabs_lessonProg') || '{}'); }
  catch { return {}; }
}

export function setLessonDone(id: string, done = true): Record<string, boolean> {
  const prog = getLessonProgress();
  prog[id] = done;
  localStorage.setItem('ailabs_lessonProg', JSON.stringify(prog));
  return prog;
}

export function getOverallProgress(totalLessons: number): number {
  if (totalLessons === 0) return 0;
  const done = Object.values(getLessonProgress()).filter(Boolean).length;
  return Math.round((done / totalLessons) * 100);
}
