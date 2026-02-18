"use client";

import { useCallback, useEffect, useState } from "react";
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
    <div className="flex h-screen text-gray-900 bg-white">
      <div className="flex w-1/2 flex-col gap-4 p-4 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold">{t("title")}</div>
          {isRefreshing && <div className="text-sm text-blue-600 animate-pulse font-medium">{t("loading")}</div>}
        </div>

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

        {errorMsg && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {errorMsg}
          </div>
        )}

        <div className="flex-1 overflow-hidden">
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
      </div>

      <div className="w-1/2 border-l border-gray-200 overflow-hidden bg-gray-50">
        <StockDetailsPanel row={selected} t={tStr} />
      </div>
    </div>
  );
}
