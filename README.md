# Lola Monster Makeup

Portafolio de Paola Palacio Romo en Next.js 16, con solicitudes de servicio guardadas en Neon Postgres. El sitio es público y no tiene cuentas ni autenticación.

## Páginas

- `/`: portada y selección de cuatro fotografías.
- `/portafolio`: galería completa con filtros, ampliación, créditos y navegación por teclado.
- `/servicios`: editorial, social glam, novias, peinado y clases.
- `/sobre-lola`: presentación de Paola.
- `/booking`: solicitud de disponibilidad y cotización.

Las imágenes y sus fuentes están documentadas en `public/portfolio/README.md`.

## Configuración

1. Ejecuta `npm ci`.
2. Crea `.env` con las variables de `.env.example`.
3. Ejecuta `npm run db:setup` para crear la tabla e índices de solicitudes. La migración es idempotente y no modifica otras tablas.
4. Ejecuta `npm run dev` y abre `http://localhost:3000`.

Configura `DATABASE_URL_POOLED` o `DATABASE_URL` en el despliegue. La conexión se utiliza únicamente en el servidor; el archivo `.env` está ignorado por Git. Las antiguas variables `NEON_AUTH_*` ya no se utilizan y no son necesarias.

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
