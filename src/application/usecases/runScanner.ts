import { markets } from "@/config/markets";
import { getProvider, DataSource } from "@/infrastructure/marketData/providerFactory";
import { computeAth, AthMode } from "@/domain/services/computeAth";
import type { ScannerResult } from "@/application/dto/ScannerResult";

// Type guard to check if provider has our fallback logging method
function hasFallbackLog(provider: any): provider is { getFallbackTickers: () => string[] } {
  return typeof provider.getFallbackTickers === "function";
}

export type ScannerOutput = {
  results: ScannerResult[];
  fallbackInfo: {
    tickers: string[];
  };
};

export async function runScanner(input: {
  marketId: keyof typeof markets;
  source: DataSource;
  mode: AthMode;
}): Promise<ScannerOutput> {
  const { marketId, source, mode } = input;
  const market = markets[marketId];

  if (!market) {
    throw new Error(`Unknown market: ${marketId}`);
  }

  const provider = getProvider(source, marketId);

  const rawResults = await Promise.all(
    market.stocks.map(async stock => {
      try {
        const candles = await provider.getDailyHistory({
          marketId,
          ticker: stock.ticker
        });

        if (!candles || candles.length === 0) {
          console.warn(`No candle data for ${stock.ticker}`);
          return null;
        }

        const athResult = computeAth(candles, mode);

        return {
          ticker: stock.ticker,
          name: stock.name,
          tradingViewSymbol: stock.tradingViewSymbol,
          ...athResult
        };
      } catch (error) {
        if (error && typeof error === "object" && "name" in error && error.name === "ProviderRateLimitError") {
          throw error;
        }
        console.error(`Error scanning ${stock.ticker}:`, error);
        return null;
      }
    })
  );

  // Filter out null results and stocks with ATH=0 (indicates data errors)
  const validResults = rawResults.filter((r): r is NonNullable<typeof r> => r !== null && r.ath !== 0);

  // Determine fallback details
  let fallbackTickers: string[] = [];
  if (hasFallbackLog(provider)) {
    fallbackTickers = provider.getFallbackTickers();
  }

  // Assign dataSource to each result
  const results = validResults.map(r => ({
    ...r,
    // If it fell back, it's yahoo. Otherwise it's the requested source.
    dataSource: fallbackTickers.includes(r.ticker) ? "yahoo" : source 
  }));

  return {
    results,
    fallbackInfo: {
      tickers: fallbackTickers
    }
  };
}
