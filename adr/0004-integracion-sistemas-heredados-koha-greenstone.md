# ADR-0004: Integración No Invasiva con Sistemas Heredados (Koha y Greenstone)

- **Estado**: Aceptado
- **Fecha**: 2026-10-14
- **Autor**: Grupo Clouds (Eduardo Moreno, Leandro Paryszewski, Marcelo Moreno, Melissa Galeano Ibañez)
- **Proyecto**: Sistema Web Institucional — Biblioteca Popular Pestalozzi (Berisso)

---

## Contexto

La Biblioteca Pestalozzi ya administra un acervo físico de más de 43.000 volúmenes catalogados en el software especializado Koha y un repositorio de obras históricas digitalizadas en Greenstone. Realizar una migración completa o una sincronización bidireccional de bases de datos excedía el alcance temporal del MVP (3 meses), sumado a la complejidad de que muchos libros locales carecen de identificador ISBN estándar.

## Decisión

Integrar Koha y Greenstone mediante una estrategia no invasiva basada en enlaces profundos directos, tarjetas y botones destacados, complementados con un punto de acceso a la búsqueda en la cabecera y sección de catálogos del portal, en lugar de intentar una migración pesada de bases de datos.

## Consecuencias

### Positivas
- **Respeto a la operatoria existente**: Conserva los flujos de catalogación diarios de la bibliotecaria sin alterar sus herramientas ya consolidadas.
- **Bajo riesgo**: Evita inconsistencias de datos, problemas por ausencia de ISBN y costos de infraestructura de sincronización.
- **Acceso inmediato**: Permite a la comunidad saltar de forma guiada al catálogo en línea sin intermediarios innecesarios.

### Negativas / Limitaciones
- La consulta fina de disponibilidad y fichas técnicas del material físico se completa dentro de la interfaz nativa de Koha y no embebida en la SPA.
