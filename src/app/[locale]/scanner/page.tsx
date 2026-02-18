"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ScannerControls from "@/components/scanner/ScannerControls";
import ScannerTable from "@/components/scanner/ScannerTable";
import StockDetailsPanel from "@/components/scanner/StockDetailsPanel";
import type { ScannerRow } from "@/application/dto/ScannerResult";
import type { DataSource } from "@/infrastructure/marketData/providerFactory";
import type { AthMode } from "@/domain/services/computeAth";

export default function ScannerPage() {
  const t = useTranslations("scanner");
  const tStr = (key: string) => t(key as Parameters<typeof t>[0]);

  const [marketId, setMarketId] = useState("ibex35");
  const [source, setSource] = useState<DataSource>("yahoo");
  const [mode, setMode] = useState<AthMode>("ath_real");

  const [rows, setRows] = useState<ScannerRow[]>([]);
  const [selected, setSelected] = useState<ScannerRow | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "ath" | "near">("all");

  const mobilePanelRef = useRef<HTMLDivElement>(null);

  // Scroll down to the detail panel on mobile when a row is selected
  useEffect(() => {
    if (selected && mobilePanelRef.current) {
      setTimeout(() => {
        mobilePanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }, [selected]);

  const [markets, setMarkets] = useState<Array<{id: string; label: string}>>([{id: "ibex35", label: "IBEX 35"}]);

  useEffect(() => {
    fetch("/api/markets")
      .then(r => r.json())
      .then(p => setMarkets((p.data ?? []).map((m: { id: string }) => ({ id: m.id, label: t(`markets.${m.id}` as Parameters<typeof t>[0]) }))))
      .catch(() => {});
  }, [t]);

  const fetchData = useCallback(() => {
    setErrorMsg(null);
    setIsRefreshing(true);

    fetch(`/api/scanner?market=${marketId}&source=${source}&mode=${mode}`)
      .then(async res => {
        const payload = await res.json();

        if (!res.ok) {
          setRows([]);
          setSelected(null);
          setErrorMsg(payload?.error ?? t("errors.unexpected"));
          return;
        }

        const now = new Date();
        const rowsWithTimestamp = (payload.data ?? []).map((row: ScannerRow) => ({
          ...row,
          lastUpdate: now
        }));

        setRows(rowsWithTimestamp);
      })
      .catch(() => setErrorMsg(t("errors.network")))
      .finally(() => setIsRefreshing(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketId, source, mode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    // Mobile: single scrollable column. Desktop: fixed-height two-column split.
    <div className="flex flex-col md:flex-row md:h-[calc(100vh-4rem)] bg-gray-50">

      {/* Main column: controls + table */}
      <div className="flex flex-col gap-4 p-4 md:p-6 w-full md:w-1/2 md:overflow-hidden">

        {/* Controls card */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <ScannerControls
            markets={markets}
            marketId={marketId}
            setMarketId={setMarketId}
            source={source}
            setSource={setSource}
            mode={mode}
            setMode={setMode}
            onRefresh={fetchData}
            isRefreshing={isRefreshing}
            t={tStr}
          />
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {errorMsg}
          </div>
        )}

        {/* Table card: on mobile auto-height; on desktop fills remaining space */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm
                        md:flex-1 md:overflow-hidden">
          <ScannerTable
            rows={rows}
            onSelect={setSelected}
            selectedTicker={selected?.ticker ?? null}
            t={tStr}
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
          />
        </div>

        {/* Mobile detail panel — appears below table when a row is selected */}
        {selected && (
          <div ref={mobilePanelRef} className="md:hidden flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
            <StockDetailsPanel
              row={selected}
              t={tStr}
              onClose={() => setSelected(null)}
            />
          </div>
        )}

      </div>

      {/* Desktop right column — always visible, hidden on mobile */}
      <div className="hidden md:flex md:flex-col md:w-1/2 border-l border-gray-200 bg-white overflow-hidden">
        <StockDetailsPanel row={selected} t={tStr} />
      </div>

    </div>
  );
}
