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

- **HTML5** semántico
- **CSS3** con variables personalizadas (custom properties), Flexbox/Grid, responsive mobile-first
- **JavaScript vanilla (ES6+)** módulos, sin dependencias ni bundler
- **Formularios**: FormSubmit / Formspree (sin backend propio)
- **Despliegue**: GitHub Pages (rama `leopary_prueba2`) o Cloudflare Pages
- **Control de versiones**: Git + GitHub (`hleopary/biblioteca-pestalozzi-web`)

> **Decisión**: Cero dependencias, cero build. Se abre `index.html` directo en navegador para desarrollo local.

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

> **Para el equipo:** clonar el repo, ubicarse en `leopary_prueba3` (`git checkout leopary_prueba3`) y abrir `index.html`. La versión publicada en GitHub Pages sale de `leopary_prueba2`.

---

## Flujo de ramas

| Rama | Propósito |
|------|-----------|
| `main` | **Limpia / vacía** (solo README mínimo). Nunca se desarrolla acá. |
| `leopary_prueba2` | **Rama publicada en GitHub Pages** (estable). Es la que ve el equipo en la URL. No recibe pushes directos. |
| `leopary_prueba3` | **Rama de trabajo actual** (14/10/2026). Nace de `leopary_prueba2`; acá se hacen los cambios nuevos. |
| `feature/*` | Ramas temporales para features grandes (opcional, salen de la rama de trabajo). |

> **Rama `leopary_prueba1` (eliminada el 14/10/2026):** era la primera landing institucional (02/10/2026). No se perdió historial: su commit `de32831` quedó dentro de la historia de `leopary_prueba2` y se puede recuperar con `git show de32831:index.html`.

**Deploy (GitHub Pages)**: publica la rama `leopary_prueba2` / `(root)` → https://hleopary.github.io/biblioteca-pestalozzi-web/ · la rama `leopary_prueba3` **no** se publica: sus avances llegan a la web solo por merge a `leopary_prueba2`

**Merge a main**: Solo vía Pull Request cuando la versión esté lista para "producción" (entrega formal).

---

## Alcance (maqueta de la cliente)

La versión de `leopary_prueba2` reimplementa el sitio según la **maqueta entregada por la Biblioteca**. Secciones, de arriba hacia abajo:

- [x] Header: logo, nombre y navegación (Inicio, Colecciones, Visitas Escolares, Catálogos y Trámites)
- [x] Hero: antetítulo, título, descripción y estadísticas (`12.000+` / `70+`)
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

---

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