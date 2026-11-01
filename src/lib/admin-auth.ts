import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSql } from "@/lib/db";

const scryptAsync = promisify(scrypt);
export const adminCookie = "lola_admin";
export const sessionSeconds = 7 * 24 * 60 * 60;

export function tokenHash(token: string): string {
	return createHash("sha256").update(token).digest("hex");
}

export async function hashPassword(password: string): Promise<string> {
	const salt = randomBytes(16).toString("hex");
	const hash = (await scryptAsync(password, salt, 64)) as Buffer;
	return `scrypt:${salt}:${hash.toString("hex")}`;
}

export async function verifyPassword(
	password: string,
	stored: string,
): Promise<boolean> {
	const [algorithm, salt, hex] = stored.split(":");
	if (algorithm !== "scrypt" || !salt || !hex || !/^[0-9a-f]{128}$/.test(hex))
		return false;
	const expected = Buffer.from(hex, "hex");
	const actual = (await scryptAsync(password, salt, expected.length)) as Buffer;
	return timingSafeEqual(actual, expected);
}

export function newSessionToken(): string {
	return randomBytes(32).toString("base64url");
}

export async function getAdmin(): Promise<{
	id: string;
	username: string;
} | null> {
	const token = (await cookies()).get(adminCookie)?.value;
	if (!token || token.length > 100) return null;
	const sql = getSql();
	const rows = await sql`
		SELECT u.id, u.username FROM admin_sessions s
		JOIN admin_users u ON u.id = s.user_id
		WHERE s.token_hash = ${tokenHash(token)} AND s.expires_at > now()
		LIMIT 1`;
	return rows.length ? { id: rows[0].id, username: rows[0].username } : null;
}

export async function requireAdmin(): Promise<{
	id: string;
	username: string;
}> {
	const admin = await getAdmin();
	if (!admin) redirect("/admin/login");
	return admin;
}
