'use client';

import {Link} from '@/i18n/routing';
import {useTranslations} from 'next-intl';

export default function Home() {
  const t = useTranslations('home');

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src="/hero-ath.webp"
            alt="Dashboard financiero ATH"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/60 mix-blend-multiply" />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              {t('title')}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              {t('subtitle')}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/scanner"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {t('goToScanner')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
