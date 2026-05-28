export type Plan = 'free' | 'pro' | 'premium';

export const PLAN_LABELS: Record<Plan, string> = {
  free: 'Free',
  pro: 'Pro',
  premium: 'Premium',
};

export function getUserPlan(user: any): Plan {
  if (!user) return 'free';
  const plan = user.plan || user.user_metadata?.plan;
  if (plan === 'pro' || plan === 'premium') return plan;
  return 'free';
}

export function canAccessLesson(lesson: any, plan: Plan): boolean {
  if (lesson.isFree) return true;
  return plan !== 'free';
}

export function canAccessPrompt(prompt: any, plan: Plan): boolean {
  if (prompt.isFree) return true;
  return plan !== 'free';
}

export type CommunityArea = 'public' | 'pro' | 'premium';

export function canAccessCommunityArea(area: CommunityArea, plan: Plan): boolean {
  if (area === 'public') return true;
  if (area === 'pro') return plan === 'pro' || plan === 'premium';
  if (area === 'premium') return plan === 'premium';
  return false;
}
