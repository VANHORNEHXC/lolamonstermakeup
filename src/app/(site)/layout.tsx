import Link from "next/link";
import type { ReactNode } from "react";
import { SiteHeader } from "../portfolio";

export default function SiteLayout({ children }: { children: ReactNode }) {
	return (
		<div className="lola-site">
			<a className="skip-link" href="#contenido">
				Saltar al contenido
			</a>
			<SiteHeader />
			{children}
			<footer className="site-footer">
				<Link
					className="wordmark"
					href="/"
					aria-label="Lola Monster Makeup, inicio"
				>
					lola<span>MONSTER MAKEUP</span>
				</Link>
				<p>Maquillaje con identidad.</p>
				<div>
					<a
						href="https://www.instagram.com/lolamonstermakeup/"
						target="_blank"
						rel="noreferrer"
					>
						Instagram ↗
					</a>
					<Link href="/booking">Booking</Link>
					<span>© Lola Monster Makeup</span>
				</div>
			</footer>
		</div>
	);
}
