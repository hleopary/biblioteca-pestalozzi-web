# ADR-0013: Implementación del DER de Etapa 2 como esquema real (opción B)

- **Estado**: Aceptado (rama `dev-07nov2026B`)
- **Fecha**: 2026-11-07
- **Autor**: Grupo Clouds (Eduardo Moreno, Leandro Paryszewski, Marcelo Moreno, Melissa Galeano Ibañez)
- **Proyecto**: Sistema Web Institucional — Biblioteca Popular Pestalozzi (Berisso)
- **Reemplaza**: ADR-0012 (rama `dev-07nov2026A`, que reconciliaba el diagrama)

---

## Contexto

El DER de Etapa 2 define seis entidades: `HORARIOS`, `CATEGORIAS_COLECCION`, `MATERIALES_BIBLIOGRAFICOS`, `SOLICITUDES_VISITA`, `CONTACTOS` y `NOVEDADES_DONACIONES`, con dos claves foráneas.

La rama A resolvió la diferencia actualizando el diagrama al modelo implementado (ADR-0012). Esta rama toma el camino opuesto: **implementar el diagrama como esquema real** y adaptar la aplicación para que cada tabla tenga uso.

## Decisión

Se implementan las **seis entidades del DER** y se conservan `USUARIOS` y `NOTAS`, que la Etapa 3 necesita para la autenticación del panel y el bloc de la bibliotecaria. El esquema queda con **8 tablas**.

| Tabla | Origen | Claves |
|---|---|---|
| `horarios` | DER | PK `id_horario` |
| `categorias_coleccion` | DER | PK `id_categoria` |
| `materiales_bibliograficos` | DER | PK `id_material`; FK `id_categoria` |
| `solicitudes_visita` | DER | PK `id_solicitud` |
| `contactos` | DER | PK `id_contacto` |
| `novedades_donaciones` | DER | PK `id_novedad`; FK `id_horario` (opcional) |
| `usuarios` | Etapa 3 | PK `id` |
| `notas` | Etapa 3 | PK `id` (fila única) |

### Columnas adicionales

El DER define el mínimo; la aplicación necesita algunos campos más. Se agregan y se documentan:

| Tabla | Columna extra | Motivo |
|---|---|---|
| `horarios` | `dia_orden` | Ordenar el tablón (el DER no fija un orden) |
| `horarios` | `updated_at` | Registrar la última edición |
| `solicitudes_visita` | `telefono`, `nivel`, `alumnos_cant`, `turno`, `observaciones` | Campos del formulario público |
| `solicitudes_visita` | `created_at` | Fecha de alta |
| `novedades_donaciones` | `orden`, `categoria`, `categoria_color`, `activa`, `created_at` | Orden, etiqueta y visibilidad del sitio |
| `materiales_bibliograficos` | — | El DER ya los contempla |
| `contactos` | `telefono` | Campo opcional del formulario |

### Uso de cada tabla

- `categorias_coleccion` y `materiales_bibliograficos` alimentan la sección **Colecciones** del sitio (materiales destacados) y se administran desde la pestaña **Catálogo** del panel.
- `contactos` recibe el formulario de consulta general y se lee desde la pestaña **Consultas** del panel.
- `novedades_donaciones.id_horario` se elige opcionalmente en el formulario de novedades.
- `solicitudes_visita` conserva el flujo de visitas escolares.

## Consecuencias

- Los controllers traducen entre las columnas del DER y el contrato que ya consumía el frontend: el sitio y el panel siguen funcionando, y las pruebas existentes pasan sin cambios.
- `PRAGMA foreign_keys = ON` se aplica en cada conexión; la API valida las referencias y devuelve 400 cuando no existen.
- La base local debe recrearse con `npm run db:reset`: el esquema no es compatible con el de la rama A.
- El panel suma dos pestañas (Consultas y Catálogo) y un selector de día en novedades.
- El panel de Catálogo no permite editar materiales (solo crear y eliminar); la edición queda para una próxima iteración.
- Las pruebas pasan de 19 a 24 y la evidencia se regenera.
- El DER, el Manual Técnico y el Manual de Usuario se actualizan.

## Alternativas consideradas

- **Opción A (reconciliar el DER con el modelo de 5 tablas)**: implementada en `dev-07nov2026A` y documentada en ADR-0012. Se mantiene como rama alternativa para que el grupo compare.
- **Implementar solo las 6 tablas sin darles uso**: descartada porque deja tablas decorativas y no mejora la coherencia funcional.
