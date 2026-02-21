import type { MarketDataProvider, Candle } from "./MarketDataProvider";

/**
 * A composite provider that tries a primary provider first.
 * If the primary provider fails (throws an error) or returns no candles,
 * it falls back to a secondary provider.
 *
 * It holds an internal record of which stocks fell back to the secondary provider,
 * which can be retrieved and grouped by the use case for reporting.
 */
export class FallbackProvider implements MarketDataProvider {
  readonly id: DataSource; // Will masquerade as the primary source ID

  private primary: MarketDataProvider;
  private secondary: MarketDataProvider;
  
  // Track stocks that needed fallback: { ticker -> true }
  private fallbackLog: Set<string>;

  constructor(primary: MarketDataProvider, secondary: MarketDataProvider) {
    this.id = primary.id as DataSource;
    this.primary = primary;
    this.secondary = secondary;
    this.fallbackLog = new Set();
  }

  async getDailyHistory(input: { marketId: string; ticker: string }): Promise<Candle[]> {
    const { ticker } = input;
    
    try {
      // 1. Try Primary
      const candles = await this.primary.getDailyHistory(input);
      
      // If primary returns data, great!
      if (candles && candles.length > 0) {
        return candles;
      }
      
      // If primary returns empty (no data), fall through to catch logic
      throw new Error("Primary provider returned empty data");
      
    } catch (error: any) {
      if (error && typeof error === "object" && "name" in error && error.name === "ProviderRateLimitError") {
         throw error; // Don't fallback on rate limits, bubble it up
      }

      console.warn(`[FallbackProvider] Primary (${this.primary.id}) failed for ticker ${ticker}. Trying fallback (${this.secondary.id}). Reason: ${error.message}`);
      
      try {
        // 2. Try Secondary
        const fallbackCandles = await this.secondary.getDailyHistory(input);
        
        // Mark this ticker as having used the fallback
        if (fallbackCandles && fallbackCandles.length > 0) {
          this.fallbackLog.add(ticker);
        }
        
        return fallbackCandles;
      } catch (fallbackError: any) {
        console.error(`[FallbackProvider] Both primary (${this.primary.id}) and secondary (${this.secondary.id}) failed for ticker ${ticker}.`);
        throw fallbackError; // Both failed, give up
      }
    }
  }

  /**
   * Returns a list of tickers that used the secondary provider during the lifetime of this instance.
   */
  getFallbackTickers(): string[] {
    return Array.from(this.fallbackLog);
  }
}

// We need to import DataSource locally since we're using it in the class definition.
import { DataSource } from "./providerFactory";
