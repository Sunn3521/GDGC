import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/**
 * Safely parse environment variables for Vite or fallback runtime
 */
const getEnvVar = (key: string, fallback: string = ''): string => {
  try {
    const meta = import.meta as any;
    if (meta && meta.env && meta.env[key]) {
      return meta.env[key] as string;
    }
  } catch (_e) {
    // Ignore in non-meta environments
  }

  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return fallback;
};

// Firebase configuration object
const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY', 'demo-api-key'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN', 'crisismate-demo.firebaseapp.com'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID', 'crisismate-demo'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET', 'crisismate-demo.appspot.com'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID', '123456789012'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID', '1:123456789012:web:abcdef1234567890'),
};

/**
 * Initialize Firebase App singleton safely
 */
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

/**
 * Firebase Auth instance
 */
export const auth: Auth = getAuth(app);

/**
 * Google Auth Provider instance configured with default scopes
 */
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Firestore Database instance
 */
export const db: Firestore = getFirestore(app);

export default { app, auth, db, googleProvider };
