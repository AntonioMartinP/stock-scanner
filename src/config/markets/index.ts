import {ibex35Stocks, IBEX35_MARKET_ID} from "./ibex35";
import { dax40Stocks, DAX40_MARKET_ID } from "./dax40";
import { ftse_mib40Stocks, FTSE_MIB40_MARKET_ID } from "./ftse_mib40";

export const markets = {
  [IBEX35_MARKET_ID]: {
    id: IBEX35_MARKET_ID,
    name: "IBEX 35",
    stocks: ibex35Stocks
  },
  [DAX40_MARKET_ID]: {
    id: DAX40_MARKET_ID,
    name: "DAX 40",
    stocks: dax40Stocks
  },
  [FTSE_MIB40_MARKET_ID]: {
    id: FTSE_MIB40_MARKET_ID,
    name: "FTSE MIB 40",
    stocks: ftse_mib40Stocks
  }
} as const;

export type MarketId = keyof typeof markets;