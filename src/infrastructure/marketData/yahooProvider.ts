import type { Candle, MarketDataProvider } from "./MarketDataProvider";
import { marketDataCache } from "@/infrastructure/cache/memoryCache";
import { ibexToYahooSymbol } from "./mappings/ibexMappings";
import { daxToYahooSymbol } from "./mappings/daxMappings";
import { ftse_mib40ToYahooSymbol } from "./mappings/ftse_mibMappings";
import YahooFinance from "yahoo-finance2";

// Suppress the deprecation notice for historical() → chart() redirect (v3 behaviour)
const yahooFinance = new YahooFinance({ suppressNotices: ["ripHistorical"] });

export const yahooProvider: MarketDataProvider = {
  id: "yahoo",

  async getDailyHistory({ marketId, ticker }): Promise<Candle[]> {
    const mappings: Record<string, Record<string, string>> = {
      ibex35: ibexToYahooSymbol,
      dax40: daxToYahooSymbol,
      ftse_mib40: ftse_mib40ToYahooSymbol
    };

    const symbolMap = mappings[marketId];
    if (!symbolMap) {
      throw new Error(`Yahoo provider: unsupported marketId ${marketId}`);
    }

    const symbol = symbolMap[ticker];
    if (!symbol) {
      console.error(`Yahoo mapping not found for ticker: ${ticker}`);
      throw new Error(`Yahoo mapping not found for ticker: ${ticker}`);
    }

    const cacheKey = marketDataCache.makeKey(["history", "yahoo", marketId, ticker, symbol]);
    const cached = marketDataCache.get<Candle[]>(cacheKey);
    if (cached) {
      console.log(`✓ Cache hit for ${symbol}: ${cached.length} candles`);
      return cached;
    }

    console.log(`Fetching Yahoo Finance data for ${symbol}...`);

    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 5);

      const result = await yahooFinance.historical(symbol, {
        period1: startDate,
        period2: endDate,
        interval: "1d"
      });

      console.log(`✓ Received ${result.length} bars for ${symbol}`);

      const candles: Candle[] = result
        // Defensively filter out bars with missing OHLC fields (can happen on split
        // days, IPO day, or when Yahoo returns a partial intraday bar mid-session)
        .filter(bar =>
          bar.high != null && bar.open != null &&
          bar.low != null && bar.close != null &&
          bar.high > 0 && bar.close > 0
        )
        .map(bar => ({
          date: bar.date.toISOString().split("T")[0],
          open: bar.open,
          high: bar.high,
          low: bar.low,
          close: bar.close,
          volume: bar.volume
        }));

      marketDataCache.set(cacheKey, candles);
      return candles;
    } catch (error: any) {
      console.error(`✗ Yahoo Finance error for ${symbol}:`, error.message);
      throw error;
    }
  }
};
