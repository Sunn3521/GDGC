/**
 * Represents a user profile stored in Firestore (`users/{uid}`)
 */
export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  phoneNumber?: string | null;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}

/**
 * Partial DTO used for updating profile fields
 */
export type UserProfileUpdate = Partial<Omit<UserProfile, 'uid' | 'createdAt'>>;
