import { runScanner } from "@/application/usecases/runScanner";
import { ProviderRateLimitError } from "@/infrastructure/marketData/errors";
import { scannerQuerySchema } from "@/lib/validation";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const parsed = scannerQuerySchema.safeParse({
    market: searchParams.get("market"),
    source: searchParams.get("source"),
    mode: searchParams.get("mode")
  });

  if (!parsed.success) {
    return Response.json(
      {
        error: "Invalid query parameters",
        details: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  try {
    const output = await runScanner({
      marketId: parsed.data.market,
      source: parsed.data.source,
      mode: parsed.data.mode
    });

    return Response.json({
      data: output.results,
      fallbackInfo: output.fallbackInfo
    });
  } catch (error) {
    if (error instanceof ProviderRateLimitError) {
      return Response.json(
        {
          error: error.message,
          provider: error.providerId,
          type: "RATE_LIMIT"
        },
        { status: 429 }
      );
    }

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}