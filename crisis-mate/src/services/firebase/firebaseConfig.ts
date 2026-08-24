/**
 * CrisisMate — Firebase Client Configuration
 *
 * Initializes Firebase App, Auth, and Firestore services using environment variables
 * with production fallbacks for the ideathaon Firebase project.
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

function getEnvVar(key: string): string {
  let viteVal = '';
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      viteVal = (import.meta.env[key] as string) || '';
    }
  } catch {
    // Ignore error in non-Vite env
  }

  let nodeVal = '';
  try {
    if (typeof process !== 'undefined' && process.env) {
      nodeVal = process.env[key] || '';
    }
  } catch {
    // Ignore error in non-Node env
  }

  return viteVal || nodeVal;
}

const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY') || 'AIzaSyDte3qwO-k-KKUjTpJuglDyo4QYbMYLASg',
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN') || 'ideathaon.firebaseapp.com',
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID') || 'ideathaon',
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET') || 'ideathaon.firebasestorage.app',
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID') || '837910203253',
  appId: getEnvVar('VITE_FIREBASE_APP_ID') || '1:837910203253:web:17bf1076a67ff12456e13c',
};

// Initialize Firebase App singleton
export const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
