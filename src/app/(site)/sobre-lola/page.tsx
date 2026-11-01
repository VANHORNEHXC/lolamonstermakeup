import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { mediaUrl } from "@/lib/media";
import { getPublicContent, getPublicMedia } from "@/lib/site-data";
export const metadata: Metadata = { title: "Sobre Lola | Lola Monster Makeup" };
export default async function AboutPage() {
	const [content, media] = await Promise.all([
		getPublicContent(),
		getPublicMedia(),
	]);
	return (
		<main id="contenido">
			<section
				className="about-section section-shell"
				id="sobre-lola"
				aria-labelledby="about-title"
			>
				<figure className="about-figure">
					<div className="about-image">
						<Image
							src={media.about_photo ?? mediaUrl("portfolio/alien-dream.webp")}
							alt="Paola Palacio Romo en una producción de fantasía, con maquillaje y peinado propios, en un paisaje de tonos ocre"
							fill
							loading="eager"
							sizes="(max-width: 700px) 90vw, 45vw"
						/>
					</div>
					<figcaption>
						AN ALIEN DREAM · FOTOGRAFÍA: JESSICA VILLADIEGO
					</figcaption>
				</figure>
				<div className="about-copy">
					<p className="eyebrow">SOBRE LOLA / DETRÁS DE LAS BROCHAS</p>
					<h1 className="page-title" id="about-title">
						Soy Paola.
						<br />
						<em>También soy Lola.</em>
					</h1>
					<p className="about-lead">{content.about_lead}</p>
					<p>{content.about_paragraph_1}</p>
					<p>{content.about_paragraph_2}</p>
					<Link className="text-link" href="/booking">
						Cuéntame tu idea ↗
					</Link>
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
		</main>
	);
}
