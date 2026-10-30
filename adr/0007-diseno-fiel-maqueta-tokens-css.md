# ADR-0007: Sistema de diseño flat editorial, tokens CSS centralizados y fidelidad por píxel a la maqueta oficial

- **Estado**: Aceptado
- **Fecha**: 2026-10-14
- **Autor**: Grupo Clouds (Eduardo Moreno, Leandro Paryszewski, Marcelo Moreno, Melissa Galeano Ibañez)
- **Proyecto**: Sistema Web Institucional — Biblioteca Popular Pestalozzi (Berisso)

---

## Contexto

La Biblioteca Pestalozzi entregó una maqueta gráfica oficial (`maqueta_web2.png`). Las primeras versiones del sitio presentaban discrepancias en paletas, sombras artificiales y márgenes. Se requería una definición arquitectónica estricta para garantizar fidelidad absoluta a la identidad visual de la institución y evitar divergencias estéticas arbitrarias.

## Decisión

1. **Tokens centralizados en `:root`**: Todos los colores y estilos se declaran exclusivamente como variables CSS en `css/styles.css` (`--color-primary: #6b1d2b`, `--color-accent: #8b5e2b`, etc.).
2. **Medición pixel-perfect**: Se midieron los colores, grosores de línea y proporciones directamente sobre la maqueta gráfica.
3. **Estilo flat editorial**:
   - Supresión total de sombras (`--shadow: none`), respetando el tono institucional de catálogo impreso y biblioteca histórica.
   - Contenedor principal limitado a `72.5rem` (`1120px`).
   - Radios de curvatura de 6px (`border-radius: 6px`) en tarjetas y botones.
   - Líneas de acento doradas de 3px (`3px solid var(--color-accent)`) para estructurar el encabezado, las bandas temáticas y el pie de página.

## Consecuencias

### Positivas
- Coherencia visual idéntica a la maqueta aprobada por la institución.
- Facilidad para alterar aspectos visuales globales modificando una única línea en el `:root`.
- Estética limpia, sobria y accesible.

### Negativas / Limitaciones
- Rigidez deliberada: no se permite agregar efectos decorativos o sombras que no existan en la especificación visual de la maqueta.
