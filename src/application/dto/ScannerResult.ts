/**
 * DTO representing the result of scanning a single stock.
 * Returned by the runScanner use case and consumed by the UI layer.
 */
export type ScannerResult = {
  ticker: string;
  name: string;
  tradingViewSymbol: string;
  ath: number;
  previousAth: number;
  currentHigh: number;
  distancePct: number;
  isNewAth: boolean;
  isNearAth: boolean;
};

/**
 * UI-level extension of ScannerResult with display metadata.
 */
export type ScannerRow = ScannerResult & {
  lastUpdate?: Date;
};
