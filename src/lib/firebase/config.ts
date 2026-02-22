import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

/**
 * Validate that all required Firebase env vars are present at runtime.
 * NEXT_PUBLIC_* vars are baked into the client bundle at build time —
 * if any are missing the app will silently fail to authenticate.
 */
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
] as const;

const missing = REQUIRED_ENV_VARS.filter(key => !process.env[key]);
if (missing.length > 0) {
  const msg = `[Firebase] Missing required environment variables:\n  ${missing.join('\n  ')}\nSet them in .env.local (dev) or your deployment environment (prod).`;
  if (process.env.NODE_ENV === 'production') {
    throw new Error(msg);
  } else {
    console.warn(msg);
  }
}

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Guard against re-initialization on Next.js Hot Reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export default app;
