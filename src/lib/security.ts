/**
 * Security utilities for input validation and sanitization.
 * All functions are pure and framework-independent to facilitate testing.
 */

/**
 * Allows only canonical TradingView symbol formats:
 *   - INDEX:TICKER  → e.g. BME:SAN, NASDAQ:AAPL, MIL:ENI
 *   - Bare index    → e.g. ^IBEX, DAX
 *
 * Rejects any string containing HTML, script tags, special chars or
 * excessively long inputs that could be used for injection attacks.
 */
const SAFE_SYMBOL_RE = /^[A-Z0-9_^]{1,12}(:[A-Z0-9_.^-]{1,20})?$/;

export function sanitizeSymbol(symbol: string): string {
  return SAFE_SYMBOL_RE.test(symbol) ? symbol : "";
}
