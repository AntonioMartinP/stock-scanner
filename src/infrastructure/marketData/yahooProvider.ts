import type { Candle, MarketDataProvider } from "./MarketDataProvider";
import { marketDataCache } from "@/infrastructure/cache/memoryCache";
import { ibexToYahooSymbol } from "./mappings/ibexMappings";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export const yahooProvider: MarketDataProvider = {
  id: "yahoo" as any,

  async getDailyHistory({ marketId, ticker }): Promise<Candle[]> {
    if (marketId !== "ibex35") {
      throw new Error(`Yahoo provider: unsupported marketId ${marketId}`);
    }

    const symbol = ibexToYahooSymbol[ticker];
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

      const candles: Candle[] = result.map(bar => ({
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
