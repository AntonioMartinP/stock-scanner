import { markets } from "@/config/markets";
import { rateLimiter, getClientIp } from "@/lib/rateLimit";

/** 60 requests per IP per 60 seconds — lightweight endpoint */
const RATE_LIMIT = { max: 60, windowMs: 60_000 };

export async function GET(req: Request) {
  const ip = getClientIp(req);
  const rl = rateLimiter.check(`markets:${ip}`, RATE_LIMIT);

  if (!rl.ok) {
    return Response.json(
      { error: "Too many requests.", type: "RATE_LIMIT" },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    );
  }

  const list = Object.values(markets).map(m => ({
    id: m.id,
    name: m.name
  }));

  return Response.json({ data: list });
}
