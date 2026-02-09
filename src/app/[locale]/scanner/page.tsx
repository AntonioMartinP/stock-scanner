"use client";

import { useEffect, useState } from "react";
import TradingViewWidget from "@/components/scanner/TradingViewWidget";

type ScannerRow = {
  ticker: string;
  name: string;
  tradingViewSymbol: string;
  ath: number;
  currentHigh: number;
  distancePct: number;
  isNewAth: boolean;
  isNearAth: boolean;
};

export default function ScannerPage() {
  const [data, setData] = useState<ScannerRow[]>([]);
  const [selected, setSelected] = useState<ScannerRow | null>(null);
  const [source, setSource] = useState("yahoo");
  const [mode, setMode] = useState("ath_52w");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setErrorMsg(null);
    setLoading(true);

    fetch(`/api/scanner?market=ibex35&source=${source}&mode=${mode}`)
      .then(async res => {
        const payload = await res.json();

        if (!res.ok) {
          setData([]);
          setSelected(null);

          if (res.status === 429) {
            setErrorMsg(payload?.error ?? "Rate limit reached for selected provider.");
            return;
          }

          setErrorMsg(payload?.error ?? "Unexpected error.");
          console.error("API Error:", payload);
          return;
        }

        console.log("Scanner response:", payload);
        setData(payload.data ?? []);
      })
      .catch((err) => {
        console.error("Network error:", err);
        setErrorMsg("Network error.");
      })
      .finally(() => setLoading(false));
  }, [source, mode]);

  return (
    <div className="flex h-screen">
      <div className="w-1/2 p-4 overflow-auto">
        <div className="flex gap-4 mb-4">
          <select value={source} onChange={e => setSource(e.target.value)} className="border p-2 rounded">
            <option value="yahoo">Yahoo Finance</option>
            <option value="stooq">Stooq</option>
            <option value="alphavantage">Alpha Vantage</option>
          </select>

          <select value={mode} onChange={e => setMode(e.target.value)} className="border p-2 rounded">
            <option value="ath_real">ATH real</option>
            <option value="ath_52w">ATH 52 semanas</option>
          </select>
        </div>

        {loading && (
          <div className="mb-3 rounded border p-3 text-sm bg-blue-50">
            Cargando datos...
          </div>
        )}

        {errorMsg && (
          <div className="mb-3 rounded border p-3 text-sm bg-red-50 text-red-800">
            {errorMsg}
          </div>
        )}

        {!loading && !errorMsg && data.length === 0 && (
          <div className="mb-3 rounded border p-3 text-sm bg-yellow-50">
            No hay datos disponibles
          </div>
        )}

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Ticker</th>
              <th className="border p-2 text-left">Nombre</th>
              <th className="border p-2 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr
                key={row.ticker}
                onClick={() => setSelected(row)}
                className={`cursor-pointer hover:bg-gray-100 ${selected?.ticker === row.ticker ? 'bg-blue-50' : ''}`}
              >
                <td className="border p-2">{row.ticker}</td>
                <td className="border p-2">{row.name}</td>
                <td className="border p-2">
                  {row.isNewAth
                    ? "🟢 ATH"
                    : row.isNearAth
                    ? "🟡 Cerca"
                    : "🔴 Lejos"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-1/2 p-4 border-l">
        {selected ? (
          <TradingViewWidget symbol={selected.tradingViewSymbol} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Selecciona una acción para ver el gráfico
          </div>
        )}
      </div>
    </div>
  );
}
