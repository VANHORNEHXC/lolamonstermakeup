import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
export const metadata: Metadata = { title: "Sobre Lola | Lola Monster Makeup" };
export default function AboutPage() {
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
							src="/portfolio/alien-dream.webp"
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
						Me inspira la belleza que se atreve a ser diferente. La que expresa,
						transforma y se siente propia.
					</p>
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
