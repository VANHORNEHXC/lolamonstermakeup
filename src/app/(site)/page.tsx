import Link from "next/link";
import { HeroVideo } from "../hero-video";
import { Gallery } from "../portfolio";
import { getPublicContent, getPublicMedia } from "@/lib/site-data";
export default async function Home() {
	const [content, media] = await Promise.all([
		getPublicContent(),
		getPublicMedia(),
	]);
	const portfolioMedia = Object.fromEntries(
		Object.entries(media)
			.filter(([slot]) => slot.startsWith("portfolio_"))
			.map(([slot, url]) => [slot.slice("portfolio_".length), url]),
	);
	return (
		<main id="contenido">
			<section className="hero hero-with-video" aria-labelledby="hero-title">
				<HeroVideo video={media.hero_video} poster={media.hero_poster} />
				<div className="hero-copy">
					<p className="eyebrow">{content.hero_eyebrow}</p>
					<h1 id="hero-title">
						{content.hero_title_1}
						<br />
						<em>{content.hero_title_2}</em>
					</h1>
					<p className="hero-description">
						{content.hero_description_1}
						<br />
						{content.hero_description_2}
					</p>
					<Link className="text-link" href="/portafolio">
						Explora mi trabajo <span aria-hidden="true">↗</span>
					</Link>
					<div className="hero-bottom">
						<div>
							<p className="eyebrow">
								EDITORIAL. GLAM.
								<br />Y TODO LO QUE IMAGINES.
							</p>
							<p className="location">Bogotá, Colombia</p>
						</div>
					</div>
				</div>
			</section>
			<section
				className="home-selection section-shell"
				aria-labelledby="selection-title"
			>
				<div className="section-heading">
					<div>
						<p className="eyebrow">UNA MIRADA AL UNIVERSO LOLA</p>
						<h2 id="selection-title">
							Trabajo <em>seleccionado.</em>
						</h2>
					</div>
					<Link className="text-link" href="/portafolio">
						Ver todo el portafolio <span aria-hidden="true">↗</span>
					</Link>
				</div>
				<Gallery preview media={portfolioMedia} />
			</section>
		</main>
	);
}
