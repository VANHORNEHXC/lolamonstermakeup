import media from "./media-manifest.json";

export function mediaUrl(path: keyof typeof media): string {
	return `/media/${media[path]}`;
}

export function portfolioImage(name: string): string {
	const path = `portfolio/${name}.webp` as keyof typeof media;
	const url = media[path];
	if (!url) throw new Error(`Falta la imagen ${path} en el manifiesto de media`);
	return `/media/${url}`;
}
