import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { SiteHeader } from "./portfolio";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
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
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
