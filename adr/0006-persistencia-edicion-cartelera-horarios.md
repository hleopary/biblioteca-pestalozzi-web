# ADR-0006: Esquema de Persistencia y Edición de la Cartelera de Horarios Dinámicos

- **Estado**: Aceptado
- **Fecha**: 2026-10-14
- **Autor**: Grupo Clouds (Eduardo Moreno, Leandro Paryszewski, Marcelo Moreno, Melissa Galeano Ibañez)
- **Proyecto**: Sistema Web Institucional — Biblioteca Popular Pestalozzi (Berisso)

---

## Contexto

Los días y turnos de atención al público de la biblioteca no son fijos a lo largo del año: rotan cada cuatrimestre para adecuarse a los compromisos académicos y de estudio de la bibliotecaria. Es fundamental que la información de horarios esté siempre al día para evitar que los vecinos asistan cuando la sede está cerrada, pero la bibliotecaria no posee conocimientos de edición de código HTML/CSS ni Git.

## Decisión

Definir un mecanismo de persistencia y edición liviano para la cartelera de horarios (mediante un archivo de configuración accesible/JSON o un panel administrativo protegido muy simple con persistencia local/SQLite), permitiendo que la bibliotecaria modifique los días de apertura y las bandas horarias sin tocar el código fuente del proyecto.

## Consecuencias

### Positivas
- **Autonomía operativa**: La cliente puede actualizar la cartelera cuatrimestralmente en pocos pasos sin depender de los desarrolladores.
- **Información verídica**: Reduce drásticamente la probabilidad de que el sitio exhiba horarios desactualizados a la comunidad.

### Negativas / Limitaciones
- Requiere gestionar de forma segura una clave o mecanismo de acceso simple exclusivo para la bibliotecaria.
