import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const bucket = "lolamonstermuamedia";
const files = [
  "portfolio/alien-dream.webp",
  "portfolio/beauty.webp",
  "portfolio/bohemia.webp",
  "portfolio/heavenly.webp",
  "portfolio/jade.webp",
  "portfolio/portrait.webp",
  "portfolio/tailoring.webp",
  "portfolio/the-shape.webp",
  "portfolio/vintage.webp",
  "video/lola-background.mp4",
  "video/lola-background.webp",
];

const endpoint = process.env.AWS_ENDPOINT_URL_S3;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!endpoint || !region || !accessKeyId || !secretAccessKey) {
  throw new Error("Faltan las variables AWS_ENDPOINT_URL_S3, AWS_REGION o las credenciales S3 en .env");
}

const origin = new URL(endpoint);
if (origin.protocol !== "https:") throw new Error("El endpoint de Neon debe usar HTTPS");

const s3 = new S3Client({
  endpoint: origin.toString(),
  region,
  forcePathStyle: true,
  credentials: { accessKeyId, secretAccessKey },
});

const assets = {};
for (const relativePath of files) {
  const body = await readFile(join("public", relativePath));
  const extension = extname(relativePath);
  const stem = basename(relativePath, extension);
  const hash = createHash("sha256").update(body).digest("hex").slice(0, 16);
  const folder = relativePath.split("/")[0];
  const key = `${folder}/${stem}-${hash}${extension}`;
  const contentType = extension === ".mp4" ? "video/mp4" : "image/webp";

  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  }));

  const head = await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
  if (head.ContentLength !== body.length || head.ContentType !== contentType) {
    throw new Error(`La comprobación de ${key} no coincide con el archivo local`);
  }

  assets[relativePath] = key;
  console.log(`${relativePath} → ${key} (${body.length} bytes)`);
}

await writeFile("src/lib/media-manifest.json", `${JSON.stringify(assets, null, 2)}\n`);
console.log("Manifiesto actualizado: src/lib/media-manifest.json");
