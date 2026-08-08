"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  loginAction,
  logoutAction,
  refreshTokenAction,
  type LoginPayload,
  type LoginResponseData,
} from "@/app/actions/auth/auth-api";

/**
 * ⚠️ Backend gap: doc-এ কোনো "get current user" endpoint নেই। Login response-এর
 * user object-টাই একমাত্র জায়গা যেখান থেকে full user data আসে। তাই hard refresh-এর
 * পর আমরা শুধু session valid কিনা check করতে পারি (refresh-token cookie দিয়ে),
 * কিন্তু user profile আবার fetch করতে পারি না — তাই সেটা localStorage-এ cache
 * রাখা হচ্ছে। Backend-এ পরে GET /users/me যোগ হলে এই cache সরিয়ে সেটা call করো।
 *
 * accessToken এখন httpOnly cookie-তে থাকে — client-side JS দিয়ে পড়া যায় না,
 * তাই এখানে কোনো token state নেই। প্রতিটা protected server action নিজেই
 * cookie থেকে token পড়ে backend-এ পাঠায়।
 */

type AuthUser = LoginResponseData["user"];

const CACHED_USER_KEY = "arthopay:cachedUser";

interface AuthContextValue {
  user: AuthUser | null;
  /** true যতক্ষণ initial session-restore check চলছে */
  isInitializing: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  /** in-memory user + localStorage cache আপডেট করে (যেমন profile edit-এর পর) */
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const setUser = useCallback((next: AuthUser | null) => {
    setUserState(next);
    if (typeof window === "undefined") return;
    if (next) {
      localStorage.setItem(CACHED_USER_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(CACHED_USER_KEY);
    }
  }, []);

  // Mount হওয়ার সময়: refreshToken cookie দিয়ে session এখনো valid কিনা check করি।
  useEffect(() => {
    let cancelled = false;

    async function restore() {
      const cachedRaw = localStorage.getItem(CACHED_USER_KEY);
      const cachedUser = cachedRaw ? (JSON.parse(cachedRaw) as AuthUser) : null;

      const result = await refreshTokenAction();
      if (cancelled) return;

      // Session valid থাকলেই cached user-কে trust করি, নাহলে সব clear
      if (result.success && cachedUser) {
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
      const result = await loginAction(payload);
      if (!result.success) {
        throw new Error(result.message);
      }
      setUser(result.data.user);
      return result.data.user;
    },
    [setUser]
  );

  const logout = useCallback(async () => {
    await logoutAction(); // নিজেদের accessToken/refreshToken cookie মুছে দেয়
    setUser(null);
  }, [setUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isInitializing,
      isAuthenticated: Boolean(user),
      login,
      logout,
      setUser,
    }),
    [user, isInitializing, login, logout, setUser]
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
