// Requires a local production server, .env, and .admin-access.
// Uses synthetic booking/content and restores both before exiting.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const base = process.argv[2] ?? "http://127.0.0.1:3100";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(base).hostname));
const sql = neon(process.env.DATABASE_URL_POOLED ?? process.env.DATABASE_URL);
const access = await readFile(".admin-access", "utf8");
const username = access.match(/^Usuario: (.+)$/m)?.[1];
const password = access.match(/^Clave temporal: (.+)$/m)?.[1];
assert.ok(username && password, "Temporary admin access file is missing");
const id = randomUUID();
const email = `admin-qa-${randomUUID()}@example.com`;
const manualEmail = `manual-qa-${randomUUID()}@example.com`;
const name = "Prueba panel — eliminar";
const beforeContent = await sql`SELECT value FROM site_content WHERE key = 'not_found_title'`;
const originalTitle = beforeContent[0]?.value ?? "Esta página se salió del lienzo.";

function actionId(html, marker) {
	const index = html.indexOf(marker);
	assert.ok(index >= 0, `Form marker missing: ${marker}`);
	const start = html.lastIndexOf("<form", index);
	const form = html.slice(start, html.indexOf("</form>", index));
	const name = form.match(/name="(\$ACTION_ID_[^"]+)"/)?.[1];
	assert.ok(name, "Server Action ID missing");
	return name;
}

async function submit(path, action, fields, cookie) {
	const form = new FormData();
	form.set(action, "");
	for (const [key, value] of Object.entries(fields)) form.set(key, String(value));
	return fetch(base + path, {
		method: "POST",
		headers: { Cookie: cookie, Origin: base },
		body: form,
		redirect: "manual",
	});
}

try {
	const login = await fetch(base + "/api/admin/login", {
		method: "POST",
		body: new URLSearchParams({ username, password }),
		redirect: "manual",
	});
	assert.equal(login.status, 303);
	const cookie = login.headers.get("set-cookie")?.split(";")[0];
	assert.ok(cookie, "Session cookie missing");

	const booking = await fetch(base + "/api/bookings", {
		method: "POST",
		headers: { "Content-Type": "application/json", Origin: base },
		body: JSON.stringify({
			id, name, email, phone: "", service: "Editorial", date: "",
			location: "Bogotá (prueba)", people: 1,
			message: "Solicitud sintética para probar el panel. Eliminar después.",
			consent: true, website: "",
		}),
	});
	assert.equal(booking.status, 201, await booking.clone().text());
	const clientsHtml = await (await fetch(base + "/admin/clientas", { headers: { Cookie: cookie } })).text();
	assert.ok(clientsHtml.includes(email), "Client profile not shown in admin");
	const clientAction = actionId(clientsHtml, `name="email" value="${email}"`);
	assert.equal((await submit("/admin/clientas", clientAction, {
		email, name: "Clienta QA editada", phone: "+57 300 000 0000",
		tags: "Editorial, Recurrente", notes: "Prefiere tonos cálidos",
	}, cookie)).status, 303);
	const [client] = await sql`SELECT name, notes, tags FROM clients WHERE email = ${email}`;
	assert.deepEqual([client.name, client.notes, client.tags],
		["Clienta QA editada", "Prefiere tonos cálidos", ["Editorial", "Recurrente"]]);
	const createAction = actionId(clientsHtml, 'required="" name="email"');
	assert.equal((await submit("/admin/clientas", createAction, {
		name: "Clienta manual QA", email: manualEmail, phone: "",
	}, cookie)).status, 303);
	const [manual] = await sql`SELECT count(*)::int AS count FROM clients WHERE email = ${manualEmail}`;
	assert.equal(manual.count, 1);
	const blocked = await fetch(base + "/admin/solicitudes");
	assert.ok(!(await blocked.text()).includes(name), "Private data leaked without session");
	const requestsHtml = await (await fetch(base + "/admin/solicitudes", { headers: { Cookie: cookie } })).text();
	assert.ok(requestsHtml.includes(name), "Booking not shown in admin");
	const updateAction = actionId(requestsHtml, `name="id" value="${id}"`);
	const update = await submit("/admin/solicitudes", updateAction, {
		id, status: "confirmed", quote_amount_cop: 350000,
		revenue_amount_cop: 150000, internal_notes: "QA temporal",
	}, cookie);
	assert.equal(update.status, 303, await update.clone().text());
	const [saved] = await sql`SELECT status, quote_amount_cop, revenue_amount_cop,
		internal_notes, archived_at FROM booking_requests WHERE id = ${id}::uuid`;
	assert.deepEqual([saved.status, saved.quote_amount_cop, saved.revenue_amount_cop, saved.internal_notes],
		["confirmed", 350000, 150000, "QA temporal"]);
	const analytics = await (await fetch(base + "/admin/analiticas", { headers: { Cookie: cookie } })).text();
	assert.ok(analytics.includes("150.000"), "Registered revenue missing from analytics");
	const [events] = await sql`SELECT count(*)::int AS count FROM booking_events WHERE booking_id = ${id}::uuid`;
	assert.ok(events.count >= 1);
	const archiveAction = actionId(requestsHtml, 'class="admin-archive-form"');
	assert.equal((await submit("/admin/solicitudes", archiveAction, { id }, cookie)).status, 303);
	const [archived] = await sql`SELECT archived_at FROM booking_requests WHERE id = ${id}::uuid`;
	assert.ok(archived.archived_at, "Booking was not archived");
	const historyHtml = await (await fetch(base + "/admin/historial", { headers: { Cookie: cookie } })).text();
	const restoreAction = actionId(historyHtml, `name="id" value="${id}"`);
	assert.equal((await submit("/admin/historial", restoreAction, { id }, cookie)).status, 303);
	const [restored] = await sql`SELECT archived_at FROM booking_requests WHERE id = ${id}::uuid`;
	assert.equal(restored.archived_at, null, "Booking was not restored");

	const settingsHtml = await (await fetch(base + "/admin/ajustes", { headers: { Cookie: cookie } })).text();
	const saveAction = actionId(settingsHtml, 'name="key" value="not_found_title"');
	const temporaryTitle = "Página temporal de prueba QA";
	assert.equal((await submit("/admin/ajustes", saveAction, { key: "not_found_title", value: temporaryTitle }, cookie)).status, 303);
	const [edited] = await sql`SELECT value FROM site_content WHERE key = 'not_found_title'`;
	assert.equal(edited.value, temporaryTitle);
	const notFound = await fetch(base + "/pagina-qa-inexistente");
	assert.equal(notFound.status, 404);
	assert.ok((await notFound.text()).includes(temporaryTitle), "Published 404 did not update");
	assert.equal((await submit("/admin/ajustes", saveAction, { key: "not_found_title", value: originalTitle }, cookie)).status, 303);
	console.log("PASS: private session, client CRM, quote/revenue update, archive/restore, history event, and 404 editor.");
} finally {
	await sql`DELETE FROM booking_requests WHERE id = ${id}::uuid AND email = ${email}`;
	await sql`DELETE FROM clients WHERE email = ${email}`;
	await sql`DELETE FROM clients WHERE email = ${manualEmail}`;
	if (beforeContent.length)
		await sql`UPDATE site_content SET value = ${originalTitle} WHERE key = 'not_found_title'`;
	else
		await sql`DELETE FROM site_content WHERE key = 'not_found_title'`;
	console.log("Synthetic admin records removed.");
}
