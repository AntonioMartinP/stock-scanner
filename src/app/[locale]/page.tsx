'use client';

import {Link} from '@/i18n/routing';
import {useTranslations} from 'next-intl';

export default function Home() {
  const t = useTranslations('home');

  return (
    <main className="min-h-screen bg-white">

      {/* ── Hero ── */}
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

      {/* ── Sales copy ── */}
      <section className="mx-auto max-w-4xl px-6 py-20 lg:px-8">

        {/* Headline */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t('salesTitle')}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {t('salesSubtitle')}
          </p>
        </div>

        {/* Problem / Solution grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2">

          {/* Problem */}
          <div className="rounded-2xl border border-red-100 bg-red-50 p-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
                <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </span>
              <h3 className="text-base font-semibold uppercase tracking-widest text-red-700">
                {t('problemTitle')}
              </h3>
            </div>
            <ul className="space-y-3">
              {(['problem1', 'problem2', 'problem3'] as const).map(key => (
                <li key={key} className="flex items-start gap-2 text-gray-700">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-400" />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>

          {/* Solution */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <h3 className="text-base font-semibold uppercase tracking-widest text-blue-700">
                {t('solutionTitle')}
              </h3>
            </div>
            <p className="text-gray-700 mb-6">{t('solutionText')}</p>
            <p className="text-sm font-semibold text-gray-800 mb-3">{t('designedFor')}</p>
            <ul className="space-y-2">
              {(['for1', 'for2', 'for3', 'for4'] as const).map(key => (
                <li key={key} className="flex items-center gap-2 text-gray-700">
                  <svg className="h-4 w-4 shrink-0 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/scanner"
            className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {t('goToScanner')}
          </Link>
        </div>

      </section>
    </main>
  );
}
