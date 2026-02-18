// src/tests/integration/runScanner.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runScanner } from '@/application/usecases/runScanner';
import * as providerFactory from '@/infrastructure/marketData/providerFactory';

vi.mock('@/infrastructure/marketData/providerFactory', () => ({
  getProvider: vi.fn(),
  DataSource: vi.fn()
}));

const getProviderMock = providerFactory.getProvider as unknown as ReturnType<typeof vi.fn>;

// Standard two-candle fixture that produces isNewAth=true, ath=25
const ascendingCandles = [
  { date: "2024-01-01", open: 10, high: 20, low: 9,  close: 15, volume: 1000 },
  { date: "2024-01-02", open: 15, high: 25, low: 14, close: 24, volume: 1200 },
];

function makeProvider(candles: typeof ascendingCandles | null, rejectWith?: string) {
  const getDailyHistory = rejectWith
    ? vi.fn().mockRejectedValue(new Error(rejectWith))
    : vi.fn().mockResolvedValue(candles);
  return { id: 'mock', getDailyHistory };
}

describe('runScanner Integration', () => {
  beforeEach(() => vi.resetAllMocks());

  // ── Happy path ─────────────────────────────────────────────────────────
  describe("happy path", () => {
    it("returns results for every stock in a known market", async () => {
      getProviderMock.mockReturnValue(makeProvider(ascendingCandles));

      const results = await runScanner({ marketId: 'ibex35', source: 'yahoo', mode: 'ath_real' });

      expect(getProviderMock).toHaveBeenCalledWith('yahoo');
      expect(results.length).toBeGreaterThan(0);
    });

    it("computes isNewAth=true when last candle beats all previous highs", async () => {
      getProviderMock.mockReturnValue(makeProvider(ascendingCandles));

      const results = await runScanner({ marketId: 'ibex35', source: 'yahoo', mode: 'ath_real' });

      const first = results[0];
      expect(first.isNewAth).toBe(true);
      expect(first.ath).toBe(25);
      expect(first.currentHigh).toBe(25);
    });

    it("result rows contain required ScannerResult fields", async () => {
      getProviderMock.mockReturnValue(makeProvider(ascendingCandles));

      const results = await runScanner({ marketId: 'ibex35', source: 'yahoo', mode: 'ath_real' });

      const row = results[0];
      expect(row).toHaveProperty('ticker');
      expect(row).toHaveProperty('name');
      expect(row).toHaveProperty('tradingViewSymbol');
      expect(row).toHaveProperty('ath');
      expect(row).toHaveProperty('distancePct');
      expect(row).toHaveProperty('isNewAth');
      expect(row).toHaveProperty('isNearAth');
    });
  });

  // ── Error paths ───────────────────────────────────────────────────────
  describe("error paths", () => {
    it("throws for an unknown marketId", async () => {
      getProviderMock.mockReturnValue(makeProvider(ascendingCandles));

      await expect(
        runScanner({ marketId: 'nonexistent_market' as any, source: 'yahoo', mode: 'ath_real' })
      ).rejects.toThrow('Unknown market');
    });

    it("silently skips stocks whose provider call throws an error", async () => {
      // Provider always throws — all stocks fail
      getProviderMock.mockReturnValue(makeProvider(null, 'Network error'));

      const results = await runScanner({ marketId: 'ibex35', source: 'yahoo', mode: 'ath_real' });

      // Should return empty array, not throw
      expect(results).toEqual([]);
    });

    it("silently skips stocks that return empty candle arrays", async () => {
      getProviderMock.mockReturnValue(makeProvider([]));

      const results = await runScanner({ marketId: 'ibex35', source: 'yahoo', mode: 'ath_real' });

      expect(results).toEqual([]);
    });

    it("filters out stocks whose computed ATH is 0 (data error indicator)", async () => {
      // A single candle returns ath=0 (insufficient data guard in computeAth)
      const singleCandle = [{ date: "2024-01-01", open: 10, high: 15, low: 9, close: 14, volume: 1 }];
      getProviderMock.mockReturnValue(makeProvider(singleCandle as any));

      const results = await runScanner({ marketId: 'ibex35', source: 'yahoo', mode: 'ath_real' });

      expect(results.every(r => r.ath !== 0)).toBe(true);
    });
  });

  // ── Mode switching ─────────────────────────────────────────────────────
  describe("mode switching", () => {
    it("passes ath_52w mode through to computeAth without throwing", async () => {
      getProviderMock.mockReturnValue(makeProvider(ascendingCandles));

      const results = await runScanner({ marketId: 'ibex35', source: 'yahoo', mode: 'ath_52w' });

      expect(results.length).toBeGreaterThan(0);
    });
  });
});
