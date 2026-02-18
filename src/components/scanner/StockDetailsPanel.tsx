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
      <div className="h-full p-4 text-sm text-gray-600">
        {t("empty.selectRow")}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div>
        <div className="text-lg font-medium">
          {row.ticker} — {row.name}
        </div>
        <div className="mt-1 text-sm text-gray-600">
          {t("table.currentHigh")}: {fmtMoney(row.currentHigh)} · {t("table.ath")}: {fmtMoney(row.ath)} · {t("table.distance")}: {fmtPct(row.distancePct)}
        </div>
      </div>

      <div className="rounded border p-2 flex-1">
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
