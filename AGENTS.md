# Guía para Agentes de IA (AGENTS.md)

Este documento define las directrices, convenciones, arquitectura y restricciones técnicas para cualquier agente de IA o desarrollador que trabaje en el repositorio **biblioteca-pestalozzi-web**.

---

## 1. Contexto del Proyecto

- **Cliente**: Biblioteca Popular Pestalozzi (Berisso, Buenos Aires) — Bibliotecaria: Betsabé Cruz.
- **Equipo**: Grupo Clouds (Eduardo Moreno, Marcelo Moreno, Leandro Paryszewski, Melissa Galeano).
- **Materia**: Práctica Profesionalizante IV (IFTS29) — 2° cuatrimestre 2026.
- **Objetivo**: Sitio web institucional estático, accesible, responsivo y adaptado estrictamente a la maqueta gráfica proporcionada por la institución.

---

## 2. Principios y Reglas Innegociables

1. **Cero Dependencias / Cero Build**:
   - **NO** instalar paquetes vía npm/yarn/pnpm ni agregar bundlers (Webpack, Vite, Parcel).
   - **NO** utilizar frameworks externos de CSS (Tailwind, Bootstrap) ni de JS (React, Vue) a menos que el usuario lo solicite explícitamente.
   - El proyecto debe poder ejecutarse simplemente abriendo `index.html` en cualquier navegador o mediante un servidor estático local (`live-server`, `python -m http.server`).

2. **Fidelidad Estricta a la Maqueta**:
   - Todo cambio visual debe respetar la paleta de colores y proporciones medidas por píxel de la maqueta (`maqueta_web2.png`).
   - No inventar estilos o sombras si no están presentes en la especificación (`--shadow: none`, `border-radius: 6px`).

3. **Compatibilidad y Formato de Imágenes**:
   - Las imágenes se alojan en `assets/img/` y utilizan formato moderno optimizado (`.avif` o `.webp`).
   - En CSS, las clases `.media` o contenedores de imagen deben conservar siempre un degradado o color de respaldo (`background-color` / `linear-gradient`) por si el archivo estático no se encuentra disponible.

4. **Sin Backend Propio**:
   - Los formularios (como el de solicitud de visitas escolares) se integran con servicios externos estáticos (FormSubmit / Formspree). Toda lógica del lado del cliente debe limitarse a validación semántica e interactividad.

5. **Creación Obligatoria de ADRs al Finalizar cada Implementación**:
   - Al terminar cualquier implementación técnica relevante, integración de servicios o cambio estructural/arquitectónico, es **mandatorio** crear el correspondiente archivo en `adr/XXXX-titulo-descriptivo.md` (con formato secuencial de 4 dígitos, contexto, decisión y consecuencias) y actualizar la tabla índice en `adr/README.md`.

6. **Actualización Obligatoria de CHANGELOG.md**:
   - Al concluir cualquier tarea, feature, corrección de diseño o ajuste técnico, se debe actualizar obligatoriamente el archivo `CHANGELOG.md` clasificando el cambio según el estándar [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) (en `[Sin publicar]` o versión correspondiente).

---

## 3. Estructura de Archivos

```
biblioteca-pestalozzi-web/
├── index.html              # Estructura semántica completa (Landing)
├── css/
│   └── styles.css          # Variables CSS, diseño mobile-first y componentes
├── js/
│   └── main.js             # Modo estricto, menú móvil y validación de formulario
├── assets/
│   └── img/                # Fotografías e imágenes del acervo (.avif)
├── adr/                    # Registro de Decisiones de Arquitectura (ADRs)
│   ├── README.md           # Índice de decisiones arquitectónicas
│   └── XXXX-titulo.md      # Registros individuales numerados
├── AGENTS.md               # Este archivo de instrucciones para agentes
├── CHANGELOG.md            # Historial de cambios siguiendo Keep a Changelog
├── README.md               # Documentación general para el equipo y docentes
├── .gitattributes          # Normalización de saltos de línea (LF/CRLF)
└── .gitignore              # Archivos y carpetas ignorados por Git
```

---

## 4. Sistema de Diseño y Tokens CSS

Todas las variables de diseño están centralizadas en el bloque `:root` de `css/styles.css`. Cualquier nuevo estilo debe reutilizar estos tokens:

| Variable | Valor | Uso previsto |
|----------|-------|--------------|
| `--color-primary` | `#6b1d2b` | Borravino principal (header, botones, bandas destacadas) |
| `--color-primary-dark` | `#55151f` | Borravino oscuro para estados hover/active |
| `--color-accent` | `#8b5e2b` | Dorado general (bordes, líneas divisorias de 3px, chips) |
| `--color-accent-dark` | `#8b5e2b` | Dorado sobre fondos claros (antetítulos/eyebrows) |
| `--color-accent-light` | `#d4a853` | Dorado claro para contraste sobre fondos oscuros |
| `--color-bg` | `#faf3e8` | Fondo base crema de la página |
| `--color-bg-alt` | `#ede4d4` | Fondo beige para secciones alternas (visitas, horarios) |
| `--color-surface` | `#ffffff` | Fondo de tarjetas blancas |
| `--color-surface-alt` | `#ede4d4` | Fondo de tarjetas beige (bebeteca, trámites) |
| `--color-off` | `#eadecd` | Celda inactiva en la grilla de horarios |
| `--color-off-border` | `#d7c7b1` | Borde de celda inactiva |
| `--color-line` | `#c8b49a` | Separadores y bordes sutiles |
| `--color-footer` | `#1c1008` | Fondo oscuro del pie de página |
| `--color-text` | `#1c1008` | Color de tipografía principal |
| `--color-text-muted` | `#6b5a48` | Color de tipografía secundaria / complementaria |

### Parámetros Geométricos Clave
- **Ancho máximo de contenedor**: `72.5rem` (`1120px`).
- **Radio de esquinas**: `6px` en tarjetas y botones.
- **Sombras**: `--shadow: none` (diseño plano / flat editorial).
- **Líneas de acento**: `3px solid var(--color-accent)` en borde inferior de header, bandas y pie de página.

---

## 5. Convenciones de Código

### HTML
- Utilizar etiquetas semánticas (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- Accesibilidad (a11y):
  - Incluir atributos ARIA cuando aplique (`aria-expanded`, `aria-label`, `aria-live`).
  - Todo botón o enlace interactivo debe ser navegable por teclado.
  - Las imágenes deben tener texto alternativo descriptivo (`alt`).

### CSS
- Enfoque **Mobile-First**: estilos base para pantallas pequeñas y `@media (min-width: ...)` para tablet y escritorio.
- Evitar selectores con excesiva especificidad o `!important`.
- Usar Flexbox y CSS Grid para layouts.
- Mantener nombres de clases descriptivos en español acordes al dominio (`.hero-stats`, `.horarios-grid`, `.tramite-card`).

### JavaScript
- Archivos con `"use strict";` al inicio.
- Código modular organizado por funciones inicializadoras (`initNavToggle`, `initCurrentYear`, `initVisitaForm`).
- Usar APIs nativas modernas (`querySelector`, `addEventListener`, `classList`, `checkValidity`).
- Evitar variables globales en el ámbito de `window`.

---

## 6. Flujo de Trabajo en Git

- **`main`**: Rama principal del proyecto.
- **`leopary_prueba2`**: Rama de despliegue activa en GitHub Pages.
- **`leopary_prueba3` / ramas temáticas**: Ramas de trabajo para ajustes y nuevas funcionalidades.
- **Mensajes de commit**: Seguir el estándar Conventional Commits en español:
  - `feat: ...` para nuevas funcionalidades.
  - `fix: ...` para corrección de errores.
  - `style: ...` para cambios de diseño/CSS sin alterar lógica.
  - `docs: ...` para cambios en documentación.
  - `chore: ...` para tareas de mantenimiento y configuración.

---

## 7. Tareas Pendientes del Roadmap

Al colaborar en el proyecto, tener presentes los siguientes ítems prioritarios:
1. Conectar el formulario de visitas escolares a FormSubmit / Formspree con feedback visual.
2. Añadir favicon e isotipos finales.
3. Incorporar la columna adicional de contacto en el footer según la maqueta.
4. Mantener sincronizado y actualizado el archivo [CHANGELOG.md](file:///c:/Users/no_de/Desktop/biblioteca-pestalozzi-web/CHANGELOG.md) tras cada entrega o grupo de cambios.
