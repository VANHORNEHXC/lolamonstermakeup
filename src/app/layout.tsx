import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const silkFlower = localFont({
	src: "../../public/silk-flower-font/silk-flower.otf",
	variable: "--font-silk-flower",
	weight: "400",
	style: "normal",
	fallback: ["Georgia", "serif"],
	display: "swap",
});

const playfair = localFont({
	src: "../../public/Metamorphous,Playfair_Display/Playfair_Display/PlayfairDisplay-VariableFont_wght.ttf",
	variable: "--font-playfair",
	weight: "400 900",
	style: "normal",
	fallback: ["Georgia", "serif"],
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
			<body className="min-h-full flex flex-col">{children}</body>
		</html>
	);
}
