import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { getSiteUrl, isSupabaseConfigured, supabase } from '../lib/supabase';

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: 'user' | 'admin';
  plan: 'free' | 'pro' | 'premium';
  bio: string | null;
  tools: string[];
  color: string;
  tc: string;
  initials: string;
  created_at: string;
};

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isConfigured: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ error: Error | null; needsEmailConfirmation: boolean }>;
  signOut: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function configError() {
  return new Error(
    'Authentication is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(userId: string) {
    if (!isSupabaseConfigured) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (!error && data) {
      setProfile(data as Profile);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      if (!isSupabaseConfigured) {
        if (mounted) setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;

      if (error) {
        console.error('Failed to load auth session:', error.message);
      }

      const currentSession = data.session ?? null;
      const currentUser = currentSession?.user ?? null;
      setSession(currentSession);
      setUser(currentUser);

      if (currentUser) {
        await fetchProfile(currentUser.id);
      }

      setLoading(false);
    }

    loadSession();

    if (!isSupabaseConfigured) {
      return () => { mounted = false; };
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      const nextUser = nextSession?.user ?? null;
      setSession(nextSession);
      setUser(nextUser);
      setLoading(false);

      if (nextUser) {
        fetchProfile(nextUser.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      profile,
      loading,
      isConfigured: isSupabaseConfigured,
      isAdmin: profile?.role === 'admin',

      async signIn(email, password) {
        if (!isSupabaseConfigured) return { error: configError() };
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error as Error | null };
      },

      async signUp(email, password, fullName) {
        if (!isSupabaseConfigured) return { error: configError(), needsEmailConfirmation: false };
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${getSiteUrl()}/profile`,
          },
        });
        return {
          error: error as Error | null,
          needsEmailConfirmation: Boolean(data.user && !data.session),
        };
      },

      async signOut() {
        if (!isSupabaseConfigured) return { error: configError() };
        const { error } = await supabase.auth.signOut();
        setProfile(null);
        return { error: error as Error | null };
      },

      async resetPassword(email) {
        if (!isSupabaseConfigured) return { error: configError() };
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${getSiteUrl()}/reset-password`,
        });
        return { error: error as Error | null };
      },

      async updatePassword(password) {
        if (!isSupabaseConfigured) return { error: configError() };
        const { error } = await supabase.auth.updateUser({ password });
        return { error: error as Error | null };
      },

      async refreshProfile() {
        if (user) await fetchProfile(user.id);
      },
    }),
    [session, user, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
