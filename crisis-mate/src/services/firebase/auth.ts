import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  NextOrObserver
} from 'firebase/auth';
import { auth, googleProvider } from './config';
import { createOrUpdateUserProfile } from './userService';
import { UserProfile } from '../../types/user';

/**
 * Initiates Google Sign-In via popup window and creates/updates Firestore UserProfile.
 */
export const signInWithGoogle = async (): Promise<{ user: User; profile: UserProfile }> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Automatically sync or create profile document in Firestore
    const profile = await createOrUpdateUserProfile(user);

    return { user, profile };
  } catch (error: any) {
    console.error('[FirebaseAuth] Google Sign-In error:', error?.message || error);
    throw new Error(`Google Authentication failed: ${error?.message || 'Unknown error'}`);
  }
};

/**
 * Signs out the currently authenticated Firebase user.
 */
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('[FirebaseAuth] Sign-Out error:', error?.message || error);
    throw new Error(`Sign out failed: ${error?.message || 'Unknown error'}`);
  }
};

/**
 * Returns the currently signed-in Firebase user, or null if unauthenticated.
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Listens for Auth state changes (login, logout, token refresh).
 * Returns an unsubscribe function.
 */
export const onAuthStateChange = (
  callback: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

export default {
  signInWithGoogle,
  signOutUser,
  getCurrentUser,
  onAuthStateChange,
};
