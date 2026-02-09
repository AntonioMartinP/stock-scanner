"use client";

import Select from "@/components/ui/Select";

export default function ScannerControls({
  markets,
  marketId,
  setMarketId,
  source,
  setSource,
  mode,
  setMode,
  onRefresh,
  isRefreshing,
  t
}: {
  markets: Array<{ id: string; label: string }>;
  marketId: string;
  setMarketId: (v: string) => void;
  source: "stooq" | "alphavantage" | "yahoo";
  setSource: (v: any) => void;
  mode: "ath_real" | "ath_52w";
  setMode: (v: any) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  t: (key: string) => string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex items-center gap-2 text-sm">
        <span className="text-gray-600">{t("controls.market")}</span>
        <Select value={marketId} onChange={e => setMarketId(e.target.value)}>
          {markets.map(m => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </Select>
      </label>

      <label className="flex items-center gap-2 text-sm">
        <span className="text-gray-600">{t("controls.source")}</span>
        <Select value={source} onChange={e => setSource(e.target.value)}>
          <option value="stooq">{t("sources.stooq")}</option>
          <option value="alphavantage">{t("sources.alphavantage")}</option>
          <option value="yahoo">{t("sources.yahoo")}</option>
        </Select>
      </label>

      <label className="flex items-center gap-2 text-sm">
        <span className="text-gray-600">{t("controls.mode")}</span>
        <Select value={mode} onChange={e => setMode(e.target.value)}>
          <option value="ath_real">{t("modes.ath_real")}</option>
          <option value="ath_52w">{t("modes.ath_52w")}</option>
        </Select>
      </label>

      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className={[
          "h-9 rounded border px-4 text-sm font-medium",
          isRefreshing 
            ? "cursor-not-allowed bg-gray-100 text-gray-400" 
            : "hover:bg-gray-50 active:bg-gray-100"
        ].join(" ")}
      >
        {isRefreshing ? "⟳ ..." : `⟳ ${t("controls.refresh")}`}
      </button>
    </div>
  );
}
