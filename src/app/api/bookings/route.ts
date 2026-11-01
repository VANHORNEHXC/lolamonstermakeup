import { validateBooking } from "@/lib/booking";
import { getSql } from "@/lib/db";

export async function POST(request: Request) {
	const origin = request.headers.get("origin");
	// Next can normalize request.url to localhost behind its HTTP server.
	// The browser's Host header preserves the public host (including its port).
	const host = request.headers.get("host") ?? new URL(request.url).host;
	if (origin && origin !== `https://${host}` && origin !== `http://${host}`)
		return Response.json(
			{ error: "Origen de solicitud no permitido." },
			{ status: 403 },
		);
	if (!request.headers.get("content-type")?.includes("application/json"))
		return Response.json(
			{ error: "Formato de solicitud no válido." },
			{ status: 415 },
		);
	const reader = request.body?.getReader();
	if (!reader)
		return Response.json(
			{ error: "La solicitud está vacía." },
			{ status: 400 },
		);
	const chunks: Uint8Array[] = [];
	let size = 0;
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			size += value.byteLength;
			if (size > 16384) {
				await reader.cancel();
				return Response.json(
					{ error: "La solicitud es demasiado larga." },
					{ status: 413 },
				);
			}
			chunks.push(value);
		}
	} catch {
		return Response.json(
			{ error: "No se pudo leer la solicitud. Inténtalo de nuevo." },
			{ status: 400 },
		);
	}
	let body: unknown;
	try {
		body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
	} catch {
		return Response.json(
			{ error: "Formato de solicitud no válido." },
			{ status: 400 },
		);
	}
	const result = validateBooking(body);
	if (result.error || !result.data)
		return Response.json({ error: result.error }, { status: 400 });
	const booking = result.data;
	try {
		const sql = getSql();
		// Serialize requests for the same email before checking the hourly limit.
		const [, rows] = await sql.transaction([
			sql`SELECT pg_advisory_xact_lock(hashtextextended(${booking.email}, 0))`,
			sql`INSERT INTO booking_requests (id, name, email, phone, service, requested_date, location, people, message, contact_consent)
        SELECT ${booking.id}::uuid, ${booking.name}, ${booking.email}, ${booking.phone || null}, ${booking.service}, ${booking.date || null}::date, ${booking.location}, ${booking.people}, ${booking.message}, true
        WHERE (SELECT count(*) FROM booking_requests WHERE email = ${booking.email} AND created_at > now() - interval '1 hour') < 3
          OR EXISTS (SELECT 1 FROM booking_requests WHERE id = ${booking.id}::uuid)
        ON CONFLICT (id) DO UPDATE SET id = EXCLUDED.id
        RETURNING id`,
		]);
		if (!rows.length)
			return Response.json(
				{
					error:
						"Ya recibimos varias solicitudes con este correo. Inténtalo en una hora o escríbeme por Instagram.",
				},
				{ status: 429 },
			);
		return Response.json({ id: rows[0].id }, { status: 201 });
	} catch {
		return Response.json(
			{
				error:
					"No pudimos guardar tu solicitud. Tus datos siguen en el formulario; inténtalo de nuevo o escríbeme por Instagram.",
			},
			{ status: 503 },
		);
	}
}
