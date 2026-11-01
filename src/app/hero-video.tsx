import { mediaUrl } from "@/lib/media";

export function HeroVideo() {
	return (
		<video
			className="hero-video"
			src={mediaUrl("video/lola-background.mp4")}
			poster={mediaUrl("video/lola-background.webp")}
			width={720}
			height={1280}
			autoPlay
			muted
			loop
			playsInline
			preload="metadata"
			aria-label="Video de maquillaje de fondo, sin sonido"
		/>
	);
}
