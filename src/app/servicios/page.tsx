import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Servicios | Lola Monster Makeup" };
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

export default function ServicesPage() {
	return (
		<main id="contenido">
			<section
				className="services-section services-page"
				id="servicios"
				aria-labelledby="services-title"
			>
				<div className="section-shell services-layout">
					<div className="services-intro">
						<p className="eyebrow">SERVICIOS / LO QUE PODEMOS CREAR</p>
						<h1 className="page-title" id="services-title">
							Cada ocasión,
							<br />
							<em>su propio arte.</em>
						</h1>
						<p>
							Desde una imagen que rompe esquemas hasta ese día que quieres
							recordar.
						</p>
						<Link className="text-link" href="/booking">
							Cuéntame tu idea <span aria-hidden="true">↗</span>
						</Link>
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
									<Link href="/booking">Consultar disponibilidad ↗</Link>
								</div>
							</details>
						))}
					</div>
				</div>
			</section>
		</main>
	);
}
