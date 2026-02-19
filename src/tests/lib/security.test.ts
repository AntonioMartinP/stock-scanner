import { describe, it, expect } from "vitest";
import { sanitizeSymbol } from "@/lib/security";

describe("sanitizeSymbol", () => {
  // ── Símbolos válidos ──────────────────────────────────────
  describe("valid symbols", () => {
    it("allows EXCHANGE:TICKER format", () => {
      expect(sanitizeSymbol("BME:SAN")).toBe("BME:SAN");
    });
    it("allows index with ^ prefix", () => {
      expect(sanitizeSymbol("^IBEX")).toBe("^IBEX");
    });
    it("allows NASDAQ format", () => {
      expect(sanitizeSymbol("NASDAQ:AAPL")).toBe("NASDAQ:AAPL");
    });
    it("allows Italian Borsa format", () => {
      expect(sanitizeSymbol("MIL:ENI")).toBe("MIL:ENI");
    });
    it("allows German XETR format", () => {
      expect(sanitizeSymbol("XETR:SAP")).toBe("XETR:SAP");
    });
    it("allows bare uppercase ticker", () => {
      expect(sanitizeSymbol("DAX")).toBe("DAX");
    });
    it("allows symbol with dot in ticker part", () => {
      expect(sanitizeSymbol("INDEX:FTSEMIB")).toBe("INDEX:FTSEMIB");
    });
  });

  // ── Ataques de inyección ──────────────────────────────────
  describe("injection attacks", () => {
    it("blocks script tag injection", () => {
      expect(sanitizeSymbol("<script>alert(1)</script>")).toBe("");
    });
    it("blocks javascript: protocol", () => {
      expect(sanitizeSymbol("javascript:alert(1)")).toBe("");
    });
    it("blocks event handler injection", () => {
      expect(sanitizeSymbol('" onload="xss')).toBe("");
    });
    it("blocks HTML entity injection", () => {
      expect(sanitizeSymbol("&lt;script&gt;")).toBe("");
    });
    it("blocks URL-encoded injection", () => {
      expect(sanitizeSymbol("%3Cscript%3E")).toBe("");
    });
  });

  // ── Edge cases ────────────────────────────────────────────
  describe("edge cases", () => {
    it("blocks empty string", () => {
      expect(sanitizeSymbol("")).toBe("");
    });
    it("blocks lowercase symbols", () => {
      expect(sanitizeSymbol("nasdaq:aapl")).toBe("");
    });
    it("blocks mixed case symbols", () => {
      expect(sanitizeSymbol("Bme:San")).toBe("");
    });
    it("blocks symbol with spaces", () => {
      expect(sanitizeSymbol("BME: SAN")).toBe("");
    });
    it("blocks symbol with @ character", () => {
      expect(sanitizeSymbol("BME@SAN")).toBe("");
    });
    it("blocks symbol with # character", () => {
      expect(sanitizeSymbol("BME#SAN")).toBe("");
    });
    it("blocks symbol with $ character", () => {
      expect(sanitizeSymbol("$AAPL")).toBe("");
    });
    it("blocks exchange part exceeding 12 chars", () => {
      expect(sanitizeSymbol("TOOLONGEXCHANGENAME:SAN")).toBe("");
    });
    it("blocks ticker part exceeding 20 chars", () => {
      expect(sanitizeSymbol("BME:TOOLONGTICKERVALUE12345")).toBe("");
    });
    it("blocks multiple colon separators", () => {
      expect(sanitizeSymbol("BME:SAN:EXTRA")).toBe("");
    });
    it("blocks newline injection", () => {
      expect(sanitizeSymbol("BME:\nSAN")).toBe("");
    });
    it("blocks null byte injection", () => {
      expect(sanitizeSymbol("BME:\0SAN")).toBe("");
    });
    it("blocks path traversal attempt", () => {
      expect(sanitizeSymbol("../etc/passwd")).toBe("");
    });
    it("blocks SQL injection attempt", () => {
      expect(sanitizeSymbol("'; DROP TABLE stocks;--")).toBe("");
    });
    it("blocks whitespace-only string", () => {
      expect(sanitizeSymbol("   ")).toBe("");
    });
  });

  // ── Símbolos límite permitidos ────────────────────────────
  describe("boundary valid symbols", () => {
    it("allows symbol with hyphen in ticker (e.g. BRK-B)", () => {
      expect(sanitizeSymbol("NYSE:BRK-B")).toBe("NYSE:BRK-B");
    });
    it("allows symbol with dot in ticker (e.g. BRK.B)", () => {
      expect(sanitizeSymbol("NYSE:BRK.B")).toBe("NYSE:BRK.B");
    });
    it("allows numeric-only ticker part", () => {
      expect(sanitizeSymbol("HKEX:700")).toBe("HKEX:700");
    });
    it("allows exchange part at max length (12 chars)", () => {
      expect(sanitizeSymbol("ABCDEFGHIJKL:SAN")).toBe("ABCDEFGHIJKL:SAN");
    });
    it("allows ticker part within max length (18 chars)", () => {
      expect(sanitizeSymbol("BME:ABCDEFGHIJKLMNOPQR")).toBe("BME:ABCDEFGHIJKLMNOPQR"); // 18 chars → allowed
    });
    it("blocks ticker part exceeding max length (21 chars)", () => {
      expect(sanitizeSymbol("BME:ABCDEFGHIJKLMNOPQRSTU")).toBe(""); // 21 chars → blocked
    });
    it("returns empty string — never throws — on any input", () => {
      const dangerous = [null as unknown as string, undefined as unknown as string, 0 as unknown as string];
      for (const input of dangerous) {
        expect(() => sanitizeSymbol(input)).not.toThrow();
      }
    });
  });
});
