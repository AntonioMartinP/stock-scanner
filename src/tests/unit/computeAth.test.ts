import { describe, it, expect } from "vitest";
import { computeAth } from "@/domain/services/computeAth";

// ── Helpers ────────────────────────────────────────────────────────────────
const candle = (date: string, high: number) => ({
  date,
  open: high * 0.9,
  high,
  low: high * 0.8,
  close: high * 0.95,
  volume: 1000,
});

/** Generates n sequential daily candles starting from 2024-01-01. */
function makeCandles(highs: number[]): ReturnType<typeof candle>[] {
  return highs.map((h, i) => {
    const d = new Date(2024, 0, 1 + i);
    return candle(d.toISOString().slice(0, 10), h);
  });
}

// ── Fixtures ───────────────────────────────────────────────────────────────
const threeCandles = makeCandles([12, 13, 20]); // last is new ATH

describe("computeAth", () => {

  // ── Guard: insufficient data ────────────────────────────────────────────
  describe("guard clauses", () => {
    it("returns zero-value result for empty candles array", () => {
      const r = computeAth([] as any, "ath_real");
      expect(r.ath).toBe(0);
      expect(r.isNewAth).toBe(false);
      expect(r.isNearAth).toBe(false);
    });

    it("returns zero-value result for a single candle (no history to compare)", () => {
      const r = computeAth([candle("2024-01-01", 10)] as any, "ath_real");
      expect(r.ath).toBe(0);
      expect(r.currentHigh).toBe(0);
    });
  });

  // ── ATH detection ──────────────────────────────────────────────────────
  describe("ATH detection (ath_real mode)", () => {
    it("detects a new ATH when last candle high exceeds all previous highs", () => {
      const r = computeAth(threeCandles as any, "ath_real");
      expect(r.isNewAth).toBe(true);
      expect(r.currentHigh).toBe(20);
      expect(r.previousAth).toBe(13);
      expect(r.ath).toBe(20); // ath = currentHigh when isNewAth
    });

    it("does NOT flag isNewAth when last candle is below previous peak", () => {
      const r = computeAth(makeCandles([20, 13, 15]) as any, "ath_real");
      expect(r.isNewAth).toBe(false);
      expect(r.currentHigh).toBe(15);
      expect(r.previousAth).toBe(20);
      expect(r.ath).toBe(20); // ath = previousAth when not new
    });

    it("does NOT flag isNewAth when last candle exactly equals previous ATH", () => {
      const r = computeAth(makeCandles([20, 15, 20]) as any, "ath_real");
      expect(r.isNewAth).toBe(false); // must be strictly greater
    });

    it("uses intraday high, not close, for ATH comparison", () => {
      // close is below previous ATH but intraday high is above
      const cs = [
        { date: "2024-01-01", open: 10, high: 15, low: 9,  close: 10, volume: 1000 },
        { date: "2024-01-02", open: 10, high: 16, low: 9,  close: 10, volume: 1000 },
      ];
      const r = computeAth(cs as any, "ath_real");
      expect(r.isNewAth).toBe(true);
      expect(r.currentHigh).toBe(16);
    });
  });

  // ── Near-ATH detection ────────────────────────────────────────────────
  describe("near-ATH detection (3% threshold)", () => {
    it("marks isNearAth when distance is within 3%", () => {
      // ATH = 20, currentHigh = 19.6 → distance = 2%
      const r = computeAth(makeCandles([20, 19.6]) as any, "ath_real");
      expect(r.isNewAth).toBe(false);
      expect(r.isNearAth).toBe(true);
    });

    it("marks isNearAth at exactly 3% distance", () => {
      // ATH = 100, currentHigh = 97 → distance = 3%
      const r = computeAth(makeCandles([100, 97]) as any, "ath_real");
      expect(r.isNearAth).toBe(true);
    });

    it("does NOT mark isNearAth when distance exceeds 3%", () => {
      // ATH = 100, currentHigh = 96 → distance = 4%
      const r = computeAth(makeCandles([100, 96]) as any, "ath_real");
      expect(r.isNearAth).toBe(false);
    });

    it("isNearAth is false when isNewAth is true (mutually exclusive)", () => {
      const r = computeAth(threeCandles as any, "ath_real");
      expect(r.isNewAth).toBe(true);
      expect(r.isNearAth).toBe(false);
    });
  });

  // ── distancePct calculation ───────────────────────────────────────────
  describe("distancePct calculation", () => {
    it("calculates negative distance when below ATH", () => {
      // ATH = 20, current = 18 → (20-18)/20 * 100 = 10%
      const r = computeAth(makeCandles([20, 18]) as any, "ath_real");
      expect(r.distancePct).toBeCloseTo(10, 2);
    });

    it("returns 0 distance when exactly at ATH (before new ATH is declared)", () => {
      const r = computeAth(makeCandles([20, 20]) as any, "ath_real");
      expect(r.distancePct).toBeCloseTo(0, 2);
    });
  });

  // ── Candle ordering ───────────────────────────────────────────────────
  describe("candle ordering", () => {
    it("sorts unsorted candles by date before computing ATH", () => {
      // Provide candles OUT of date order — last by date should still be treated as current
      const shuffled = [
        candle("2024-01-03", 20), // this is the LAST chronologically
        candle("2024-01-01", 12),
        candle("2024-01-02", 13),
      ];
      const r = computeAth(shuffled as any, "ath_real");
      expect(r.isNewAth).toBe(true);
      expect(r.currentHigh).toBe(20);
    });
  });

  // ── 52-week mode ──────────────────────────────────────────────────────
  describe("ath_52w mode (rolling 252 candles)", () => {
    it("only considers last 252 candles in ath_52w mode", () => {
      // Create 300 candles where candle 0 has a huge spike (>1yr ago)
      // In ath_52w mode that old spike should be ignored
      const highs = Array.from({ length: 300 }, (_, i) => (i === 0 ? 9999 : 10 + i * 0.01));
      const cs = makeCandles(highs);
      const rFull = computeAth(cs as any, "ath_real");
      const r52w  = computeAth(cs as any, "ath_52w");
      // In full mode, old spike makes it hard to beat ATH; in 52w it is excluded
      expect(rFull.ath).toBe(9999);
      expect(r52w.ath).toBeLessThan(9999);
    });
  });
});
