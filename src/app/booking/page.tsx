import type { Metadata } from "next";
import Image from "next/image";
import { BookingForm } from "./booking-form";
export const metadata: Metadata = {
	title: "Booking | Lola Monster Makeup",
	description:
		"Cuéntame tu idea y solicita disponibilidad para maquillaje y peinado editorial, social glam o novias en Bogotá.",
};
export default function BookingPage() {
	return (
		<main id="contenido" className="booking-page section-shell">
			<div className="booking-intro">
				<p className="eyebrow">BOOKING / CREEMOS ALGO JUNTAS</p>
				<h1 className="page-title">
					Tu idea.
					<br />
					<em>Mi próximo lienzo.</em>
				</h1>
				<p>
					Cuéntame qué tienes en mente. Revisaré tu solicitud para conversar
					sobre el look, la disponibilidad y la cotización.
				</p>
				<div className="booking-photo">
					<Image
						src="/portfolio/heavenly.webp"
						alt="Maquillaje luminoso de la editorial Heavenly"
						fill
						loading="eager"
						sizes="(max-width: 700px) 90vw, 35vw"
					/>
				</div>
				<p className="booking-photo-credit">HEAVENLY · MAKEUP BY LOLA</p>
				<a
					className="text-link"
					href="https://www.instagram.com/lolamonstermakeup/"
					target="_blank"
					rel="noreferrer"
				>
					¿Prefieres un DM? Instagram ↗
				</a>
			</div>
			<div className="booking-panel">
				<p className="eyebrow">SOLICITUD DE SERVICIO</p>
				<h2>
					Hablemos de <em>tu look.</em>
				</h2>
				<p className="booking-note">
					Los campos con * son obligatorios.
				</p>
				<BookingForm />
			</div>
		</main>
	);
}
