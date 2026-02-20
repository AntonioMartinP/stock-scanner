import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import Navbar from '@/components/layout/Navbar';
import { AuthProvider } from '@/context/AuthContext';
import { AuthCookieSyncClient } from '@/components/auth/AuthCookieSyncClient';
import '@/app/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | StockScanner',
    default: 'StockScanner',
  },
  description: 'ATH Scanner — Track all-time highs for IBEX 35 and DAX 40',
  openGraph: {
    title: 'StockScanner',
    description: 'ATH Scanner — Track all-time highs for IBEX 35 and DAX 40',
    type: 'website',
  },
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const tFooter = await getTranslations({locale, namespace: 'footer'});

  return (
    <html lang={locale}>
      <body className="relative bg-gray-50 text-gray-900 flex flex-col min-h-screen">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <AuthCookieSyncClient />
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t border-gray-200 bg-white py-4">
              <p className="text-center text-xs text-gray-400">
                {tFooter('disclaimer')}
              </p>
            </footer>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
