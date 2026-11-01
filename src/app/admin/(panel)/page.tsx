import Link from "next/link";
import { getOverview, cop, dateLabel, statusLabels } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminOverview() {
	await requireAdmin();
	const { stats, recent, services, clients } = await getOverview();
	const total = Number(stats.total);
	const maxService = Math.max(1, ...services.map((row) => Number(row.count)));
	return (
		<main className="admin-content">
			<div className="admin-page-heading">
				<div>
					<p className="admin-kicker">PANEL / VISIÓN GENERAL</p>
					<h1>
						Tu estudio, <em>de un vistazo.</em>
					</h1>
					<p>Todo lo que está pasando con tus solicitudes y clientas.</p>
				</div>
				<Link className="admin-outline-button" href="/admin/solicitudes">
					Ver solicitudes ↗
				</Link>
			</div>
			<div className="admin-stat-grid">
				<div className="admin-stat">
					<span>Solicitudes activas</span>
					<strong>{total}</strong>
					<small>{stats.new_count} nuevas por atender</small>
				</div>
				<div className="admin-stat">
					<span>Clientas</span>
					<strong>{clients}</strong>
					<small>Perfiles con historial</small>
				</div>
				<div className="admin-stat">
					<span>Cotizado</span>
					<strong>{cop(stats.quotes_cop)}</strong>
					<small>Valor propuesto</small>
				</div>
				<div className="admin-stat admin-stat-dark">
					<span>Ingresos registrados</span>
					<strong>{cop(stats.revenue_cop)}</strong>
					<small>{stats.confirmed_count} solicitudes confirmadas</small>
				</div>
			</div>
			<div className="admin-two-columns">
				<section className="admin-panel">
					<div className="admin-panel-head">
						<div>
							<p className="admin-kicker">EN SEGUIMIENTO</p>
							<h2>Solicitudes recientes</h2>
						</div>
						<Link href="/admin/solicitudes">Ver todas ↗</Link>
					</div>
					{recent.length ? (
						<div className="admin-list">
							{recent.map((row) => (
								<div className="admin-list-row" key={row.id}>
									<div>
										<strong>{row.name}</strong>
										<small>
											{row.service} · {dateLabel(row.created_at)}
										</small>
									</div>
									<span className={`admin-badge is-${row.status}`}>
										{statusLabels[row.status as keyof typeof statusLabels]}
									</span>
								</div>
							))}
						</div>
					) : (
						<p className="admin-empty">
							Aún no hay solicitudes. Cuando alguien envíe el formulario de
							booking, aparecerá aquí.
						</p>
					)}
				</section>
				<section className="admin-panel">
					<div className="admin-panel-head">
						<div>
							<p className="admin-kicker">DEMANDA</p>
							<h2>Servicios más pedidos</h2>
						</div>
						<Link href="/admin/analiticas">Analíticas ↗</Link>
					</div>
					{services.length ? (
						<div className="admin-bars">
							{services.map((row) => (
								<div className="admin-bar-row" key={row.service}>
									<div>
										<span>{row.service}</span>
										<strong>{row.count}</strong>
									</div>
									<div className="admin-bar-track">
										<i
											style={{
												width: `${(Number(row.count) / maxService) * 100}%`,
											}}
										/>
									</div>
								</div>
							))}
						</div>
					) : (
						<p className="admin-empty">
							Los servicios aparecerán al recibir solicitudes.
						</p>
					)}
				</section>
			</div>
		</main>
	);
}
