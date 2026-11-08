# Biblioteca Pestalozzi — Sitio Web Institucional

Sitio web estático (HTML + CSS + JS vanilla) para la **Biblioteca Popular Pestalozzi** de Berisso, desarrollado como parte del Proyecto Integrador del **Grupo Clouds** (Práctica Profesionalizante IV - IFTS29).

---

## Información del proyecto

| Dato | Detalle |
|------|---------|
| **Cliente** | Biblioteca Popular Pestalozzi (Berisso) — Betsabé Cruz (bibliotecaria) |
| **Equipo** | Grupo Clouds: Eduardo Moreno · Marcelo Moreno · Leandro Paryszewski · Melissa Galeano |
| **Materia** | Práctica Profesionalizante IV (3.1.5) |
| **Ciclo** | 2° cuatrimestre 2026 |
| **Docente** | Kevin Del Bello |

---

## Stack tecnologico

**Frontend**
- **HTML5** semántico
- **CSS3** con variables personalizadas (custom properties), Flexbox/Grid, responsive mobile-first
- **JavaScript vanilla (ES6+)**, sin framework ni bundler

**Backend**
- **Node.js 24** + **Express ^4.21.1**
- **Base de datos**: SQLite embebido con `node:sqlite`; esquema versionado en `db/schema.sql`
- **Autenticación**: JWT (`jsonwebtoken`) + hash de contraseñas con `bcryptjs`
- **Correo**: `nodemailer` (opcional; se simula por consola si no hay SMTP)
- **Pruebas**: runner nativo `node:test`

**Formularios**
- **Visitas escolares**: se persisten en la base mediante la API
- **Consulta general**: se entrega por Formspree

**Despliegue**
- **Railway**: aplicación completa (sitio + panel + API + SQLite con volumen)
- **Vercel**: espejo estático
- **GitHub Pages**: espejo estático desde `main`

**Control de versiones**: Git + GitHub (`hleopary/biblioteca-pestalozzi-web`)

> **Decisión**: el frontend mantiene cero dependencias y cero build; el backend tiene sus propias dependencias y se instala con `npm install`. La decisión completa de persistencia y hosting está en [docs/adr/ADR-001-persistence-and-hosting.md](docs/adr/ADR-001-persistence-and-hosting.md).

---

## Estructura del repositorio

```
biblioteca-pestalozzi-web/
├── index.html              # Página principal (landing)
├── css/
│   └── styles.css          # Estilos globales + responsive
├── js/
│   └── main.js             # Interacciones + validación de formulario
├── assets/                 # Imágenes, íconos, fuentes (si aplica)
├── .gitignore
├── README.md               # Este archivo
└── LICENSE                 # MIT (opcional)
```

---

## Desarrollo local

```bash
# Clonar el repo
git clone https://github.com/hleopary/biblioteca-pestalozzi-web.git
cd biblioteca-pestalozzi-web

# Cambiar a la rama de desarrollo
git checkout leopary_prueba3

# Abrir index.html en el navegador (doble clic o live-server)
# Opción A: Doble clic en index.html
# Opción B: npx live-server (si tenés Node instalado)
```

> **Para el equipo:** clonar el repo, ubicarse en `dev` (`git checkout dev`) y abrir `index.html`. La integración vive en `dev`; la publicación sale de `main`.

---

## Flujo de ramas

| Rama | Propósito |
|------|-----------|
| `main` | **Rama principal del proyecto** (producción / entregas formales vía PR). |
| `dev` | **Rama de integración de desarrollo**. Todas las ramas temáticas nuevas nacen a partir de `dev`. |
| `feat/*`, `fix/*`, `chore/*` | **Ramas de trabajo**, siempre creadas desde `dev`. |
| `prueba/*` | Ramas de integración para resolver conflictos sin tocar la rama de otra persona. |
> **Rama `leopary_prueba1` (eliminada el 14/10/2026):** era la primera landing institucional (02/10/2026). No se perdió historial: su commit `de32831` quedó dentro de la historia de `leopary_prueba2` y se puede recuperar con `git show de32831:index.html`.

**Merge a main**: Solo vía Pull Request cuando la versión esté lista para "producción" (entrega formal).

---

## Deploy

El sitio se publica en dos destinos desde este mismo repositorio:

| Destino | Rama | Qué sirve |
|---------|------|-----------|
| **Vercel** (principal) | `main` en producción, `dev` en preview | Sitio estático completo |
| **GitHub Pages** (espejo) | `main` | Sitio estático |

**Vercel.** Importar el repositorio una vez y elegir el preset *Other*: no hay paso de build. `vercel.json` agrega caché larga para `assets/` y dos cabeceras de seguridad; `.vercelignore` deja fuera la base local y las dependencias del backend.

**GitHub Pages.** Publica `main` / `(root)` → https://hleopary.github.io/biblioteca-pestalozzi-web/

> **Alcance del deploy actual:** la API de `backend/` todavía no está publicada. El sitio funciona con el tablón estático de `index.html` y los formularios por Formspree, pero `admin.html` no puede autenticarse ni guardar cambios. La API necesita un origen con disco persistente; la migración a Vercel con Turso está planificada.

---

## Alcance (maqueta de la cliente)

La versión de `leopary_prueba2` reimplementa el sitio según la **maqueta entregada por la Biblioteca**. Secciones, de arriba hacia abajo:

- [x] Header: logo, nombre y navegación (Inicio, Colecciones, Visitas Escolares, Catálogos y Trámites)
- [x] Hero: antetítulo, título, descripción y estadísticas (`43.000+` / `70+`)
- [x] Atención al público: grilla de horarios 3×2 y enlace de WhatsApp (texto bordó)
- [x] Noticias e incorporaciones: 3 tarjetas de novedades
- [x] Patrimonio bibliográfico: 2 tarjetas de colecciones especiales
- [x] Sala Infantil · Bebeteca: 4 tarjetas beige
- [x] Visitas escolares: pasos "¿Cómo funciona?" + formulario validado (JS)
- [x] Acceso digital: catálogos Koha y Greenstone
- [x] Asociación y préstamos: 3 trámites + bloque de consulta
- [x] Footer: datos de contacto, redes y créditos
- [x] Responsive (móvil / tablet / escritorio) y accesibilidad básica
- [x] Imágenes: `assets/img/hero.avif` y las 2 de colecciones (cargadas por el usuario, 14/10); las novedades no llevan imagen según la maqueta 2
- [ ] Conectar el formulario de visita escolar a un servicio real (FormSubmit/Formspree)
- [ ] Favicon e íconos definitivos

> **Nota:** los bloques `.media` conservan un degradado como respaldo por si falta el archivo; las imágenes se asignan por CSS (`background-image`) en `css/styles.css`, con rutas relativas a la carpeta `css/` (`../assets/img/...`). Se aceptan `.avif`.

## Horarios de atención

El tablón público **no está fijado en el HTML**: `js/main.js` lo construye con la respuesta de `GET /api/horarios`, que lee la tabla `horarios` de SQLite.

- **Para cambiar un horario**: usar el panel (`admin.html` → *Horarios Cuatrimestrales*). El cambio se publica al guardar, sin editar archivos ni redesplegar.
- **Para cambiar los datos iniciales**: editar `db/seed.sql` y ejecutar `npm run db:reset` (o `npm run db:seed` sobre una base vacía).
- **Si la API no responde**: el tablón muestra un estado de fallo explícito, con enlace a WhatsApp y un botón para reintentar. Nunca queda una tabla vacía que se lea como "cerrado toda la semana".
- **Sin JavaScript**: se muestra un aviso con enlace a los canales de contacto.

El detalle de la decisión está en [docs/adr/ADR-001-persistence-and-hosting.md](docs/adr/ADR-001-persistence-and-hosting.md).

## Catálogos externos (Koha y Greenstone - Feat #3):
Centralizados en `js/main.js` bajo el objeto `DATOS_CATALOGOS`. A la espera de la provisión de URLs institucionales definitivas por parte de la biblioteca, los enlaces cuentan con un manejador preventivo.


## Formularios y Recepción de Mensajes (Feat #1, Feat #4)

Los envíos de solicitudes y consultas generales se gestionan a través de una arquitectura serverless desacoplada de costo $0:

* **Mecanismo de entrega:** El formulario de consulta general (`#consulta-form`) procesa los envíos mediante peticiones HTTP `POST` hacia la API de Formspree (`CONFIG_ENVIO.endpointConsulta` en `js/main.js`), garantizando la entrega de los campos estructurados (nombre, email, teléfono y mensaje) a la bandeja de correo.
* **Manejo de estados y accesibilidad:** Las respuestas del servidor se notifican de forma dinámica en la región `#consulta-status` (`aria-live="polite"`), conservando los datos ingresados ante cualquier error de red para permitir el reintento.
* **Transición a backend propio:** El despacho está centralizado en el cliente; si se conecta a la API de Node.js/Express, basta con modificar el endpoint a `/api/consultas` sin alterar la estructura del formulario.

## Trámites de Asociación y Préstamos (Feat #5): 
Las URLs de los formularios externos y la planilla de asociación están centralizadas en js/main.js bajo el objeto DATOS_TRAMITES. A la espera de la provisión de los links de los formularios definitivos por parte de la biblioteca, los enlaces cuentan con un manejador preventivo.

### Bloque de Consultas Rápidas (Sección Trámites)
* **Ubicación:** `index.html` (bloque `.consulta`) y lógica en `js/main.js`.
* **Canales integrados:**
  - **Correo electrónico:** El botón "Enviar correo" abre automáticamente el cliente de correo predeterminado apuntando a `bibliotecapestalozziberisso@gmail.com` con el asunto institucional precargado.
  - **WhatsApp:** El botón abre el canal de mensajería directa configurado en las constantes globales con el texto predefinido de consulta.


---
## Datos de contacto institucionales (Feat #6):
Todos los datos de contacto de la biblioteca (dirección postal, enlace a Google Maps, teléfono fijo, número de WhatsApp para los CTA, correo electrónico y perfiles de Instagram y Facebook) viven en un único lugar para evitar valores duplicados o desactualizados en el marcado:

Dónde viven: en js/main.js, dentro del objeto constante DATOS_CONTACTO.

Cómo se consumen: al cargar el documento (DOMContentLoaded), la función inicializarDatosContacto() busca en index.html todos los elementos con el atributo data-contact (whatsapp, direccion, telefono, email, instagram, facebook) y actualiza sus textos y atributos href.
Como actualizarlos: editar únicamente el valor deseado en DATOS_CONTACTO dentro de js/main.js. El cambio impactará automáticamente en el footer, en el bloque de Horarios vigentes y en la sección de Visitas escolares.

## Accesibilidad y Experiencia de Usuario (RNF01 - Feat #7)

El desarrollo incorpora criterios de diseño accesible alineados con las pautas WCAG 2.1 (Nivel AA) orientados a adultos mayores y docentes:

* **Escala tipográfica accesible:** Se fijó un umbral base mínimo de 14px (`0.875rem`) para textos secundarios, fechas, estados de validación y etiquetas auxiliares, asegurando 16px (`1rem`) para etiquetas de campos y cuerpo principal.
* **Contraste de foco dinámico:** El contorno de foco `:focus-visible` adapta su contraste visual ($\ge 3:1$) según el fondo del componente: dorado claro institucional (`--color-accent-light`) en áreas oscuras (cabecera, hero y pie) y tono acento sobre contenedores claros.
* **Navegación asistida y controles:** El botón hamburguesa móvil (`.nav-toggle`) actualiza dinámicamente su texto accesible (`.sr-only`) sincronizado con el atributo `aria-expanded` para lectores de pantalla.

### Navegación y retorno accesible (Pie de página)
* **Área de interacción controlada:** El enlace institucional a `#inicio` en el pie de página está delimitado estrictamente al isotipo y al texto (`width: fit-content`), previniendo saltos no deseados al interactuar con el espacio libre.
* **Indicador visual de retorno:** Se incorporó el llamado explícito *"Volver al inicio ↑"* con escala tipográfica accesible ($\ge 14\text{px}$) y atributo semántico `aria-label` para facilitar la navegación a adultos mayores.

## Paleta y ajustes de la maqueta 2

Los colores se **midieron por píxel** sobre `practica_profesionalizante/apuntes/maqueta_web2.png` (la maqueta de la cliente) y se centralizan en `css/styles.css`.

| Variable | Valor | Uso |
|----------|-------|-----|
| `--color-primary` | `#6b1d2b` | Borravino (encabezado, bandas bordó, botones) |
| `--color-primary-dark` | `#55151f` | Borravino oscuro (hover) |
| `--color-accent` | `#8b5e2b` | Dorado general (línea del encabezado, líneas de las bandas, chips, bordes) |
| `--color-accent-dark` | `#8b5e2b` | Dorado para texto sobre fondos claros (eyebrows) |
| `--color-accent-light` | `#d4a853` | Dorado claro (texto/íconos sobre fondos oscuros: "Pestalozzi", estadísticas, título de banda) |
| `--color-bg` | `#faf3e8` | Crema (fondo general) |
| `--color-bg-alt` | `#ede4d4` | Beige (horarios y visitas) |
| `--color-surface` | `#ffffff` | Tarjetas blancas (colecciones, visita, catálogos) |
| `--color-surface-alt` | `#ede4d4` | Tarjetas beige (bebeteca, trámites, consulta) |
| `--color-off` | `#eadecd` | Celda apagada de la grilla de horarios |
| `--color-off-border` | `#d7c7b1` | Borde de celda apagada |
| `--color-line` | `#c8b49a` | Líneas separadoras y bordes de tarjeta |
| `--color-footer` | `#1c1008` | Pie de página |
| `--color-text` | `#1c1008` | Texto principal |
| `--color-text-muted` | `#6b5a48` | Texto secundario |

Geometría: contenedor **72.5 rem (1120 px)**, radio de tarjetas **6 px** y **sin sombras** (`--shadow: none`).

### Ronda 1 (14/10)

- **Línea dorada** de 3px en el borde inferior del encabezado (`#8b5e2b`).
- **Hero:** velo bordó suavizado (oscuro a la izquierda, casi transparente a la derecha) para que la fotografía se vea sin perder legibilidad.
- **Dorado general** `#b08d57` → `#8b5e2b` (+ un dorado claro `#d4a853` para textos e íconos sobre fondos oscuros).
- **Etiquetas de Novedades** con color propio por tarjeta (`--tag-color` vía `:nth-child`): 1ª `#8b5e2b`, 2ª `#6b1d2b`, 3ª `#3d5a3e`.
- **Bebeteca** con 4 tarjetas de emojis (⚽ 🦖 🐺 🧙‍♀️).

### Ronda 2 (14/10, rama `leopary_prueba3`)

Comparación "juego de las 200 diferencias" contra `maqueta_web2.png`, resuelta **midiendo píxeles** (Chrome headless + PIL) en vez de mirar. Cambios:

- **Ícono de marca:** libro cerrado (Feather `book`) en lugar de la pluma; se agregó un ícono de chat para los enlaces de WhatsApp.
- **Hero:** "Pestalozzi" en dorado claro `#d4a853` en una segunda línea; caja de estadísticas de 224 px con borde fino dorado, divisor interno y números en dorado (se quitó el relleno verde).
- **Horarios:** grilla de 3 columnas × 2 filas, celdas de 52 px con 8 px de separación; Martes y Miércoles en blanco y el resto apagadas; enlaces de WhatsApp como **texto bordó con ícono de chat** (se eliminó `.btn-whatsapp`).
- **Colecciones:** chips de fecha abajo a la derecha de cada foto; banda bordó + cuerpo crema.
- **Bebeteca:** tarjetas beige alineadas a la izquierda y emoji `📚` delante del `h2`.
- **Visitas:** banda bordó + línea dorada de 3 px + cuerpo beige; **Catálogos:** igual con cuerpo crema.
- **Footer:** `#1c1008` con línea dorada superior de 3 px.
- Paleta y contenedor re-medidos (tabla de arriba).

Pendientes respecto de la maqueta (para la próxima iteración): tamaños de fuente y espaciados generales, la columna CONTACTO extra del footer, el párrafo de entrada duplicado en "Asociación", el título del cuerpo de Catálogos y la línea divisoria del pie del footer.

---

## Licencia

MIT — uso libre para fines educativos y del proyecto Grupo Clouds.