import Image from "next/image";
import Link from "next/link";
import { Gallery } from "./portfolio";
export default function Home() {
	return (
		<main id="contenido">
			<section className="hero" aria-labelledby="hero-title">
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
						<div className="hero-small-image">
							<Image
								src="/portfolio/the-shape.webp"
								alt="Retrato editorial en blanco y negro, con ondas que enmarcan el rostro"
								fill
								sizes="(max-width: 700px) 30vw, 170px"
							/>
						</div>
						<div>
							<p className="eyebrow">
								EDITORIAL. GLAM.
								<br />Y TODO LO QUE IMAGINES.
							</p>
							<p className="location">Bogotá, Colombia</p>
						</div>
					</div>
				</div>
				<figure className="hero-figure">
					<div className="hero-image">
						<Image
							src="/portfolio/bohemia.webp"
							alt="Maquillaje de tonos cálidos y labios ciruela para la editorial Bohemia Nostálgica"
							fill
							loading="eager"
							fetchPriority="high"
							sizes="(max-width: 700px) 100vw, 50vw"
						/>
					</div>
					<figcaption>
						<span>BOHEMIA NOSTÁLGICA</span>
						<span>MAKEUP BY LOLA ↗</span>
					</figcaption>
				</figure>
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
