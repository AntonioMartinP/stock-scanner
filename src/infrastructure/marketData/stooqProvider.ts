import type { MarketDataProvider, Candle } from "./MarketDataProvider";

export const stooqProvider: MarketDataProvider = {
  id: "stooq",

  async getDailyHistory({ marketId, ticker }): Promise<Candle[]> {
    // implementation for stooq
    return [];
  }
};