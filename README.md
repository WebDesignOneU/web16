# Web16 - Portal Web Ballet UCB (Frontend Vue 3)

Frontend del portal web del **Ballet de la Universidad Católica Boliviana "San Pablo"** desarrollado con **Vue 3 + Vite**, basado en los diseños y la identidad visual de la carpeta `../web09`, e integrado con la API REST documentada en Swagger: `http://localhost:3000/api-docs`.

## 1. Objetivo del proyecto

Construir una SPA (Single Page Application) que traslade el diseño del sitio estático `web09` a un frontend moderno en Vue, consumiendo los endpoints reales de la API Ballet UCB para mostrar y gestionar información de:

- **Obras y funciones** (repertorio, cartelera, detalle de obra).
- **Noticias** (listado y detalle por slug).
- **Elenco** (integrantes filtrables por rol).
- **Convocatorias y postulaciones** (listado público y envío de postulación).
- **Reservas** (creación de reserva de entradas y consulta pública por código).
- **Suscripción** al boletín de noticias.
- **Autenticación** (registro, login y perfil del usuario autenticado con JWT).

## 2. Stack tecnológico

- **Vue 3** (`<script setup>` / Composition API) como framework de UI.
- **Vite 5** como bundler y servidor de desarrollo.
- **Vue Router 4** para el enrutamiento SPA (history mode).
- **Axios** como cliente HTTP con interceptores para inyectar el token JWT.
- **CSS del diseño web09** reutilizado directamente (`variables.css`, `base.css`, `layout.css`, `components.css`, `animations.css`, `landing.css`) para mantener la estética teatral (paleta borgoña/oro, tipografías Cinzel + Plus Jakarta Sans, componentes glassmorphism, hero, carrusel, tablas, formularios).
- **Carrusel JS vanilla** heredado de `web09/js/carousel.js` (`window.BalletCarousel`), cargado desde `public/` e inicializado desde la vista Home.

## 3. Estructura del proyecto

```text
web16/
├─ index.html                  # Entry HTML, fuentes e inclusión del carrusel
├─ vite.config.js              # Config Vite + proxy /api -> http://localhost:3000
├─ package.json
├─ .env.example
├─ public/
│  ├─ assets/                  # Imágenes, audio, video y datos copiados de web09
│  └─ carousel.js              # Script del carrusel (BalletCarousel) de web09
└─ src/
   ├─ main.js                  # Bootstrap Vue, router e importación de estilos
   ├─ App.vue                  # Layout raíz (header, main/router-view, footer)
   ├─ assets/css/              # Hojas de estilo del diseño web09
   ├─ components/
   │  ├─ AppHeader.vue         # Cabecera, navegación responsive y toggle de tema
   │  └─ AppFooter.vue         # Pie de página
   ├─ composables/
   │  └─ useAuth.js            # Estado/reactividad de sesión (token/user) y acciones auth
   ├─ router/
   │  └─ index.js              # Definición de rutas y guard de autenticación
   ├─ services/
   │  └─ api.js                # Instancia Axios, baseURL y interceptores JWT/401
   └─ views/
      ├─ HomeView.vue          # Landing: hero, stats, about, carrusel, obras, noticias, suscripción
      ├─ NoticiasView.vue      # Listado de noticias (GET /api/noticias)
      ├─ NoticiaDetalleView.vue# Detalle por slug (GET /api/noticias/:slug)
      ├─ FuncionesView.vue     # Funciones con filtro por estado y obras (GET /api/funciones, /api/obras)
      ├─ ObraDetalleView.vue   # Detalle de obra y sus funciones (GET /api/obras/:id)
      ├─ ElencoView.vue        # Elenco filtrable por rol (GET /api/elenco)
      ├─ ConvocatoriasView.vue # Convocatorias y formulario de postulación (GET/POST)
      ├─ ReservasView.vue      # Crear reserva y consultar por código (POST/GET)
      ├─ LoginView.vue         # Inicio de sesión (POST /api/auth/login)
      ├─ RegisterView.vue      # Registro de usuario (POST /api/auth/register)
      └─ PerfilView.vue        # Perfil autenticado (GET /api/auth/perfil, ruta protegida)
```

## 4. Integración con la API (Swagger)

La API base es `http://localhost:3000` (según `servers` del OpenAPI). Endpoints consumidos:

| Módulo | Método y ruta | Uso en el frontend |
|---|---|---|
| Auth | `POST /api/auth/register` | Registro (espectador/postulante) |
| Auth | `POST /api/auth/login` | Login y obtención de JWT |
| Auth | `GET /api/auth/perfil` | Perfil del usuario autenticado |
| Noticias | `GET /api/noticias` | Listado/paginado y últimas en Home |
| Noticias | `GET /api/noticias/:slug` | Detalle de noticia |
| Obras | `GET /api/obras` | Repertorio en Home y Funciones |
| Obras | `GET /api/obras/:id` | Detalle de obra y sus funciones |
| Funciones | `GET /api/funciones` | Cartelera/tabla con filtro por estado |
| Elenco | `GET /api/elenco` | Listado con filtro por rol |
| Convocatorias | `GET /api/convocatorias` | Listado de convocatorias |
| Convocatorias | `POST /api/convocatorias/:id/postulaciones` | Envío de postulación pública |
| Reservas | `POST /api/reservas` | Registro de reserva (genera código BUCB-XXXX) |
| Reservas | `GET /api/reservas/codigo/:codigo` | Consulta pública por código |
| Suscriptores | `POST /api/suscriptores` | Suscripción al boletín |

### Notas de integración
- **Autenticación:** el token JWT se guarda en `localStorage` y se adjunta automáticamente como `Authorization: Bearer <token>` mediante un interceptor de Axios (`src/services/api.js`). Si la API responde 401, se limpia la sesión local.
- **Normalización de respuestas:** distintas APIs pueden envolver los datos como `{ data: [...] }`, `{ obras: [...] }`, `{ items: [...] }`, etc. Las vistas incluyen helpers `normalize`/`normalizeList` para tolerar estas variantes y evitar errores de renderizado.
- **Proxy de desarrollo:** `vite.config.js` proxyea `/api` a `http://localhost:3000`, evitando problemas de CORS en desarrollo. La instancia Axios usa `baseURL: '/api'` por defecto (configurable con `VITE_API_BASE_URL`).
- **Manejo de errores:** cada vista muestra mensajes de error amigables usando `error.response.data.message` cuando la API lo provee, y estados de carga/vacío.

## 5. Relación con el diseño de `web09`

- Se copiaron los **assets** (imágenes, audio, video) y las **hojas CSS** de `web09` para preservar la misma identidad visual: hero con overlay, tipografía y paleta teatral, tarjetas, tablas responsivas, formularios, carrusel de producciones, stats banner y widgets.
- La estructura de la **Home** replica las secciones principales del `index.html` de `web09` (hero, estadísticas, sobre nosotros, galería/carrusel, repertorio, noticias y suscripción), pero conectando repertorio/noticias a la API.
- El **toggle de tema claro/oscuro** y el **menú responsive** se reimplementaron como comportamiento Vue manteniendo las clases/markup esperadas por el CSS original (`data-theme="light"`, `.is-open`, `.nav-toggle`, etc.).
- Se reutilizó el **carrusel** (`BalletCarousel`) como script global para no reescribir su lógica; la vista Home lo inicializa en `onMounted` y lo destruye en `onBeforeUnmount`.

## 6. Rutas de la aplicación

- `/` — Inicio (landing).
- `/noticias` — Listado de noticias.
- `/noticias/:slug` — Detalle de noticia.
- `/funciones` — Funciones programadas y obras.
- `/obras/:id` — Detalle de obra.
- `/elenco` — Integrantes del elenco.
- `/convocatorias` — Convocatorias y postulación.
- `/reservas` — Crear y consultar reservas.
- `/login` — Inicio de sesión.
- `/registro` — Registro de cuenta.
- `/perfil` — Perfil (ruta protegida; requiere token, si no redirige a login).

## 7. Instalación y ejecución

### Requisitos previos
- Node.js 18+ y npm.
- API Ballet UCB en ejecución en `http://localhost:3000` (con Swagger en `/api-docs`).

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en desarrollo (http://localhost:5173, proxy /api -> :3000)
npm run dev

# 3. Build de producción
npm run build

# 4. Previsualizar build
npm run preview
```

> Si la API corre en otro host/puerto, define `VITE_API_BASE_URL` en un archivo `.env` (ver `.env.example`).

## 8. Comentarios de desarrollo y decisiones

- **Composición y reutilización:** se centralizó la sesión en `useAuth` (composable) para compartir estado de usuario/token entre header, rutas protegidas y perfil sin necesidad de un store externo pesado.
- **Resiliencia ante formas de payload:** como el contrato exacto de respuesta (envoltorios `data/items/rows`, nombres de campos de ID como `id` vs `id_funcion/id_obra`) puede variar, las vistas usan accesos defensivos (`f.id || f.id_funcion`) y normalizadores de listas.
- **Formularios públicos:** las postulaciones y reservas siguen los campos requeridos documentados en Swagger (incluyendo validaciones básicas HTML5). La reserva muestra el `codigo_reserva` devuelto para su consulta posterior.
- **Diseño primero, datos después:** el layout y estilos provienen de `web09` para cumplir la consigna de basarse en esos diseños; los datos dinámicos reemplazan el contenido estático donde la API lo provee.
- **Extensibilidad:** la estructura por vistas/servicios/composables facilita agregar módulos administrativos (CRUD de noticias/obras/funciones/elenco) reutilizando los endpoints `[AUTH]` ya documentados.

## 9. Posibles mejoras futuras

- Componentizar el carrusel como componente Vue nativo.
- Añadir paginación/filtrado avanzado en noticias y funciones según parámetros de la API.
- Gestión de estados globales con Pinia si crece la complejidad de sesión/datos.
- Vistas administrativas para roles `admin`/`director` (gestión de reservas, evaluación de postulaciones, reporte de ocupación).
- Pruebas E2E/integración contra la API.
- Manejo de imágenes/fallbacks y optimización de assets para producción.
