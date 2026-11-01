import type { Metadata } from "next";
import Link from "next/link";
import { getPublicContent, type TextKey } from "@/lib/site-data";
export const metadata: Metadata = { title: "Servicios | Lola Monster Makeup" };
const services: { name: string; detailKey: TextKey; note: string }[] = [
	{
		name: "Editorial",
		detailKey: "service_editorial",
		note: "MODA · CAMPAÑAS · PRODUCCIONES",
	},
	{
		name: "Social glam",
		detailKey: "service_social",
		note: "EVENTOS · CELEBRACIONES",
	},
	{
		name: "Novias",
		detailKey: "service_novias",
		note: "BRIDAL BEAUTY",
	},
	{
		name: "Peinado",
		detailKey: "service_peinado",
		note: "HAIR STYLING",
	},
	{
		name: "Clases",
		detailKey: "service_clases",
		note: "EXPLORA · APRENDE · CREA",
	},
];

export default async function ServicesPage() {
	const content = await getPublicContent();
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
									<p>{content[service.detailKey]}</p>
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
