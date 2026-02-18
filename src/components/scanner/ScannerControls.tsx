"use client";

import type { DataSource } from "@/infrastructure/marketData/providerFactory";
import type { AthMode } from "@/domain/services/computeAth";

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
  source: DataSource;
  setSource: (v: DataSource) => void;
  mode: AthMode;
  setMode: (v: AthMode) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  t: (key: string) => string;
}) {
  return (
    <div className="flex flex-wrap items-end gap-4">

      {/* Mercado */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-500">{t("controls.market")}</span>
        <select
          value={marketId}
          onChange={e => setMarketId(e.target.value)}
          className="h-9 rounded-lg border border-gray-300 bg-white px-3 pr-8 text-sm
                     text-gray-800 shadow-sm outline-none focus:border-blue-500
                     focus:ring-2 focus:ring-blue-500/20 appearance-none
                     bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')]
                     bg-[length:20px] bg-[position:right_8px_center] bg-no-repeat"
        >
          {markets.map(m => (
            <option key={m.id} value={m.id}>{m.label}</option>
          ))}
        </select>
      </div>

      {/* Fuente */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-500">{t("controls.source")}</span>
        <select
          value={source}
          onChange={e => setSource(e.target.value as DataSource)}
          className="h-9 rounded-lg border border-gray-300 bg-white px-3 pr-8 text-sm
                     text-gray-800 shadow-sm outline-none focus:border-blue-500
                     focus:ring-2 focus:ring-blue-500/20 appearance-none
                     bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')]
                     bg-[length:20px] bg-[position:right_8px_center] bg-no-repeat"
        >
          <option value="stooq">{t("sources.stooq")}</option>
          <option value="alphavantage">{t("sources.alphavantage")}</option>
          <option value="yahoo">{t("sources.yahoo")}</option>
        </select>
      </div>

      {/* Modo */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-500">{t("controls.mode")}</span>
        <select
          value={mode}
          onChange={e => setMode(e.target.value as AthMode)}
          className="h-9 rounded-lg border border-gray-300 bg-white px-3 pr-8 text-sm
                     text-gray-800 shadow-sm outline-none focus:border-blue-500
                     focus:ring-2 focus:ring-blue-500/20 appearance-none
                     bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')]
                     bg-[length:20px] bg-[position:right_8px_center] bg-no-repeat"
        >
          <option value="ath_real">{t("modes.ath_real")}</option>
          <option value="ath_52w">{t("modes.ath_52w")}</option>
        </select>
      </div>

      {/* Actualizar */}
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm
                   font-semibold text-white shadow-sm transition hover:bg-blue-700
                   disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
        >
          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
        </svg>
        {t("controls.refresh")}
      </button>

    </div>
  );
}
