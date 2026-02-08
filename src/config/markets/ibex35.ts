import type {Stock} from "@/domain/entities/Stock";

export const IBEX35_MARKET_ID = "ibex35";

export const ibex35Stocks: Stock[] = [
  {marketId: IBEX35_MARKET_ID, ticker: "SAN", name: "Banco Santander", tradingViewSymbol: "BME:SAN"},
  {marketId: IBEX35_MARKET_ID, ticker: "BBVA", name: "BBVA", tradingViewSymbol: "BME:BBVA"},
  {marketId: IBEX35_MARKET_ID, ticker: "IBE", name: "Iberdrola", tradingViewSymbol: "BME:IBE"},
  {marketId: IBEX35_MARKET_ID, ticker: "ITX", name: "Inditex", tradingViewSymbol: "BME:ITX"}
  // luego metemos el resto del IBEX
];