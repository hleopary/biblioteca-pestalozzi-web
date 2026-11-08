# ADR-001: Persistencia y hosting del sistema

- **Estado**: Aceptado
- **Fecha**: 2026-11-07
- **Autor**: Grupo Clouds (Eduardo Moreno, Leandro Paryszewski, Marcelo Moreno, Melissa Galeano Ibañez)
- **Proyecto**: Sistema Web Institucional — Biblioteca Popular Pestalozzi (Berisso)
- **Issues relacionadas**: #8 (esta decisión), #9, #10, #12, #13, #14

---

## Contexto

La guía de la Etapa 2 proponía una aplicación **React / Next.js / SPA** con un servicio de persistencia externo. El equipo había adoptado otra decisión en ADR-0001: **sitio estático, cero dependencias y cero build**, con HTML, CSS y JavaScript nativo.

La Etapa 3 exige una aplicación funcional con base de datos, CRUD demostrable, validaciones y pruebas. Eso obliga a resolver tres cosas que la Etapa 2 había dejado abiertas:

1. **Dónde persistir** los horarios, las novedades, las visitas y las notas.
2. **Dónde hospedar** la capa que escribe, porque un sitio estático no puede hacerlo.
3. **Cómo proteger la escritura** sin pedirle una cuenta al público.

Este documento fija esas decisiones y reconcilia el stack entregado con la propuesta de la guía.

## Decisión

### Persistencia

**SQLite embebido mediante `node:sqlite`**, con el esquema versionado en `db/schema.sql` y el contenido inicial en `db/seed.sql`.

- No hay ORM ni servidor de base de datos separado.
- El esquema es la fuente única: lo aplican el arranque del servidor y `npm run db:migrate`.
- Los scripts de migración, seed, dump y restauración viven en `backend/scripts/db.js`.

Se descartaron:

| Opción | Por qué se descartó |
|---|---|
| **Firebase / Firestore** | Dependencia externa, cuentas y reglas de seguridad que agregan complejidad; el CRUD queda fuera del repositorio |
| **MySQL / PostgreSQL gestionado** | Servicio pago o con límites, y un servidor más para una base de 32 KB |
| **SQLite sobre serverless (Vercel)** | El sistema de archivos es de solo lectura y `/tmp` es efímero: las escrituras se pierden |
| **Almacenamiento en archivos JSON** | Sin transacciones, sin restricciones y con riesgo de corrupción |

### Hosting

| Componente | Dónde se sirve |
|---|---|
| **Sitio público** | Railway (canónico) · Vercel (espejo estático) · GitHub Pages (rama `main`) |
| **API y base de datos** | Railway, con un volumen persistente en `/app/backend/data` |
| **Panel de administración** | Railway, en `/admin.html` |

Railway corre la aplicación completa en un contenedor `node:24-alpine`: el mismo `server.js` sirve el sitio, el panel y la API, y el volumen conserva `pestalozzi.db` entre despliegues.

### Costo

| Escenario | Costo |
|---|---|
| Sitio estático (Vercel y GitHub Pages) | $0 |
| Aplicación completa en Railway, primeros 30 días | $0 (crédito de prueba) |
| Aplicación completa en Railway después del período de prueba | $5/mes |
| Alternativa de costo $0 recurrente | VPS con capa gratuita (Oracle Cloud Always Free) con disco propio |

La decisión deja registrado el costo real: **la evaluación se hace con costo $0** y, si la biblioteca decide mantener el sistema en línea, hay dos caminos: el plan Hobby de Railway (USD 5/mes) o migrar el mismo contenedor a un VPS gratuito. No se oculta el costo recurrente.

### Protección de la escritura (RNF05)

El público general **nunca necesita una cuenta**. Solo las rutas que escriben están protegidas:

| Medida | Implementación |
|---|---|
| Contraseña | Hash bcrypt con 10 rondas; nunca se almacena en texto plano |
| Sesión | JWT firmado con `JWT_SECRET`, vigencia de 8 horas por defecto |
| Rutas | `authenticateToken` en todo lo que crea, modifica o elimina |
| Credencial en el servidor | Variables de entorno del hosting (Railway). En desarrollo, `backend/.env`, ignorado por Git |
| Credencial en el cliente | Solo el token en memoria del navegador; no se guarda la contraseña |

**Rotación de credenciales:**

- **Contraseña del panel**: se cambia desde el propio panel (`PUT /api/auth/password`), indicando la actual y la nueva (mínimo 6 caracteres).
- **`JWT_SECRET`**: se reemplaza en las variables del hosting y se redespliega; todas las sesiones emitidas quedan invalidadas.
- **Credenciales SMTP**: se reemplazan en las variables del hosting; el correo se simula por consola si no están definidas.

### Reconciliación con la guía de Etapa 2

La guía sugería React/Next.js/SPA. El equipo construyó sobre **ADR-0001 (cero dependencias, cero build)** y la Etapa 3 se implementa sobre ese stack, no sobre React:

- La interactividad se resuelve con JavaScript nativo (`fetch`, actualización del DOM) sin bundler ni framework.
- El comportamiento "tipo SPA" (actualizar partes de la página sin recargar) se logra con la API y `fetch`.
- El backend es Node.js + Express (ADR-0010), no Next.js.
- La decisión se sostiene porque el sitio es pequeño, el equipo no usa React y el despliegue estático simplifica la publicación.

### Tooling fijado

| Pieza | Herramienta | Comando |
|---|---|---|
| Runtime de la API | Node.js 24 | `npm start` |
| Driver de base | `node:sqlite` (sin ORM) | — |
| Migraciones | `db/schema.sql` + `scripts/db.js` | `npm run db:migrate` |
| Seed | `db/seed.sql` + seeder | `npm run db:seed` |
| Reset | borra y recrea | `npm run db:reset` |
| Dump / restore | `scripts/db.js` | `npm run db:dump` / `db:restore` |
| Tests | `node:test` nativo | `npm test`, `test:unit`, `test:integration`, `test:smoke` |
| Despliegue | Docker (`node:24-alpine`) | Railway |

## Consecuencias

### Issues de Etapa 2 cuyos criterios quedan afectados

| Issue | Efecto | Cómo se amenda |
|---|---|---|
| **#2** (tablón editable sin servidor) | La issue pedía un archivo de datos "sin servidor ni base de datos"; la decisión adopta una base | Se redefine el alcance: la edición se hace desde el panel (#11) sobre la base. El modelo de rotaciones sigue pendiente |
| **#6** (persistencia de horarios, ADR-0006) | Queda superada por esta decisión | Se referencia este ADR |
| **#3 original** (formularios serverless, ADR-0003) | Las visitas ahora se persisten en la base; el correo es una notificación | Se mantiene Formspree solo para la consulta general |
| **#9** (esquema, migraciones, seed) | Toma como fuente `db/schema.sql` y `scripts/db.js` | Se actualiza con la reconciliación del DER (ADR-0012) |
| **#10** (CRUD de horarios) | Depende del esquema y los validadores de esta decisión | Sin cambios de alcance |
| **#12** (tablón desde la base) | El sitio ya lee de la API | Se completa con el estado de fallo explícito |
| **#13** (pruebas) | El runner queda fijado en `node:test` | Se documenta en el Manual Técnico |

### Otras consecuencias

- El sitio publicado en Vercel es un **espejo estático**: si la API no está accesible, el tablón muestra un estado de fallo explícito con una alternativa de contacto (no una tabla vacía).
- La base vive en un volumen: sin volumen, cada despliegue perdería los datos.
- Un clon limpio se levanta con `npm install` y `npm run db:reset`.
- El esquema no usa claves foráneas; la correspondencia con el DER de Etapa 2 está en ADR-0012.

## Referencias

- ADR-0001: arquitectura Jamstack / cero build.
- ADR-0003: procesamiento serverless de formularios.
- ADR-0006: persistencia de la cartelera.
- ADR-0010: backend Node.js / Express.
- ADR-0012: reconciliación del DER.
- `db/schema.sql`, `db/seed.sql`, `backend/scripts/db.js`.
