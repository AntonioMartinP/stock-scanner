"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

/**
 * Global error boundary for the [locale] segment.
 * Catches unexpected runtime errors in any page under this layout.
 * Next.js requires this file to be a Client Component.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  useEffect(() => {
    // Log to console (replace with a real error tracker in production)
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <svg
          className="h-8 w-8 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="max-w-md text-sm text-gray-500">{t("description")}</p>
        {error.digest && (
          <p className="text-xs text-gray-400">
            {t("digest")}: <code className="font-mono">{error.digest}</code>
          </p>
        )}
      </div>

      <button
        onClick={reset}
        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   transition-colors"
      >
        {t("retry")}
      </button>
    </div>
  );
}
