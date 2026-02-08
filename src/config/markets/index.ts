import {ibex35Stocks, IBEX35_MARKET_ID} from "./ibex35";

export const markets = {
  [IBEX35_MARKET_ID]: {
    id: IBEX35_MARKET_ID,
    name: "IBEX 35",
    stocks: ibex35Stocks
  }
} as const;

export type MarketId = keyof typeof markets;