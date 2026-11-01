import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import {
	adminCookie,
	newSessionToken,
	sessionSeconds,
	tokenHash,
	verifyPassword,
} from "@/lib/admin-auth";
import { getSql } from "@/lib/db";

export async function POST(request: Request) {
	const origin = request.headers.get("origin");
	const host = request.headers.get("host") ?? new URL(request.url).host;
	if (origin && origin !== `https://${host}` && origin !== `http://${host}`)
		return new Response("Forbidden", { status: 403 });
	let form: FormData;
	try {
		form = await request.formData();
	} catch {
		return new Response("Bad Request", { status: 400 });
	}
	const username = String(form.get("username") ?? "")
		.trim()
		.toLowerCase();
	const password = String(form.get("password") ?? "");
	const ip =
		request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
	const ipHash = createHash("sha256").update(ip).digest("hex");
	const loginUrl = new URL("/admin/login?error=1", request.url);
	if (!username || username.length > 80 || !password || password.length > 200)
		return NextResponse.redirect(loginUrl, 303);

	const sql = getSql();
	await sql`DELETE FROM admin_login_attempts WHERE created_at < now() - interval '30 days'`;
	await sql`DELETE FROM admin_sessions WHERE expires_at < now()`;
	const [{ failures }] = await sql`
		SELECT count(*)::int AS failures FROM admin_login_attempts
		WHERE username = ${username} AND ip_hash = ${ipHash}
		AND success = false AND created_at > now() - interval '15 minutes'`;
	if (failures >= 5) {
		return NextResponse.redirect(
			new URL("/admin/login?error=limite", request.url),
			303,
		);
	}

	const users =
		await sql`SELECT id, password_hash FROM admin_users WHERE username = ${username} LIMIT 1`;
	const valid = users.length
		? await verifyPassword(password, users[0].password_hash)
		: false;
	await sql`INSERT INTO admin_login_attempts (username, ip_hash, success)
		VALUES (${username}, ${ipHash}, ${valid})`;
	if (!valid) return NextResponse.redirect(loginUrl, 303);

	const token = newSessionToken();
	await sql`INSERT INTO admin_sessions (token_hash, user_id, expires_at)
		VALUES (${tokenHash(token)}, ${users[0].id}::uuid, now() + interval '7 days')`;
	const response = NextResponse.redirect(new URL("/admin", request.url), 303);
	response.cookies.set(adminCookie, token, {
		httpOnly: true,
		secure: process.env.VERCEL === "1",
		sameSite: "strict",
		path: "/",
		maxAge: sessionSeconds,
	});
	return response;
}
