# Lola Monster Makeup

Portafolio de Paola Palacio Romo en Next.js 16, con solicitudes de servicio guardadas en Neon Postgres. El sitio es público y no tiene cuentas ni autenticación.

## Páginas

- `/`: portada y selección de cuatro fotografías.
- `/portafolio`: galería completa con filtros, ampliación, créditos y navegación por teclado.
- `/servicios`: editorial, social glam, novias, peinado y clases.
- `/sobre-lola`: presentación de Paola.
- `/booking`: solicitud de disponibilidad y cotización.

Las imágenes y sus fuentes están documentadas en `public/portfolio/README.md`. Las fotografías y el video se guardan en el bucket privado de Neon `lolamonstermuamedia`.

La identidad visual usa Silk Flower para títulos y Playfair Display para texto, servidas localmente mediante `next/font`. La paleta pastel se define en `src/app/globals.css`; los colores `text-muted` y `text-accent` son variantes oscuras para mantener legibilidad sobre crema y avena.

## Configuración

1. Ejecuta `npm ci`.
2. Crea `.env` con las variables de `.env.example`.
3. Ejecuta `npm run db:setup` para crear la tabla e índices de solicitudes. La migración es idempotente y no modifica otras tablas.
4. Ejecuta `npm run dev` y abre `http://localhost:3000`.

Configura `DATABASE_URL_POOLED` o `DATABASE_URL` en el despliegue. La conexión se utiliza únicamente en el servidor; el archivo `.env` está ignorado por Git. Las antiguas variables `NEON_AUTH_*` ya no se utilizan y no son necesarias.

## Media en Neon

1. Copia a `.env` las cuatro variables S3 de Neon que aparecen en `.env.example`. Usa el endpoint y las credenciales de la rama que contiene el bucket `lolamonstermuamedia`.
2. Ejecuta `npm run media:upload`. Sube las nueve fotografías, el video y su imagen de espera, comprueba tamaño y tipo, y actualiza `src/lib/media-manifest.json` con nombres que incluyen un hash del contenido.
3. Añade las mismas cuatro variables `AWS_*` a los entornos de Production y Preview en Vercel y vuelve a desplegar. Las credenciales nunca se envían al navegador.

El bucket permanece privado. La ruta `/media/` solo acepta los archivos incluidos en el manifiesto; entrega imágenes y video desde Neon y permite peticiones parciales del video. Las respuestas usan caché de navegador y CDN para los nombres con hash. Las copias locales siguen en `public/` como respaldo: si faltan las variables S3 o falla Neon, la ruta redirige a la copia local sin almacenar esa redirección en caché. En una respuesta de `/media/`, `X-Media-Source: neon` confirma que los bytes llegan de Neon; `local-fallback` indica que se está usando el respaldo.

`vercel.json` elimina la variable heredada `npm_config_cache_dir` antes de instalar y compilar: npm ya no reconoce esa opción. Esto corrige la causa de la advertencia sin ocultar mensajes ni desactivar comprobaciones. Los comandos usan las [opciones de configuración de Vercel](https://vercel.com/docs/project-configuration/vercel-json).

## Solicitudes

`POST /api/bookings` valida los campos, exige consentimiento de contacto y guarda una solicitud en `booking_requests`. Aplica un límite de tres solicitudes por correo por hora, una trampa antispam y un límite de 16 KB por petición. Una transacción serializa el límite por correo. El identificador de petición evita duplicados al reintentar un envío.

Las solicitudes se consultan en Neon Console, por ejemplo:

```sql
SELECT id, created_at, name, email, phone, service, requested_date,
       location, people, message, status
FROM booking_requests
ORDER BY created_at DESC;
```

No existe una ruta pública para leer solicitudes ni se envían correos automáticamente. La confirmación en pantalla indica recepción de la solicitud, no una reserva confirmada. Los estados disponibles son `new`, `contacted`, `confirmed` y `closed`.

## Validación

- `npm run lint`: reglas de código.
- `npm test`: validación de solicitudes, fechas y campos.
- `npm run build`: compilación de producción.
- `GET /api/health`: ejecuta `SELECT 1` y devuelve `{"database":"ok"}` cuando conecta.

Para comprobar el guardado completo, inicia `npm run start -- --hostname 127.0.0.1 --port 3100` tras compilar y ejecuta `node --env-file=.env tests/booking.integration.mjs`. La prueba envía el mismo encabezado `Origin` que un navegador, verifica persistencia, reintentos y límites, y elimina exclusivamente sus propios registros sintéticos.
