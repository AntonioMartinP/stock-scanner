import type { Candle, MarketDataProvider } from "./MarketDataProvider";
import { marketDataCache } from "@/infrastructure/cache/memoryCache";
import { ibexToStooqSymbol } from "./mappings/ibexMappings";

function parseStooqCsv(csv: string): Candle[] {
  const lines = csv.trim().split("\n");
  const header = lines.shift();
  if (!header) return [];

  // Expected: Date,Open,High,Low,Close,Volume
  return lines
    .map(line => line.split(","))
    .filter(cols => cols.length >= 6)
    .map(cols => ({
      date: cols[0],
      open: Number(cols[1]),
      high: Number(cols[2]),
      low: Number(cols[3]),
      close: Number(cols[4]),
      volume: Number(cols[5])
    }))
    .filter(c => Number.isFinite(c.high) && c.high > 0);
}

export const stooqProvider: MarketDataProvider = {
  id: "stooq",

  async getDailyHistory({ marketId, ticker }): Promise<Candle[]> {
    if (marketId !== "ibex35") {
      throw new Error(`Stooq provider: unsupported marketId ${marketId}`);
    }

    const symbol = ibexToStooqSymbol[ticker];
    if (!symbol) throw new Error(`Stooq mapping not found for ticker: ${ticker}`);

    const cacheKey = marketDataCache.makeKey(["history", "stooq", marketId, ticker, symbol]);
    const cached = marketDataCache.get<Candle[]>(cacheKey);
    if (cached) return cached;

    const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(symbol)}&i=d`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Stooq request failed: ${res.status}`);

    const csv = await res.text();
    const candles = parseStooqCsv(csv);

    marketDataCache.set(cacheKey, candles);
    return candles;
  }
};