export const bookingServices = [
	"Editorial",
	"Social glam",
	"Novias",
	"Peinado",
	"Clases",
	"Otro / por definir",
] as const;
export type Booking = {
	id: string;
	name: string;
	email: string;
	phone: string;
	service: string;
	date: string;
	location: string;
	people: number;
	message: string;
};
export function validateBooking(
	value: unknown,
	now = new Date(),
): { data: Booking; error?: never } | { error: string; data?: never } {
	if (!value || typeof value !== "object" || Array.isArray(value))
		return { error: "Revisa los datos de tu solicitud." };
	const input = value as Record<string, unknown>;
	const text = (key: string) =>
		typeof input[key] === "string" ? input[key].trim() : "";
	if (text("website")) return { error: "No se pudo enviar la solicitud." };
	const id = text("id");
	if (
		!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
			id,
		)
	)
		return { error: "Recarga la página e inténtalo de nuevo." };
	const name = text("name"),
		email = text("email").toLowerCase(),
		phone = text("phone"),
		service = text("service"),
		date = text("date"),
		location = text("location"),
		message = text("message");
	if (name.length < 2 || name.length > 100)
		return { error: "Escribe tu nombre (entre 2 y 100 caracteres)." };
	if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
		return { error: "Escribe un correo electrónico válido." };
	if (phone && !/^[+\d\s().-]{6,35}$/.test(phone))
		return { error: "Revisa tu número de teléfono." };
	if (!bookingServices.some((item) => item === service))
		return { error: "Selecciona el servicio que te interesa." };
	if (date) {
		const parsed = new Date(`${date}T12:00:00Z`);
		const today = new Date(now.getTime() - 5 * 60 * 60 * 1000)
			.toISOString()
			.slice(0, 10);
		if (
			!/^\d{4}-\d{2}-\d{2}$/.test(date) ||
			Number.isNaN(parsed.getTime()) ||
			parsed.toISOString().slice(0, 10) !== date ||
			date < today
		)
			return {
				error: "Elige una fecha válida a partir de hoy o déjala por definir.",
			};
	}
	if (location.length < 2 || location.length > 150)
		return {
			error: "Indica la ciudad o lugar de la sesión (máximo 150 caracteres).",
		};
	const people = input.people;
	if (
		typeof people !== "number" ||
		!Number.isInteger(people) ||
		people < 1 ||
		people > 100
	)
		return { error: "Indica entre 1 y 100 personas." };
	if (message.length < 10 || message.length > 3000)
		return { error: "Cuéntame tu idea en entre 10 y 3000 caracteres." };
	if (input.consent !== true)
		return {
			error: "Autoriza el uso de tus datos para responder a esta solicitud.",
		};
	return {
		data: { id, name, email, phone, service, date, location, people, message },
	};
}
