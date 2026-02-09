"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import ScannerControls from "@/components/scanner/ScannerControls";
import ScannerTable, { type ScannerRow } from "@/components/scanner/ScannerTable";
import StockDetailsPanel from "@/components/scanner/StockDetailsPanel";

export default function ScannerPage() {
  const t = useTranslations("scanner");

  const [marketId, setMarketId] = useState("ibex35");
  const [source, setSource] = useState<"stooq" | "alphavantage" | "yahoo">("yahoo");
  const [mode, setMode] = useState<"ath_real" | "ath_52w">("ath_52w");

  const [rows, setRows] = useState<ScannerRow[]>([]);
  const [selected, setSelected] = useState<ScannerRow | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "ath" | "near">("all");

  const [markets, setMarkets] = useState<Array<{id: string; label: string}>>([{id: "ibex35", label: "IBEX 35"}]);

  useEffect(() => {
    fetch("/api/markets")
      .then(r => r.json())
      .then(p => setMarkets((p.data ?? []).map((m: any) => ({ id: m.id, label: m.name }))))
      .catch(() => {});
  }, []);

  const fetchData = () => {
    setErrorMsg(null);
    setIsRefreshing(true);

    fetch(`/api/scanner?market=${marketId}&source=${source}&mode=${mode}`)
      .then(async res => {
        const payload = await res.json();

        if (!res.ok) {
          setRows([]);
          setSelected(null);
          setErrorMsg(payload?.error ?? "Unexpected error.");
          return;
        }

        const now = new Date();
        const rowsWithTimestamp = (payload.data ?? []).map((row: ScannerRow) => ({
          ...row,
          lastUpdate: now
        }));

        setRows(rowsWithTimestamp);
      })
      .catch(() => setErrorMsg("Network error."))
      .finally(() => setIsRefreshing(false));
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    setLoading(false);
  }, [marketId, source, mode]);

  return (
    <div className="flex h-screen text-gray-900 bg-white">
      <div className="flex w-1/2 flex-col gap-4 p-4 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold">{t("title")}</div>
          {loading && <div className="text-sm text-blue-600 animate-pulse font-medium">Loading...</div>}
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
          t={(k) => t(k as any)}
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
            t={(k) => t(k as any)}
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
          />
        </div>
      </div>

      <div className="w-1/2 border-l border-gray-200 overflow-hidden bg-gray-50">
        <StockDetailsPanel row={selected} t={(k) => t(k as any)} />
      </div>
    </div>
  );
}
