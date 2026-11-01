import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { logoutAdmin } from "../actions";
import { requireAdmin } from "@/lib/admin-auth";

export const instant = false;

const sections = [
	{ href: "/admin", label: "Resumen", number: "01" },
	{ href: "/admin/solicitudes", label: "Solicitudes", number: "02" },
	{ href: "/admin/historial", label: "Historial", number: "03" },
	{ href: "/admin/clientas", label: "Clientas", number: "04" },
	{ href: "/admin/analiticas", label: "Analíticas", number: "05" },
	{ href: "/admin/editor", label: "Editor web", number: "06" },
	{ href: "/admin/ajustes", label: "Ajustes", number: "07" },
];

export default function PanelLayout({ children }: { children: ReactNode }) {
	return (
		<Suspense fallback={<div className="admin-loading">Abriendo panel…</div>}>
			<ProtectedPanel>{children}</ProtectedPanel>
		</Suspense>
	);
}

async function ProtectedPanel({ children }: { children: ReactNode }) {
	const admin = await requireAdmin();
	return (
		<div className="admin-shell">
			<aside className="admin-sidebar">
				<Link href="/admin" className="admin-brand">
					lola<span>STUDIO / ADMIN</span>
				</Link>
				<p className="admin-sidebar-label">WORKSPACE</p>
				<nav aria-label="Navegación del panel">
					{sections.map((item) => (
						<Link key={item.href} href={item.href}>
							<span>{item.number}</span>
							{item.label}
							<span aria-hidden="true">↗</span>
						</Link>
					))}
				</nav>
				<div className="admin-sidebar-bottom">
					<p>
						Sesión de <strong>{admin.username}</strong>
					</p>
					<Link href="/" target="_blank">
						Ver sitio ↗
					</Link>
					<form action={logoutAdmin}>
						<button type="submit">Cerrar sesión</button>
					</form>
				</div>
			</aside>
			<div className="admin-main">
				<header className="admin-topbar">
					<span>LOLA MONSTER MAKEUP / BACK OFFICE</span>
					<span>BOGOTÁ · CO</span>
				</header>
				{children}
			</div>
		</div>
	);
}
