import { createClient, updateClient } from "../../actions";
import {
	getClientHistory,
	getClients,
	cop,
	dateLabel,
	statusLabels,
} from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

export default async function ClientsPage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; saved?: string; error?: string }>;
}) {
	await requireAdmin();
	const params = await searchParams;
	const query = (params.q ?? "").slice(0, 100);
	const [clients, history] = await Promise.all([
		getClients(query),
		getClientHistory(),
	]);
	return (
		<main className="admin-content">
			<div className="admin-page-heading">
				<div>
					<p className="admin-kicker">CRM / RELACIONES</p>
					<h1>
						Tu universo de <em>clientas.</em>
					</h1>
					<p>Contacto, preferencias e historial de cada persona.</p>
				</div>
				<span className="admin-count">{clients.length} perfiles</span>
			</div>
			{params.saved && <p className="admin-notice">Perfil guardado.</p>}
			{params.error && (
				<p className="admin-error">Revisa los datos antes de guardar.</p>
			)}
			<details className="admin-panel admin-create-client">
				<summary>+ Añadir clienta</summary>
				<form action={createClient} className="admin-form">
					<div className="admin-form-grid">
						<label>
							Nombre
							<input name="name" minLength={2} maxLength={100} required />
						</label>
						<label>
							Correo
							<input name="email" type="email" maxLength={254} required />
						</label>
						<label>
							Teléfono
							<input name="phone" maxLength={35} />
						</label>
					</div>
					<button className="admin-button" type="submit">
						Crear perfil ↗
					</button>
				</form>
			</details>
			<form className="admin-filterbar" method="get">
				<input
					name="q"
					aria-label="Buscar clientas"
					placeholder="Buscar por nombre o correo"
					defaultValue={query}
				/>
				<button type="submit">Buscar ↗</button>
			</form>
			{clients.length ? (
				<div className="admin-client-grid">
					{clients.map((client) => {
						const recent = history.filter(
							(item) => item.email === client.email,
						);
						return (
							<details className="admin-client-card" key={client.email}>
								<summary>
									<div className="admin-avatar">
										{client.name.slice(0, 1).toUpperCase()}
									</div>
									<div>
										<strong>{client.name}</strong>
										<small>{client.email}</small>
									</div>
									<span aria-hidden="true">+</span>
								</summary>
								<div className="admin-client-meta">
									<span>{client.request_count} solicitudes</span>
									<span>{client.confirmed_count} confirmadas</span>
									<span>{cop(client.revenue_cop)} ingresados</span>
									<span>Última: {dateLabel(client.last_request)}</span>
								</div>
								<form action={updateClient} className="admin-form">
									<input type="hidden" name="email" value={client.email} />
									<label>
										Nombre
										<input
											name="name"
											defaultValue={client.name}
											minLength={2}
											maxLength={100}
											required
										/>
									</label>
									<label>
										Teléfono
										<input
											name="phone"
											defaultValue={client.phone ?? ""}
											maxLength={35}
										/>
									</label>
									<label>
										Etiquetas (separadas por coma)
										<input
											name="tags"
											defaultValue={client.tags.join(", ")}
											placeholder="Editorial, Novias, Recurrente"
										/>
									</label>
									<label>
										Notas privadas
										<textarea
											name="notes"
											rows={4}
											maxLength={3000}
											defaultValue={client.notes}
											placeholder="Preferencias, seguimiento…"
										/>
									</label>
									<button className="admin-button" type="submit">
										Guardar perfil ↗
									</button>
								</form>
								<div className="admin-client-history">
									<strong>Últimas solicitudes</strong>
									{recent.length ? (
										recent.map((item) => (
											<div key={`${item.created_at}-${item.service}`}>
												<span>
													{item.service} · {dateLabel(item.created_at)}
												</span>
												<span className={`admin-badge is-${item.status}`}>
													{
														statusLabels[
															item.status as keyof typeof statusLabels
														]
													}
												</span>
											</div>
										))
									) : (
										<p>Sin solicitudes todavía.</p>
									)}
								</div>
							</details>
						);
					})}
				</div>
			) : (
				<div className="admin-empty-card">
					<span>✳</span>
					<h2>Tu base de clientas empieza aquí.</h2>
					<p>Añade un perfil o recibe una solicitud de booking.</p>
				</div>
			)}
		</main>
	);
}
