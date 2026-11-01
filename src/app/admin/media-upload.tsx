"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function MediaUpload({ slot, kind }: { slot: string; kind: string }) {
	const router = useRouter();
	const [pending, setPending] = useState(false);
	const [message, setMessage] = useState("");
	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget;
		const data = new FormData(form);
		setPending(true);
		setMessage("");
		try {
			const response = await fetch("/api/admin/upload", {
				method: "POST",
				body: data,
			});
			const result = await response.json();
			if (!response.ok)
				throw new Error(result.error || "No se pudo subir el archivo.");
			setMessage("Archivo publicado.");
			form.reset();
			router.refresh();
		} catch (error) {
			setMessage(error instanceof Error ? error.message : "Error de subida.");
		} finally {
			setPending(false);
		}
	}
	return (
		<form className="admin-upload" onSubmit={submit}>
			<input type="hidden" name="slot" value={slot} />
			<input
				type="file"
				name="file"
				accept={
					kind === "video"
						? "video/mp4"
						: "image/webp,image/jpeg,image/png,image/avif"
				}
				aria-label={`Subir ${slot}`}
				required
			/>
			<button type="submit" disabled={pending}>
				{pending ? "Subiendo…" : "Subir archivo ↗"}
			</button>
			{message && <span role="status">{message}</span>}
		</form>
	);
}
