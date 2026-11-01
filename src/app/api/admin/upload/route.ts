import { createHash } from "node:crypto";
import {
	HeadObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAdmin } from "@/lib/admin-auth";
import { getSql } from "@/lib/db";
import { mediaSlots } from "@/lib/site-data";

const bucket = "lolamonstermuamedia";
const maxBytes = 4_000_000;

function fileType(
	bytes: Uint8Array,
): { mime: string; extension: string; kind: string } | null {
	const head = Buffer.from(bytes.subarray(0, 16));
	if (
		head.toString("ascii", 0, 4) === "RIFF" &&
		head.toString("ascii", 8, 12) === "WEBP"
	)
		return { mime: "image/webp", extension: "webp", kind: "image" };
	if (
		head.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
	)
		return { mime: "image/png", extension: "png", kind: "image" };
	if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff)
		return { mime: "image/jpeg", extension: "jpg", kind: "image" };
	if (head.toString("ascii", 4, 12) === "ftypavif")
		return { mime: "image/avif", extension: "avif", kind: "image" };
	if (head.toString("ascii", 4, 8) === "ftyp")
		return { mime: "video/mp4", extension: "mp4", kind: "video" };
	return null;
}

export async function POST(request: Request) {
	const admin = await getAdmin();
	if (!admin)
		return Response.json({ error: "Sesión expirada." }, { status: 401 });
	const origin = request.headers.get("origin");
	const host = request.headers.get("host") ?? new URL(request.url).host;
	if (origin && origin !== `https://${host}` && origin !== `http://${host}`)
		return Response.json({ error: "Origen no permitido." }, { status: 403 });
	if (Number(request.headers.get("content-length") ?? 0) > maxBytes + 200_000)
		return Response.json({ error: "El archivo supera 4 MB." }, { status: 413 });
	const form = await request.formData();
	const slot = String(form.get("slot") ?? "");
	const definition = mediaSlots.find((item) => item.slot === slot);
	const file = form.get("file");
	if (
		!definition ||
		!(file instanceof File) ||
		!file.size ||
		file.size > maxBytes
	)
		return Response.json(
			{ error: "Elige un archivo válido de hasta 4 MB." },
			{ status: 400 },
		);
	const bytes = new Uint8Array(await file.arrayBuffer());
	const type = fileType(bytes);
	if (!type || type.kind !== definition.kind)
		return Response.json(
			{ error: "Formato no permitido para esta sección." },
			{ status: 400 },
		);
	const endpoint = process.env.AWS_ENDPOINT_URL_S3;
	const region = process.env.AWS_REGION;
	const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
	const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
	if (!endpoint || !region || !accessKeyId || !secretAccessKey)
		return Response.json(
			{ error: "Storage no configurado en el servidor." },
			{ status: 503 },
		);
	const s3 = new S3Client({
		endpoint,
		region,
		forcePathStyle: true,
		credentials: { accessKeyId, secretAccessKey },
	});
	const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 16);
	const key = `admin/${slot}/${hash}.${type.extension}`;
	try {
		await s3.send(
			new PutObjectCommand({
				Bucket: bucket,
				Key: key,
				Body: bytes,
				ContentType: type.mime,
				CacheControl: "public, max-age=31536000, immutable",
			}),
		);
		const head = await s3.send(
			new HeadObjectCommand({ Bucket: bucket, Key: key }),
		);
		if (head.ContentLength !== bytes.length)
			throw new Error("Upload size mismatch");
		const sql = getSql();
		await sql`INSERT INTO site_media (slot, object_key, content_type, size_bytes, original_name)
			VALUES (${slot}, ${key}, ${type.mime}, ${bytes.length}, ${file.name.slice(0, 200)})
			ON CONFLICT (slot) DO UPDATE SET object_key = EXCLUDED.object_key,
				content_type = EXCLUDED.content_type, size_bytes = EXCLUDED.size_bytes,
				original_name = EXCLUDED.original_name, updated_at = now()`;
		revalidateTag("site-media", "max");
		for (const path of ["/", "/portafolio", "/sobre-lola", "/booking"])
			revalidatePath(path);
		return Response.json({ ok: true, url: `/media/${key}` });
	} catch (error) {
		console.error("Admin media upload failed:", error);
		return Response.json(
			{ error: "No se pudo subir el archivo. Inténtalo de nuevo." },
			{ status: 503 },
		);
	}
}
