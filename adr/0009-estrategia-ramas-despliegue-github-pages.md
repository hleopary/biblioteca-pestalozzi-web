# ADR-0009: Estrategia de ramas Git y ciclo de publicación en GitHub Pages

- **Estado**: Aceptado
- **Fecha**: 2026-10-14
- **Autor**: Grupo Clouds (Eduardo Moreno, Leandro Paryszewski, Marcelo Moreno, Melissa Galeano Ibañez)
- **Proyecto**: Sistema Web Institucional — Biblioteca Popular Pestalozzi (Berisso)

---

## Contexto

El equipo de desarrollo (Grupo Clouds) trabaja de forma colaborativa y necesita un flujo ordenado en GitHub que permita:
- Mostrar avances estables y testeados a la cliente (Betsabé Cruz) y al docente (Kevin Del Bello).
- Desarrollar nuevas iteraciones sin riesgo de romper el sitio web público mientras se trabaja.
- Mantener la rama `main` protegida y limpia.

## Decisión

Definir un flujo de ramas con roles estrictos:

1. **`main`**: Rama troncal consolidada, limpia y estable. Las modificaciones ingresan únicamente mediante Pull Request revisado y aprobado.
2. **`leopary_prueba2`**: Rama designada para el despliegue automático en GitHub Pages (`https://hleopary.github.io/biblioteca-pestalozzi-web/`). Representa la versión pública visible para la institución.
3. **`leopary_prueba3` / ramas temáticas (`feature/*`)**: Ramas de desarrollo activo donde el equipo realiza iteraciones y experimentos. No impactan en producción hasta ser fusionadas a `leopary_prueba2` / `main`.

## Consecuencias

### Positivas
- Estabilidad total en la URL pública entregada al cliente.
- Libertad para realizar cambios y mediciones en desarrollo sin alterar lo que ven los docentes o usuarios finales.
- Historial de Git prolijo y trazable mediante commits convencionales.

### Negativas / Compromisos
- Requiere ejecutar merges coordinados para que los avances de las ramas de desarrollo impacten en el entorno de producción en GitHub Pages.
