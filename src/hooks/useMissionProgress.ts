import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  getMissionProgress,
  setMissionProgress,
  getMissionXP,
  setMissionXP,
  getMissionStreak,
  setMissionStreak,
  getMissionBadges,
  setMissionBadges,
  addMissionXP as addMissionXPLocal,
  type StreakData,
} from '../lib/missions';

export function useMissionProgress() {
  const { user } = useAuth();
  const [progress, setProgressState] = useState<Record<string, boolean>>(getMissionProgress);
  const [xp, setXpState] = useState(getMissionXP);
  const [streak, setStreakState] = useState<StreakData>(getMissionStreak);
  const [badges, setBadgesState] = useState<string[]>(getMissionBadges);
  const [loading, setLoading] = useState(true);

  const setProgress = useCallback((next: Record<string, boolean>) => {
    setMissionProgress(next);
    setProgressState(next);
  }, []);

  const setXp = useCallback((next: number) => {
    setMissionXP(next);
    setXpState(next);
  }, []);

  const setStreak = useCallback((next: StreakData) => {
    setMissionStreak(next);
    setStreakState(next);
  }, []);

  const setBadges = useCallback((next: string[]) => {
    setMissionBadges(next);
    setBadgesState(next);
  }, []);

  // Load remote progress when user changes
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        if (user) {
          const [{ data: progressRows }, { data: profile }] = await Promise.all([
            supabase
              .from('mission_progress')
              .select('lesson_id, completed')
              .eq('user_id', user.id),
            supabase.from('profiles').select('mission_xp, mission_streak, mission_badges').eq('id', user.id).single(),
          ]);

          if (!cancelled) {
            if (progressRows) {
              const remote = Object.fromEntries(progressRows.map((r) => [r.lesson_id, r.completed]));
              const local = getMissionProgress();
              const merged = { ...local, ...remote };
              setMissionProgress(merged);
              setProgressState(merged);
            }
            if (profile) {
              if (typeof profile.mission_xp === 'number') {
                setMissionXP(profile.mission_xp);
                setXpState(profile.mission_xp);
              }
              if (profile.mission_streak !== null) {
                const remoteStreak: StreakData = {
                  streak: profile.mission_streak,
                  lastActive: getMissionStreak().lastActive,
                };
                setMissionStreak(remoteStreak);
                setStreakState(remoteStreak);
              }
              if (Array.isArray(profile.mission_badges)) {
                setMissionBadges(profile.mission_badges);
                setBadgesState(profile.mission_badges);
              }
            }
          }
        }
      } finally {
        if (!cancelled) {
          setProgressState(getMissionProgress());
          setXpState(getMissionXP());
          setStreakState(getMissionStreak());
          setBadgesState(getMissionBadges());
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const saveRemoteProgress = useCallback(
    async (nextProgress: Record<string, boolean>) => {
      if (!user) return;
      const rows = Object.entries(nextProgress)
        .filter(([, completed]) => completed)
        .map(([lesson_id]) => ({
          user_id: user.id,
          lesson_id,
          completed: true,
          xp_earned: 0,
        }));
      if (rows.length > 0) {
        await supabase.from('mission_progress').upsert(rows);
      }
    },
    [user],
  );

  const saveRemoteXP = useCallback(
    async (nextXp: number) => {
      if (!user) return;
      await supabase
        .from('profiles')
        .update({ mission_xp: nextXp, mission_level: Math.floor(nextXp / 100) + 1 })
        .eq('id', user.id);
    },
    [user],
  );

  const completeMission = useCallback(
    async (missionId: string) => {
      const next = { ...progress, [missionId]: true };
      setProgress(next);
      await saveRemoteProgress(next);
    },
    [progress, setProgress, saveRemoteProgress],
  );

  const addMissionXP = useCallback(
    async (amount: number) => {
      const next = addMissionXPLocal(amount);
      setXpState(next);
      await saveRemoteXP(next);
      return next;
    },
    [saveRemoteXP],
  );

  const resetAll = useCallback(() => {
    setMissionProgress({});
    setMissionXP(0);
    setMissionStreak({ streak: 0, lastActive: new Date(0).toISOString() });
    setMissionBadges([]);
    setProgressState({});
    setXpState(0);
    setStreakState({ streak: 0, lastActive: new Date(0).toISOString() });
    setBadgesState([]);
  }, []);

  return {
    progress,
    xp,
    streak,
    badges,
    loading,
    setProgress,
    setXp,
    setStreak,
    setBadges,
    completeMission,
    addMissionXP,
    resetAll,
    saveRemoteProgress,
  };
}
