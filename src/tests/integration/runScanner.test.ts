// src/tests/integration/runScanner.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runScanner } from '@/application/usecases/runScanner';
import * as providerFactory from '@/infrastructure/marketData/providerFactory';

// Mock the provider factory module directly
vi.mock('@/infrastructure/marketData/providerFactory', () => ({
    getProvider: vi.fn(),
    DataSource: vi.fn()
}));

const getProviderMock = providerFactory.getProvider as unknown as ReturnType<typeof vi.fn>;

describe('runScanner Integration', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should aggregate data for a market', async () => {
        // Arrange
        const mockCandles = [
            { date: "2024-01-01", open: 10, high: 20, low: 9, close: 15, volume: 1000 },
            { date: "2024-01-02", open: 15, high: 25, low: 14, close: 24, volume: 1200 }
        ];

        const mockProvider = {
            id: 'yahoo',
            getDailyHistory: vi.fn().mockResolvedValue(mockCandles)
        };

        getProviderMock.mockReturnValue(mockProvider);

        // Act
        // Using 'ibex35' market which has stocks configured
        const results = await runScanner({
            marketId: 'ibex35',
            source: 'yahoo', // Valid now
            mode: 'ath_real'
        });

        // Assert
        expect(getProviderMock).toHaveBeenCalledWith('yahoo');

        // Check that results contain expected data
        // Since ibex35 has 35 stocks, and all return same data -> 35 results
        expect(results.length).toBeGreaterThan(0);
        const first = results[0];
        expect(first.isNewAth).toBe(true);
        expect(first.ath).toBe(25);
    });
});
