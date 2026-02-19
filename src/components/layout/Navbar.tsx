"use client";

import { useState }                     from 'react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useTranslations }              from 'next-intl';
import { useAuth }                      from '@/context/AuthContext';
import LanguageSwitcher                 from '@/components/ui/LanguageSwitcher';

export default function Navbar() {
  const t                         = useTranslations('nav');
  const pathname                  = usePathname();
  const router                    = useRouter();
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen]   = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    router.push('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">

          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" onClick={closeMenu} className="flex items-center gap-2 transition-opacity hover:opacity-80">
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
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                StockScanner
              </span>
            </Link>
          </div>

          {/* Nav Links — centered, desktop only */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 space-x-8">
            <Link
              href="/"
              className={`text-lg font-medium transition-colors hover:text-blue-600 ${
                isActive('/') ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              {t('home')}
            </Link>
            <Link
              href="/scanner"
              className={`text-lg font-medium transition-colors hover:text-blue-600 ${
                isActive('/scanner') ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              {t('scanner')}
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">

            {/* Desktop: user info + auth buttons + language */}
            <div className="hidden md:flex items-center gap-4">
              {loading && <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />}

              {!loading && user && (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full
                                  bg-blue-100 text-sm font-semibold text-blue-700">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <span className="max-w-[160px] truncate text-sm text-gray-600">
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

              <LanguageSwitcher />
            </div>

            {/* Mobile: hamburger / close button */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg
                         text-gray-600 hover:bg-gray-100 transition"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

          </div>
        </div>
      </nav>

      {/* Mobile dropdown — overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile dropdown — full width */}
      <div
        className={`fixed top-[4rem] left-0 right-0 z-50 bg-white border-b border-gray-200
                    shadow-lg flex flex-col
                    transition-all duration-200 ease-out origin-top md:hidden
                    ${menuOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-0 pointer-events-none'}`}
      >
        {/* Nav links */}
        <div className="flex flex-col px-4 py-2 gap-0.5">
          <Link
            href="/"
            onClick={closeMenu}
            className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition
              ${isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            {t('home')}
          </Link>
          <Link
            href="/scanner"
            onClick={closeMenu}
            className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition
              ${isActive('/scanner') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            {t('scanner')}
          </Link>
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-gray-100" />

        {/* Language switcher */}
        <div className="px-4 py-3">
          <LanguageSwitcher />
        </div>

        {/* User section */}
        {(!loading && user) || (!loading && !user) ? (
          <div className="border-t border-gray-100 px-4 py-3 flex flex-col gap-2">
            {!loading && user && (
              <>
                <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full
                                  bg-blue-100 text-xs font-semibold text-blue-700">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <span className="text-xs text-gray-600 truncate">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-lg
                             bg-red-500 px-3 py-2.5 text-sm font-semibold text-white
                             transition hover:bg-red-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                  </svg>
                  {t('logout')}
                </button>
              </>
            )}

            {!loading && !user && (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex w-full items-center justify-center rounded-lg border
                             border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700
                             transition hover:bg-gray-50"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="flex w-full items-center justify-center rounded-lg bg-blue-600
                             px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
}
