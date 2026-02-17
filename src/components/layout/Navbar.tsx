"use client";

import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function Navbar() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">
        
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-indigo-700 text-white shadow-md">
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
                <polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline>
                <polyline points="16 17 22 17 22 11"></polyline>
              </svg>
            </div>
            <span className="hidden text-xl font-bold tracking-tight text-gray-900 sm:block">
              StockScanner
            </span>
          </Link>
        </div>

        {/* Navigation Links - Centered */}
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

        {/* Right Section: Language Switcher */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}
