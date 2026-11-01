import {
	GetObjectCommand,
	HeadObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import media from "@/lib/media-manifest.json";
import { getSql } from "@/lib/db";

const bucket = "lolamonstermuamedia";
const localPathByKey = new Map(
	Object.entries(media).map(([localPath, key]) => [key, localPath]),
);
const cacheControl = "public, max-age=31536000, s-maxage=31536000, immutable";
let s3Client: S3Client | null | undefined;

function client(): S3Client | null {
	if (s3Client !== undefined) return s3Client;
	const endpoint = process.env.AWS_ENDPOINT_URL_S3;
	const region = process.env.AWS_REGION;
	const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
	const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
	if (!endpoint || !region || !accessKeyId || !secretAccessKey) {
		s3Client = null;
		return null;
	}
	s3Client = new S3Client({
		endpoint,
		region,
		forcePathStyle: true,
		credentials: { accessKeyId, secretAccessKey },
	});
	return s3Client;
}

function fallback(request: Request, localPath: string): Response {
	return new Response(null, {
		status: 307,
		headers: {
			Location: new URL(`/${localPath}`, request.url).toString(),
			"Cache-Control": "no-store",
			"X-Media-Source": "local-fallback",
		},
	});
}

async function serve(
	request: Request,
	context: { params: Promise<{ path: string[] }> },
	headOnly: boolean,
): Promise<Response> {
	const { path } = await context.params;
	const key = path.join("/");
	const localPath = localPathByKey.get(key);
	if (!localPath) {
		const sql = getSql();
		const rows = await sql`SELECT slot FROM site_media WHERE object_key = ${key} LIMIT 1`;
		if (!rows.length) return new Response("Not Found", { status: 404 });
	}

	const s3 = client();
	if (!s3) return localPath ? fallback(request, localPath) : new Response("Media unavailable", { status: 503 });

	const range = request.headers.get("range");
	if (range && !/^bytes=(?:\d+-\d*|-\d+)$/.test(range)) {
		return new Response("Invalid Range", { status: 416 });
	}

	try {
		const object = headOnly
			? await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
			: await s3.send(
					new GetObjectCommand({
						Bucket: bucket,
						Key: key,
						Range: range ?? undefined,
					}),
				);
		const headers = new Headers({
			"Cache-Control": cacheControl,
			"Vercel-CDN-Cache-Control": "public, s-maxage=31536000",
			"Content-Type": object.ContentType ?? "application/octet-stream",
			"Accept-Ranges": "bytes",
			"X-Media-Source": "neon",
		});
		if (object.ContentLength !== undefined) {
			headers.set("Content-Length", String(object.ContentLength));
		}
		if (object.ContentRange) headers.set("Content-Range", object.ContentRange);
		const body = "Body" in object ? object.Body?.transformToWebStream() : null;
		return new Response(headOnly ? null : body, {
			status: object.ContentRange ? 206 : 200,
			headers,
		});
	} catch (error) {
		console.error("Neon media unavailable:", error);
		return localPath ? fallback(request, localPath) : new Response("Media unavailable", { status: 503 });
	}
}

export function GET(
	request: Request,
	context: { params: Promise<{ path: string[] }> },
) {
	return serve(request, context, false);
}

export function HEAD(
	request: Request,
	context: { params: Promise<{ path: string[] }> },
) {
	return serve(request, context, true);
}
