import type { Metadata } from "next";
import Link from "next/link";
import { Gallery } from "../portfolio";
export const metadata: Metadata = { title: "Portafolio | Lola Monster Makeup" };
export default function PortfolioPage() {
	return (
		<main id="contenido" className="portfolio-section section-shell">
			<div className="section-heading">
				<div>
					<p className="eyebrow">PORTAFOLIO / MAKEUP & HAIR</p>
					<h1 className="page-title">
						El arte de <em>transformar.</em>
					</h1>
				</div>
				<p>
					Distintos rostros. Infinitas posibilidades.
					<br />
					Una mirada al universo Lola.
				</p>
			</div>
			<Gallery />
			<div className="portfolio-end">
				<p>¿Tienes una idea en mente?</p>
				<Link className="text-link" href="/booking">
					Creemos tu próximo look <span aria-hidden="true">↗</span>
				</Link>
			</div>
		</main>
	);
}
