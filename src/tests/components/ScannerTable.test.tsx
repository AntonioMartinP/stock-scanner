// src/tests/components/ScannerTable.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ScannerTable from '@/components/scanner/ScannerTable';
import { ScannerRow } from '@/application/dto/ScannerResult';

// Mock Badge component if complex (optional, but good practice for unit tests of container components)
vi.mock('@/components/ui/Badge', () => ({
    default: ({ children }: any) => <span data-testid="badge">{children}</span>
}));

const mockData: ScannerRow[] = [
    { 
        ticker: 'SAN', 
        name: 'Banco Santander', 
        tradingViewSymbol: 'BME:SAN',
        ath: 10, currentHigh: 9, distancePct: 10, 
        isNewAth: false, isNearAth: true,
        previousAth: 10,
        lastUpdate: new Date('2024-01-01')
    },
    { 
        ticker: 'BBVA', 
        name: 'BBVA Bank', 
        tradingViewSymbol: 'BME:BBVA',
        ath: 20, currentHigh: 21, distancePct: 5, 
        isNewAth: true, isNearAth: false,
        previousAth: 20,
        lastUpdate: new Date('2024-01-01')
    }
];

describe('ScannerTable Component', () => {
    it('renders correct number of rows', () => {
        render(
            <ScannerTable 
                rows={mockData} 
                onSelect={() => {}} 
                selectedTicker={null} 
                t={(k: string) => k} 
                search="" 
                setSearch={() => {}} 
                filter="all" 
                setFilter={() => {}} 
            />
        );
        
        // Check ticker names appear
        expect(screen.getByText('SAN')).toBeInTheDocument();
        expect(screen.getByText('BBVA')).toBeInTheDocument();
        
        // Wait, table rows are rendered via mapping over rows.
        // Assuming implementation renders rows.
    });

    it('filters rows based on search prop', () => {
        // Since filtering logic is INSIDE the component based on props,
        // passing search="SAN" should show SAN but not BBVA.
        // Wait, the component receives `search` state via props, AND implements filtering internally?
        // Let's check the code:
        // `const filtered = rows.filter(r => ... r.ticker.toLowerCase().includes(search)...)`
        // Yes, logic is inside component rendering.
        
        render(
            <ScannerTable 
                rows={mockData} 
                onSelect={() => {}} 
                selectedTicker={null} 
                t={(k: string) => k} 
                search="SAN" 
                setSearch={() => {}} 
                filter="all" 
                setFilter={() => {}} 
            />
        );

        expect(screen.getByText('SAN')).toBeInTheDocument();
        expect(screen.queryByText('BBVA')).not.toBeInTheDocument();
    });

    it('handles row selection', () => {
        const onSelect = vi.fn();
        render(
            <ScannerTable 
                rows={mockData} 
                onSelect={onSelect} 
                selectedTicker={null} 
                t={(k: string) => k} 
                search="" 
                setSearch={() => {}} 
                filter="all" 
                setFilter={() => {}} 
            />
        );

        fireEvent.click(screen.getByText('SAN'));
        expect(onSelect).toHaveBeenCalledWith(mockData[0]);
    });
});
