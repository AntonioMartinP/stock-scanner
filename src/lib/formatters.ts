/**
 * Shared formatting utilities for display layer.
 * Pure functions — no framework dependencies.
 */

/** Formats a numeric value with up to 2 decimal places using locale separator. */
export function fmtMoney(v: number): string {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(v);
}

/** Formats a decimal as a percentage string, e.g. -1.22 → "-1.22%" */
export function fmtPct(v: number): string {
  return `${v.toFixed(2)}%`;
}

/** Formats a Date with day/month/year + hours:minutes:seconds. */
export function fmtDateTimeFull(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    day:    "numeric",
    month:  "numeric",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

/** Returns Tailwind class sets for the distance stat box based on ATH status. */
export function getDistanceStyle(isNewAth: boolean, isNearAth: boolean): {
  bg: string;
  label: string;
  value: string;
} {
  if (isNewAth)  return { bg: "bg-green-50",  label: "text-green-500",  value: "text-green-600"  };
  if (isNearAth) return { bg: "bg-yellow-50", label: "text-yellow-600", value: "text-orange-600" };
  return               { bg: "bg-gray-50",   label: "text-gray-500",   value: "text-gray-900"   };
}
