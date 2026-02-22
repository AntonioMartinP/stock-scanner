import { runScanner } from "@/application/usecases/runScanner";
import { ProviderRateLimitError, ProviderConfigError } from "@/infrastructure/marketData/errors";
import { scannerQuerySchema } from "@/lib/validation";
import { rateLimiter, getClientIp } from "@/lib/rateLimit";

/** 30 requests per IP per 60 seconds — protects expensive external API calls */
const RATE_LIMIT = { max: 30, windowMs: 60_000 };

export async function GET(req: Request) {
  const ip = getClientIp(req);
  const rl = rateLimiter.check(`scanner:${ip}`, RATE_LIMIT);

  if (!rl.ok) {
    return Response.json(
      { error: "Too many requests. Please wait before retrying.", type: "RATE_LIMIT" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Limit": String(RATE_LIMIT.max),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(rl.resetAt),
        },
      }
    );
  }

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
        { error: error.message, provider: error.providerId, type: "RATE_LIMIT" },
        { status: 429 }
      );
    }

    if (error instanceof ProviderConfigError) {
      return Response.json(
        { error: error.message, provider: error.providerId, type: "NO_API_KEY" },
        { status: 422 }
      );
    }

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}