import { describe, it, expect } from "vitest";
import { computeAth } from "@/domain/services/computeAth";

const candles = [
  { date: "2024-01-01", open: 10, high: 12, low: 9, close: 11, volume: 1000 },
  { date: "2024-01-02", open: 11, high: 13, low: 10, close: 12, volume: 1000 },
  { date: "2024-01-03", open: 12, high: 20, low: 11, close: 19, volume: 1000 }
];

describe("computeAth", () => {
  it("detects a new ATH using intraday high", () => {
    const r = computeAth(candles as any, "ath_real");
    expect(r.isNewAth).toBe(true);
    expect(r.currentHigh).toBe(20);
    expect(r.ath).toBe(13);
  });

  it("marks near ATH when within threshold and not a new ATH", () => {
    const candles2 = [
      { date: "2024-01-01", open: 10, high: 20, low: 9, close: 11, volume: 1000 },
      { date: "2024-01-02", open: 11, high: 19.6, low: 10, close: 12, volume: 1000 }
    ];
    const r = computeAth(candles2 as any, "ath_real");
    expect(r.isNewAth).toBe(false);
    expect(r.isNearAth).toBe(true);
  });
});
