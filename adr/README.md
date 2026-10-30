# Registro de Decisiones de Arquitectura (ADR)

Este directorio contiene los **Architectural Decision Records (ADRs)** del proyecto web de la **Biblioteca Popular Pestalozzi** (Berisso, Buenos Aires), desarrollado por el **Grupo Clouds**.

Cada documento describe una decisión técnica o de diseño significativa, su contexto y sus consecuencias según los estándares del equipo.

## Formato y Convenciones
- **Nomenclatura**: `XXXX-titulo-descriptivo.md` (4 dígitos secuenciales).
- **Estructura**: Estado, Fecha, Autor/Proyecto, Contexto, Decisión y Consecuencias.
- **Regla obligatoria de agentes**: Al terminar cualquier implementación técnica relevante o cambio arquitectónico, es **obligatorio** registrar el ADR correspondiente y actualizar este índice junto con el `CHANGELOG.md`.

---

## Índice General de Decisiones

| ID | Título | Estado | Fecha |
|---|---|---|---|
| [ADR-0001](0001-adopcion-arquitectura-jamstack-spa.md) | Adopción de Arquitectura Jamstack / Single Page Application (SPA) | Aceptado | 2026-10-02 |
| [ADR-0002](0002-despliegue-hosting-estatico-costo-cero.md) | Despliegue en Plataformas de Hosting Estático de Costo Recurrente Cero ($0 ARS) | Aceptado | 2026-10-02 |
| [ADR-0003](0003-procesamiento-serverless-formularios.md) | Procesamiento Serverless para Formularios de Contacto y Visitas Escolares | Aceptado | 2026-10-14 |
| [ADR-0004](0004-integracion-sistemas-heredados-koha-greenstone.md) | Integración No Invasiva con Sistemas Heredados (Koha y Greenstone) | Aceptado | 2026-10-14 |
| [ADR-0005](0005-exclusion-registro-obligatorio-usuarios.md) | Exclusión de Registro Obligatorio de Usuarios en Línea | Aceptado | 2026-10-14 |
| [ADR-0006](0006-persistencia-edicion-cartelera-horarios.md) | Esquema de Persistencia y Edición de la Cartelera de Horarios Dinámicos | Aceptado | 2026-10-14 |
| [ADR-0007](0007-diseno-fiel-maqueta-tokens-css.md) | Sistema de diseño flat editorial, tokens CSS centralizados y fidelidad por píxel | Aceptado | 2026-10-14 |
| [ADR-0008](0008-optimizacion-imagenes-avif-fallback-css.md) | Optimización de imágenes en formato AVIF y degradados de respaldo en CSS | Aceptado | 2026-10-14 |
| [ADR-0009](0009-estrategia-ramas-despliegue-github-pages.md) | Estrategia de ramas Git y ciclo de publicación en GitHub Pages | Aceptado | 2026-10-14 |
