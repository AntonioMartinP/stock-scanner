import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'always'
});

export type Locale = 'es' | 'en';
export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;

export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);