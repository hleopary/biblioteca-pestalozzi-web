# ADR-0001: Adopción de Arquitectura Jamstack / Single Page Application (SPA)

- **Estado**: Aceptado
- **Fecha**: 2026-10-02
- **Autor**: Grupo Clouds (Eduardo Moreno, Leandro Paryszewski, Marcelo Moreno, Melissa Galeano Ibañez)
- **Proyecto**: Sistema Web Institucional — Biblioteca Popular Pestalozzi (Berisso)

---

## Contexto

La Biblioteca Popular Pestalozzi es operada por una única bibliotecaria (Betsabé Cruz) y carece de presupuesto asignado para el mantenimiento de infraestructura en la nube o servidores dedicados. La solución tecnológica debe ofrecer tiempos de respuesta rápidos, ser accesible e intuitiva para adultos mayores y docentes, y requerir un costo de mantenimiento técnico nulo.

## Decisión

Desarrollar el portal web bajo los principios de una arquitectura Jamstack / Single Page Application (SPA), priorizando tecnologías estándar del navegador (HTML5 semántico, CSS3 moderno, JavaScript vanilla ES6+ y componentes modulares en el cliente) desacopladas de cualquier servidor de renderizado.

## Consecuencias

### Positivas
- **Carga inicial rápida y navegación fluida**: La página y sus secciones responden al instante sin recargas completas de ventana.
- **Rendimiento en dispositivos móviles**: Excelente performance y bajo consumo de datos móviles en redes celulares 3G/4G.
- **Alojamiento estático gratuito**: Capacidad de ser distribuido en CDNs y plataformas de hosting estático sin incurrir en costos de servidor.

### Negativas / Limitaciones
- Cualquier funcionalidad dinámica avanzada (procesamiento de formularios, catálogos externos) debe manejarse mediante servicios desacoplados o APIs externas.
