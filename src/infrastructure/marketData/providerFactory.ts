import type { MarketDataProvider } from "./MarketDataProvider";
import { mockProvider } from "./mockProvider";
import { alphaVantageProvider } from "./alphaVantageProvider";

export type DataSource = "stooq" | "alphavantage";

const providers: Record<DataSource, MarketDataProvider> = {
  stooq: mockProvider, // Using mock provider since Stooq doesn't have Spanish stock data
  alphavantage: alphaVantageProvider
};

export function getProvider(source: DataSource): MarketDataProvider {
  const provider = providers[source];

  if (!provider) {
    throw new Error(`Unsupported data source: ${source}`);
  }

  return provider;
}