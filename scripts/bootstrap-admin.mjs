import { randomBytes, scryptSync } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL_POOLED ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error("Configura DATABASE_URL_POOLED o DATABASE_URL.");
const sql = neon(connectionString);
const username = "admin";
const existing = await sql`SELECT id FROM admin_users WHERE username = ${username}`;
if (existing.length) {
	console.log("La cuenta admin ya existe. Cambia la clave desde Ajustes.");
	process.exit(0);
}

const password = randomBytes(24).toString("base64url");
const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");
await sql`INSERT INTO admin_users (username, password_hash)
  VALUES (${username}, ${`scrypt:${salt}:${hash}`}) ON CONFLICT (username) DO NOTHING`;
await writeFile(".admin-access", `Usuario: ${username}\nClave temporal: ${password}\n`, {
	mode: 0o600,
	flag: "wx",
});
console.log("Cuenta temporal creada. Credenciales guardadas en .admin-access (ignorado por Git).");
