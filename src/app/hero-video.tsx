export function HeroVideo({ video, poster }: { video: string; poster: string }) {
	return (
		<video
			className="hero-video"
			src={video}
			poster={poster}
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
