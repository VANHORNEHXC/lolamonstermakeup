import Link from "next/link";
import { getPublicContent } from "@/lib/site-data";

export default async function NotFound() {
	const content = await getPublicContent();
	return (
		<main id="contenido" className="not-found-page">
			<p className="eyebrow">404 / LOLA MONSTER MAKEUP</p>
			<h1>{content.not_found_title}</h1>
			<p>{content.not_found_message}</p>
			<Link className="text-link" href="/">Volver al inicio ↗</Link>
		</main>
	);
}
