"use client";

import TradingViewWidget from "@/components/scanner/TradingViewWidget";
import type { ScannerRow } from "@/application/dto/ScannerResult";

export default function StockDetailsPanel({
  row,
  t,
  onClose
}: {
  row: ScannerRow | null;
  t: (key: string) => string;
  onClose?: () => void;
}) {
  if (!row) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-400">{t("empty.selectRow")}</p>
      </div>
    );
  }

  const distancePositive = row.distancePct >= 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 md:p-6 md:h-full">

      {/* Header: ticker + name + close button on mobile */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xl font-bold text-gray-900">{row.ticker}</span>
          <p className="text-sm text-gray-500">{row.name}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden ml-4 flex h-8 w-8 items-center justify-center
                       rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Colored stat grid (2×2) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Máximo hoy — blue */}
        <div className="rounded-xl bg-blue-50 px-4 py-3">
          <p className="text-xs font-medium text-blue-500">{t("table.currentHigh")}</p>
          <p className="mt-0.5 text-lg font-bold text-gray-900">{fmtMoney(row.currentHigh)}</p>
        </div>
        {/* ATH — purple */}
        <div className="rounded-xl bg-purple-50 px-4 py-3">
          <p className="text-xs font-medium text-purple-500">{t("table.ath")}</p>
          <p className="mt-0.5 text-lg font-bold text-gray-900">{fmtMoney(row.ath)}</p>
        </div>
        {/* Distancia — green if near/ath, orange if positive far */}
        <div className={`rounded-xl px-4 py-3 ${
          row.isNewAth ? "bg-green-50" : row.isNearAth ? "bg-yellow-50" : "bg-gray-50"
        }`}>
          <p className={`text-xs font-medium ${
            row.isNewAth ? "text-green-500" : row.isNearAth ? "text-yellow-600" : "text-gray-500"
          }`}>{t("table.distance")}</p>
          <p className={`mt-0.5 text-lg font-bold ${
            row.isNewAth ? "text-green-600" : row.isNearAth ? "text-orange-600" : "text-gray-900"
          }`}>{fmtPct(row.distancePct)}</p>
          {row.isNewAth && (
            <p className="text-xs text-green-500 mt-0.5">Above ATH</p>
          )}
        </div>
        {/* Última actualización */}
        <div className="rounded-xl bg-gray-50 px-4 py-3">
          <p className="text-xs font-medium text-gray-500">{t("table.lastUpdate")}</p>
          <p className="mt-0.5 text-sm font-semibold text-gray-900">
            {row.lastUpdate ? fmtDateTimeFull(row.lastUpdate) : "-"}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[60vh] md:h-auto md:flex-1 rounded-xl border border-gray-200 overflow-hidden">
        <TradingViewWidget symbol={row.tradingViewSymbol} />
      </div>

    </div>
  );
}

function fmtMoney(v: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(v);
}
function fmtPct(v: number) {
  return `${v.toFixed(2)}%`;
}
function fmtDateTimeFull(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    day:    "numeric",
    month:  "numeric",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}
