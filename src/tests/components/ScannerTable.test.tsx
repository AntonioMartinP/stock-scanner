// src/tests/components/ScannerTable.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ScannerTable from '@/components/scanner/ScannerTable';
import { ScannerRow } from '@/application/dto/ScannerResult';

vi.mock('@/components/ui/Badge', () => ({
  default: ({ children }: any) => <span data-testid="badge">{children}</span>,
}));

// ── Fixture ────────────────────────────────────────────────────────────────
const sanRow: ScannerRow = {
  ticker: 'SAN', name: 'Banco Santander', tradingViewSymbol: 'BME:SAN',
  ath: 10, currentHigh: 9, distancePct: 10,
  isNewAth: false, isNearAth: true, previousAth: 10,
  lastUpdate: new Date('2024-01-01'),
};
const bbvaRow: ScannerRow = {
  ticker: 'BBVA', name: 'BBVA Bank', tradingViewSymbol: 'BME:BBVA',
  ath: 20, currentHigh: 21, distancePct: 0,
  isNewAth: true, isNearAth: false, previousAth: 20,
  lastUpdate: new Date('2024-01-02'),
};
const iberRow: ScannerRow = {
  ticker: 'IBE', name: 'Iberdrola', tradingViewSymbol: 'BME:IBE',
  ath: 15, currentHigh: 10, distancePct: 33,
  isNewAth: false, isNearAth: false, previousAth: 15,
  lastUpdate: new Date('2024-01-03'),
};

const mockData: ScannerRow[] = [sanRow, bbvaRow, iberRow];

/** Shorthand render with sensible defaults */
function renderTable(overrides: Partial<Parameters<typeof ScannerTable>[0]> = {}) {
  const defaults = {
    rows: mockData,
    onSelect: vi.fn(),
    selectedTicker: null,
    t: (k: string) => k,
    search: '',
    setSearch: vi.fn(),
    filter: 'all' as const,
    setFilter: vi.fn(),
  };
  return render(<ScannerTable {...defaults} {...overrides} />);
}

describe('ScannerTable', () => {

  // ── Basic rendering ──────────────────────────────────────────────────
  describe('basic rendering', () => {
    it('renders all rows when filter is "all" and search is empty', () => {
      renderTable();
      expect(screen.getByText('SAN')).toBeInTheDocument();
      expect(screen.getByText('BBVA')).toBeInTheDocument();
      expect(screen.getByText('IBE')).toBeInTheDocument();
    });

    it('renders an empty table body when rows array is empty', () => {
      renderTable({ rows: [] });
      expect(screen.queryByText('SAN')).not.toBeInTheDocument();
    });
  });

  // ── Search filtering ─────────────────────────────────────────────────
  describe('search filtering', () => {
    it('shows only rows matching ticker search (case-insensitive)', () => {
      renderTable({ search: 'san' });
      expect(screen.getByText('SAN')).toBeInTheDocument();
      expect(screen.queryByText('BBVA')).not.toBeInTheDocument();
      expect(screen.queryByText('IBE')).not.toBeInTheDocument();
    });

    it('shows only rows matching company name search', () => {
      renderTable({ search: 'iberdrola' });
      expect(screen.getByText('IBE')).toBeInTheDocument();
      expect(screen.queryByText('SAN')).not.toBeInTheDocument();
    });

    it('shows all rows when search is a single space (trim makes it empty)', () => {
      renderTable({ search: '  ' });
      expect(screen.getByText('SAN')).toBeInTheDocument();
      expect(screen.getByText('BBVA')).toBeInTheDocument();
    });

    it('shows no rows when search matches nothing', () => {
      renderTable({ search: 'XYZ_NOMATCH' });
      expect(screen.queryByText('SAN')).not.toBeInTheDocument();
      expect(screen.queryByText('BBVA')).not.toBeInTheDocument();
    });
  });

  // ── Status filtering ─────────────────────────────────────────────────
  describe('status filtering', () => {
    it('filter="ath" shows only rows with isNewAth=true', () => {
      renderTable({ filter: 'ath' });
      expect(screen.getByText('BBVA')).toBeInTheDocument();
      expect(screen.queryByText('SAN')).not.toBeInTheDocument();
      expect(screen.queryByText('IBE')).not.toBeInTheDocument();
    });

    it('filter="near" shows only rows with isNearAth=true', () => {
      renderTable({ filter: 'near' });
      expect(screen.getByText('SAN')).toBeInTheDocument();
      expect(screen.queryByText('BBVA')).not.toBeInTheDocument();
      expect(screen.queryByText('IBE')).not.toBeInTheDocument();
    });

    it('filter="all" shows all rows', () => {
      renderTable({ filter: 'all' });
      expect(screen.getAllByRole('row').length).toBeGreaterThanOrEqual(3);
    });
  });

  // ── Row selection ────────────────────────────────────────────────────
  describe('row selection', () => {
    it('calls onSelect with the correct ScannerRow when a row is clicked', () => {
      const onSelect = vi.fn();
      renderTable({ onSelect });
      fireEvent.click(screen.getByText('SAN'));
      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(sanRow);
    });

    it('calls onSelect with the correct row for a different row', () => {
      const onSelect = vi.fn();
      renderTable({ onSelect });
      fireEvent.click(screen.getByText('BBVA'));
      expect(onSelect).toHaveBeenCalledWith(bbvaRow);
    });
  });

  // ── Filter buttons ───────────────────────────────────────────────────
  describe('filter button callbacks', () => {
    it('calls setFilter("ath") when the ATH filter button is clicked', () => {
      const setFilter = vi.fn();
      renderTable({ setFilter });
      fireEvent.click(screen.getByText(/controls\.onlyAth/));
      expect(setFilter).toHaveBeenCalledWith('ath');
    });

    it('calls setFilter("near") when the Near ATH filter button is clicked', () => {
      const setFilter = vi.fn();
      renderTable({ setFilter });
      fireEvent.click(screen.getByText(/controls\.onlyNear/));
      expect(setFilter).toHaveBeenCalledWith('near');
    });

    it('calls setFilter("all") when the All filter button is clicked', () => {
      const setFilter = vi.fn();
      renderTable({ setFilter, filter: 'ath' });
      fireEvent.click(screen.getByText(/controls\.showAll/));
      expect(setFilter).toHaveBeenCalledWith('all');
    });
  });
});
