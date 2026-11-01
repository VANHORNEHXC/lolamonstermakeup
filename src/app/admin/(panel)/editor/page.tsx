import Link from "next/link";
import Image from "next/image";
import { resetMedia, saveText } from "../../actions";
import { MediaUpload } from "../../media-upload";
import { requireAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import {
	defaultContent,
	defaultMedia,
	mediaSlots,
	textFields,
} from "@/lib/site-data";

export default async function EditorPage({
	searchParams,
}: {
	searchParams: Promise<{ saved?: string; error?: string }>;
}) {
	await requireAdmin();
	const sql = getSql();
	const [texts, files, params] = await Promise.all([
		sql`SELECT key, value FROM site_content`,
		sql`SELECT slot, object_key, content_type, size_bytes, original_name, updated_at FROM site_media`,
		searchParams,
	]);
	const values = {
		...defaultContent,
		...Object.fromEntries(texts.map((row) => [row.key, row.value])),
	};
	const custom = new Map(files.map((row) => [row.slot, row]));
	const groups = [
		{
			label: "PORTADA",
			title: "Primera impresión",
			fields: textFields.filter((field) => field.key.startsWith("hero_")),
		},
		{
			label: "IDENTIDAD",
			title: "Sobre Lola",
			fields: textFields.filter((field) => field.key.startsWith("about_")),
		},
		{
			label: "OFERTA",
			title: "Servicios",
			fields: textFields.filter((field) => field.key.startsWith("service_")),
		},
	];
	return (
		<main className="admin-content">
			<div className="admin-page-heading">
				<div>
					<p className="admin-kicker">CMS / SITIO WEB</p>
					<h1>
						Tu web, <em>tu voz.</em>
					</h1>
					<p>
						Edita textos e imágenes sin tocar el código. Los cambios se publican
						al guardar.
					</p>
				</div>
				<Link className="admin-outline-button" href="/" target="_blank">
					Abrir sitio ↗
				</Link>
			</div>
			{params.saved && (
				<p className="admin-notice">Contenido guardado y publicado.</p>
			)}
			{params.error && (
				<p className="admin-error">
					No se pudo guardar. Revisa el texto o el archivo.
				</p>
			)}
			<div className="admin-editor-tabs">
				<a href="#textos">Textos</a>
				<a href="#media">Imágenes y video</a>
			</div>
			<div id="textos" className="admin-editor-sections">
				{groups.map((group) => (
					<section className="admin-panel" key={group.label}>
						<div className="admin-panel-head">
							<div>
								<p className="admin-kicker">{group.label}</p>
								<h2>{group.title}</h2>
							</div>
						</div>
						<div className="admin-editor-fields">
							{group.fields.map((field) => (
								<form action={saveText} className="admin-form" key={field.key}>
									<input type="hidden" name="key" value={field.key} />
									<label>
										{field.label}
										<textarea
											name="value"
											rows={
												field.key.includes("paragraph") ||
												field.key.startsWith("service_")
													? 4
													: 2
											}
											maxLength={5000}
											required
											defaultValue={values[field.key]}
										/>
									</label>
									<button className="admin-text-button" type="submit">
										Guardar texto ↗
									</button>
								</form>
							))}
						</div>
					</section>
				))}
			</div>
			<section id="media" className="admin-panel admin-media-section">
				<div className="admin-panel-head">
					<div>
						<p className="admin-kicker">ARCHIVOS / NEON STORAGE</p>
						<h2>Imágenes y video</h2>
					</div>
				</div>
				<p className="admin-section-intro">
					Imágenes WebP, JPG, PNG o AVIF; video MP4. Hasta 4 MB por archivo. Usa
					formato vertical para el video de portada. El bucket sigue privado.
				</p>
				<div className="admin-media-grid">
					{mediaSlots.map((item) => {
						const uploaded = custom.get(item.slot);
						const url = uploaded
							? `/media/${uploaded.object_key}`
							: defaultMedia[item.slot];
						return (
							<div className="admin-media-card" key={item.slot}>
								<div className="admin-media-preview">
									{item.kind === "video" ? (
										<video
											src={url}
											muted
											loop
											playsInline
											preload="metadata"
										/>
									) : (
										<Image
											src={url}
											alt={item.label}
											width={220}
											height={220}
											sizes="220px"
										/>
									)}
								</div>
								<div className="admin-media-info">
									<strong>{item.label}</strong>
									<small>
										{uploaded
											? `Personalizado · ${uploaded.original_name}`
											: "Archivo original"}
									</small>
									<a href={url} target="_blank" rel="noreferrer">
										Ver archivo ↗
									</a>
								</div>
								<MediaUpload slot={item.slot} kind={item.kind} />
								{uploaded && (
									<form action={resetMedia}>
										<input type="hidden" name="slot" value={item.slot} />
										<button className="admin-text-button" type="submit">
											Restaurar original
										</button>
									</form>
								)}
							</div>
						);
					})}
				</div>
			</section>
		</main>
	);
}
