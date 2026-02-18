"use client";

import { useState, FormEvent } from 'react';
import { useRouter }           from 'next/navigation';
import { useTranslations }     from 'next-intl';
import { useLocale }           from 'next-intl';
import { Link }                from '@/i18n/routing';
import { useAuth }             from '@/context/AuthContext';

export default function LoginPage() {
  const { login, error } = useAuth();
  const router           = useRouter();
  const locale           = useLocale();
  const t                = useTranslations('auth');

  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      router.push(`/${locale}/scanner`);
    } catch {
      // Error is already available via AuthContext.error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="rounded-2xl bg-white px-8 py-10 shadow-lg ring-1 ring-gray-100">

          {/* Title */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {t('loginTitle')}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {t('loginSubtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Error banner */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3
                              text-sm text-red-700 ring-1 ring-red-200">
                <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414
                       1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293
                       1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10
                       8.586 8.707 7.293z"
                  />
                </svg>
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('email')}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={submitting}
                placeholder="tu@email.com"
                className="mt-1 block w-full rounded-lg border border-gray-300
                           px-3 py-2.5 text-sm shadow-sm outline-none transition
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                           disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Password + forgot */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  {t('password')}
                </label>
                <Link
                  href="/login"
                  className="text-xs text-blue-600 hover:underline"
                >
                  {t('forgotPassword')}
                </Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={submitting}
                placeholder="••••••••"
                className="mt-1 block w-full rounded-lg border border-gray-300
                           px-3 py-2.5 text-sm shadow-sm outline-none transition
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                           disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg
                         bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white
                         shadow-sm transition hover:bg-blue-700
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50
                         disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12" cy="12" r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  {t('signingIn')}
                </>
              ) : t('signIn')}
            </button>

          </form>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            {t('noAccount')}{' '}
            <Link href="/register" className="font-semibold text-gray-900 hover:underline">
              {t('registerHere')}
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
