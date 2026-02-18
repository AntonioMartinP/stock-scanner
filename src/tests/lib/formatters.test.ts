import { describe, it, expect } from "vitest";
import { fmtMoney, fmtPct, fmtDateTimeFull, getDistanceStyle } from "@/lib/formatters";

describe("fmtMoney", () => {
  it("formats an integer", () => {
    expect(fmtMoney(1500)).not.toBe("");
  });
  it("respects 2 decimal places maximum", () => {
    // Should not produce more than 2 decimal digits
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
    const result = fmtPct(3);
    expect(result).toBe("3.00%");
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
    // Result should contain numeric time parts
    expect(result).toMatch(/\d+:\d+/);
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
});
