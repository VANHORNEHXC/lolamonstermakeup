import { getAnalytics, cop, statusLabels } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AnalyticsPage() {
	await requireAdmin();
	const { summary, monthly, services, statuses } = await getAnalytics();
	const maxMonth = Math.max(1, ...monthly.map((row) => Number(row.requests)));
	const maxService = Math.max(
		1,
		...services.map((row) => Number(row.requests)),
	);
	const rate = Number(summary.requests)
		? Math.round((Number(summary.confirmed) / Number(summary.requests)) * 100)
		: 0;
	return (
		<main className="admin-content">
			<div className="admin-page-heading">
				<div>
					<p className="admin-kicker">INTELIGENCIA / ESTUDIO</p>
					<h1>
						Los números <em>cuentan historias.</em>
					</h1>
					<p>
						Datos basados en solicitudes, cotizaciones e ingresos registrados
						manualmente.
					</p>
				</div>
			</div>
			<div className="admin-stat-grid">
				<div className="admin-stat">
					<span>Solicitudes</span>
					<strong>{summary.requests}</strong>
					<small>Activas, sin archivadas</small>
				</div>
				<div className="admin-stat">
					<span>Conversión</span>
					<strong>{rate}%</strong>
					<small>Confirmadas / solicitudes</small>
				</div>
				<div className="admin-stat">
					<span>Cotizado</span>
					<strong>{cop(summary.quotes_cop)}</strong>
					<small>Propuestas registradas</small>
				</div>
				<div className="admin-stat admin-stat-dark">
					<span>Ingresos</span>
					<strong>{cop(summary.revenue_cop)}</strong>
					<small>Pagos registrados</small>
				</div>
			</div>
			<div className="admin-two-columns">
				<section className="admin-panel">
					<div className="admin-panel-head">
						<div>
							<p className="admin-kicker">ÚLTIMOS 12 MESES</p>
							<h2>Ritmo de solicitudes</h2>
						</div>
					</div>
					<div className="admin-month-chart">
						{monthly.map((row) => (
							<div className="admin-month" key={row.label}>
								<div className="admin-month-bar">
									<i
										style={{
											height: `${Math.max(4, (Number(row.requests) / maxMonth) * 100)}%`,
										}}
										title={`${row.requests} solicitudes`}
									/>
								</div>
								<strong>{row.requests}</strong>
								<span>{row.label}</span>
							</div>
						))}
					</div>
				</section>
				<section className="admin-panel">
					<div className="admin-panel-head">
						<div>
							<p className="admin-kicker">EMBUDO</p>
							<h2>Estado de oportunidades</h2>
						</div>
					</div>
					<div className="admin-funnel">
						{Object.entries(statusLabels).map(([key, label]) => {
							const count = Number(
								statuses.find((row) => row.status === key)?.count ?? 0,
							);
							return (
								<div key={key}>
									<span>{label}</span>
									<strong>{count}</strong>
									<div className="admin-bar-track">
										<i
											style={{
												width: `${Number(summary.requests) ? (count / Number(summary.requests)) * 100 : 0}%`,
											}}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</section>
			</div>
			<section className="admin-panel admin-wide-panel">
				<div className="admin-panel-head">
					<div>
						<p className="admin-kicker">MIX DE SERVICIOS</p>
						<h2>Qué están pidiendo</h2>
					</div>
				</div>
				{services.length ? (
					<div className="admin-service-analytics">
						{services.map((row) => (
							<div key={row.service}>
								<div>
									<strong>{row.service}</strong>
									<span>
										{row.requests} solicitudes · {cop(row.quotes_cop)} cotizado
										· {cop(row.revenue_cop)} ingresado
									</span>
								</div>
								<div className="admin-bar-track">
									<i
										style={{
											width: `${(Number(row.requests) / maxService) * 100}%`,
										}}
									/>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="admin-empty">
						Las métricas por servicio aparecerán después de la primera
						solicitud.
					</p>
				)}
			</section>
			<p className="admin-footnote">
				Los ingresos son los montos que registras en cada solicitud; no se
				conectan a una pasarela de pagos.
			</p>
		</main>
	);
}
