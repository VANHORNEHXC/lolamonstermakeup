import Link from "next/link";
import { changePassword, purgeArchived, saveText } from "../../actions";
import { requireAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { defaultContent } from "@/lib/site-data";

export default async function SettingsPage({
	searchParams,
}: {
	searchParams: Promise<{ saved?: string; error?: string; purged?: string }>;
}) {
	await requireAdmin();
	const sql = getSql();
	const [texts, stale, params] = await Promise.all([
		sql`SELECT key, value FROM site_content WHERE key IN ('not_found_title', 'not_found_message')`,
		sql`SELECT count(*)::int AS count FROM booking_requests WHERE archived_at < now() - interval '90 days'`,
		searchParams,
	]);
	const content = {
		...defaultContent,
		...Object.fromEntries(texts.map((row) => [row.key, row.value])),
	};
	return (
		<main className="admin-content">
			<div className="admin-page-heading">
				<div>
					<p className="admin-kicker">CONTROL / PREFERENCIAS</p>
					<h1>
						Todo bajo <em>control.</em>
					</h1>
					<p>Acceso, página 404 y mantenimiento de solicitudes.</p>
				</div>
			</div>
			{params.saved && <p className="admin-notice">Ajuste guardado.</p>}
			{params.purged && (
				<p className="admin-notice">Solicitudes antiguas eliminadas.</p>
			)}
			{params.error && (
				<p className="admin-error">
					No se pudo completar: revisa la clave o la confirmación.
				</p>
			)}
			<div className="admin-two-columns">
				<section className="admin-panel">
					<div className="admin-panel-head">
						<div>
							<p className="admin-kicker">SEGURIDAD</p>
							<h2>Cambiar clave</h2>
						</div>
					</div>
					<p className="admin-section-intro">
						La clave nueva debe tener al menos 12 caracteres. Al cambiarla,
						todas las sesiones se cerrarán.
					</p>
					<form action={changePassword} className="admin-form">
						<label>
							Clave actual
							<input
								type="password"
								name="current_password"
								autoComplete="current-password"
								required
							/>
						</label>
						<label>
							Clave nueva
							<input
								type="password"
								name="new_password"
								autoComplete="new-password"
								minLength={12}
								required
							/>
						</label>
						<button className="admin-button" type="submit">
							Cambiar clave ↗
						</button>
					</form>
				</section>
				<section className="admin-panel">
					<div className="admin-panel-head">
						<div>
							<p className="admin-kicker">PÁGINA 404</p>
							<h2>Cuando algo no aparece</h2>
						</div>
						<Link href="/pagina-que-no-existe" target="_blank">
							Vista previa ↗
						</Link>
					</div>
					<div className="admin-editor-fields">
						<form action={saveText} className="admin-form">
							<input type="hidden" name="key" value="not_found_title" />
							<label>
								Título
								<input
									name="value"
									defaultValue={content.not_found_title}
									maxLength={200}
									required
								/>
							</label>
							<button className="admin-text-button" type="submit">
								Guardar título ↗
							</button>
						</form>
						<form action={saveText} className="admin-form">
							<input type="hidden" name="key" value="not_found_message" />
							<label>
								Mensaje
								<textarea
									name="value"
									rows={3}
									defaultValue={content.not_found_message}
									maxLength={500}
									required
								/>
							</label>
							<button className="admin-text-button" type="submit">
								Guardar mensaje ↗
							</button>
						</form>
					</div>
				</section>
			</div>
			<section className="admin-panel admin-danger-panel">
				<div className="admin-panel-head">
					<div>
						<p className="admin-kicker">MANTENIMIENTO</p>
						<h2>Depurar solicitudes</h2>
					</div>
					<span className="admin-count">{stale[0].count} elegibles</span>
				</div>
				<p>
					Solo se eliminan solicitudes archivadas hace más de 90 días, máximo
					100 por operación. Esto borra también sus eventos de historial y no se
					puede deshacer. Los perfiles de clientas permanecen.
				</p>
				<form action={purgeArchived} className="admin-form admin-purge-form">
					<label>
						Escribe ELIMINAR para confirmar
						<input
							name="confirmation"
							autoComplete="off"
							placeholder="ELIMINAR"
							required
						/>
					</label>
					<button type="submit" disabled={Number(stale[0].count) === 0}>
						Eliminar archivadas antiguas
					</button>
				</form>
			</section>
			<p className="admin-footnote">
				El bucket de Neon es privado. Las imágenes y el video se publican
				únicamente mediante la ruta de media del sitio.{" "}
				<Link href="/admin/editor">Gestionar media ↗</Link>
			</p>
		</main>
	);
}
