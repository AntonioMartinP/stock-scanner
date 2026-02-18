import { z } from "zod";

export const scannerQuerySchema = z.object({
  market: z.enum(["ibex35", "dax40"]),
  source: z.enum(["stooq", "alphavantage", "yahoo"]),
  mode: z.enum(["ath_real", "ath_52w"])
});

export type ScannerQuery = z.infer<typeof scannerQuerySchema>;
