"use client";

import React from "react";
import type { ScannerRow } from "@/application/dto/ScannerResult";

export type { ScannerRow };

type SortKey = "ticker" | "name" | "currentHigh" | "ath" | "distancePct" | "lastUpdate";

export default function ScannerTable({
  rows,
  onSelect,
  selectedTicker,
  t,
  search,
  setSearch,
  filter,
  setFilter
}: {
  rows: ScannerRow[];
  onSelect: (row: ScannerRow) => void;
  selectedTicker: string | null;
  t: (key: string) => string;
  search: string;
  setSearch: (v: string) => void;
  filter: "all" | "ath" | "near";
  setFilter: (v: "all" | "ath" | "near") => void;
}) {
  const [sortKey, setSortKey] = React.useState<SortKey>("distancePct");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");

  function toggleSort(nextKey: SortKey) {
    if (nextKey === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(nextKey);
      setSortDir("asc");
    }
  }

  const filtered = rows
    .filter(r => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        r.ticker.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q)
      );
    })
    .filter(r => {
      if (filter === "ath") return r.isNewAth;
      if (filter === "near") return r.isNearAth;
      return true;
    });

  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    
    if (sortKey === "lastUpdate") {
      const aTime = a.lastUpdate?.getTime() ?? 0;
      const bTime = b.lastUpdate?.getTime() ?? 0;
      return (aTime - bTime) * dir;
    }
    
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });

  const athCount  = rows.filter(r => r.isNewAth).length;
  const nearCount = rows.filter(r => r.isNearAth).length;
  const allCount  = rows.length;

  return (
    <div className="flex h-full flex-col">

      {/* Search + filters */}
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
        {/* Search with icon */}
        <div className="relative flex-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t("controls.search")}
            className="h-9 w-full rounded-lg border border-gray-200 pl-9 pr-3 text-sm
                       outline-none transition focus:border-blue-500 focus:ring-2
                       focus:ring-blue-500/20"
          />
        </div>

        {/* Filter buttons */}
        <button
          onClick={() => setFilter("all")}
          className={`h-9 rounded-lg px-4 text-sm font-medium transition ${
            filter === "all"
              ? "bg-blue-600 text-white shadow-sm"
              : "border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {t("controls.showAll")} ({allCount})
        </button>
        <button
          onClick={() => setFilter("ath")}
          className={`h-9 rounded-lg px-4 text-sm font-medium transition ${
            filter === "ath"
              ? "bg-blue-600 text-white shadow-sm"
              : "border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {t("controls.onlyAth")} ({athCount})
        </button>
        <button
          onClick={() => setFilter("near")}
          className={`h-9 rounded-lg px-4 text-sm font-medium transition ${
            filter === "near"
              ? "bg-blue-600 text-white shadow-sm"
              : "border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {t("controls.onlyNear")} ({nearCount})
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white z-10 border-b border-gray-100">
            <tr>
              <Th onClick={() => toggleSort("ticker")}>{t("table.ticker")}</Th>
              <Th onClick={() => toggleSort("name")}>{t("table.name")}</Th>
              <Th>{t("table.status")}</Th>
              <Th onClick={() => toggleSort("currentHigh")} align="right">{t("table.currentHigh")}</Th>
              <Th onClick={() => toggleSort("ath")} align="right">{t("table.ath")}</Th>
              <Th onClick={() => toggleSort("distancePct")} align="right">{t("table.distance")}</Th>
              <Th onClick={() => toggleSort("lastUpdate")}>{t("table.lastUpdate")}</Th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(r => {
              const isSelected = selectedTicker === r.ticker;
              const statusKey  = r.isNewAth ? "status.ath" : r.isNearAth ? "status.near" : "status.away";
              return (
                <tr
                  key={r.ticker}
                  onClick={() => onSelect(r)}
                  className={[
                    "cursor-pointer border-b border-gray-200 transition-colors",
                    r.isNewAth               ? "bg-green-50 hover:bg-green-100"   : "",
                    r.isNearAth && !r.isNewAth ? "bg-yellow-50 hover:bg-yellow-100" : "",
                    !r.isNewAth && !r.isNearAth ? "hover:bg-gray-50"              : "",
                    isSelected  ? "outline outline-1 outline-blue-400" : "",
                  ].join(" ")}
                >
                  <Td className="font-mono font-semibold text-gray-900">{r.ticker}</Td>
                  <Td className="truncate max-w-[180px] text-gray-700">{r.name}</Td>
                  <Td>
                    <span className={[
                      "inline-block rounded border px-2 py-0.5 text-xs font-medium",
                      r.isNewAth  ? "border-green-400 text-green-700 bg-green-50"  : "",
                      r.isNearAth && !r.isNewAth ? "border-gray-300 text-gray-600 bg-white" : "",
                      !r.isNewAth && !r.isNearAth ? "border-gray-200 text-gray-400 bg-white" : "",
                    ].join(" ")}>
                      {t(statusKey)}
                    </span>
                  </Td>
                  <Td align="right" className="font-mono text-gray-800">{fmtMoney(r.currentHigh)}</Td>
                  <Td align="right" className="font-mono text-gray-800">{fmtMoney(r.ath)}</Td>
                  <Td align="right" className={`font-mono font-medium ${r.isNearAth && !r.isNewAth ? "text-black-600" : "text-gray-900"}`}>
                    {fmtPct(r.distancePct)}
                  </Td>
                  <Td className="font-mono text-gray-400 text-xs">
                    {r.lastUpdate ? fmtDateTime(r.lastUpdate) : "-"}
                  </Td>
                </tr>
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <Td colSpan={7} className="py-12 text-center text-gray-400">
                  {t("empty.noResults")}
                </Td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, onClick, align }: { children: React.ReactNode; onClick?: () => void; align?: "right" }) {
  return (
    <th
      onClick={onClick}
      className={[
        "px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500",
        align === "right" ? "text-right" : "text-left",
        onClick ? "cursor-pointer select-none hover:text-gray-900" : ""
      ].join(" ")}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className,
  colSpan,
  align
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
  align?: "right";
}) {
  return (
    <td
      colSpan={colSpan}
      className={["px-4 py-2", align === "right" ? "text-right" : "", className ?? ""].join(" ")}
    >
      {children}
    </td>
  );
}

function fmtMoney(v: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(v);
}

function fmtPct(v: number) {
  return `${v.toFixed(2)}%`;
}

function fmtDateTime(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}
