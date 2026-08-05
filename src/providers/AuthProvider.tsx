"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { User } from "@/types/api";
import { ApiError } from "@/lib/api-client";
import { login as loginRequest, refreshAccessToken } from "@/services/auth.service";
import type { LoginPayload } from "@/types/api";

/**
 * ⚠️ Backend gap: the docs don't expose a "get current user" endpoint.
 * Login is the only place a full `User` object comes back from the server.
 * So on a hard page refresh we can silently get a new access token (the
 * refresh-token endpoint reads the httpOnly cookie), but we have no way to
 * re-fetch the user's profile — we only have whatever was cached locally.
 * If the backend adds e.g. GET /users/me, swap the `restoreUser` bit below
 * to call it instead of reading localStorage.
 */
const CACHED_USER_KEY = "arthopay:cachedUser";

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  /** true while the initial silent-refresh-on-load check is running */
  isInitializing: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  logout: () => void;
  /** Update in-memory user + refresh the localStorage cache (e.g. after profile edit) */
  setUser: (user: User | null) => void;
  /** Get a currently-valid access token, refreshing it first if we don't have one in memory */
  getValidAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  // De-dupe concurrent refresh calls (e.g. several components mounting at once)
  const refreshInFlight = useRef<Promise<string | null> | null>(null);

  const setUser = useCallback((next: User | null) => {
    setUserState(next);
    if (typeof window === "undefined") return;
    if (next) {
      localStorage.setItem(CACHED_USER_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(CACHED_USER_KEY);
    }
  }, []);

  const doRefresh = useCallback(async (): Promise<string | null> => {
    try {
      const data = await refreshAccessToken();
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch (err) {
      // Refresh cookie missing/expired — treat as logged out.
      setAccessToken(null);
      setUser(null);
      if (!(err instanceof ApiError)) {
        console.error("Silent token refresh failed unexpectedly:", err);
      }
      return null;
    }
  }, [setUser]);

  const getValidAccessToken = useCallback(async (): Promise<string | null> => {
    if (accessToken) return accessToken;
    if (!refreshInFlight.current) {
      refreshInFlight.current = doRefresh().finally(() => {
        refreshInFlight.current = null;
      });
    }
    return refreshInFlight.current;
  }, [accessToken, doRefresh]);

  // On mount: try to restore a session using the httpOnly refresh cookie.
  useEffect(() => {
    let cancelled = false;

    async function restore() {
      const cachedRaw = localStorage.getItem(CACHED_USER_KEY);
      const cachedUser = cachedRaw ? (JSON.parse(cachedRaw) as User) : null;

      const token = await doRefresh();
      if (cancelled) return;

      // Only trust the cached user if we actually still have a valid session.
      if (token && cachedUser) {
        setUserState(cachedUser);
      } else {
        setUserState(null);
        localStorage.removeItem(CACHED_USER_KEY);
      }
      setIsInitializing(false);
    }

    restore();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const data = await loginRequest(payload);
      setAccessToken(data.accessToken);
      setUser(data.user);
      return data.user;
    },
    [setUser]
  );

  const logout = useCallback(() => {
    // No /auth/logout endpoint in the docs yet — this just clears local state.
    // The refresh-token httpOnly cookie will still exist server-side until it expires.
    setAccessToken(null);
    setUser(null);
  }, [setUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isInitializing,
      isAuthenticated: Boolean(user && accessToken),
      login,
      logout,
      setUser,
      getValidAccessToken,
    }),
    [user, accessToken, isInitializing, login, logout, setUser, getValidAccessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth() must be used inside <AuthProvider>");
  }
  return ctx;
}
