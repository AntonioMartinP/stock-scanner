import type { MarketDataProvider } from "./MarketDataProvider";
import { stooqProvider } from "./stooqProvider";
import { alphaVantageProvider } from "./alphaVantageProvider";
import { yahooProvider } from "./yahooProvider";
import { FallbackProvider } from "./fallbackProvider";

export type DataSource = "stooq" | "alphavantage" | "yahoo";

const providers: Record<DataSource, MarketDataProvider> = {
  stooq: stooqProvider,
  alphavantage: alphaVantageProvider,
  yahoo: yahooProvider
};

/**
 * Markets where Stooq returns no data or incomplete data.
 * These will be transparently routed to Yahoo Finance via FallbackProvider.
 */
const STOOQ_UNSUPPORTED_MARKETS = new Set(["ibex35", "dax40", "ftse_mib40"]);

export function getProvider(source: DataSource, marketId?: string): MarketDataProvider {
  // Use FallbackProvider when Stooq is selected for European indices
  if (source === "stooq" && marketId && STOOQ_UNSUPPORTED_MARKETS.has(marketId)) {
    return new FallbackProvider(providers.stooq, providers.yahoo);
  }

  const provider = providers[source];

  if (!provider) {
    throw new Error(`Unsupported data source: ${source}`);
  }

  return provider;
}