# ADR-0012: Reconciliación del DER de Etapa 2 con la base implementada

- **Estado**: Aceptado
- **Fecha**: 2026-11-07
- **Autor**: Grupo Clouds (Eduardo Moreno, Leandro Paryszewski, Marcelo Moreno, Melissa Galeano Ibañez)
- **Proyecto**: Sistema Web Institucional — Biblioteca Popular Pestalozzi (Berisso)

---

## Contexto

El DER de la Etapa 2 (`diagramas/codigo/4.8 DER.puml`) define seis entidades:

`HORARIOS`, `CATEGORIAS_COLECCION`, `MATERIALES_BIBLIOGRAFICOS`, `SOLICITUDES_VISITA`, `CONTACTOS` y `NOVEDADES_DONACIONES`, con dos claves foráneas (`MATERIALES_BIBLIOGRAFICOS.id_categoria` y `NOVEDADES_DONACIONES.id_horario`).

La implementación de la Etapa 3 evolucionó hacia un esquema de cinco tablas (`usuarios`, `horarios`, `visitas`, `novedades`, `notas`) sin claves foráneas, porque:

1. La cartelera de horarios se resuelve con una fila por día y un estado activo, sin cuatrimestres ni rotaciones (el modelo de rotaciones quedó pendiente en #2).
2. Los catálogos de Koha y Greenstone son sistemas externos a los que se enlaza: no se almacenan materiales ni categorías en la base propia (ADR-0004).
3. Las consultas generales se entregan por Formspree y no se persisten (ADR-0003), por lo que `CONTACTOS` no tiene tabla.
4. La Etapa 3 incorporó dos necesidades que el DER no contemplaba: autenticación de la bibliotecaria (`usuarios`) y su bloc de notas (`notas`).

La Etapa 3 exige coherencia entre el sistema y los diagramas de las etapas anteriores. Con el DER original, la base implementada no coincide entidad por entidad.

## Decisión

Se adopta la **reconciliación**: se actualiza el DER al modelo realmente implementado y se documenta la correspondencia y las desviaciones.

- El diagrama vigente pasa a ser `docs/der/der-implementado.puml` (con su versión en PNG).
- El esquema versionado es `db/schema.sql`, que es la fuente única que aplican tanto el servidor como `npm run db:migrate`.
- Este ADR registra qué entidad del DER de Etapa 2 corresponde a qué tabla y por qué cambió.

## Correspondencia con el DER de Etapa 2

| Entidad del DER (Etapa 2) | Tabla implementada | Situación |
|---|---|---|
| `HORARIOS` (`dias_atencion`, `rango_horario`, `cuatrimestre`) | `horarios` (`dia_orden`, `dia_nombre`, `horario_texto`, `activo`) | Rediseñada: una fila por día, sin cuatrimestre ni rotaciones |
| `SOLICITUDES_VISITA` | `visitas` | Ampliada con los campos del formulario real (nivel, turno, cantidad, observaciones, estado) |
| `NOVEDADES_DONACIONES` | `novedades` | Se quitó la FK a `HORARIOS`: las novedades no dependen de un día de atención |
| `CATEGORIAS_COLECCION` | — | No implementada: los catálogos son externos (ADR-0004) |
| `MATERIALES_BIBLIOGRAFICOS` | — | No implementada: no se cataloga material propio |
| `CONTACTOS` | — | No implementada: las consultas se entregan por Formspree (ADR-0003) |
| — | `usuarios` | Nueva: autenticación de la bibliotecaria |
| — | `notas` | Nueva: bloc de notas del panel |

## Consecuencias

- El Manual Técnico (#14) describe este DER y no el de Etapa 2; incluye la tabla de correspondencia de este ADR.
- La issue #9 queda cumplida en lo referido a scripts, seed, dump y restauración, y **parcialmente** en el criterio de las seis tablas con claves foráneas, que este ADR reemplaza por una decisión explícita.
- El modelo de rotaciones con nombre (#2) y el CRUD completo de horarios (#10) siguen pendientes: si se implementan, requieren una nueva revisión de este ADR y del esquema.
- No se introducen entidades fuera de las documentadas acá.

## Alternativas consideradas

- **Implementar las seis tablas del DER original** (opción B): se descartó para esta entrega porque exige migrar el esquema, adaptar los controllers, el panel y los datos, con un costo estimado de dos días y riesgo sobre los entregables obligatorios de la Etapa 3. Queda como camino posible si la evaluación externa exige la correspondencia literal.
- **Mantener el DER de Etapa 2 sin actualizar**: se descartó porque deja una incoherencia visible entre la documentación y el sistema en ejecución.
