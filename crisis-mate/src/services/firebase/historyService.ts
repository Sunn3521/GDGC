/**
 * CrisisMate — Firestore Emergency Session History Service
 *
 * Implements CRUD operations for users/{userId}/emergencySessions/{sessionId}.
 */

import {
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore';
import type { CrisisAnalysis } from '../../types/crisis';
import type { EmergencySession } from '../../types/emergency';
import { getHistoryCollectionRef } from './firestoreService';
import { db } from './firebaseConfig';

/**
 * Save an emergency session to Firestore.
 */
export async function saveEmergencySession(
  userId: string,
  analysis: CrisisAnalysis,
  userMessage: string
): Promise<EmergencySession> {
  if (!userId) {
    throw new Error('User must be authenticated to save emergency session.');
  }

  try {
    const historyRef = getHistoryCollectionRef(userId);
    const newSessionData: Omit<EmergencySession, 'id'> = {
      userId,
      userMessage,
      analysis,
      sosTrigger: false,
      locationActivated: analysis.needsLocation,
      startedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(historyRef, newSessionData);
    return { id: docRef.id, ...newSessionData };
  } catch (error) {
    console.error('[CrisisMate History] Error saving session to Firestore:', error);
    throw new Error('Failed to save emergency session to Firestore.');
  }
}

/**
 * Fetch all past emergency sessions for a user.
 */
export async function getEmergencyHistory(userId: string): Promise<EmergencySession[]> {
  if (!userId) return [];
  try {
    const historyRef = getHistoryCollectionRef(userId);
    const q = query(historyRef, orderBy('startedAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as EmergencySession[];
  } catch (error) {
    console.error('[CrisisMate History] Error fetching history from Firestore:', error);
    throw new Error('Failed to load emergency history from Firestore.');
  }
}

/**
 * Delete an emergency session log.
 */
export async function deleteEmergencySession(userId: string, sessionId: string): Promise<void> {
  try {
    const sessionRef = doc(db, 'users', userId, 'emergencySessions', sessionId);
    await deleteDoc(sessionRef);
  } catch (error) {
    console.error('[CrisisMate History] Error deleting session:', error);
    throw new Error('Failed to delete emergency session from Firestore.');
  }
}
