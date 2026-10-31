"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const works = [
	{
		image: "portrait",
		title: "A’ Portrait",
		category: "Editorial",
		tags: ["Editorial", "Peinado"],
		code: "DedHscXjRmk",
		alt: "Modelo con maquillaje de rubor intenso y gorguera blanca sobre fondo azul grisáceo",
		credit:
			"Fotografía y styling: @_gonzalezandres · Modelo: @marloncaceresr · Makeup & hair: @lolamonstermakeup · Feland Studios",
	},
	{
		image: "the-shape",
		title: "The Shape",
		category: "Editorial",
		tags: ["Editorial", "Peinado"],
		code: "Dd7kv1ZlpLJ",
		alt: "Retrato en blanco y negro con ondas esculpidas alrededor del rostro",
		credit:
			"Fotografía: @stevenmanriquephotos · Modelo: @irina.popovaa · Styling: @elkinariasoficial · Makeup & hair: @lolamonstermakeup",
	},
	{
		image: "jade",
		title: "Jade",
		category: "Editorial",
		tags: ["Editorial"],
		code: "DeNlZc1lmh3",
		alt: "Modelo de cabello rubio con sombrero negro y maquillaje suave ante un fondo rojo",
		credit:
			"Fotografía: @stevenmanriquephotos · Modelo: @jadesaric_ · Styling: @bykhaled__ · Makeup: @lolamonstermakeup",
	},
	{
		image: "beauty",
		title: "Color & textura",
		category: "Beauty",
		tags: ["Beauty"],
		code: "DeALLE_lg4x",
		alt: "Detalle de ojos, piel luminosa y labios con brillo",
		credit: "Makeup: @lolamonstermakeup · Modelo: @ch_rrybomb",
	},
	{
		image: "heavenly",
		title: "Heavenly",
		category: "Beauty editorial",
		tags: ["Editorial", "Beauty"],
		code: "DdhGSSolvWP",
		alt: "Maquillaje luminoso y delicado bajo un velo blanco",
		credit:
			"Dirección y fotografía: @stevenmanriquephotos · Modelo: @_pilarretrive · Styling: @elkinariasoficial · Makeup: @lolamonstermakeup",
	},
	{
		image: "tailoring",
		title: "Siluetas",
		category: "Editorial",
		tags: ["Editorial", "Peinado"],
		code: "Dchu20KEUH_",
		alt: "Modelo con traje negro y corsé blanco sobre fondo vino",
		credit:
			"Fotografía: @777visual · Modelo: @unpatoalagua · Styling: @elkinariasoficial · Makeup: @lolamonstermakeup",
	},
	{
		image: "bohemia",
		title: "Bohemia Nostálgica",
		category: "Beauty editorial",
		tags: ["Editorial", "Beauty"],
		code: "DfDBr3bnHFm",
		alt: "Retrato de tonos cálidos con labios ciruela y mirada definida",
		credit:
			"Fotografía: @enfokado_1519 · Modelo: @_pilarretrive · Styling: @unavagamundamas · Makeup: @lolamonstermakeup",
	},
	{
		image: "vintage",
		title: "Retrato vintage",
		category: "Beauty",
		tags: ["Beauty", "Peinado"],
		code: "DdXhL-6keTe",
		alt: "Retrato de inspiración vintage en blanco y negro",
		credit: "Makeup: @lolamonstermakeup · Modelo: @ch_rrybomb",
	},
];
const filters = ["Todo", "Editorial", "Beauty", "Peinado"];

export function SiteHeader() {
	const [open, setOpen] = useState(false);
	useEffect(() => {
		const closeMenu = () => setOpen(false);
		window.addEventListener("hashchange", closeMenu);
		return () => window.removeEventListener("hashchange", closeMenu);
	}, []);
	return (
		<header className="site-header">
			<a
				className="wordmark"
				href="#inicio"
				aria-label="Lola Monster Makeup, inicio"
			>
				lola<span>MONSTER MAKEUP</span>
			</a>
			<button
				type="button"
				className="menu-toggle"
				aria-expanded={open}
				aria-controls="main-navigation"
				onClick={() => setOpen(!open)}
			>
				{open ? "Cerrar −" : "Menú +"}
			</button>
			<nav
				id="main-navigation"
				aria-label="Navegación principal"
				className={open ? "navigation is-open" : "navigation"}
			>
				<a href="/#portafolio">Portafolio</a>
				<a href="/#servicios">Servicios</a>
				<a href="/#sobre-lola">Sobre Lola</a>
				<a className="nav-contact" href="/#contacto">
					Hablemos <span aria-hidden="true">↗</span>
				</a>
			</nav>
		</header>
	);
}

export function Gallery() {
	const [filter, setFilter] = useState("Todo");
	const [active, setActive] = useState(0);
	const dialog = useRef<HTMLDialogElement>(null);
	const selected = works[active];
	const visible = works.filter(
		(work) => filter === "Todo" || work.tags.includes(filter),
	);
	function showWork(index: number) {
		setActive(index);
		dialog.current?.showModal();
	}
	function move(direction: number) {
		const index = visible.indexOf(selected);
		const next = visible[(index + direction + visible.length) % visible.length];
		setActive(works.indexOf(next));
	}
	return (
		<>
			<div className="gallery-toolbar">
				<fieldset className="gallery-filters" aria-label="Filtrar portafolio">
					{filters.map((item) => (
						<button
							type="button"
							key={item}
							aria-pressed={item === filter}
							onClick={() => setFilter(item)}
						>
							{item}
						</button>
					))}
				</fieldset>
				<span className="gallery-count" aria-live="polite">
					{String(visible.length).padStart(2, "0")} trabajos
				</span>
			</div>
			<div className="gallery-grid">
				{visible.map((work) => (
					<button
						className="work"
						type="button"
						key={work.image}
						onClick={() => showWork(works.indexOf(work))}
						aria-label={`Ver ${work.title}`}
					>
						<div className="work-image">
							<Image
								src={`/portfolio/${work.image}.webp`}
								alt={work.alt}
								fill
								sizes="(max-width: 700px) 50vw, (max-width: 1100px) 45vw, 24vw"
							/>
							<span className="work-open" aria-hidden="true">
								↗
							</span>
						</div>
						<div className="work-caption">
							<h3>{work.title}</h3>
							<span>{work.category}</span>
						</div>
					</button>
				))}
			</div>
			<dialog
				ref={dialog}
				className="work-dialog"
				aria-labelledby="work-title"
				onKeyDown={(event) => {
					if (event.key === "ArrowRight") move(1);
					if (event.key === "ArrowLeft") move(-1);
				}}
			>
				<button
					className="dialog-close"
					type="button"
					onClick={() => dialog.current?.close()}
					aria-label="Cerrar fotografía"
				>
					Cerrar ×
				</button>
				<div className="dialog-photo">
					<Image
						src={`/portfolio/${selected.image}.webp`}
						alt={selected.alt}
						fill
						sizes="(max-width: 700px) 90vw, 65vw"
					/>
				</div>
				<div className="dialog-info">
					<p className="eyebrow">{selected.category}</p>
					<h3 id="work-title">{selected.title}</h3>
					<p>{selected.credit}</p>
					<a
						className="text-link"
						href={`https://www.instagram.com/p/${selected.code}/`}
						target="_blank"
						rel="noreferrer"
					>
						Ver publicación y créditos ↗
					</a>
					<div className="dialog-controls">
						<button
							type="button"
							onClick={() => move(-1)}
							aria-label="Fotografía anterior"
						>
							←
						</button>
						<span>
							{visible.indexOf(selected) + 1} / {visible.length}
						</span>
						<button
							type="button"
							onClick={() => move(1)}
							aria-label="Fotografía siguiente"
						>
							→
						</button>
					</div>
				</div>
			</dialog>
		</>
	);
}
