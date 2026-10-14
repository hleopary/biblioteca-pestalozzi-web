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
- **Despliegue**: GitHub Pages (rama `leopary_prueba1`) o Cloudflare Pages
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
git checkout leopary_prueba1

# Abrir index.html en el navegador (doble clic o live-server)
# Opción A: Doble clic en index.html
# Opción B: npx live-server (si tenés Node instalado)
```

---

## Flujo de ramas

| Rama | Propósito |
|------|-----------|
| `main` | **Limpia / vacía** (solo README mínimo). Nunca se desarrolla acá. |
| `leopary_prueba1` | Primera landing institucional (02/10/2026). Versión previa. |
| `leopary_prueba2` | **Rama de trabajo actual** — reimplementación del sitio según la maqueta de la cliente (publicada en GitHub el 14/10/2026). |
| `feature/*` | Ramas temporales para features grandes (opcional, salen de la rama de trabajo). |

**Deploy a GitHub Pages**: Configurar en Settings → Pages → Source: `leopary_prueba1` / `(root)`.

**Merge a main**: Solo vía Pull Request cuando la versión esté lista para "producción" (entrega formal).

---

## Alcance (maqueta de la cliente)

La versión de `leopary_prueba2` reimplementa el sitio según la **maqueta entregada por la Biblioteca**. Secciones, de arriba hacia abajo:

- [x] Header: logo, nombre y navegación (Inicio, Colecciones, Visitas Escolares, Catálogos y Trámites)
- [x] Hero: antetítulo, título, descripción y estadísticas (`12.000+` / `70+`)
- [x] Atención al público: horarios vigentes + botón de WhatsApp
- [x] Noticias e incorporaciones: 3 tarjetas de novedades
- [x] Patrimonio bibliográfico: 2 tarjetas de colecciones especiales
- [x] Sala Infantil · Bebeteca: 4 íconos temáticos
- [x] Visitas escolares: pasos "¿Cómo funciona?" + formulario validado (JS)
- [x] Acceso digital: catálogos Koha y Greenstone
- [x] Asociación y préstamos: 3 trámites + bloque de consulta
- [x] Footer: datos de contacto, redes y créditos
- [x] Responsive (móvil / tablet / escritorio) y accesibilidad básica
- [ ] Imágenes reales (hero, novedades y colecciones) — hoy hay placeholders de color
- [ ] Conectar el formulario de visita escolar a un servicio real (FormSubmit/Formspree)
- [ ] Favicon e íconos definitivos

> **Nota:** los bloques de imagen usan placeholders (degradados) hasta contar con las fotografías reales de la biblioteca. Están marcados en el HTML para reemplazarlos sin tocar el diseño.

---

## Licencia

MIT — uso libre para fines educativos y del proyecto Grupo Clouds.