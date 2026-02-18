import type { Candle, MarketDataProvider } from "./MarketDataProvider";
import { marketDataCache } from "@/infrastructure/cache/memoryCache";
import { ibexToStooqSymbol } from "./mappings/ibexMappings";
import { daxToStooqSymbol } from "./mappings/daxMappings";
import { ftse_mib40ToStooqSymbol } from "./mappings/ftse_mibMappings";

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
    const mappings: Record<string, Record<string, string>> = {
      ibex35: ibexToStooqSymbol,
      dax40: daxToStooqSymbol,
      ftse_mib40: ftse_mib40ToStooqSymbol
    };

    const symbolMap = mappings[marketId];
    if (!symbolMap) {
      throw new Error(`Stooq provider: unsupported marketId ${marketId}`);
    }

    const symbol = symbolMap[ticker];
    if (!symbol) throw new Error(`Stooq mapping not found for ticker: ${ticker}`);

    const cacheKey = marketDataCache.makeKey(["history", "stooq", marketId, ticker, symbol]);
    const cached = marketDataCache.get<Candle[]>(cacheKey);
    if (cached) return cached;

    const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(symbol)}&i=d`;
    console.log(`[Stooq] Fetching ${symbol} from ${url}`);
    
    const res = await fetch(url, { 
      cache: "no-store",
      headers: {
        'Accept': 'text/csv,application/csv,*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (!res.ok) {
      console.error(`[Stooq] Request failed for ${symbol}: ${res.status}`);
      throw new Error(`Stooq request failed: ${res.status}`);
    }

    const csv = await res.text();
    console.log(`[Stooq] Response for ${symbol}:`, csv.substring(0, 200));
    
    const candles = parseStooqCsv(csv);
    console.log(`[Stooq] Parsed ${candles.length} candles for ${symbol}`);

    marketDataCache.set(cacheKey, candles);
    return candles;
  }
};