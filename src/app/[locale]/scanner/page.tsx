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
  const [source, setSource] = useState("stooq");
  const [mode, setMode] = useState("ath_real");

  useEffect(() => {
    fetch(
      `/api/scanner?market=ibex35&source=${source}&mode=${mode}`
    )
      .then(res => res.json())
      .then(res => setData(res.data ?? []));
  }, [source, mode]);

  return (
    <div className="flex h-screen">
      <div className="w-1/2 p-4">
        <div className="flex gap-4 mb-4">
          <select value={source} onChange={e => setSource(e.target.value)} className="p-2 border rounded">
            <option value="stooq">Stooq</option>
            <option value="alphavantage">Alpha Vantage</option>
          </select>

          <select value={mode} onChange={e => setMode(e.target.value)} className="p-2 border rounded">
            <option value="ath_real">ATH real</option>
            <option value="ath_52w">ATH 52 semanas</option>
          </select>
        </div>

        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-2 border">Ticker</th>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr
                key={row.ticker}
                onClick={() => setSelected(row)}
                className={`cursor-pointer hover:bg-gray-100 ${selected?.ticker === row.ticker ? 'bg-blue-50' : ''}`}
              >
                <td className="p-2 border font-medium">{row.ticker}</td>
                <td className="p-2 border">{row.name}</td>
                <td className="p-2 border">
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

      <div className="w-1/2 border-l">
        {selected ? (
          <TradingViewWidget symbol={selected.tradingViewSymbol} />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            Selecciona una acción para ver el gráfico
          </div>
        )}
      </div>
    </div>
  );
}
