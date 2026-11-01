"use client";
import Link from "next/link";
import { type FormEvent, useRef, useState } from "react";
import { bookingServices } from "@/lib/booking";

export function BookingForm() {
	const [pending, setPending] = useState(false);
	const [error, setError] = useState("");
	const [reference, setReference] = useState("");
	const requestId = useRef<string | null>(null);
	const inFlight = useRef(false);
	const successHeading = useRef<HTMLHeadingElement>(null);
	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (inFlight.current) return;
		inFlight.current = true;
		setPending(true);
		setError("");
		const form = new FormData(event.currentTarget);
		requestId.current ??= crypto.randomUUID();
		try {
			const response = await fetch("/api/bookings", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: requestId.current,
					name: form.get("name"),
					email: form.get("email"),
					phone: form.get("phone"),
					service: form.get("service"),
					date: form.get("date"),
					location: form.get("location"),
					people: Number(form.get("people")),
					message: form.get("message"),
					consent: form.get("consent") === "on",
					website: form.get("website"),
				}),
			});
			const result = await response.json();
			if (!response.ok) {
				setError(
					result.error || "No pudimos enviar tu solicitud. Inténtalo de nuevo.",
				);
				return;
			}
			setReference(result.id);
			requestAnimationFrame(() => successHeading.current?.focus());
		} catch {
			setError(
				"No pudimos conectar. Tus datos siguen aquí; revisa tu conexión e inténtalo de nuevo.",
			);
		} finally {
			inFlight.current = false;
			setPending(false);
		}
	}
	if (reference)
		return (
			<div className="booking-success" role="status">
				<span className="success-mark" aria-hidden="true">
					✳
				</span>
				<h3 ref={successHeading} tabIndex={-1}>
					Tu solicitud está en buenas manos.
				</h3>
				<p>
					Gracias por compartir tu idea. La solicitud quedó registrada para
					revisar disponibilidad y cotización.
				</p>
				<p>
					El envío no confirma una reserva. La fecha y los detalles se acuerdan
					contigo después.
				</p>
				<p className="booking-reference">
					Referencia: {reference.slice(0, 8).toUpperCase()}
				</p>
				<Link className="text-link" href="/portafolio">
					Mientras tanto, un poco de inspiración ↗
				</Link>
			</div>
		);
	return (
		<form className="booking-form" onSubmit={submit} aria-busy={pending}>
			<div className="form-row">
				<label>
					Nombre completo *
					<input
						name="name"
						autoComplete="name"
						minLength={2}
						maxLength={100}
						required
						placeholder="Tu nombre"
					/>
				</label>
				<label>
					Correo electrónico *
					<input
						name="email"
						type="email"
						autoComplete="email"
						maxLength={254}
						required
						placeholder="hola@ejemplo.com"
					/>
				</label>
			</div>
			<div className="form-row">
				<label>
					Teléfono / WhatsApp
					<input
						name="phone"
						type="tel"
						autoComplete="tel"
						maxLength={35}
						placeholder="+57"
					/>
				</label>
				<label>
					Servicio *
					<select name="service" defaultValue="" required>
						<option value="" disabled>
							Selecciona una opción
						</option>
						{bookingServices.map((service) => (
							<option key={service} value={service}>
								{service}
							</option>
						))}
					</select>
				</label>
			</div>
			<div className="form-row">
				<label>
					Fecha ideal
					<input name="date" type="date" />
					<span className="field-hint">
						Si aún no la tienes, déjala en blanco.
					</span>
				</label>
				<label>
					Número de personas *
					<input
						name="people"
						type="number"
						min={1}
						max={100}
						defaultValue={1}
						required
					/>
				</label>
			</div>
			<label>
				Ciudad o lugar de la sesión *
				<input
					name="location"
					autoComplete="address-level2"
					minLength={2}
					maxLength={150}
					required
					placeholder="Bogotá, estudio, lugar del evento…"
				/>
			</label>
			<label>
				Cuéntame tu idea *
				<textarea
					name="message"
					minLength={10}
					maxLength={3000}
					rows={5}
					required
					placeholder="La ocasión, el estilo que imaginas, horarios y cualquier detalle especial. También puedes compartir un enlace de inspiración."
				/>
			</label>
			<div className="form-honeypot" aria-hidden="true">
				<label>
					Tu sitio web
					<input name="website" autoComplete="off" tabIndex={-1} />
				</label>
			</div>
			<label className="consent-label">
				<input name="consent" type="checkbox" required />
				<span>
					Autorizo a Lola Monster Makeup a usar estos datos para responder y dar
					seguimiento a mi solicitud. *
				</span>
			</label>
			{error && (
				<p className="form-error" role="alert">
					{error}
				</p>
			)}
			<button className="booking-submit" type="submit" disabled={pending}>
				{pending ? "Enviando tu idea…" : "Enviar solicitud"}
				<span aria-hidden="true">↗</span>
			</button>
			<p className="booking-note">
				Esta es una solicitud de disponibilidad y cotización. La reserva se
				confirma personalmente.
			</p>
		</form>
	);
}
