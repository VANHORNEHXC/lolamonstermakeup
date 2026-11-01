// Requires a local production server and the same .env as that server.
// Synthetic records created here are removed by their exact generated IDs.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
const base = process.argv[2] ?? "http://127.0.0.1:3100";
assert.ok(
	["127.0.0.1", "localhost"].includes(new URL(base).hostname),
	"Run against a local server only.",
);
const sql = neon(process.env.DATABASE_URL_POOLED ?? process.env.DATABASE_URL);
const ids = Array.from({ length: 4 }, () => randomUUID());
const email = `qa-${randomUUID()}@example.com`;
const payload = {
	id: ids[0],
	name: "Prueba automática — eliminar",
	email,
	phone: "",
	service: "Editorial",
	date: "",
	location: "Bogotá (prueba)",
	people: 1,
	message:
		"Registro sintético para verificar el flujo de booking. No contactar.",
	consent: true,
	website: "",
};
const send = (data, headers = {}) =>
	fetch(`${base}/api/bookings`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Origin: new URL(base).origin,
			...headers,
		},
		body: JSON.stringify(data),
	});
try {
	for (const path of [
		"/",
		"/portafolio",
		"/servicios",
		"/sobre-lola",
		"/booking",
		"/api/health",
	])
		assert.equal((await fetch(base + path)).status, 200, path);
	for (const path of [
		"/account",
		"/auth/sign-in",
		"/auth/sign-up",
		"/api/auth/get-session",
	])
		assert.equal((await fetch(base + path)).status, 404, path);
	assert.equal(
		(await fetch(`${base}/api/bookings`)).status,
		405,
		"No public booking list",
	);
	assert.equal((await send({ ...payload, consent: false })).status, 400);
	assert.equal(
		(await send(payload, { Origin: "https://unrelated.example" })).status,
		403,
	);
	assert.equal(
		(await send({ ...payload, message: "x".repeat(17000) })).status,
		413,
	);
	for (const id of ids.slice(0, 3)) {
		const response = await send({ ...payload, id });
		assert.equal(response.status, 201, await response.clone().text());
		assert.equal((await response.json()).id, id);
	}
	assert.equal((await send({ ...payload, id: ids[3] })).status, 429);
	assert.equal((await send(payload)).status, 201, "Retries are idempotent");
	const [saved] =
		await sql`SELECT count(*)::int AS count FROM booking_requests WHERE email = ${email}`;
	assert.equal(saved.count, 3, "No duplicate records");
	console.log(
		"PASS: pages, removed auth routes, input validation, database persistence, rate limit and idempotency.",
	);
} finally {
	await sql`DELETE FROM booking_requests WHERE id = ANY(${ids}::uuid[]) AND email = ${email}`;
	console.log("Synthetic test requests removed.");
}
