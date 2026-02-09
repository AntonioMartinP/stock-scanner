import { markets } from "@/config/markets";

export async function GET() {
  const list = Object.values(markets).map(m => ({
    id: m.id,
    name: m.name
  }));

  return Response.json({ data: list });
}
