import Link from "next/link";
import { Suspense } from "react";

export default function LoginPage({
	searchParams,
}: {
	searchParams: Promise<{ error?: string; changed?: string }>;
}) {
	return (
		<main className="admin-login-page">
			<Suspense
				fallback={<div className="admin-login-card">Cargando acceso…</div>}
			>
				<LoginCard searchParams={searchParams} />
			</Suspense>
		</main>
	);
}

async function LoginCard({
	searchParams,
}: {
	searchParams: Promise<{ error?: string; changed?: string }>;
}) {
	const params = await searchParams;
	return (
		<div className="admin-login-card">
			<Link className="admin-login-brand" href="/">
				lola<span>MONSTER MAKEUP</span>
			</Link>
			<p className="admin-kicker">ESPACIO PRIVADO</p>
			<h1>Bienvenida de nuevo.</h1>
			<p>Solicitudes, clientas y contenido en un solo lugar.</p>
			{params.changed && (
				<p className="admin-notice">Clave actualizada. Ingresa de nuevo.</p>
			)}
			{params.error && (
				<p className="admin-error" role="alert">
					{params.error === "limite"
						? "Demasiados intentos. Prueba en 15 minutos."
						: "Usuario o clave incorrectos."}
				</p>
			)}
			<form action="/api/admin/login" method="post" className="admin-form">
				<label>
					Usuario
					<input
						name="username"
						autoComplete="username"
						required
						defaultValue="admin"
					/>
				</label>
				<label>
					Clave
					<input
						name="password"
						type="password"
						autoComplete="current-password"
						required
					/>
				</label>
				<button className="admin-button" type="submit">
					Entrar al panel <span aria-hidden="true">↗</span>
				</button>
			</form>
			<Link className="admin-back" href="/">
				← Volver al sitio
			</Link>
		</div>
	);
}
