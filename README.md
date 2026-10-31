# Lola Monster Makeup

Portafolio de Paola Palacio Romo (Lola Monster Makeup), construido con Next.js 16. Galería filtrable con fotografías, créditos y navegación por teclado, servicios, presentación y contacto por Instagram. Incluye Neon Postgres y Managed Better Auth.

Las imágenes optimizadas se encuentran en `public/portfolio`; las fuentes y créditos se documentan en `public/portfolio/README.md`. El contacto público dirige al perfil oficial de Lola.

## Configuración local

1. Ejecuta `npm ci`.
2. Crea un archivo `.env` en la raíz del proyecto con las variables de `.env.example`.
3. Genera `NEON_AUTH_COOKIE_SECRET` con `openssl rand -base64 32` y configura `localhost:3000` como origen permitido en Neon Auth.
4. Ejecuta `npm run dev` y abre `http://localhost:3000`.

El archivo `.env` está ignorado por Git. Configura las mismas variables en el entorno de despliegue.

## Comprobaciones

- `npm run lint`: reglas de código.
- `npm run build`: compilación de producción.
- `GET /api/health`: ejecuta `SELECT 1` en Neon Postgres y devuelve `{"database":"ok"}` cuando conecta.
- `/auth/sign-up`, `/auth/sign-in` y `/account`: flujo básico de Neon Auth. La página de cuenta requiere sesión.

La URL de conexión a Postgres solo se utiliza en el servidor. `DATABASE_URL_POOLED` tiene preferencia si está definida; en caso contrario se usa `DATABASE_URL`.
