import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
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

  return (
    <html lang={locale}>
      <body className="relative bg-gray-50 text-gray-900">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <AuthCookieSyncClient />
            <Navbar />
            <main className="min-h-[calc(100vh-4rem)]">
              {children}
            </main>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
