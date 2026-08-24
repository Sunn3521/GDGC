import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { UserProfile, UserProfileUpdate } from '../../types/user';

/**
 * Collection name for user profiles
 */
export const USERS_COLLECTION = 'users';

/**
 * Creates or updates a Firestore user profile under `users/{uid}`.
 */
export const createOrUpdateUserProfile = async (user: {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  phoneNumber?: string | null;
}): Promise<UserProfile> => {
  if (!user || !user.uid) {
    throw new Error('[UserService] User UID is required to create or update profile.');
  }

  const userRef = doc(db, USERS_COLLECTION, user.uid);
  const now = new Date().toISOString();

  try {
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      // Document exists: merge updated fields
      const existingData = docSnap.data() as UserProfile;
      const updatedProfile: UserProfile = {
        ...existingData,
        displayName: user.displayName !== undefined ? user.displayName : existingData.displayName,
        email: user.email !== undefined ? user.email : existingData.email,
        photoURL: user.photoURL !== undefined ? user.photoURL : existingData.photoURL,
        phoneNumber: user.phoneNumber !== undefined ? user.phoneNumber : existingData.phoneNumber,
        updatedAt: now,
      };

      await setDoc(userRef, updatedProfile, { merge: true });
      return updatedProfile;
    } else {
      // Document does not exist: create new user profile
      const newProfile: UserProfile = {
        uid: user.uid,
        displayName: user.displayName || null,
        email: user.email || null,
        photoURL: user.photoURL || null,
        phoneNumber: user.phoneNumber || null,
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(userRef, newProfile);
      return newProfile;
    }
  } catch (error: any) {
    console.error('[UserService] Failed to create or update user profile:', error?.message || error);
    throw new Error(`Failed to save user profile: ${error?.message || 'Unknown error'}`);
  }
};

/**
 * Retrieves a user profile by UID from `users/{uid}`.
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!uid) {
    throw new Error('[UserService] UID is required to fetch user profile.');
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error: any) {
    console.error('[UserService] Failed to fetch user profile:', error?.message || error);
    throw new Error(`Failed to retrieve user profile: ${error?.message || 'Unknown error'}`);
  }
};

/**
 * Updates specific user profile fields for a user UID.
 */
export const updateUserProfile = async (
  uid: string,
  updateData: UserProfileUpdate
): Promise<UserProfile> => {
  if (!uid) {
    throw new Error('[UserService] UID is required to update user profile.');
  }

  const userRef = doc(db, USERS_COLLECTION, uid);
  const now = new Date().toISOString();

  try {
    const payload = {
      ...updateData,
      updatedAt: now,
    };

    await updateDoc(userRef, payload as Record<string, any>);
    const updatedSnap = await getDoc(userRef);
    return updatedSnap.data() as UserProfile;
  } catch (error: any) {
    console.error('[UserService] Failed to update user profile:', error?.message || error);
    throw new Error(`Failed to update user profile: ${error?.message || 'Unknown error'}`);
  }
};

export default {
  createOrUpdateUserProfile,
  getUserProfile,
  updateUserProfile,
};
