import { neon } from "@neondatabase/serverless";

export function getSql() {
  const connectionString = process.env.DATABASE_URL_POOLED ?? process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL_POOLED or DATABASE_URL is required");
  }

  return neon(connectionString);
}

export async function checkDatabase() {
  const sql = getSql();
  await sql`SELECT 1`;
}
