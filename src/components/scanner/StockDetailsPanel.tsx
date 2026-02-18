"use client";

import TradingViewWidget from "@/components/scanner/TradingViewWidget";
import type { ScannerRow } from "@/application/dto/ScannerResult";

export default function StockDetailsPanel({
  row,
  t
}: {
  row: ScannerRow | null;
  t: (key: string) => string;
}) {
  if (!row) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-400">{t("empty.selectRow")}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 p-6">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-gray-900">{row.ticker}</span>
          <span className="text-base text-gray-500">{row.name}</span>
        </div>
        <div className="mt-3 flex gap-4">
          <Stat label={t("table.currentHigh")} value={fmtMoney(row.currentHigh)} />
          <Stat label={t("table.ath")} value={fmtMoney(row.ath)} />
          <Stat
            label={t("table.distance")}
            value={fmtPct(row.distancePct)}
            valueClass={row.distancePct <= 2 ? "text-orange-600" : "text-gray-900"}
          />
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 rounded-xl border border-gray-200 overflow-hidden">
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

function Stat({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</span>
      <span className={`text-base font-semibold ${valueClass ?? "text-gray-900"}`}>{value}</span>
    </div>
  );
}
