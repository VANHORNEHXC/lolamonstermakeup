"use server";

import { cookies } from "next/headers";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import {
	adminCookie,
	hashPassword,
	requireAdmin,
	tokenHash,
	verifyPassword,
} from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { mediaSlots, textFields } from "@/lib/site-data";

const idPattern =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const statuses = new Set(["new", "contacted", "confirmed", "closed"]);
const fieldKeys = new Set<string>(textFields.map((field) => field.key));
const mediaKeys = new Set<string>(mediaSlots.map((slot) => slot.slot));

function money(value: FormDataEntryValue | null): number | null {
	const text = String(value ?? "").trim();
	if (!text) return null;
	const amount = Number(text);
	if (!Number.isSafeInteger(amount) || amount < 0 || amount > 2_000_000_000)
		throw new Error("Monto inválido");
	return amount;
}

export async function updateBooking(form: FormData) {
	await requireAdmin();
	const id = String(form.get("id") ?? "");
	const status = String(form.get("status") ?? "");
	const notes = String(form.get("internal_notes") ?? "").trim();
	if (!idPattern.test(id) || !statuses.has(status) || notes.length > 3000)
		redirect("/admin/solicitudes?error=datos");
	let quote: number | null;
	let revenue: number | null;
	try {
		quote = money(form.get("quote_amount_cop"));
		revenue = money(form.get("revenue_amount_cop"));
	} catch {
		redirect("/admin/solicitudes?error=monto");
	}
	const sql = getSql();
	await sql.transaction([
		sql`UPDATE booking_requests SET status = ${status}, quote_amount_cop = ${quote},
			revenue_amount_cop = ${revenue}, internal_notes = ${notes}, updated_at = now()
			WHERE id = ${id}::uuid`,
		sql`INSERT INTO booking_events (booking_id, action, detail)
			SELECT id, 'updated', ${`Estado: ${status} · Cotización: ${quote ?? "—"} · Ingreso: ${revenue ?? "—"}`}
			FROM booking_requests WHERE id = ${id}::uuid`,
	]);
	redirect("/admin/solicitudes?saved=1");
}

export async function archiveBooking(form: FormData) {
	await requireAdmin();
	const id = String(form.get("id") ?? "");
	if (!idPattern.test(id)) redirect("/admin/solicitudes?error=datos");
	const sql = getSql();
	await sql.transaction([
		sql`UPDATE booking_requests SET archived_at = now(), updated_at = now() WHERE id = ${id}::uuid`,
		sql`INSERT INTO booking_events (booking_id, action, detail)
			SELECT id, 'archived', 'Solicitud archivada' FROM booking_requests WHERE id = ${id}::uuid`,
	]);
	redirect("/admin/solicitudes?saved=1");
}

export async function restoreBooking(form: FormData) {
	await requireAdmin();
	const id = String(form.get("id") ?? "");
	if (!idPattern.test(id)) redirect("/admin/historial?error=datos");
	const sql = getSql();
	await sql.transaction([
		sql`UPDATE booking_requests SET archived_at = NULL, updated_at = now() WHERE id = ${id}::uuid`,
		sql`INSERT INTO booking_events (booking_id, action, detail)
			SELECT id, 'restored', 'Solicitud restaurada' FROM booking_requests WHERE id = ${id}::uuid`,
	]);
	redirect("/admin/historial?saved=1");
}

export async function updateClient(form: FormData) {
	await requireAdmin();
	const email = String(form.get("email") ?? "")
		.toLowerCase()
		.trim();
	const name = String(form.get("name") ?? "").trim();
	const phone = String(form.get("phone") ?? "").trim();
	const notes = String(form.get("notes") ?? "").trim();
	const tagsInput = String(form.get("tags") ?? "");
	const tags = tagsInput
		.split(",")
		.map((tag) => tag.trim())
		.filter(Boolean)
		.slice(0, 10)
		.join(",");
	if (
		!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
		name.length < 2 ||
		name.length > 100 ||
		phone.length > 35 ||
		notes.length > 3000 ||
		tagsInput.length > 500
	)
		redirect("/admin/clientas?error=datos");
	const sql = getSql();
	await sql`UPDATE clients SET name = ${name}, phone = ${phone || null}, notes = ${notes},
		tags = CASE WHEN ${tags} = '' THEN ARRAY[]::text[] ELSE string_to_array(${tags}, ',') END,
		updated_at = now() WHERE email = ${email}`;
	redirect("/admin/clientas?saved=1");
}

export async function createClient(form: FormData) {
	await requireAdmin();
	const email = String(form.get("email") ?? "")
		.toLowerCase()
		.trim();
	const name = String(form.get("name") ?? "").trim();
	const phone = String(form.get("phone") ?? "").trim();
	if (
		!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
		email.length > 254 ||
		name.length < 2 ||
		name.length > 100 ||
		phone.length > 35
	)
		redirect("/admin/clientas?error=datos");
	const sql = getSql();
	await sql`INSERT INTO clients (email, name, phone) VALUES (${email}, ${name}, ${phone || null})
		ON CONFLICT (email) DO NOTHING`;
	redirect("/admin/clientas?saved=1");
}

export async function saveText(form: FormData) {
	await requireAdmin();
	const key = String(form.get("key") ?? "");
	const value = String(form.get("value") ?? "").trim();
	if (!fieldKeys.has(key) || !value || value.length > 5000)
		redirect("/admin/editor?error=texto");
	const sql = getSql();
	await sql`INSERT INTO site_content (key, value) VALUES (${key}, ${value})
		ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`;
	updateTag("site-content");
	redirect(
		key.startsWith("not_found_")
			? "/admin/ajustes?saved=1"
			: "/admin/editor?saved=1",
	);
}

export async function resetMedia(form: FormData) {
	await requireAdmin();
	const slot = String(form.get("slot") ?? "");
	if (!mediaKeys.has(slot)) redirect("/admin/editor?error=media");
	const sql = getSql();
	await sql`DELETE FROM site_media WHERE slot = ${slot}`;
	updateTag("site-media");
	redirect("/admin/editor?saved=1");
}

export async function changePassword(form: FormData) {
	const admin = await requireAdmin();
	const current = String(form.get("current_password") ?? "");
	const next = String(form.get("new_password") ?? "");
	if (next.length < 12 || next.length > 200)
		redirect("/admin/ajustes?error=longitud");
	const sql = getSql();
	const users =
		await sql`SELECT password_hash FROM admin_users WHERE id = ${admin.id}::uuid`;
	if (!users.length || !(await verifyPassword(current, users[0].password_hash)))
		redirect("/admin/ajustes?error=clave");
	const passwordHash = await hashPassword(next);
	await sql.transaction([
		sql`UPDATE admin_users SET password_hash = ${passwordHash}, updated_at = now() WHERE id = ${admin.id}::uuid`,
		sql`DELETE FROM admin_sessions WHERE user_id = ${admin.id}::uuid`,
	]);
	(await cookies()).delete(adminCookie);
	redirect("/admin/login?changed=1");
}

export async function purgeArchived(form: FormData) {
	await requireAdmin();
	if (
		String(form.get("confirmation") ?? "")
			.trim()
			.toUpperCase() !== "ELIMINAR"
	)
		redirect("/admin/ajustes?error=confirmacion");
	const sql = getSql();
	await sql`DELETE FROM booking_requests WHERE id IN (
		SELECT id FROM booking_requests WHERE archived_at < now() - interval '90 days'
		ORDER BY archived_at LIMIT 100
	)`;
	redirect("/admin/ajustes?purged=1");
}

export async function logoutAdmin() {
	const token = (await cookies()).get(adminCookie)?.value;
	if (token) {
		const sql = getSql();
		await sql`DELETE FROM admin_sessions WHERE token_hash = ${tokenHash(token)}`;
	}
	(await cookies()).delete(adminCookie);
	redirect("/admin/login");
}
