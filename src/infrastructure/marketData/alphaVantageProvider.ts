import type { MarketDataProvider, Candle } from "./MarketDataProvider";
import { ProviderRateLimitError } from "./errors";

export const alphaVantageProvider: MarketDataProvider = {
  id: "alphavantage",

  async getDailyHistory({ marketId, ticker }): Promise<Candle[]> {
    // const response = await fetch(/* Alpha Vantage URL built with mapping */);
    // const data = await response.json();
    const data: any = {}; // Placeholder

    if (data?.Note || data?.Information) {
      throw new ProviderRateLimitError(
        "alphavantage",
        "Alpha Vantage rate limit reached. Please try again later."
      );
    }

    // map Alpha Vantage payload to Candle[]
    return [];
  }
};