"use client";

import React from "react";
import Badge from "@/components/ui/Badge";

export type ScannerRow = {
  ticker: string;
  name: string;
  tradingViewSymbol: string;
  ath: number;
  currentHigh: number;
  distancePct: number;
  isNewAth: boolean;
  isNearAth: boolean;
};

type SortKey = "ticker" | "name" | "currentHigh" | "ath" | "distancePct";

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
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t("controls.search")}
          className="h-9 w-full rounded border px-3 text-sm"
        />
        <button
          onClick={() => setFilter("all")}
          className="h-9 rounded border px-3 text-sm"
        >
          {t("controls.showAll")}
        </button>
        <button
          onClick={() => setFilter("ath")}
          className="h-9 rounded border px-3 text-sm"
        >
          {t("controls.onlyAth")}
        </button>
        <button
          onClick={() => setFilter("near")}
          className="h-9 rounded border px-3 text-sm"
        >
          {t("controls.onlyNear")}
        </button>
      </div>

      <div className="overflow-auto rounded border">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b">
              <Th onClick={() => toggleSort("ticker")}>{t("table.ticker")}</Th>
              <Th onClick={() => toggleSort("name")}>{t("table.name")}</Th>
              <Th>{t("table.status")}</Th>
              <Th onClick={() => toggleSort("currentHigh")}>{t("table.currentHigh")}</Th>
              <Th onClick={() => toggleSort("ath")}>{t("table.ath")}</Th>
              <Th onClick={() => toggleSort("distancePct")}>{t("table.distance")}</Th>
            </tr>
          </thead>

          <tbody>
            {sorted.map(r => {
              const isSelected = selectedTicker === r.ticker;
              const statusKey = r.isNewAth ? "status.ath" : r.isNearAth ? "status.near" : "status.away";
              return (
                <tr
                  key={r.ticker}
                  onClick={() => onSelect(r)}
                  className={[
                    "cursor-pointer border-b hover:bg-gray-50",
                    isSelected ? "bg-gray-100" : ""
                  ].join(" ")}
                >
                  <Td className="font-mono">{r.ticker}</Td>
                  <Td className="truncate max-w-[220px]">{r.name}</Td>
                  <Td>
                    <Badge>{t(statusKey)}</Badge>
                  </Td>
                  <Td>{fmtMoney(r.currentHigh)}</Td>
                  <Td>{fmtMoney(r.ath)}</Td>
                  <Td>{fmtPct(r.distancePct)}</Td>
                </tr>
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <Td colSpan={6} className="py-8 text-center text-gray-500">
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

function Th({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <th
      onClick={onClick}
      className={[
        "px-3 py-2 text-left font-medium",
        onClick ? "cursor-pointer select-none hover:bg-gray-50" : ""
      ].join(" ")}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className,
  colSpan
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td colSpan={colSpan} className={["px-3 py-2", className ?? ""].join(" ")}>
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
