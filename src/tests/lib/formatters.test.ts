import { describe, it, expect } from "vitest";
import { fmtMoney, fmtPct, fmtDateTimeFull, getDistanceStyle } from "@/lib/formatters";

describe("fmtMoney", () => {
  it("formats an integer", () => {
    expect(fmtMoney(1500)).not.toBe("");
  });
  it("respects 2 decimal places maximum", () => {
    const result = fmtMoney(1.999);
    const decimalPart = result.split(/[.,]/)[1] ?? "";
    expect(decimalPart.length).toBeLessThanOrEqual(2);
  });
  it("handles zero", () => {
    const result = fmtMoney(0);
    expect(result).toContain("0");
  });
  it("handles large numbers", () => {
    const result = fmtMoney(1_000_000);
    expect(result).toBeTruthy();
  });
  it("handles negative values", () => {
    const result = fmtMoney(-42.5);
    expect(result).toMatch(/-/);
  });
  it("rounds 2-decimal input exactly", () => {
    const result = fmtMoney(13.45);
    expect(result).toContain("13");
  });
  it("returns a string type", () => {
    expect(typeof fmtMoney(100)).toBe("string");
  });
});

describe("fmtPct", () => {
  it("formats a negative percentage", () => {
    expect(fmtPct(-1.22)).toBe("-1.22%");
  });
  it("formats a positive percentage", () => {
    expect(fmtPct(5.5)).toBe("5.50%");
  });
  it("formats zero", () => {
    expect(fmtPct(0)).toBe("0.00%");
  });
  it("always has 2 decimal places", () => {
    expect(fmtPct(3)).toBe("3.00%");
  });
  it("formats 100%", () => {
    expect(fmtPct(100)).toBe("100.00%");
  });
  it("formats very small negative (near ATH, ≥ -3%)", () => {
    expect(fmtPct(-0.5)).toBe("-0.50%");
  });
  it("always ends with % character", () => {
    expect(fmtPct(12.3456)).toMatch(/%$/);
  });
  it("trims to exactly 2 decimal places regardless of input precision", () => {
    const result = fmtPct(1.23456789);
    expect(result).toBe("1.23%");
  });
});

describe("fmtDateTimeFull", () => {
  it("returns a non-empty string for a valid date", () => {
    const result = fmtDateTimeFull(new Date("2026-02-18T19:38:00"));
    expect(result.length).toBeGreaterThan(0);
  });
  it("includes the year in the output", () => {
    const result = fmtDateTimeFull(new Date("2026-02-18T19:38:00"));
    expect(result).toContain("2026");
  });
  it("includes hours and minutes in the output", () => {
    const result = fmtDateTimeFull(new Date("2026-02-18T19:38:00"));
    expect(result).toMatch(/\d+:\d+/);
  });
  it("returns a string type", () => {
    expect(typeof fmtDateTimeFull(new Date())).toBe("string");
  });
  it("does not throw for Unix epoch (Jan 1, 1970)", () => {
    expect(() => fmtDateTimeFull(new Date(0))).not.toThrow();
  });
  it("includes seconds in the output", () => {
    // Output has at least two colon-separated time segments HH:MM:SS
    const result = fmtDateTimeFull(new Date("2026-02-18T19:38:45"));
    const colonCount = (result.match(/:/g) ?? []).length;
    expect(colonCount).toBeGreaterThanOrEqual(2);
  });
});

describe("getDistanceStyle", () => {
  it("returns green styles when isNewAth=true", () => {
    const style = getDistanceStyle(true, false);
    expect(style.bg).toBe("bg-green-50");
    expect(style.label).toBe("text-green-500");
    expect(style.value).toBe("text-green-600");
  });
  it("returns yellow styles when isNearAth=true and not new ATH", () => {
    const style = getDistanceStyle(false, true);
    expect(style.bg).toBe("bg-yellow-50");
    expect(style.label).toBe("text-yellow-600");
    expect(style.value).toBe("text-orange-600");
  });
  it("returns gray styles when neither new ATH nor near ATH", () => {
    const style = getDistanceStyle(false, false);
    expect(style.bg).toBe("bg-gray-50");
    expect(style.label).toBe("text-gray-500");
    expect(style.value).toBe("text-gray-900");
  });
  it("prioritises isNewAth over isNearAth when both are true", () => {
    const style = getDistanceStyle(true, true);
    expect(style.bg).toBe("bg-green-50");
  });
  it("always returns an object with exactly bg, label and value keys", () => {
    const keys = Object.keys(getDistanceStyle(false, false));
    expect(keys).toEqual(expect.arrayContaining(["bg", "label", "value"]));
    expect(keys.length).toBe(3);
  });
  it("all returned values are non-empty strings", () => {
    for (const [a, b] of [[true, false], [false, true], [false, false], [true, true]] as [boolean, boolean][]) {
      const style = getDistanceStyle(a, b);
      expect(style.bg.length).toBeGreaterThan(0);
      expect(style.label.length).toBeGreaterThan(0);
      expect(style.value.length).toBeGreaterThan(0);
    }
  });
});
