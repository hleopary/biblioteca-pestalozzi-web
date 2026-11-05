# Registro de Cambios (Changelog)

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y este proyecto adhiere al versionado semántico y convenciones de Git del Grupo Clouds.

---

## [Sin publicar] (Unreleased)

### Añadido
- **Registro de Decisiones de Arquitectura (ADR)**:
  - Estructuración de la carpeta `adr/` con índice centralizado `adr/README.md`.
  - Creación de 9 registros arquitectónicos oficiales (`ADR-0001` a `ADR-0009`) basados en las decisiones del Grupo Clouds (Jamstack, hosting $0, serverless forms, integración con Koha/Greenstone, exclusión de login obligatorio, horarios dinámicos, diseño flat editorial, optimización AVIF y flujo de ramas en GitHub Pages).
- **Reglas operativas en `AGENTS.md`**:
  - Incorporación como principio innegociable de la obligación de redactar el ADR y actualizar `CHANGELOG.md` al finalizar cada implementación.
  - ### Añadido
- **Optimización del bloque de consultas de trámites (`Feat #5`, `Feat #6`)**:
  - Incorporación del botón interactivo de WhatsApp en la sección "¿Tenés alguna consulta?".
  - Contenedor `.consulta-actions` en CSS con separación y alineación flexible (`flex-wrap`, `gap: var(--space-sm)`).
  - Vinculación dinámica del botón "Enviar correo" al correo institucional (`DATOS_CONTACTO.email`) con asunto precargado.


### Cambiado
   Publicación de canales de contacto reales en lugar de valores de relleno (`Feat #6`)**:
  - **Pie de Página (Footer)**:
    - Reemplazo de dirección ficticia por ubicación real en Berisso vinculada a Google Maps (`data-contact="direccion"`).
    - Actualización de teléfono fijo real con esquema `tel:` (`data-contact="telefono"`) y correo electrónico institucional monitoreado con esquema `mailto:` (`data-contact="email"`).
    - Vinculación de los íconos de Instagram y Facebook a los perfiles oficiales de la biblioteca (`data-contact="instagram"` y `data-contact="facebook"`).
  - **Llamados a la Acción (CTA de WhatsApp)**:
    - Unificación de los enlaces de WhatsApp en los bloques "Horarios vigentes" y "Visitas escolares" hacia el número real de la biblioteca con mensaje precargado (`data-contact="whatsapp"`).
   - **Sección Hero**:
     - Corrección de la estadística del acervo bibliográfico a `43.000+` volúmenes según datos reales relevados con la biblioteca.


### Pendiente
- Conexión del formulario de visita escolar a servicio externo funcional (FormSubmit o Formspree).
- Incorporación de favicon e isotipo definitivo en el encabezado.
- Refinamiento de columna extra de contacto en el pie de página.
- Ajuste de espaciados y tipografía fina según la maqueta institucional.

---

## [1.2.0] - 2026-10-29

### Añadido / Integrado
- **Merge Pull Request #17 (`hleopary/leopary_prueba3` a `main`)**:
  - Unificación de los ajustes de diseño de la maqueta 2 en la rama principal del repositorio (`3e0bf34`).

---

## [1.1.0] - 2026-10-15

### Cambiado
- **Ajustes de alta precisión contra Maqueta 2 (Ronda 2 - `ed5414a`)**:
  - **Identidad & Encabezado**:
    - Reemplazo del ícono de pluma por libro cerrado (Feather `book`).
    - Adición de línea dorada inferior de 3px (`#8b5e2b`).
  - **Sección Hero**:
    - Subtítulo "Pestalozzi" en segunda línea en color dorado claro (`#d4a853`).
    - Caja de estadísticas fijada en 224 px con borde fino dorado, divisor interno y valores en dorado, removiendo el relleno verde.
    - Gradiente suavizado tipo velo bordó para asegurar contraste sobre la fotografía de fondo.
  - **Atención al Público (Horarios)**:
    - Grilla reestructurada a 3 columnas × 2 filas (celdas de 52 px y 8 px de separación).
    - Celdas activas para Martes y Miércoles en blanco y restantes en tono apagado (`--color-off: #eadecd`).
    - Enlaces directos a WhatsApp transformados a texto bordó con ícono de mensaje (removiendo clase `.btn-whatsapp`).
  - **Patrimonio Bibliográfico (Colecciones)**:
    - Inclusión de chips con fechas en el extremo inferior derecho de cada imagen.
    - Estructura con banda superior bordó y cuerpo en crema.
  - **Sala Infantil y Bebeteca**:
    - Incorporación de emoji `📚` en el encabezado `h2`.
    - Tarjetas beige alineadas a la izquierda con emojis distintivos (⚽ 🦖 🐺 🧙‍♀️).
  - **Visitas Escolares y Catálogos**:
    - Bandas bordó con línea dorada de 3px y cuerpos diferenciados (beige para visitas y crema para catálogos).
  - **Pie de Página (Footer)**:
    - Fondo oscuro `#1c1008` rematado con línea dorada superior de 3px.
  - **Documentación**:
    - Registro de la comparativa de diferencias y actualización de la tabla de paleta en `README.md`.

---

## [1.0.1] - 2026-10-14

### Añadido
- **Fotografías institucionales reales (`3d9c518`)**:
  - Incorporación de `assets/img/hero.avif`.
  - Incorporación de `assets/img/coleccion-berisso-la-plata.avif`.
  - Incorporación de `assets/img/coleccion-colectividades.avif`.
  - Configuración de respaldo mediante degradados CSS en `.media` en caso de fallo de carga.

### Cambiado
- **Alineación con Maqueta 2 (Ronda 1 - `304a325`, `7615633`)**:
  - Reajuste de estadísticas, novedades y sección bebeteca.
  - Unificación de paleta con dorado general (`#8b5e2b`) y dorado claro (`#d4a853`).
  - Asignación de paleta individual a etiquetas de novedades mediante `:nth-child`.

### Documentación
- Actualización de documentación de flujo de ramas en `README.md` (`leopary_prueba2` como rama de despliegue en Pages y creación de `leopary_prueba3` para desarrollo activo) (`8ffa8e1`, `d575405`, `9916f79`, `aabb3ee`).

---

## [1.0.0] - 2026-10-14

### Reimplementado
- **Reimplementación integral según maqueta oficial (`d6c9d4e`)**:
  - Reestructuración semántica completa de `index.html` y reescritura de `css/styles.css`.
  - Secciones implementadas:
    1. Header institucional con navegación responsive.
    2. Hero con estadísticas de acervo (`12.000+` libros y `70+` años).
    3. Cuadro de atención al público y canales directos.
    4. Noticias e incorporaciones (3 tarjetas).
    5. Patrimonio bibliográfico y colecciones especiales.
    6. Sala infantil · Bebeteca.
    7. Visitas escolares: flujo guiado "¿Cómo funciona?" y formulario con validación interactiva JS.
    8. Acceso digital: enlaces a catálogos Koha y Greenstone.
    9. Asociación y préstamos con trámites detallados.
    10. Pie de página institucional completo.

---

## [0.1.0] - 2026-10-02

### Añadido
- **Landing inicial (`acc70be`)**:
  - Primera versión funcional del sitio web para la Biblioteca Popular Pestalozzi.
  - Estructura base en HTML5, hojas de estilo CSS3 y scripts de interacción en `js/main.js`.
  - Configuración inicial de `.gitignore`.
- **Configuración de repositorio (`4674c39`, `de32831`)**:
  - Inicialización del repositorio y rama `main`.
  - Configuración de `.gitattributes` para normalización de finales de línea (LF/CRLF) multiplataforma.
