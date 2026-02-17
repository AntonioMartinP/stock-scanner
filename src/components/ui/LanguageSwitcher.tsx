"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {useLocale} from "next-intl";
import {locales, type Locale} from "@/i18n/routing";

function stripLocalePrefix(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "/";

  const hasLocalePrefix = locales.includes(parts[0] as Locale);
  const rest = hasLocalePrefix ? parts.slice(1) : parts;

  return rest.length ? `/${rest.join("/")}` : "/";
}

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const localizedPath = stripLocalePrefix(pathname);

  return (
    <nav aria-label="Language selector" className="rounded border bg-white/90 px-2 py-1 text-xs shadow-sm backdrop-blur">
      <ul className="flex items-center gap-2">
        {locales.map((item) => {
          const href = item === "es"
            ? `/es${localizedPath === "/" ? "" : localizedPath}`
            : `/en${localizedPath === "/" ? "" : localizedPath}`;

          const isActive = item === locale;

          return (
            <li key={item}>
              <Link
                href={href}
                className={[
                  "rounded px-2 py-1 transition-colors",
                  isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                ].join(" ")}
              >
                {item.toUpperCase()}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}