import { getSql } from "@/lib/db";

export type BookingRow = {
	id: string;
	name: string;
	email: string;
	phone: string | null;
	service: string;
	requested_date: string | null;
	location: string;
	people: number;
	message: string;
	status: "new" | "contacted" | "confirmed" | "closed";
	quote_amount_cop: number | null;
	revenue_amount_cop: number | null;
	internal_notes: string;
	created_at: string;
	updated_at: string;
	archived_at: string | null;
};

export type ClientRow = {
	email: string;
	name: string;
	phone: string | null;
	notes: string;
	tags: string[];
	request_count: number;
	confirmed_count: number;
	revenue_cop: number;
	last_request: string | null;
};

export const statusLabels: Record<BookingRow["status"], string> = {
	new: "Nueva",
	contacted: "Contactada",
	confirmed: "Confirmada",
	closed: "Cerrada",
};

export function cop(value: number | string | null | undefined): string {
	if (value === null || value === undefined) return "—";
	return new Intl.NumberFormat("es-CO", {
		style: "currency",
		currency: "COP",
		maximumFractionDigits: 0,
	}).format(Number(value));
}

export function dateLabel(value: string | Date | null | undefined): string {
	if (!value) return "—";
	const date =
		typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
			? new Date(`${value}T12:00:00Z`)
			: new Date(value);
	return new Intl.DateTimeFormat("es-CO", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		timeZone: "America/Bogota",
	}).format(date);
}

export async function getOverview() {
	const sql = getSql();
	const [stats, recent, services] = await Promise.all([
		sql`SELECT count(*)::int AS total,
			count(*) FILTER (WHERE status = 'new')::int AS new_count,
			count(*) FILTER (WHERE status = 'confirmed')::int AS confirmed_count,
			COALESCE(sum(quote_amount_cop), 0)::bigint AS quotes_cop,
			COALESCE(sum(revenue_amount_cop), 0)::bigint AS revenue_cop
			FROM booking_requests WHERE archived_at IS NULL`,
		sql`SELECT id, name, email, service, status, created_at, quote_amount_cop
			FROM booking_requests WHERE archived_at IS NULL ORDER BY created_at DESC LIMIT 6`,
		sql`SELECT service, count(*)::int AS count FROM booking_requests
			WHERE archived_at IS NULL GROUP BY service ORDER BY count DESC, service`,
	]);
	const clients = await sql`SELECT count(*)::int AS count FROM clients`;
	return {
		stats: stats[0],
		recent,
		services,
		clients: clients[0].count as number,
	};
}

export async function getBookings({
	archived = false,
	query = "",
	status = "all",
} = {}): Promise<BookingRow[]> {
	const sql = getSql();
	const pattern = `%${query.slice(0, 100)}%`;
	const rows = await sql`
		SELECT id, name, email, phone, service, requested_date, location, people,
			message, status, quote_amount_cop, revenue_amount_cop, internal_notes,
			created_at, updated_at, archived_at
		FROM booking_requests
		WHERE (archived_at IS NOT NULL) = ${archived}
			AND (${query} = '' OR name ILIKE ${pattern} OR email ILIKE ${pattern} OR service ILIKE ${pattern})
			AND (${status} = 'all' OR status = ${status})
		ORDER BY created_at DESC LIMIT 100`;
	return rows as BookingRow[];
}

export async function getClients(query = ""): Promise<ClientRow[]> {
	const sql = getSql();
	const pattern = `%${query.slice(0, 100)}%`;
	const rows = await sql`
		SELECT c.email, c.name, c.phone, c.notes, c.tags,
			count(b.id)::int AS request_count,
			count(b.id) FILTER (WHERE b.status = 'confirmed')::int AS confirmed_count,
			COALESCE(sum(b.revenue_amount_cop), 0)::bigint AS revenue_cop,
			max(b.created_at) AS last_request
		FROM clients c LEFT JOIN booking_requests b ON lower(b.email) = c.email
		WHERE ${query} = '' OR c.name ILIKE ${pattern} OR c.email ILIKE ${pattern}
		GROUP BY c.email ORDER BY last_request DESC NULLS LAST, c.name LIMIT 100`;
	return rows as ClientRow[];
}

export async function getClientHistory(): Promise<
	{ email: string; service: string; status: string; created_at: string }[]
> {
	const sql = getSql();
	const rows = await sql`SELECT email, service, status, created_at FROM (
		SELECT lower(email) AS email, service, status, created_at,
			row_number() OVER (PARTITION BY lower(email) ORDER BY created_at DESC) AS rn
		FROM booking_requests
	) recent WHERE rn <= 5 ORDER BY created_at DESC`;
	return rows as {
		email: string;
		service: string;
		status: string;
		created_at: string;
	}[];
}

export async function getHistory() {
	const sql = getSql();
	const [events, archived, closed] = await Promise.all([
		sql`SELECT e.id, e.action, e.detail, e.created_at, b.name, b.service
			FROM booking_events e JOIN booking_requests b ON b.id = e.booking_id
			ORDER BY e.created_at DESC LIMIT 40`,
		sql`SELECT id, name, email, service, status, archived_at, created_at
			FROM booking_requests WHERE archived_at IS NOT NULL ORDER BY archived_at DESC LIMIT 50`,
		sql`SELECT id, name, email, service, status, created_at
			FROM booking_requests WHERE status = 'closed' AND archived_at IS NULL
			ORDER BY updated_at DESC LIMIT 50`,
	]);
	return { events, archived, closed, closedCount: closed.length };
}

export async function getAnalytics() {
	const sql = getSql();
	const [summary, monthly, services, statuses] = await Promise.all([
		sql`SELECT count(*)::int AS requests,
			count(*) FILTER (WHERE status = 'confirmed')::int AS confirmed,
			count(DISTINCT lower(email))::int AS clients,
			COALESCE(sum(quote_amount_cop), 0)::bigint AS quotes_cop,
			COALESCE(sum(revenue_amount_cop), 0)::bigint AS revenue_cop
			FROM booking_requests WHERE archived_at IS NULL`,
		sql`SELECT to_char(m.month, 'Mon YY') AS label,
			count(b.id)::int AS requests,
			COALESCE(sum(b.revenue_amount_cop), 0)::bigint AS revenue_cop
			FROM generate_series(date_trunc('month', now()) - interval '11 months',
				date_trunc('month', now()), interval '1 month') AS m(month)
			LEFT JOIN booking_requests b ON date_trunc('month', b.created_at) = m.month
				AND b.archived_at IS NULL
			GROUP BY m.month ORDER BY m.month`,
		sql`SELECT service, count(*)::int AS requests,
			COALESCE(sum(quote_amount_cop), 0)::bigint AS quotes_cop,
			COALESCE(sum(revenue_amount_cop), 0)::bigint AS revenue_cop
			FROM booking_requests WHERE archived_at IS NULL
			GROUP BY service ORDER BY requests DESC, service`,
		sql`SELECT status, count(*)::int AS count FROM booking_requests
			WHERE archived_at IS NULL GROUP BY status`,
	]);
	return { summary: summary[0], monthly, services, statuses };
}
