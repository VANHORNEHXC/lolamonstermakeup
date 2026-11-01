"use client";

import { useEffect, useRef, useState } from "react";

export function HeroVideo() {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [playing, setPlaying] = useState(false);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;
		const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
		if (!motion.matches) void video.play().catch(() => {});
		const respectMotion = () => {
			if (motion.matches) video.pause();
		};
		motion.addEventListener("change", respectMotion);
		return () => motion.removeEventListener("change", respectMotion);
	}, []);

	function togglePlayback() {
		const video = videoRef.current;
		if (!video) return;
		if (video.paused) void video.play().catch(() => {});
		else video.pause();
	}

	return (
		<>
			<video
				ref={videoRef}
				className="hero-video"
				src="/video/lola-background.mp4"
				poster="/video/lola-background.webp"
				width={720}
				height={1280}
				muted
				loop
				playsInline
				preload="metadata"
				aria-label="Video de maquillaje de fondo, sin sonido"
				onPlay={() => setPlaying(true)}
				onPause={() => setPlaying(false)}
			/>
			<button
				className="video-toggle"
				type="button"
				onClick={togglePlayback}
				aria-label={
					playing ? "Pausar video de fondo" : "Reproducir video de fondo"
				}
			>
				<span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span>
				{playing ? "Pausar video" : "Reproducir video"}
			</button>
		</>
	);
}
