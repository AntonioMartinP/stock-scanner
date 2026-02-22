import Link from "next/link";
import { useTranslations } from "next-intl";

/**
 * 404 page for the [locale] segment.
 * Rendered whenever notFound() is called or a route doesn't exist.
 */
export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
        <span className="text-3xl font-bold text-blue-600" aria-hidden="true">
          404
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="max-w-md text-sm text-gray-500">{t("description")}</p>
      </div>

      <Link
        href="/"
        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   transition-colors"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
