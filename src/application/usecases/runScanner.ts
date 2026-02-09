import { markets } from "@/config/markets";
import { getProvider } from "@/infrastructure/marketData/providerFactory";
import { computeAth, AthMode } from "@/domain/services/computeAth";

export async function runScanner(input: {
  marketId: keyof typeof markets;
  source: "stooq" | "alphavantage";
  mode: AthMode;
}) {
  const { marketId, source, mode } = input;
  const market = markets[marketId];

  if (!market) {
    throw new Error(`Unknown market: ${marketId}`);
  }

  const provider = getProvider(source);

  const results = await Promise.all(
    market.stocks.map(async stock => {
      const candles = await provider.getDailyHistory({
        marketId,
        ticker: stock.ticker
      });

      const athResult = computeAth(candles, mode);

      return {
        ticker: stock.ticker,
        name: stock.name,
        tradingViewSymbol: stock.tradingViewSymbol,
        ...athResult
      };
    })
  );

  return results;
}
