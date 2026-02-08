import type { MarketDataProvider } from "./MarketDataProvider";
import { stooqProvider } from "./stooqProvider";
import { alphaVantageProvider } from "./alphaVantageProvider";

export type DataSource = "stooq" | "alphavantage";

const providers: Record<DataSource, MarketDataProvider> = {
  stooq: stooqProvider,
  alphavantage: alphaVantageProvider
};

export function getProvider(source: DataSource): MarketDataProvider {
  const provider = providers[source];

  if (!provider) {
    throw new Error(`Unsupported data source: ${source}`);
  }

  return provider;
}