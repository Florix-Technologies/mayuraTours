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
  clearStoredUser,
  persistUser,
  readStoredUser,
  type AuthUser,
} from "@/lib/auth/session";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  signIn: (
    email: string,
    remember: boolean,
    profile?: {
      name?: string;
      age?: string;
      gender?: string;
    },
  ) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setUser(readStoredUser());
    setIsReady(true);
  }, []);

  const signIn = useCallback(
    (
      email: string,
      remember: boolean,
      profile?: {
        name?: string;
        age?: string;
        gender?: string;
      },
    ) => {
      const nextUser: AuthUser = {
        email: email.trim().toLowerCase(),
        ...(profile?.name ? { name: profile.name.trim() } : {}),
        ...(profile?.age ? { age: profile.age } : {}),
        ...(profile?.gender ? { gender: profile.gender } : {}),
      };

      persistUser(nextUser, remember);
      setUser(nextUser);
    },
    [],
  );

  const signOut = useCallback(() => {
    clearStoredUser();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isReady,
      signIn,
      signOut,
    }),
    [user, isReady, signIn, signOut],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}