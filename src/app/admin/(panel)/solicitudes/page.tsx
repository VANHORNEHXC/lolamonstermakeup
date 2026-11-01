import { archiveBooking, updateBooking } from "../../actions";
import { getBookings, cop, dateLabel, statusLabels } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

export default async function RequestsPage({
	searchParams,
}: {
	searchParams: Promise<{
		q?: string;
		status?: string;
		saved?: string;
		error?: string;
	}>;
}) {
	await requireAdmin();
	const params = await searchParams;
	const query = (params.q ?? "").slice(0, 100);
	const status = params.status ?? "all";
	const bookings = await getBookings({ query, status });
	return (
		<main className="admin-content">
			<div className="admin-page-heading">
				<div>
					<p className="admin-kicker">BOOKING / BANDEJA</p>
					<h1>
						Solicitudes <em>en curso.</em>
					</h1>
					<p>
						Actualiza estados, cotizaciones, ingresos y notas de cada trabajo.
					</p>
				</div>
				<span className="admin-count">{bookings.length} registros</span>
			</div>
			{params.saved && <p className="admin-notice">Solicitud actualizada.</p>}
			{params.error && (
				<p className="admin-error">Revisa los datos antes de guardar.</p>
			)}
			<form className="admin-filterbar" method="get">
				<input
					name="q"
					aria-label="Buscar solicitudes"
					placeholder="Buscar por clienta, correo o servicio"
					defaultValue={query}
				/>
				<select
					name="status"
					aria-label="Filtrar por estado"
					defaultValue={status}
				>
					<option value="all">Todos los estados</option>
					{Object.entries(statusLabels).map(([value, label]) => (
						<option key={value} value={value}>
							{label}
						</option>
					))}
				</select>
				<button type="submit">Filtrar ↗</button>
			</form>
			{bookings.length ? (
				<div className="admin-records">
					{bookings.map((booking) => (
						<details className="admin-record" key={booking.id}>
							<summary>
								<span className="admin-record-date">
									{dateLabel(booking.created_at)}
								</span>
								<span className="admin-record-person">
									<strong>{booking.name}</strong>
									<small>{booking.email}</small>
								</span>
								<span>{booking.service}</span>
								<span className={`admin-badge is-${booking.status}`}>
									{statusLabels[booking.status]}
								</span>
								<span className="admin-record-arrow">+</span>
							</summary>
							<div className="admin-record-body">
								<div className="admin-record-details">
									<div>
										<span>Contacto</span>
										<strong>{booking.phone || "Sin teléfono"}</strong>
									</div>
									<div>
										<span>Fecha ideal</span>
										<strong>{dateLabel(booking.requested_date)}</strong>
									</div>
									<div>
										<span>Lugar</span>
										<strong>{booking.location}</strong>
									</div>
									<div>
										<span>Personas</span>
										<strong>{booking.people}</strong>
									</div>
									<div className="admin-record-message">
										<span>Idea de la clienta</span>
										<p>{booking.message}</p>
									</div>
								</div>
								<form
									action={updateBooking}
									className="admin-form admin-record-form"
								>
									<input type="hidden" name="id" value={booking.id} />
									<div className="admin-form-grid">
										<label>
											Estado
											<select name="status" defaultValue={booking.status}>
												{Object.entries(statusLabels).map(([value, label]) => (
													<option key={value} value={value}>
														{label}
													</option>
												))}
											</select>
										</label>
										<label>
											Cotización · COP
											<input
												name="quote_amount_cop"
												type="number"
												min="0"
												step="1"
												defaultValue={booking.quote_amount_cop ?? ""}
												placeholder="0"
											/>
										</label>
										<label>
											Ingreso recibido · COP
											<input
												name="revenue_amount_cop"
												type="number"
												min="0"
												step="1"
												defaultValue={booking.revenue_amount_cop ?? ""}
												placeholder="0"
											/>
										</label>
									</div>
									<label>
										Notas internas
										<textarea
											name="internal_notes"
											rows={3}
											maxLength={3000}
											defaultValue={booking.internal_notes}
											placeholder="Seguimiento, horarios, referencias…"
										/>
									</label>
									<div className="admin-form-actions">
										<button className="admin-button" type="submit">
											Guardar cambios ↗
										</button>
										<span>
											Cotizado: {cop(booking.quote_amount_cop)} · Ingreso:{" "}
											{cop(booking.revenue_amount_cop)}
										</span>
									</div>
								</form>
								<form action={archiveBooking} className="admin-archive-form">
									<input type="hidden" name="id" value={booking.id} />
									<button type="submit">Archivar solicitud</button>
								</form>
							</div>
						</details>
					))}
				</div>
			) : (
				<div className="admin-empty-card">
					<span>✳</span>
					<h2>No hay solicitudes aquí todavía.</h2>
					<p>
						Prueba con otro filtro o espera el próximo formulario de booking.
					</p>
				</div>
			)}
		</main>
	);
}
