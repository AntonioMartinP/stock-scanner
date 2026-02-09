import { z } from "zod";

export const scannerQuerySchema = z.object({
  market: z.string().min(1),
  source: z.enum(["stooq", "alphavantage", "yahoo"]),
  mode: z.enum(["ath_real", "ath_52w"])
});
