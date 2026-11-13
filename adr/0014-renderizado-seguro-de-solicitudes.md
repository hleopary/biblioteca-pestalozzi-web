# ADR-0014: Renderizado seguro de solicitudes de visita en el panel

- **Estado**: Aceptado
- **Fecha**: 2026-11-13
- **Autor**: Grupo Clouds
- **Proyecto**: Sistema Web Institucional — Biblioteca Popular Pestalozzi (Berisso)

---

## Contexto

El formulario público permite enviar solicitudes de visita escolar. Esos datos se guardan y luego se muestran en la tabla y en el modal de detalle del panel administrativo. Los valores recibidos desde formularios deben considerarse datos no confiables, aunque el backend valide sus campos.

La vista administrativa interpolaba esos valores en cadenas asignadas a `innerHTML`, haciendo que el navegador los interpretara como marcado.

## Decisión

Construir las filas de solicitudes y el contenido del modal con elementos DOM y asignar los valores dinámicos mediante `textContent` o nodos de texto. Los enlaces se crean por separado: `mailto:` solo se genera para direcciones con formato simple y sin caracteres de consulta; en caso contrario, el correo se muestra como texto. El enlace de WhatsApp se construye únicamente con los dígitos del teléfono. Los estados visibles se limitan a los valores conocidos por el panel.

## Consecuencias

- Los datos de una solicitud se muestran literalmente y no se interpretan como HTML.
- Se conserva la presentación, los filtros y las acciones actuales de la tabla y del modal.
- El mismo criterio debe aplicarse al mostrar otros datos de origen público en interfaces administrativas.
- El alcance de esta decisión cubre la tabla y el modal de solicitudes de visita.
