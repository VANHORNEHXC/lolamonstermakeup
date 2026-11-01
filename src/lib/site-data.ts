import { cacheLife, cacheTag } from "next/cache";
import { getSql } from "@/lib/db";
import media from "@/lib/media-manifest.json";

export const textFields = [
	{
		key: "hero_eyebrow",
		label: "Portada · línea superior",
		defaultValue: "PAOLA PALACIO ROMO — MAKEUP & HAIR ARTIST",
	},
	{
		key: "hero_title_1",
		label: "Portada · título, primera línea",
		defaultValue: "Tu esencia.",
	},
	{
		key: "hero_title_2",
		label: "Portada · título, segunda línea",
		defaultValue: "Sin límites.",
	},
	{
		key: "hero_description_1",
		label: "Portada · descripción, primera línea",
		defaultValue: "Maquillaje que cuenta una historia.",
	},
	{
		key: "hero_description_2",
		label: "Portada · descripción, segunda línea",
		defaultValue: "La tuya, con un toque de Lola.",
	},
	{
		key: "about_lead",
		label: "Sobre Lola · frase destacada",
		defaultValue:
			"El maquillaje es mi forma de explorar todo lo que podemos ser.",
	},
	{
		key: "about_paragraph_1",
		label: "Sobre Lola · primer párrafo",
		defaultValue:
			"Soy Paola Palacio Romo, la artista detrás de Lola Monster Makeup. Desde Bogotá, creo propuestas de maquillaje y peinado editorial y social glam, donde el color, la textura y la personalidad se encuentran.",
	},
	{
		key: "about_paragraph_2",
		label: "Sobre Lola · segundo párrafo",
		defaultValue:
			"Me inspira la belleza que se atreve a ser diferente. La que expresa, transforma y se siente propia.",
	},
	{
		key: "service_editorial",
		label: "Servicio · Editorial",
		defaultValue:
			"Una idea que se convierte en imagen. Maquillaje y peinado para editoriales, producciones de moda y proyectos creativos.",
	},
	{
		key: "service_social",
		label: "Servicio · Social glam",
		defaultValue:
			"Un look que se siente tuyo. Maquillaje para celebrar, salir de lo cotidiano y acompañarte en tus ocasiones especiales.",
	},
	{
		key: "service_novias",
		label: "Servicio · Novias",
		defaultValue:
			"Tu esencia, presente en cada detalle. Conversemos sobre el maquillaje y peinado que imaginas para ese día.",
	},
	{
		key: "service_peinado",
		label: "Servicio · Peinado",
		defaultValue:
			"Textura, forma y movimiento para completar la historia. Peinados para proyectos editoriales y ocasiones especiales.",
	},
	{
		key: "service_clases",
		label: "Servicio · Clases",
		defaultValue:
			"Un espacio para explorar el maquillaje y descubrir nuevas posibilidades. Escríbeme para conocer las clases disponibles.",
	},
	{
		key: "not_found_title",
		label: "Página 404 · título",
		defaultValue: "Esta página se salió del lienzo.",
	},
	{
		key: "not_found_message",
		label: "Página 404 · mensaje",
		defaultValue:
			"No encontramos la página que buscabas. Vuelve al inicio y sigamos creando.",
	},
] as const;

export type TextKey = (typeof textFields)[number]["key"];
export const defaultContent = Object.fromEntries(
	textFields.map((field) => [field.key, field.defaultValue]),
) as Record<TextKey, string>;

export const mediaSlots = [
	{
		slot: "hero_video",
		label: "Portada · video",
		original: "video/lola-background.mp4",
		kind: "video",
	},
	{
		slot: "hero_poster",
		label: "Portada · imagen de espera",
		original: "video/lola-background.webp",
		kind: "image",
	},
	{
		slot: "about_photo",
		label: "Sobre Lola · fotografía",
		original: "portfolio/alien-dream.webp",
		kind: "image",
	},
	{
		slot: "booking_photo",
		label: "Booking · fotografía",
		original: "portfolio/heavenly.webp",
		kind: "image",
	},
	{
		slot: "portfolio_portrait",
		label: "Portafolio · A’ Portrait",
		original: "portfolio/portrait.webp",
		kind: "image",
	},
	{
		slot: "portfolio_the-shape",
		label: "Portafolio · The Shape",
		original: "portfolio/the-shape.webp",
		kind: "image",
	},
	{
		slot: "portfolio_jade",
		label: "Portafolio · Jade",
		original: "portfolio/jade.webp",
		kind: "image",
	},
	{
		slot: "portfolio_beauty",
		label: "Portafolio · Color & textura",
		original: "portfolio/beauty.webp",
		kind: "image",
	},
	{
		slot: "portfolio_heavenly",
		label: "Portafolio · Heavenly",
		original: "portfolio/heavenly.webp",
		kind: "image",
	},
	{
		slot: "portfolio_tailoring",
		label: "Portafolio · Siluetas",
		original: "portfolio/tailoring.webp",
		kind: "image",
	},
	{
		slot: "portfolio_bohemia",
		label: "Portafolio · Bohemia Nostálgica",
		original: "portfolio/bohemia.webp",
		kind: "image",
	},
	{
		slot: "portfolio_vintage",
		label: "Portafolio · Retrato vintage",
		original: "portfolio/vintage.webp",
		kind: "image",
	},
] as const;

export type MediaSlot = (typeof mediaSlots)[number]["slot"];
export const defaultMedia = Object.fromEntries(
	mediaSlots.map(({ slot, original }) => [slot, `/media/${media[original]}`]),
) as Record<MediaSlot, string>;

export async function getPublicContent(): Promise<Record<TextKey, string>> {
	"use cache";
	cacheLife("hours");
	cacheTag("site-content");
	try {
		const sql = getSql();
		const rows = await sql`SELECT key, value FROM site_content`;
		return {
			...defaultContent,
			...Object.fromEntries(rows.map((row) => [row.key, row.value])),
		};
	} catch {
		return defaultContent;
	}
}

export async function getPublicMedia(): Promise<Record<MediaSlot, string>> {
	"use cache";
	cacheLife("hours");
	cacheTag("site-media");
	try {
		const sql = getSql();
		const rows = await sql`SELECT slot, object_key FROM site_media`;
		return {
			...defaultMedia,
			...Object.fromEntries(
				rows.map((row) => [row.slot, `/media/${row.object_key}`]),
			),
		};
	} catch {
		return defaultMedia;
	}
}
