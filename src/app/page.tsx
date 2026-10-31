import Image from "next/image";
import Link from "next/link";
import { Gallery, SiteHeader } from "./portfolio";

const instagram = "https://www.instagram.com/lolamonstermakeup/";
const services = [
	{
		name: "Editorial",
		detail:
			"Una idea que se convierte en imagen. Maquillaje y peinado para editoriales, producciones de moda y proyectos creativos.",
		note: "MODA · CAMPAÑAS · PRODUCCIONES",
	},
	{
		name: "Social glam",
		detail:
			"Un look que se siente tuyo. Maquillaje para celebrar, salir de lo cotidiano y acompañarte en tus ocasiones especiales.",
		note: "EVENTOS · CELEBRACIONES",
	},
	{
		name: "Novias",
		detail:
			"Tu esencia, presente en cada detalle. Conversemos sobre el maquillaje y peinado que imaginas para ese día.",
		note: "BRIDAL BEAUTY",
	},
	{
		name: "Peinado",
		detail:
			"Textura, forma y movimiento para completar la historia. Peinados para proyectos editoriales y ocasiones especiales.",
		note: "HAIR STYLING",
	},
	{
		name: "Clases",
		detail:
			"Un espacio para explorar el maquillaje y descubrir nuevas posibilidades. Escríbeme para conocer las clases disponibles.",
		note: "EXPLORA · APRENDE · CREA",
	},
];

export default function Home() {
	return (
		<div className="lola-site" id="inicio">
			<a className="skip-link" href="#contenido">
				Saltar al contenido
			</a>
			<SiteHeader />
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
						<a className="text-link" href="#portafolio">
							Explora mi trabajo <span aria-hidden="true">↗</span>
						</a>
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
				<div className="manifesto">
					<span>Makeup as a form of expression.</span>
					<span className="spark" aria-hidden="true">
						✳
					</span>
					<span>Vegan & cruelty free.</span>
					<span className="spark" aria-hidden="true">
						✳
					</span>
					<span>Beauty beyond the ordinary.</span>
				</div>
				<section
					className="portfolio-section section-shell"
					id="portafolio"
					aria-labelledby="portfolio-title"
				>
					<div className="section-heading">
						<div>
							<p className="eyebrow">01 / TRABAJO SELECCIONADO</p>
							<h2 id="portfolio-title">
								El arte de <em>transformar.</em>
							</h2>
						</div>
						<p>
							Distintos rostros. Infinitas posibilidades.
							<br />
							Una mirada al universo Lola.
						</p>
					</div>
					<Gallery />
					<div className="portfolio-end">
						<p>El proceso, los detalles y lo que viene.</p>
						<a
							className="text-link"
							href={instagram}
							target="_blank"
							rel="noreferrer"
						>
							Más en Instagram <span aria-hidden="true">↗</span>
						</a>
					</div>
				</section>
				<section
					className="services-section"
					id="servicios"
					aria-labelledby="services-title"
				>
					<div className="section-shell services-layout">
						<div className="services-intro">
							<p className="eyebrow">02 / LO QUE PODEMOS CREAR</p>
							<h2 id="services-title">
								Cada ocasión,
								<br />
								<em>su propio arte.</em>
							</h2>
							<p>
								Desde una imagen que rompe esquemas hasta ese día que quieres
								recordar.
							</p>
							<a
								className="text-link"
								href={instagram}
								target="_blank"
								rel="noreferrer"
							>
								Cuéntame tu idea <span aria-hidden="true">↗</span>
							</a>
						</div>
						<div className="service-list">
							{services.map((service, index) => (
								<details className="service" key={service.name}>
									<summary>
										<span className="service-number">0{index + 1}</span>
										<h3>{service.name}</h3>
										<span className="service-plus" aria-hidden="true">
											+
										</span>
									</summary>
									<div className="service-content">
										<p className="eyebrow">{service.note}</p>
										<p>{service.detail}</p>
										<a href={instagram} target="_blank" rel="noreferrer">
											Consultar disponibilidad ↗
										</a>
									</div>
								</details>
							))}
						</div>
					</div>
				</section>
				<section
					className="about-section section-shell"
					id="sobre-lola"
					aria-labelledby="about-title"
				>
					<figure className="about-figure">
						<div className="about-image">
							<Image
								src="/portfolio/alien-dream.webp"
								alt="Paola Palacio Romo en una producción de fantasía, con maquillaje y peinado propios, en un paisaje de tonos ocre"
								fill
								sizes="(max-width: 700px) 90vw, 45vw"
							/>
						</div>
						<figcaption>
							AN ALIEN DREAM · FOTOGRAFÍA: JESSICA VILLADIEGO
						</figcaption>
					</figure>
					<div className="about-copy">
						<p className="eyebrow">03 / DETRÁS DE LAS BROCHAS</p>
						<h2 id="about-title">
							Soy Paola.
							<br />
							<em>También soy Lola.</em>
						</h2>
						<p className="about-lead">
							El maquillaje es mi forma de explorar todo lo que podemos ser.
						</p>
						<p>
							Soy Paola Palacio Romo, la artista detrás de Lola Monster Makeup.
							Desde Bogotá, creo propuestas de maquillaje y peinado editorial y
							social glam, donde el color, la textura y la personalidad se
							encuentran.
						</p>
						<p>
							Me inspira la belleza que se atreve a ser diferente. La que
							expresa, transforma y se siente propia.
						</p>
						<div className="ethos">
							<span aria-hidden="true">✳</span>
							<span>
								Creatividad sin límites.
								<br />
								<strong>Vegan & cruelty free.</strong>
							</span>
						</div>
					</div>
				</section>
				<section
					className="contact-section"
					id="contacto"
					aria-labelledby="contact-title"
				>
					<p className="eyebrow">
						TU PRÓXIMO LOOK EMPIEZA CON UNA CONVERSACIÓN
					</p>
					<h2 id="contact-title">
						Hagamos algo
						<br />
						<em>extraordinario.</em>
					</h2>
					<a
						href={instagram}
						target="_blank"
						rel="noreferrer"
						className="contact-button"
					>
						Hablemos por Instagram <span aria-hidden="true">↗</span>
					</a>
					<p>Bogotá, Colombia · Editorial · Social glam · Novias</p>
					<span className="contact-star" aria-hidden="true">
						✳
					</span>
				</section>
			</main>
			<footer className="site-footer">
				<a
					className="wordmark"
					href="#inicio"
					aria-label="Lola Monster Makeup, inicio"
				>
					lola<span>MONSTER MAKEUP</span>
				</a>
				<p>Maquillaje con identidad.</p>
				<div>
					<a href={instagram} target="_blank" rel="noreferrer">
						Instagram ↗
					</a>
					<Link href="/account">Mi cuenta</Link>
					<span>© Lola Monster Makeup</span>
				</div>
			</footer>
		</div>
	);
}
