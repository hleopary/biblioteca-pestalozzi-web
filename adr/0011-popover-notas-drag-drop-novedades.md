# ADR-0011: Popover de Notas Flotante, Modal Institucional de Confirmación y Drag & Drop con Scroll en Novedades

- **Estado**: Aceptado
- **Fecha**: 2026-10-30
- **Autor/Equipo**: Grupo Clouds (IFTS29) / Antigravity pair programming
- **Contexto**: Panel de Gestión Interna (`admin.html`) y Landing pública (`index.html`)

---

## 1. Contexto y Problemática

1. **Ubicación y UX del Bloc de Notas**:
   En la iteración previa se probó un drawer lateral que ocupaba toda la altura de la pantalla (`100vh`). Sin embargo, la bibliotecaria requería que el panel se desplegara **justo debajo del botón comprimido de notas**, como una tarjeta flotante (*popover*), manteniéndose accesible sobre el contenido sin invadir toda la pantalla ni interferir con la navegación general.
2. **Fallas en la Eliminación de Solicitudes y Novedades**:
   El uso de la función nativa `window.confirm()` del navegador presentaba problemas de bloqueo en navegadores modernos (que suprimen ventanas emergentes repetidas) y colisiones en los selectores de clase compartidos entre los botones de ver detalle y eliminar.
3. **Reordenamiento y Visualización Escalable de Novedades**:
   La institución publica periódicamente noticias y adquisiciones. Se necesitaba que la bibliotecaria pudiera definir el orden de prioridad de las novedades en el panel de administración mediante interacción táctil/arrastre (*Drag & Drop*) y que en la landing pública (`index.html`) se muestren todas las novedades activas con desplazamiento suave (*scroll horizontal / carrusel*) cuando superen las 3 publicaciones base de la maqueta.

---

## 2. Decisiones de Arquitectura

1. **Notas en Formato Popover Desplegable Anclado**:
   - Se implementó `.notas-dropdown-wrapper` con posición relativa en la barra superior.
   - El panel `.notas-popover` se posiciona de forma absoluta justo debajo del botón (`top: calc(100% + 4px); right: 0; width: 380px; z-index: 1000;`) con elevación, sombra y animación de desvanecimiento suave.
   - Cuenta con detección de clic externo (`document.addEventListener("click")`) y tecla `Escape` para cierre inmediato sin alterar el estado de sincronización.
2. **Modal Institucional de Confirmación (`#modal-confirm`)**:
   - Se reemplazó completamente el diálogo bloqueable `window.confirm()` por un modal HTML5/CSS estilizado institucionalmente con los colores de la biblioteca (`var(--color-primary)`, `var(--color-error)`).
   - El flujo se encapsuló en una función asíncrona `pedirConfirmacion(mensaje): Promise<boolean>` reutilizable para solicitudes de visita, novedades y limpieza de notas.
   - Se separaron estrictamente los selectores de acción en la tabla de visitas (`.btn-ver-obs` y `.btn-eliminar-visita`).
3. **Persistencia y Reordenamiento de Novedades con Drag & Drop Nativo**:
   - Se agregó la ruta protegida `PUT /api/novedades/reordenar` en `backend/src/routes/novedadesRoutes.js` y el controlador `reordenarNovedades` en `backend/src/controllers/novedadesController.js`, actualizando el campo `orden` en base de datos SQLite mediante una transacción rápida.
   - En el frontend del admin (`js/admin.js`), se usaron los eventos nativos de la API Drag and Drop de HTML5 (`draggable="true"`, `dragstart`, `dragover`, `drop`, `dragend`) con control visual de arrastre (`⠿`), sin requerir librerías externas (cumpliendo la regla innegociable de cero dependencias).
4. **Scroll Horizontal de Novedades en la Landing Pública (`index.html`)**:
   - Se eliminó el `LIMIT 3` fijo en `getNovedadesPublicas` del backend para enviar todas las novedades activas ordenadas por `orden ASC`.
   - En `css/styles.css`, la clase `.section-novedades .card-grid-3` se adaptó con `display: flex; overflow-x: auto; scroll-snap-type: x mandatory;` y una barra de desplazamiento dorada institucional (`var(--color-accent)`).
   - Cuando hay 3 novedades, encajan simétricamente en 3 columnas respetando al 100% la maqueta original. Cuando hay más de 3, permite deslizamiento fluido con snap suave en escritorio y dispositivos táctiles.

---

## 3. Consecuencias

### Positivas
- **Fidelidad al requerimiento visual**: El bloc de notas se abre con precisión quirúrgica exactamente en el espacio indicado por el cliente.
- **Robustez operativa**: La eliminación de elementos ya no depende del motor de alertas del navegador, garantizando consistencia en cualquier entorno.
- **Flexibilidad editorial**: La bibliotecaria Betsabé puede jerarquizar las noticias con arrastrar y soltar sin conocimientos técnicos, y la página pública las refleja de inmediato.
- **Cero dependencias**: Se resolvió el Drag & Drop y el carrusel con estándares web nativos (HTML5 Drag & Drop y CSS Scroll Snap).

### Negativas / Mitigaciones
- Para navegadores muy antiguos sin soporte de `scroll-snap`, la lista se comporta como un contenedor de desplazamiento estándar manteniendo la accesibilidad.
