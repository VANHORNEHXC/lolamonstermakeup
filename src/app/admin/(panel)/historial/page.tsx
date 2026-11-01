import { restoreBooking } from "../../actions";
import { dateLabel, getHistory, statusLabels } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

export default async function HistoryPage({
	searchParams,
}: {
	searchParams: Promise<{ saved?: string }>;
}) {
	await requireAdmin();
	const [{ events, archived, closed, closedCount }, params] = await Promise.all(
		[getHistory(), searchParams],
	);
	return (
		<main className="admin-content">
			<div className="admin-page-heading">
				<div>
					<p className="admin-kicker">SEGUIMIENTO / HISTORIAL</p>
					<h1>
						Cada historia, <em>en orden.</em>
					</h1>
					<p>Actividad, trabajos cerrados y solicitudes archivadas.</p>
				</div>
				<span className="admin-count">{closedCount} cerradas recientes</span>
			</div>
			{params.saved && <p className="admin-notice">Solicitud restaurada.</p>}
			<div className="admin-two-columns">
				<section className="admin-panel">
					<div className="admin-panel-head">
						<div>
							<p className="admin-kicker">ACTIVIDAD</p>
							<h2>Movimientos recientes</h2>
						</div>
					</div>
					{events.length ? (
						<div className="admin-timeline">
							{events.map((event) => (
								<div className="admin-timeline-item" key={event.id}>
									<span className="admin-timeline-dot" />
									<div>
										<strong>{event.name}</strong>
										<small>
											{event.service} · {dateLabel(event.created_at)}
										</small>
										<p>{event.detail || event.action}</p>
									</div>
								</div>
							))}
						</div>
					) : (
						<p className="admin-empty">
							El historial aparecerá cuando actualices una solicitud.
						</p>
					)}
				</section>
				<section className="admin-panel">
					<div className="admin-panel-head">
						<div>
							<p className="admin-kicker">CERRADAS</p>
							<h2>Trabajos finalizados</h2>
						</div>
					</div>
					{closed.length ? (
						<div className="admin-list">
							{closed.map((row) => (
								<div className="admin-list-row" key={row.id}>
									<div>
										<strong>{row.name}</strong>
										<small>
											{row.service} · {dateLabel(row.created_at)}
										</small>
									</div>
									<span className="admin-badge is-closed">Cerrada</span>
								</div>
							))}
						</div>
					) : (
						<p className="admin-empty">Aún no hay solicitudes cerradas.</p>
					)}
				</section>
			</div>
			<section className="admin-panel admin-wide-panel">
				<div className="admin-panel-head">
					<div>
						<p className="admin-kicker">ARCHIVO</p>
						<h2>Solicitudes guardadas</h2>
					</div>
				</div>
				{archived.length ? (
					<div className="admin-list">
						{archived.map((row) => (
							<div className="admin-list-row" key={row.id}>
								<div>
									<strong>{row.name}</strong>
									<small>
										{row.service} · {dateLabel(row.archived_at)}
									</small>
									<span className={`admin-badge is-${row.status}`}>
										{statusLabels[row.status as keyof typeof statusLabels]}
									</span>
								</div>
								<form action={restoreBooking}>
									<input type="hidden" name="id" value={row.id} />
									<button className="admin-text-button" type="submit">
										Restaurar ↗
									</button>
								</form>
							</div>
						))}
					</div>
				) : (
					<p className="admin-empty">No hay solicitudes archivadas.</p>
				)}
			</section>
		</main>
	);
}
