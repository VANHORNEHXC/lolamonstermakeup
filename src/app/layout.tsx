import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { SiteHeader } from "./portfolio";
import "./globals.css";

const silkFlower = localFont({
	src: "../../public/silk-flower-font/silk-flower.otf",
	variable: "--font-silk-flower",
	display: "swap",
});

const playfair = localFont({
	src: "../../public/Metamorphous,Playfair_Display/Playfair_Display/PlayfairDisplay-VariableFont_wght.ttf",
	variable: "--font-playfair",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Lola Monster Makeup | Maquillaje & peinado en Bogotá",
	description:
		"Paola Palacio Romo. Maquillaje y peinado editorial, social glam y novias en Bogotá. Explora el universo de Lola Monster Makeup. Vegan & cruelty free.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="es"
			className={`${silkFlower.variable} ${playfair.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col">
				<div className="lola-site">
					<a className="skip-link" href="#contenido">
						Saltar al contenido
					</a>
					<SiteHeader />
					{children}
					<footer className="site-footer">
						<Link
							className="wordmark"
							href="/"
							aria-label="Lola Monster Makeup, inicio"
						>
							lola<span>MONSTER MAKEUP</span>
						</Link>
						<p>Maquillaje con identidad.</p>
						<div>
							<a
								href="https://www.instagram.com/lolamonstermakeup/"
								target="_blank"
								rel="noreferrer"
							>
								Instagram ↗
							</a>
							<Link href="/booking">Booking</Link>
							<span>© Lola Monster Makeup</span>
						</div>
					</footer>
				</div>
			</body>
		</html>
	);
}
