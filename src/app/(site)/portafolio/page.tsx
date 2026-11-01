import type { Metadata } from "next";
import Link from "next/link";
import { Gallery } from "../../portfolio";
import { getPublicMedia } from "@/lib/site-data";
export const metadata: Metadata = { title: "Portafolio | Lola Monster Makeup" };
export default async function PortfolioPage() {
	const media = await getPublicMedia();
	const portfolioMedia = Object.fromEntries(
		Object.entries(media)
			.filter(([slot]) => slot.startsWith("portfolio_"))
			.map(([slot, url]) => [slot.slice("portfolio_".length), url]),
	);
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
			<Gallery media={portfolioMedia} />
			<div className="portfolio-end">
				<p>¿Tienes una idea en mente?</p>
				<Link className="text-link" href="/booking">
					Creemos tu próximo look <span aria-hidden="true">↗</span>
				</Link>
			</div>
		</main>
	);
}
