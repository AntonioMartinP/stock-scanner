export type Candle = {
  date: string;   // ISO yyyy-mm-dd
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type MarketDataProvider = {
  id: "stooq" | "alphavantage";
  getDailyHistory(input: {marketId: string; ticker: string}): Promise<Candle[]>;
};