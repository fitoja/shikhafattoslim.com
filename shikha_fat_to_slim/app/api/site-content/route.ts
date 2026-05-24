import { getSiteContent } from "@/lib/siteContent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getSiteContent();
  return Response.json(content);
}
