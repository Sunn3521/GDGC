import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import {
  onAuthStateChange,
  signInWithGoogle as googleSignIn,
  signInAnonymouslyUser as anonymousSignIn,
  signOutUser,
} from '../services/firebase/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {},
  signInAnonymously: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      await googleSignIn();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed.';
      setError(msg);
    }
  };

  const signInAnonymously = async () => {
    setError(null);
    try {
      await anonymousSignIn();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Anonymous sign-in failed.';
      setError(msg);
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOutUser();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Sign out failed.';
      setError(msg);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signInWithGoogle,
        signInAnonymously,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
