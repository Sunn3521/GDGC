/**
 * CrisisMate — Firebase Client Configuration
 *
 * Initializes Firebase App, Auth, and Firestore services using environment variables.
 * Safe initialization: provides dummy fallback credentials for dev/offline testing
 * so app never crashes if environment variables are not yet configured.
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
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY') || 'AIzaSyDummyKeyForCrisisMateDevOnly',
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN') || 'crisis-mate-dev.firebaseapp.com',
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID') || 'crisis-mate-dev',
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET') || 'crisis-mate-dev.appspot.com',
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID') || '1234567890',
  appId: getEnvVar('VITE_FIREBASE_APP_ID') || '1:1234567890:web:abcdef123456',
};

// Initialize Firebase App singleton
export const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
