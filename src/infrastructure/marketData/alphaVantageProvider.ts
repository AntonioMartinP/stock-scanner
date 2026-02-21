import type { Candle, MarketDataProvider } from "./MarketDataProvider";
import { ProviderRateLimitError } from "./errors";
import { marketDataCache } from "@/infrastructure/cache/memoryCache";
import { ibexToAlphaVantageSymbol } from "./mappings/ibexMappings";
import { daxToAlphaVantageSymbol } from "./mappings/daxMappings";
import { ftse_mib40ToAlphaVantageSymbol } from "./mappings/ftse_mibMappings";

function mustGetEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

let requestQueue = Promise.resolve();

function enqueueRequest<T>(task: () => Promise<T>): Promise<T> {
  const result = requestQueue.then(async () => {
    try {
      return await task();
    } finally {
      // 1.5 second delay to avoid rate limiting blocks from concurrent/frequent requests
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  });

  // Catch errors so the queue itself doesn't become rejected
  requestQueue = result.catch(() => {}) as Promise<void>;
  
  return result;
}

export const alphaVantageProvider: MarketDataProvider = {
  id: "alphavantage",

  async getDailyHistory({ marketId, ticker }): Promise<Candle[]> {
    const mappings: Record<string, Record<string, string>> = {
      ibex35: ibexToAlphaVantageSymbol,
      dax40: daxToAlphaVantageSymbol,
      ftse_mib40: ftse_mib40ToAlphaVantageSymbol
    };

    const symbolMap = mappings[marketId];
    if (!symbolMap) {
      throw new Error(`Alpha Vantage provider: unsupported marketId ${marketId}`);
    }

    const symbol = symbolMap[ticker];
    if (!symbol) throw new Error(`Alpha Vantage mapping not found for ticker: ${ticker}`);

    const cacheKey = marketDataCache.makeKey(["history", "alphavantage", marketId, ticker, symbol]);
    const cached = marketDataCache.get<Candle[]>(cacheKey);
    if (cached) return cached;

    const apiKey = mustGetEnv("ALPHAVANTAGE_API_KEY");

    const url =
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED` +
      `&symbol=${encodeURIComponent(symbol)}` +
      `&outputsize=full&apikey=${encodeURIComponent(apiKey)}`;

    const data = await enqueueRequest(async () => {
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();

      if (json?.Note || json?.Information) {
        throw new ProviderRateLimitError(
          "alphavantage",
          "Alpha Vantage rate limit reached. Please try again later."
        );
      }
      return json;
    });

    const series = data?.["Time Series (Daily)"];
    if (!series) {
      throw new Error("Alpha Vantage: unexpected response format");
    }

    const candles: Candle[] = Object.entries(series).map(([date, ohlc]: any) => ({
      date,
      open: Number(ohlc["1. open"]),
      high: Number(ohlc["2. high"]),
      low: Number(ohlc["3. low"]),
      close: Number(ohlc["4. close"]),
      volume: Number(ohlc["6. volume"] ?? ohlc["5. volume"])
    }));

    candles.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    marketDataCache.set(cacheKey, candles);
    return candles;
  }
};