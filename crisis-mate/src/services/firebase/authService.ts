/**
 * CrisisMate — Firebase Authentication Service
 *
 * Provides Google Sign-In, Anonymous Sign-In, Sign-Out, and Auth state observer.
 */

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  type User,
  type Unsubscribe,
} from 'firebase/auth';
import { auth } from './firebaseConfig';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

/**
 * Sign in user with Google Auth Provider.
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Google sign in failed.';
    console.error('[CrisisMate Auth] Google Sign-In error:', message);
    throw new Error(message);
  }
}

/**
 * Sign in user anonymously for quick session saving.
 */
export async function signInAnonymouslyUser(): Promise<User> {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Anonymous sign in failed.';
    console.error('[CrisisMate Auth] Anonymous Sign-In error:', message);
    throw new Error(message);
  }
}

/**
 * Sign out current authenticated user.
 */
export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sign out failed.';
    console.error('[CrisisMate Auth] Sign-out error:', message);
    throw new Error(message);
  }
}

/**
 * Listen to auth state changes.
 */
export function onAuthStateChange(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

/**
 * Get current authenticated user synchronously.
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}
