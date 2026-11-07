# Backend — Biblioteca Popular Pestalozzi (Berisso)

Servidor API REST desarrollado con **Node.js + Express** y base de datos relacional ligera **SQLite** nativa (`DatabaseSync`), diseñado para la gestión dinámica de la cartelera de horarios, recepción de visitas escolares y publicación de novedades.

---

## Características

- **Cero configuración externa**: Utiliza SQLite embebido en `backend/data/pestalozzi.db`, sin necesidad de instalar bases de datos externas como MySQL o PostgreSQL.
- **Autenticación con JWT**: Acceso protegido para la bibliotecaria Betsabé Cruz mediante tokens criptográficos y contraseñas hasheadas con `bcryptjs`.
- **Seeder automático**: Carga inicial automática de horarios oficiales, novedades y usuario administrador al iniciar el servidor por primera vez.
- **Notificaciones por Email**: Envío de correos automáticos ante solicitudes de visitas escolares (con fallback a consola en desarrollo).
- **Servidor dual**: Puede actuar como API REST desacoplada (puerto 3000) y servir simultáneamente el frontend estático (`index.html` y `admin.html`).

---

## Requisitos

- **Node.js** v22 o superior (probado en v24.16.0).
- **npm** v10 o superior.

---

## Instalación y Puesta en Marcha

```bash
# 1. Ingresar a la carpeta del backend
cd backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (opcional, ya cuenta con valores por defecto)
cp .env.example .env

# 4. Iniciar el servidor
npm start

# Modo desarrollo con auto-reload:
npm run dev
```

---

## Acceso Rápido

Una vez iniciado el servidor:
- **API Health Check**: `http://localhost:3000/api/health`
- **Sitio Web Público**: `http://localhost:3000/index.html`
- **Panel Administrativo Betsabé**: `http://localhost:3000/admin.html`

### Credenciales iniciales por defecto
- **Usuario**: `betsabe`
- **Contraseña**: `pestalozzi2026`

---

## Endpoints de la API REST

### Públicos
- `GET /api/health` — Estado del servicio.
- `GET /api/horarios` — Cartelera semanal de horarios.
- `GET /api/novedades` — Las 3 novedades activas más recientes.
- `POST /api/visitas` — Enviar solicitud de visita escolar.

### Protegidos (Requieren encabezado `Authorization: Bearer <token>`)
- `POST /api/auth/login` — Autenticación de usuario.
- `GET /api/auth/verify` — Validación de sesión JWT.
- `PUT /api/auth/password` — Cambio de contraseña.
- `PUT /api/horarios` — Actualización de la grilla de horarios completa.
- `PATCH /api/horarios/:diaOrden` — Actualización de un día específico.
- `GET /api/visitas` — Lista de solicitudes recibidas (filtro opcional por `?estado=`).
- `PATCH /api/visitas/:id/estado` — Modificación de estado (`pendiente`, `confirmada`, etc.).
- `DELETE /api/visitas/:id` — Eliminación de solicitud.
- `GET /api/novedades/admin` — Todas las novedades.
- `POST /api/novedades` — Publicar nueva novedad.
- `PUT /api/novedades/:id` — Editar novedad.
- `DELETE /api/novedades/:id` — Eliminar novedad.
