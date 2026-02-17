'use client';

import {Link} from '@/i18n/routing';
import {useTranslations} from 'next-intl';

export default function Home() {
  const t = useTranslations('home');

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t('title')}
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300">
          {t('subtitle')}
        </p>

        <div className="flex justify-center">
          <Link
            href="/scanner"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            {t('goToScanner')}
          </Link>
        </div>
      </div>
    </main>
  );
}
