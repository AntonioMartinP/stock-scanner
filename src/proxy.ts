import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Routes that require authentication
const PROTECTED_PATHS = ['/scanner'];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Strip locale prefix to compare: /es/scanner → /scanner
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '');
  const isProtected = PROTECTED_PATHS.some(p => pathnameWithoutLocale.startsWith(p));

  if (isProtected) {
    const sessionCookie = request.cookies.get('auth-session');

    if (!sessionCookie?.value) {
      // Redirect to locale-aware login page
      const locale   = pathname.split('/')[1] ?? 'es';
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};