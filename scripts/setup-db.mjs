import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";
const connectionString =
	process.env.DATABASE_URL_POOLED ?? process.env.DATABASE_URL;
if (!connectionString)
	throw new Error("Configura DATABASE_URL_POOLED o DATABASE_URL.");
const sql = neon(connectionString);
const migration = await readFile(
	new URL("../db/migrations/001_booking_requests.sql", import.meta.url),
	"utf8",
);
const statements = migration
	.split(";")
	.map((statement) => statement.trim())
	.filter(Boolean);
await sql.transaction(statements.map((statement) => sql.query(statement)));
console.log("Base de datos de solicitudes lista.");
