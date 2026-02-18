// src/tests/infrastructure/yahooProvider.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted to ensure mock is available inside factory
const { mockHistorical } = vi.hoisted(() => {
    return { mockHistorical: vi.fn() };
});

// Mock the module before importing the provider
vi.mock('yahoo-finance2', () => {
    return {
        default: class {
            historical = mockHistorical;
        }
    };
});

// Mock cache to avoid cross-test contamination and hitting actual cache
vi.mock('@/infrastructure/cache/memoryCache', () => ({
    marketDataCache: {
        get: vi.fn(), // Default is undefined (null)
        set: vi.fn(),
        makeKey: vi.fn().mockImplementation((p: any[]) => p.join('|'))
    },
    MemoryCache: vi.fn()
}));

import { yahooProvider } from '@/infrastructure/marketData/yahooProvider';

describe('YahooProvider', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should fetch and map data correctly', async () => {
        const mockData = [
            { date: new Date('2024-01-01'), open: 10, high: 11, low: 9, close: 10.5, volume: 1000 }
        ];

        mockHistorical.mockResolvedValue(mockData);

        const result = await yahooProvider.getDailyHistory({
            marketId: 'ibex35',
            ticker: 'SAN'
        });

        // Verify call
        expect(mockHistorical).toHaveBeenCalledWith(
            expect.stringContaining('SAN'), // The mapped symbol e.g. "SAN.MC"
            expect.objectContaining({ interval: '1d' })
        );

        // Verify mapping
        expect(result).toHaveLength(1);
        expect(result[0].close).toBe(10.5);
        // Date mapping to string YYYY-MM-DD
        expect(result[0].date).toBe('2024-01-01');
    });

    it('should throw error on API failure', async () => {
        mockHistorical.mockRejectedValue(new Error('API Down'));

        await expect(yahooProvider.getDailyHistory({
            marketId: 'ibex35',
            ticker: 'SAN'
        })).rejects.toThrow('API Down');
    });
});
