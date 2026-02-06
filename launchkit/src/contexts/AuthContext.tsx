"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        // Check if supabase is properly configured
        if (!supabase || !supabase.auth) {
          setIsConfigured(false);
          setLoading(false);
          return;
        }

        const result = await supabase.auth.getSession();
        const initialSession = result?.data?.session;
        
        setSession(initialSession || null);
        setUser(initialSession?.user ?? null);
        setIsConfigured(true);
      } catch (error) {
        console.error("Error getting session:", error);
        setIsConfigured(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes only if configured
    const setupListener = async () => {
      try {
        if (!supabase?.auth?.onAuthStateChange) {
          return;
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event: any, currentSession: any) => {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            setLoading(false);
          }
        );

        // Cleanup subscription
        return () => {
          subscription?.unsubscribe();
        };
      } catch (error) {
        console.error("Error setting up auth listener:", error);
        setLoading(false);
      }
    };

    const unsubscribe = setupListener();
    return () => {
      unsubscribe.then(fn => fn?.());
    };
  }, []);

  const signOut = async () => {
    try {
      if (supabase?.auth?.signOut) {
        await supabase.auth.signOut();
      }
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    isConfigured,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
