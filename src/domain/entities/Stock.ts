export type CanonicalTicker = string;

export type Stock = {
  marketId: string;           // e.g. "ibex35"
  ticker: CanonicalTicker;    // e.g. "SAN"
  name: string;               // e.g. "Banco Santander"
  tradingViewSymbol: string;  // e.g. "BME:SAN"
};