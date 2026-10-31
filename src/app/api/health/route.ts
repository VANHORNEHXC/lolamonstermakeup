import { checkDatabase } from "@/lib/db";

export async function GET() {
  try {
    await checkDatabase();
    return Response.json({ database: "ok" });
  } catch {
    return Response.json({ database: "unavailable" }, { status: 503 });
  }
}
