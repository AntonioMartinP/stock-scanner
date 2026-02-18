import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import StockDetailsPanel from "@/components/scanner/StockDetailsPanel";
import type { ScannerRow } from "@/application/dto/ScannerResult";

// Mock TradingViewWidget to avoid loading external scripts in tests
vi.mock("@/components/scanner/TradingViewWidget", () => ({
  default: ({ symbol }: { symbol: string }) => (
    <div data-testid="tradingview-widget" data-symbol={symbol} />
  ),
}));

// Mock next-intl hooks used transitively
vi.mock("next-intl", () => ({
  useLocale: () => "es",
}));

const t = (key: string) => key;

const baseRow: ScannerRow = {
  ticker: "SAN",
  name: "Banco Santander",
  tradingViewSymbol: "BME:SAN",
  ath: 11.26,
  previousAth: 11.0,
  currentHigh: 10.77,
  distancePct: -4.37,
  isNewAth: false,
  isNearAth: false,
  lastUpdate: new Date("2026-02-18T19:38:00"),
};

describe("StockDetailsPanel", () => {
  describe("empty state", () => {
    it("renders the empty-state message when row is null", () => {
      render(<StockDetailsPanel row={null} t={t} />);
      expect(screen.getByText("empty.selectRow")).toBeInTheDocument();
    });

    it("does not render any button in empty state", () => {
      render(<StockDetailsPanel row={null} t={t} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("row rendering", () => {
    it("displays the ticker and company name", () => {
      render(<StockDetailsPanel row={baseRow} t={t} />);
      expect(screen.getByText("SAN")).toBeInTheDocument();
      expect(screen.getByText("Banco Santander")).toBeInTheDocument();
    });

    it("renders the TradingView widget with the sanitized symbol", () => {
      render(<StockDetailsPanel row={baseRow} t={t} />);
      const widget = screen.getByTestId("tradingview-widget");
      expect(widget).toBeInTheDocument();
      expect(widget.getAttribute("data-symbol")).toBe("BME:SAN");
    });

    it("blocks unsafe tradingViewSymbol before reaching the widget", () => {
      const maliciousRow: ScannerRow = {
        ...baseRow,
        tradingViewSymbol: '<script>alert(1)</script>',
      };
      render(<StockDetailsPanel row={maliciousRow} t={t} />);
      const widget = screen.getByTestId("tradingview-widget");
      expect(widget.getAttribute("data-symbol")).toBe("");
    });

    it("shows last update formatted text", () => {
      render(<StockDetailsPanel row={baseRow} t={t} />);
      expect(screen.getByText(/2026/)).toBeInTheDocument();
    });

    it('shows "-" when lastUpdate is undefined', () => {
      const noDateRow: ScannerRow = { ...baseRow, lastUpdate: undefined };
      render(<StockDetailsPanel row={noDateRow} t={t} />);
      expect(screen.getByText("-")).toBeInTheDocument();
    });
  });

  describe("ATH status indicators", () => {
    it("does NOT show badge when isNewAth is false", () => {
      render(<StockDetailsPanel row={baseRow} t={t} />);
      expect(screen.queryByText("badge.aboveAth")).not.toBeInTheDocument();
    });

    it("shows badge when isNewAth is true", () => {
      const athRow: ScannerRow = { ...baseRow, isNewAth: true };
      render(<StockDetailsPanel row={athRow} t={t} />);
      expect(screen.getByText("badge.aboveAth")).toBeInTheDocument();
    });
  });

  describe("close button", () => {
    it("does not render close button when onClose is not provided", () => {
      render(<StockDetailsPanel row={baseRow} t={t} />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("renders close button when onClose is provided", () => {
      const onClose = vi.fn();
      render(<StockDetailsPanel row={baseRow} t={t} onClose={onClose} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("calls onClose when close button is clicked", () => {
      const onClose = vi.fn();
      render(<StockDetailsPanel row={baseRow} t={t} onClose={onClose} />);
      fireEvent.click(screen.getByRole("button"));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
