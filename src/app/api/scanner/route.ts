import { getProvider } from "@/infrastructure/marketData/providerFactory";
import { ProviderRateLimitError } from "@/infrastructure/marketData/errors";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const source = searchParams.get("source") as "stooq" | "alphavantage";

  try {
    const provider = getProvider(source);
    // run scanner use case
    return Response.json({ ok: true, data: [] });
  } catch (error) {
    if (error instanceof ProviderRateLimitError) {
      return Response.json(
        {
          ok: false,
          error: {
            type: "RATE_LIMIT",
            provider: error.providerId,
            message: error.message
          }
        },
        { status: 429 }
      );
    }

    throw error;
  }
}