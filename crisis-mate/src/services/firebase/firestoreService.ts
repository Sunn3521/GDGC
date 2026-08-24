/**
 * CrisisMate — Base Firestore Helper
 *
 * Provides base reference paths for user documents and subcollections.
 */

import { doc, collection, type DocumentReference, type CollectionReference } from 'firebase/firestore';
import { db } from './firebaseConfig';

export function getUserDocRef(userId: string): DocumentReference {
  return doc(db, 'users', userId);
}

export function getContactsCollectionRef(userId: string): CollectionReference {
  return collection(db, 'users', userId, 'trustedContacts');
}

export function getHistoryCollectionRef(userId: string): CollectionReference {
  return collection(db, 'users', userId, 'emergencySessions');
}
