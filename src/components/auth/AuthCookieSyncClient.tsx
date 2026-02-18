"use client";

import { useAuthCookieSync } from '@/hooks/useAuthCookieSync';

/**
 * Invisible client component that runs the cookie sync hook.
 * Placed in the layout so it runs on every page.
 */
export function AuthCookieSyncClient() {
  useAuthCookieSync();
  return null;
}
