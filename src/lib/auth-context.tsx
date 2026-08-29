import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AUTH_STORAGE_KEY, login as loginRequest, register as registerRequest } from "@/services/authService";
import type { User } from "@/types";

/**
 * Mock auth layer. Session is kept in localStorage only.
 * Swap the two service calls for real API calls and everything else holds.
 */

interface AuthContextValue {
  user: User | null;
  hydrated: boolean;
  isAuthenticated: boolean;
  isAdministrator: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (input: { name: string; email: string; password: string }) => Promise<User>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as User);
    } catch {
      /* corrupted session — ignore */
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: User | null) => {
    setUser(next);
    try {
      if (next) window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
      else window.localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const next = await loginRequest(email, password);
      persist(next);
      return next;
    },
    [persist],
  );

  const signUp = useCallback(
    async (input: { name: string; email: string; password: string }) => {
      const next = await registerRequest(input);
      persist(next);
      return next;
    },
    [persist],
  );

  const signOut = useCallback(() => persist(null), [persist]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      hydrated,
      isAuthenticated: Boolean(user),
      isAdministrator: user?.role === "administrator",
      signIn,
      signUp,
      signOut,
    }),
    [user, hydrated, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
