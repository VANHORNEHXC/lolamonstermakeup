import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";
const connectionString =
	process.env.DATABASE_URL_POOLED ?? process.env.DATABASE_URL;
if (!connectionString)
	throw new Error("Configura DATABASE_URL_POOLED o DATABASE_URL.");
const sql = neon(connectionString);
for (const name of ["001_booking_requests.sql", "002_admin.sql"]) {
	const migration = await readFile(
		new URL(`../db/migrations/${name}`, import.meta.url),
		"utf8",
	);
	const statements = migration
		.split(";")
		.map((statement) => statement.trim())
		.filter(Boolean);
	await sql.transaction(statements.map((statement) => sql.query(statement)));
	console.log(`Migración ${name} lista.`);
}
