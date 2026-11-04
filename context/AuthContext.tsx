"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import type { UserPreferences, UserProfile } from "@/lib/types";

const GUEST_ID = "local-guest";
const PREFS_KEY = "nidhiva:preferences:";

const defaultPreferences: UserPreferences = {
  currency: "INR",
  locale: "en-IN",
  monthStartDay: 1,
  theme: "light",
  defaultView: "home",
};

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  userId: string;
  loading: boolean;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadPrefs(uid: string): UserPreferences {
  if (typeof window === "undefined") return defaultPreferences;
  try {
    const raw = localStorage.getItem(PREFS_KEY + uid);
    return raw
      ? { ...defaultPreferences, ...(JSON.parse(raw) as UserPreferences) }
      : defaultPreferences;
  } catch {
    return defaultPreferences;
  }
}

function savePrefs(uid: string, prefs: UserPreferences) {
  localStorage.setItem(PREFS_KEY + uid, JSON.stringify(prefs));
}

function toProfile(user: User | null, uid: string, prefs: UserPreferences): UserProfile {
  return {
    uid,
    email: user?.email ?? "",
    displayName: user?.displayName || (uid === GUEST_ID ? "Guest" : "User"),
    photoURL: user?.photoURL ?? undefined,
    preferences: prefs,
    createdAt: user?.metadata.creationTime ?? new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [guest, setGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  useEffect(() => {
    if (!auth) {
      const wasGuest = localStorage.getItem("nidhiva:guest") === "1";
      setGuest(wasGuest);
      if (wasGuest) setPreferences(loadPrefs(GUEST_ID));
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, (next) => {
      setUser(next);
      if (next) {
        setGuest(false);
        localStorage.removeItem("nidhiva:guest");
        setPreferences(loadPrefs(next.uid));
      } else {
        const wasGuest = localStorage.getItem("nidhiva:guest") === "1";
        setGuest(wasGuest);
        if (wasGuest) setPreferences(loadPrefs(GUEST_ID));
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const userId = user?.uid ?? (guest ? GUEST_ID : "");

  const login = useCallback(async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth is not configured");
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      if (!auth) throw new Error("Firebase Auth is not configured");
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
    },
    [],
  );

  const logout = useCallback(async () => {
    setGuest(false);
    localStorage.removeItem("nidhiva:guest");
    if (auth && user) await signOut(auth);
  }, [user]);

  const continueAsGuest = useCallback(() => {
    localStorage.setItem("nidhiva:guest", "1");
    setGuest(true);
    setPreferences(loadPrefs(GUEST_ID));
  }, []);

  const updatePreferences = useCallback(
    (prefs: Partial<UserPreferences>) => {
      if (!userId) return;
      setPreferences((prev) => {
        const next = { ...prev, ...prefs };
        savePrefs(userId, next);
        return next;
      });
    },
    [userId],
  );

  const profile = useMemo(
    () => (userId ? toProfile(user, userId, preferences) : null),
    [user, userId, preferences],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      userId,
      loading,
      isGuest: guest && !user,
      login,
      register,
      logout,
      continueAsGuest,
      updatePreferences,
    }),
    [
      user,
      profile,
      userId,
      loading,
      guest,
      login,
      register,
      logout,
      continueAsGuest,
      updatePreferences,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
