# Registro de Cambios (Changelog)

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y este proyecto adhiere al versionado semántico y convenciones de Git del Grupo Clouds.

---

## [Sin publicar] (Unreleased)

### Corregido
- El panel de visitas ahora representa los datos enviados por el público como texto, sin insertarlos como HTML en la tabla ni en el modal de detalle.

### Añadido
- **Prueba de regresión del renderizado seguro de solicitudes de visita** (`backend/tests/admin-render.test.js`):
  - Verifica que la tabla y el modal del panel no interpelen datos en `innerHTML` y que usen `textContent`.
  - Comprueba que el filtro de correo rechace direcciones con `?`, `#`, `&` y valores no simples.
  - Controla que el ADR-0015 esté documentado e indexado.
- **Colección de Postman para la API REST**:
  - Colección importable en `backend/docs/postman/collection/` con endpoints públicos, autenticados y CRUD.
  - Variables reutilizables para URL base, token JWT e identificadores generados durante las pruebas.
- **Backend Propio en Node.js / Express (`backend/`)**:
  - Servidor API REST con Express, CORS y middleware centralizado de errores.
  - Persistencia relacional portable con SQLite nativo (`node:sqlite`) en `backend/data/pestalozzi.db`.
  - Seeder automático para poblar horarios, novedades y el usuario inicial de la bibliotecaria (`betsabe`).
  - Módulo de autenticación con contraseñas hasheadas (`bcryptjs`) y tokens criptográficos JWT.
  - Endpoints REST para cartelera cuatrimestral de horarios (`/api/horarios`).
  - Endpoints para recepción, listado y cambio de estado de visitas escolares (`/api/visitas`) con notificaciones vía Nodemailer.
  - Endpoints CRUD para novedades institucionales (`/api/novedades`).
  - Endpoints para guardado, recuperación y eliminación de notas de la bibliotecaria (`/api/notas` con soporte `DELETE /api/notas/:id`).
- **Panel de Gestión Interna (`admin.html`)**:
  - Transformación del bloc de notas en un **Popover Flotante Desplegable** ubicado justo debajo del botón `📝 Notas` en la barra superior (con elevación, animación suave, foco automático y cierre por clic externo o `Escape`).
  - Implementación de **Modal Institucional de Confirmación (`#modal-confirm`)** que reemplaza el `window.confirm()` nativo del navegador, garantizando que la eliminación de solicitudes de visitas y de novedades funcione de forma 100% fiable en cualquier navegador.
  - Soporte nativo de **Drag & Drop** en la lista de Novedades Registradas con agarrador visual (`⠿`), permitiendo a la bibliotecaria reordenar las publicaciones arrastrándolas con persistencia inmediata en la base de datos vía `PUT /api/novedades/reordenar`.
  - Expansión de las vistas de contenidos (Horarios, Visitas y Novedades) al 100% de ancho del panel principal.
  - Rediseño de la tabla de Solicitudes de Visitas Escolares en 6 columnas integradas y optimizadas.
- **Frontend Público (`index.html`)**:
  - Implementación de **Scroll Horizontal Fluido (Carrusel)** en la sección de Novedades (`.section-novedades .card-grid-3`) con *scroll-snap* y barra de desplazamiento dorada institucional, permitiendo visualizar todas las novedades activas ordenadas según la prioridad definida en el admin.
- **Decisiones de Arquitectura y Reglas**:
  - Creación de `ADR-0010: Incorporación de Backend Node.js / Express para Gestión Dinámica y Persistencia`.
  - Creación de `ADR-0011: Popover de Notas Flotante, Modal Institucional de Confirmación y Drag & Drop con Scroll en Novedades`.
  - Actualización de `adr/README.md`.

- **Registro de Decisiones de Arquitectura (ADR)**:
  - Estructuración de la carpeta `adr/` con índice centralizado `adr/README.md`.
  - Creación de 9 registros arquitectónicos oficiales (`ADR-0001` a `ADR-0009`) basados en las decisiones del Grupo Clouds (Jamstack, hosting $0, serverless forms, integración con Koha/Greenstone, exclusión de login obligatorio, horarios dinámicos, diseño flat editorial, optimización AVIF y flujo de ramas en GitHub Pages).
- **Reglas operativas en `AGENTS.md`**:
  - Incorporación como principio innegociable de la obligación de redactar el ADR y actualizar `CHANGELOG.md` al finalizar cada implementación.
 - **Formulario de consulta general interactivo (`Feat #4` - RF06)**:
   - Incorporación del elemento `<form id="consulta-form">` con campos para nombre, correo electrónico, teléfono (opcional) y mensaje.
   - Validación del lado del cliente reutilizando los patrones visuales y semánticos del sistema (`.form-field`, `.field-error`, `.has-error`).
   - Envío asincrónico mediante `fetch()` conectado a endpoint serverless sin costo (Formspree) para notificación directa a la casilla institucional.
   - Anuncio dinámico de estados de envío y respuesta a tecnologías de asistencia mediante `role="status"` y `aria-live="polite"`.
 - **Centralización y enrutamiento de trámites de asociación y préstamos (`Feat #5`)**:
   - Configuración de las constantes `DATOS_TRAMITES` en `js/main.js` para los botones de asociación, solicitud y renovación de préstamos.
   - Incorporación de atributos accesibles y apertura en pestaña nueva (`rel="noopener noreferrer"`).
   - Incorporación del botón de WhatsApp faltante y activación del enlace de correo (`mailto:`) en el bloque de consulta de la sección.
- **Optimización del bloque de consultas de trámites (`Feat #5`, `Feat #6`)**:
  - Incorporación del botón interactivo de WhatsApp en la sección "¿Tenés alguna consulta?".
  - Contenedor `.consulta-actions` en CSS con separación y alineación flexible (`flex-wrap`, `gap: var(--space-sm)`).
  - Vinculación dinámica del botón "Enviar correo" al correo institucional (`DATOS_CONTACTO.email`) con asunto precargado.
 - **Indicador de foco accesible (`Feat #7` - RNF01)**:
   - Definición de la variable CSS `--color-focus` con contraste adaptativo mayor a 3:1 (WCAG 2.1 SC 1.4.11 / WCAG 2.2 SC 2.4.7) utilizando tono claro sobre fondos oscuros (header, hero, pie de página y franjas institucionales) y acento terracota sobre superficies claras.
   - Ajuste de contornos visibles en tarjetas con `overflow: visible` para evitar recortes del anillo de navegación por teclado.
- **Navegación de retorno al inicio en pie de página**:
  - Incorporación del indicador explícito *"Volver al inicio ↑"* (`.volver-arriba`) en el bloque de marca del footer con atributo accesible `aria-label`.


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
   - **Optimización de la sección de Asociación y Préstamos**:     
      -  Eliminación del texto introductorio duplicado en el encabezado de la sección.    
     -  Reemplazo de la caja simple de consulta por un layout responsivo de dos columnas (`.consulta-seccion`) que integra el formulario web junto al canal directo de WhatsApp institucional.
- **Estructura y centralización de catálogos externos (`Feat #3`)**:
  - Configuración de las constantes `DATOS_CATALOGOS` en `js/main.js` preparadas para recibir las URLs institucionales oficiales sin recurrir a enlaces ficticios.
  - Incorporación de control preventivo de clics y atributos accesibles para lectores de pantalla.
- **Escala tipográfica y accesibilidad móvil (`Feat #7` - RNF01)**:
  - Elevación de tamaños tipográficos mínimos a 14px (0.875rem) en textos secundarios (`.eyebrow`, `.tag`, `.card-date`, `.badge`, `.field-error`, `.stat-label` y `.footer-bottom`).
  - Ajuste del tamaño de etiquetas de formularios (`.form-field label`) a 16px (1rem) para facilitar la lectura a adultos mayores y docentes.
  - Actualización dinámica del nombre accesible en el botón de navegación móvil (`.nav-toggle`), alternando entre *"Abrir menú de navegación"* y *"Cerrar menú de navegación"*.
- **Ajuste de interactividad e identidad institucional en el pie de página**:
  - Unificación del nombre oficial a **Biblioteca Popular Pestalozzi** en la cabecera y pie de página para consistencia de marca.
  - Delimitación del área activa de clic a `.brand-footer` (`width: fit-content`), evitando disparos accidentales al presionar el espacio vacío de la columna. 

### Corregido
- **Integración con `dev` (backend de gestión dinámica)**:
  - Resolución de los conflictos en `CHANGELOG.md`, `css/styles.css` y `js/main.js` conservando los aportes de ambas ramas; `index.html` se integró sin conflictos.
  - El bloque `DOMContentLoaded` ejecuta las seis inicializaciones (horarios y novedades dinámicos + catálogos, trámites, consulta y datos de contacto).
- **Cabecera en pantallas angostas (≤400px)**:
  - La marca cede espacio al botón de menú en lugar de empujarlo a una segunda fila: el header vuelve a medir 79px a 320, 360 y 375px (medía 103px e introducía 6px de desborde horizontal a 360px).
  - La marca trunca con puntos suspensivos cuando no entra, sin alterar el layout de escritorio.
- **Pie de página en móvil**:
  - El correo institucional sin puntos de corte ya no fija el ancho mínimo de la grilla: se elimina el desborde horizontal de 6px a 360px (`min-width: 0` + `overflow-wrap: anywhere`).
- **Escala tipográfica de 14px**:
  - `.tag` (13,6px) y la línea de ciudad de la marca (12,8px) se elevan a 14px (0.875rem), completando el criterio de `Feat #7`.
  - El contorno de foco también cubre `select:focus-visible`.

### Pruebas, base de datos y DER (Etapa 3)
- **Suite de pruebas con `node:test`** (sin dependencias nuevas):
  - 12 pruebas unitarias de las validaciones puras (campos obligatorios, correo, formato y orden del rango horario, duplicados).
  - 7 pruebas de integración sobre la API real, con Express en un puerto efímero y SQLite en un archivo temporal.
  - Scripts `npm test`, `test:unit`, `test:integration` y `test:smoke`; evidencia en `docs/evidencia/`.
- **Validaciones extraídas a `backend/src/utils/validators.js`** y reutilizadas por los controllers de visitas y novedades.
- **Scripts de base de datos** en `db/` y `backend/scripts/db.js`:
  - `db/schema.sql` como fuente única del esquema y `db/seed.sql` con el contenido inicial.
  - Comandos `db:migrate`, `db:seed`, `db:reset`, `db:dump`, `db:restore` y `db:count`.
- **DER reconciliado** en `docs/der/der-implementado.puml` y ADR-0012, que documenta la correspondencia con el DER de Etapa 2.
- **Manual Técnico** en `docs/manual-tecnico.md` y su PDF (16 páginas): arquitectura, estructura, DER, instalación, componentes, validaciones, pruebas y despliegue.
- **Manual de Usuario** en `docs/manual-usuario/` y su PDF (18 páginas): recorrido del sitio, flujos de uso, guía del panel, 20 capturas, mensajes frecuentes y preguntas frecuentes.

### Arquitectura y tablón (Etapa 3)
- **ADR-001 de persistencia y hosting** en `docs/adr/`: decisión de SQLite + Railway, costo, protección de escritura, reconciliación con el stack de Etapa 2 y tooling fijado.
- **Tablón de horarios sin filas fijas**: se quitaron las seis filas estáticas de `index.html`; la lista se construye con la API.
- **Estado de fallo explícito**: si la API no responde, el tablón muestra un mensaje, un enlace a WhatsApp y un botón para reintentar. Se agregó un aviso para navegadores sin JavaScript.

### Modelo del DER (rama B)
- **Esquema con las seis entidades del DER** (HORARIOS, CATEGORIAS_COLECCION, MATERIALES_BIBLIOGRAFICOS, SOLICITUDES_VISITA, CONTACTOS y NOVEDADES_DONACIONES) con sus dos claves foráneas, más USUARIOS y NOTAS.
- **Endpoints nuevos**: `/api/contactos` (alta pública, lectura y borrado autenticados) y `/api/catalogos` (categorías con materiales en lectura pública; CRUD autenticado).
- **Formulario de consulta**: guarda en `CONTACTOS` y además reenvía por Formspree.
- **Sitio**: los materiales de las colecciones se leen de la base.
- **Panel**: pestañas Consultas y Catálogo, y día relacionado opcional en novedades.
- **Pruebas**: 24 (12 unitarias y 12 de integración).
- **DER y ADR-0013** actualizados.

### Pendiente
- Incorporación de favicon e isotipos definitivos en el encabezado.
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
