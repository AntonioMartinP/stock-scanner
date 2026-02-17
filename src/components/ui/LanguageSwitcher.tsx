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
      className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
      role="group"
      aria-label="Language switcher"
    >
      <div className="flex p-0.5">
        {locales.map((locale) => {
          if (!Object.keys(localeNames).includes(locale)) return null;
          return (
            <button
              key={locale}
              onClick={() => changeLanguage(locale)}
              disabled={isPending || locale === currentLocale}
              className={`
                px-3 py-1.5 rounded text-sm font-medium transition-all
                flex items-center gap-1.5
                ${
                  locale === currentLocale
                    ? 'bg-white text-blue-600 shadow-sm border border-gray-100 ring-1 ring-black/5'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }
                ${isPending ? 'opacity-50 cursor-wait' : ''}
              `}
              aria-label={`Switch to ${localeNames[locale]}`}
              aria-pressed={locale === currentLocale}
            >
              <span aria-hidden="true">{localeFlags[locale]}</span>
              <span className="text-sm font-semibold">{locale.toUpperCase()}</span>
            </button>
          );
        })}
      </div>
      {isPending && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 rounded-lg flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}