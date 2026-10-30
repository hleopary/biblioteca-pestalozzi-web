# ADR-0010: Incorporación de Backend Node.js / Express para Gestión Dinámica y Persistencia

- **Estado**: Aceptado
- **Fecha**: 2026-10-29
- **Autor**: Grupo Clouds (Eduardo Moreno, Leandro Paryszewski, Marcelo Moreno, Melissa Galeano Ibañez)
- **Proyecto**: Sistema Web Institucional — Biblioteca Popular Pestalozzi (Berisso)

---

## Contexto

Inicialmente, el portal web institucional fue planteado como una solución puramente estática con delegación en servicios serverless externos (ADR-0003) y persistencia liviana a definir para horarios (ADR-0006). Sin embargo, surgieron los siguientes requerimientos concretos:
1. La cartelera de horarios debe ser editable cuatrimestralmente por la bibliotecaria (Betsabé Cruz) sin editar código HTML.
2. Las solicitudes de visitas escolares deben persistirse de forma segura y centralizada en una base de datos propia, permitiendo a la bibliotecaria consultar el historial, cambiar estados y recibir notificaciones.
3. Se requiere un canal para publicar novedades e incorporaciones de libros sin depender de modificaciones manuales en el repositorio.
4. Se debe mantener la facilidad de despliegue para los integrantes del Grupo Clouds y la institución, evitando servidores de bases de datos pesados o configuraciones complejas.

## Decisión

Incorporar un backend propio desacoplado en **Node.js con Express** bajo una arquitectura de monorepo en la carpeta `backend/`:

1. **Persistencia en SQLite nativo (`node:sqlite`)**:
   - Utilizar el motor SQLite integrado en Node.js, almacenando la base de datos en `backend/data/pestalozzi.db`.
   - Cero dependencias nativas de compilación (sin node-gyp) y portabilidad inmediata en cualquier sistema operativo.
2. **Autenticación con JWT**:
   - Módulo de login protegido para Betsabé con contraseñas hasheadas (`bcryptjs`) y tokens JSON Web Token para autorización en endpoints administrativos.
3. **API REST Modular**:
   - Endpoints públicos para lectura de horarios, novedades activas y recepción de solicitudes de visitas escolares.
   - Endpoints protegidos para actualización de horarios, administración de visitas y CRUD de novedades.
4. **Panel de Gestión Interna (`admin.html`)**:
   - Interfaz web simple y accesible adaptada a la paleta institucional para que la bibliotecaria administre el sitio con autonomía.
   - Acceso al Perfil de la bibliotecaria y cambio de contraseña centralizado en la barra de navegación superior.
5. **Bloc de Notas Rápido Persistente**:
   - Espacio lateral dedicado para anotaciones de la bibliotecaria (llamadas, pendientes, recordatorios de docentes), con sincronización automática en base de datos (`/api/notas`) y respaldo en almacenamiento local.
6. **Resiliencia en el Frontend**:
   - El cliente JavaScript (`js/api-client.js` y `js/main.js`) consulta la API dinámica pero conserva los contenidos HTML estáticos como respaldo (fallback) en caso de que el backend se encuentre momentáneamente fuera de línea.

## Relación con ADRs anteriores
- **Complementa y evoluciona ADR-0003**: Permite el procesamiento directo de formularios en servidor propio y persistencia en base de datos, manteniendo la posibilidad de delegación externa como alternativa.
- **Implementa y concreta ADR-0006**: Proporciona el mecanismo definitivo de edición y persistencia para la cartelera de horarios dinámica.

## Consecuencias

### Positivas
- **Autonomía total para la institución**: Betsabé puede cambiar horarios y publicar novedades de forma intuitiva desde `admin.html`.
- **Trazabilidad de visitas**: Las solicitudes de las escuelas no se pierden en correos spam; quedan registradas en la base de datos con su estado de gestión.
- **Cero complejidad de infraestructura**: SQLite no requiere instalación de MySQL/Postgres; funciona con clonar el repo y ejecutar `npm start`.
- **Compatibilidad con el frontend**: El sitio sigue pudiendo abrirse de forma estática gracias a los fallbacks programados.

### Negativas / Compromisos
- Requiere ejecutar el proceso de Node.js (`npm start`) para disponer de las funciones dinámicas y del panel administrativo.
