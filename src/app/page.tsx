import Link from "next/link";
import { HeroVideo } from "./hero-video";
import { Gallery } from "./portfolio";
export default function Home() {
	return (
		<main id="contenido">
			<section className="hero hero-with-video" aria-labelledby="hero-title">
				<HeroVideo />
				<div className="hero-copy">
					<p className="eyebrow">
						PAOLA PALACIO ROMO <span>—</span> MAKEUP & HAIR ARTIST
					</p>
					<h1 id="hero-title">
						Tu esencia.
						<br />
						<em>Sin límites.</em>
					</h1>
					<p className="hero-description">
						Maquillaje que cuenta una historia.
						<br />
						La tuya, con un toque de Lola.
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
				<Gallery preview />
			</section>
		</main>
	);
}
