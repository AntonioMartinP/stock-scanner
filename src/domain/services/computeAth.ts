import type { Candle } from "@/infrastructure/marketData/MarketDataProvider";

export type AthMode = "ath_real" | "ath_52w";

export type AthResult = {
  ath: number;
  currentHigh: number;
  distancePct: number;
  isNewAth: boolean;
  isNearAth: boolean;
};

const NEAR_ATH_THRESHOLD = 3; // percent

export function computeAth(
  candles: Candle[],
  mode: AthMode
): AthResult {
  if (candles.length === 0) {
    throw new Error("No candle data available");
  }

  const sorted = [...candles].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const relevantCandles =
    mode === "ath_52w"
      ? sorted.slice(-252)
      : sorted;

  const previousCandles = relevantCandles.slice(0, -1);
  const lastCandle = relevantCandles[relevantCandles.length - 1];

  const ath = Math.max(...previousCandles.map(c => c.high));
  const currentHigh = lastCandle.high;

  const isNewAth = currentHigh > ath;
  const distancePct = ((ath - currentHigh) / ath) * 100;

  return {
    ath,
    currentHigh,
    distancePct,
    isNewAth,
    isNearAth: !isNewAth && distancePct <= NEAR_ATH_THRESHOLD
  };
}
