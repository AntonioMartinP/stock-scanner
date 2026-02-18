"use client";

import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations }              from 'next-intl';
import { useAuth }                      from '@/context/AuthContext';
import LanguageSwitcher                 from '@/components/ui/LanguageSwitcher';

export default function Navbar() {
  const t                         = useTranslations('nav');
  const pathname                  = usePathname();
  const router                    = useRouter();
  const { user, loading, logout } = useAuth();

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">

        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                <polyline points="16 17 22 17 22 11" />
              </svg>
            </div>
            <span className="hidden text-xl font-bold tracking-tight text-gray-900 sm:block">
              StockScanner
            </span>
          </Link>
        </div>

        {/* Nav Links — centered */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 space-x-8">
          <Link
            href="/"
            className={`text-lg font-medium transition-colors hover:text-blue-600 ${
              isActive('/') ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            {t('home')}
          </Link>

          {/* Scanner always visible — middleware redirects to login if not authenticated */}
          <Link
            href="/scanner"
            className={`text-lg font-medium transition-colors hover:text-blue-600 ${
              isActive('/scanner') ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            {t('scanner')}
          </Link>
        </div>

        {/* Right: user info + logout / login button + language */}
        <div className="flex items-center gap-4">

          {/* Loading skeleton */}
          {loading && (
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
          )}

          {/* Logged in */}
          {!loading && user && (
            <div className="flex items-center gap-3">
              {/* Avatar with email initial */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full
                              bg-blue-100 text-sm font-semibold text-blue-700">
                {user.email?.[0].toUpperCase()}
              </div>
              <span className="hidden max-w-[160px] truncate text-sm text-gray-600 sm:block">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm
                           text-gray-600 transition hover:border-red-200
                           hover:bg-red-50 hover:text-red-600"
              >
                {t('logout')}
              </button>
            </div>
          )}

          {/* Not logged in — Iniciar Sesión + Crear Cuenta */}
          {!loading && !user && (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600
                           transition hover:text-blue-600"
              >
                {t('login')}
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold
                           text-white shadow-sm transition hover:bg-blue-700"
              >
                {t('register')}
              </Link>
            </div>
          )}

          <div className="ml-4">
            <LanguageSwitcher />
          </div>
        </div>

      </div>
    </nav>
  );
}
