import { runScanner } from "@/application/usecases/runScanner";
import { ProviderRateLimitError } from "@/infrastructure/marketData/errors";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const market = searchParams.get("market");
  const source = searchParams.get("source");
  const mode = searchParams.get("mode");

  if (!market || !source || !mode) {
    return Response.json(
      { error: "Missing required query params" },
      { status: 400 }
    );
  }

  try {
    console.log(`[API] Starting scanner - market: ${market}, source: ${source}, mode: ${mode}`);
    
    const data = await runScanner({
      marketId: market as any,
      source: source as any,
      mode: mode as any
    });

    console.log(`[API] Scanner completed - ${data.length} results`);
    return Response.json({ data });
  } catch (error: any) {
    console.error("Scanner API Error:", error);

    if (error instanceof ProviderRateLimitError) {
      return Response.json(
        {
          error: error.message,
          provider: error.providerId
        },
        { status: 429 }
      );
    }

    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}