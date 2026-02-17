"use client";

import {useLocale} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/routing';
import {useTransition} from 'react';
import {locales, type Locale} from '@/i18n/routing';

const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

const localeFlags: Record<Locale, string> = {
  es: '🇪🇸',
  en: '🇬🇧',
};

export default function LanguageSwitcher() {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const changeLanguage = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;
    
    startTransition(() => {
      router.replace(pathname, {locale: newLocale});
    });
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      role="group"
      aria-label="Language switcher"
    >
      <div className="flex gap-1 p-1">
        {locales.map((locale) => (
          <button
            key={locale}
            onClick={() => changeLanguage(locale)}
            disabled={isPending || locale === currentLocale}
            className={`
              px-4 py-2 rounded-md font-medium transition-all
              flex items-center gap-2
              ${
                locale === currentLocale
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
              ${
                isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }
              disabled:cursor-not-allowed
            `}
            aria-label={`Switch to ${localeNames[locale]}`}
            aria-current={locale === currentLocale ? 'true' : 'false'}
          >
            <span aria-hidden="true">{localeFlags[locale]}</span>
            <span className="text-sm font-semibold">{locale.toUpperCase()}</span>
          </button>
        ))}
      </div>
      {isPending && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 rounded-lg flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}