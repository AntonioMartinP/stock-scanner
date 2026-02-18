"use client";

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

/**
 * Listens to Firebase Auth state and syncs the token to an HTTP cookie
 * so Next.js middleware can read it server-side to protect routes.
 */
export function useAuthCookieSync() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        // Cookie valid for 1 hour (matches Firebase token expiry)
        document.cookie = `auth-session=${token}; path=/; SameSite=Strict; max-age=3600`;
      } else {
        // Delete cookie on logout
        document.cookie = 'auth-session=; path=/; max-age=0';
      }
    });
    return () => unsubscribe();
  }, []);
}
