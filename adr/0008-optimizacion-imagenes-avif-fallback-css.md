# ADR-0008: Optimización de imágenes en formato AVIF y degradados de respaldo en CSS

- **Estado**: Aceptado
- **Fecha**: 2026-10-14
- **Autor**: Grupo Clouds (Eduardo Moreno, Leandro Paryszewski, Marcelo Moreno, Melissa Galeano Ibañez)
- **Proyecto**: Sistema Web Institucional — Biblioteca Popular Pestalozzi (Berisso)

---

## Contexto

El portal contiene fotografías de gran tamaño del edificio histórico y de colecciones bibliográficas. El uso de formatos sin compresión moderna (JPEG o PNG pesados) aumenta el consumo de datos y degrada la velocidad de carga en dispositivos móviles en Berisso. Asimismo, si una imagen estática no carga por problemas de red o archivo ausente, no debe quedar un espacio roto o en blanco.

## Decisión

1. **Adopción de formato AVIF**: Guardar las fotografías institucionales en formato `.avif` comprimido en `assets/img/`, reduciendo el peso en hasta un 70% sin pérdida perceptible de calidad.
2. **Degradados CSS de respaldo**: Toda clase `.media` o bloque con imagen de fondo en `css/styles.css` debe conservar una propiedad `background-color` o `linear-gradient` previa como respaldo resiliente.
3. **Rutas relativas estándar**: Referenciar los recursos fotográficos desde CSS mediante `../assets/img/...`.

## Consecuencias

### Positivas
- Carga casi instantánea en teléfonos celulares y cumplimiento de estándares Web Vitals (LCP óptimo).
- Composición visual protegida ante fallos de carga de archivos estáticos.

### Negativas / Limitaciones
- Dispositivos muy obsoletos sin soporte nativo de AVIF verán el color o degradado de respaldo (fallback) en lugar de la imagen.
