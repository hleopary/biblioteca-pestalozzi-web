# Evidencia de scripts de base — issue #9

**Fecha:** 07/11/2026
**Rama:** `dev-07nov2026B` (modelo del DER)
**Base usada:** archivo temporal `./data/evidencia-b.sqlite` (eliminado al terminar)

## Qué se agregó

| Pieza | Ubicación | Función |
|---|---|---|
| Esquema | `db/schema.sql` | Fuente única de las 8 tablas; lo aplica el servidor y `db:migrate` |
| Seed | `db/seed.sql` | Contenido publicado: horarios, categorías, materiales, novedades y nota |
| Script | `backend/scripts/db.js` | Comandos `migrate`, `seed`, `reset`, `dump`, `restore`, `count` |
| Scripts npm | `backend/package.json` | `db:migrate`, `db:seed`, `db:reset`, `db:dump`, `db:restore`, `db:count` |

El usuario administrador no se incluye en el seed SQL porque su contraseña se hashea con bcrypt en `seeder.js`, leyendo `ADMIN_USER`, `ADMIN_PASS` y `ADMIN_EMAIL`.

El dump se genera en `db/dump.sql` y **no se versiona** (está en `.gitignore`) porque contiene los datos de la base, incluido el hash de la contraseña.

## Tablas del modelo

Las seis entidades del DER de Etapa 2:

| Tabla | Filas del seed | Claves |
|---|---:|---|
| `horarios` | 7 | PK `id_horario` |
| `categorias_coleccion` | 2 | PK `id_categoria` |
| `materiales_bibliograficos` | 6 | PK `id_material`, FK `id_categoria` |
| `solicitudes_visita` | 0 | PK `id_solicitud` |
| `contactos` | 0 | PK `id_contacto` |
| `novedades_donaciones` | 3 | PK `id_novedad`, FK `id_horario` |

Más las dos entidades que agregó la Etapa 3: `usuarios` (1) y `notas` (1).

## Ejecución de punta a punta

| Paso | Resultado |
|---|---|
| 1. `npm run db:reset` | Borra la base y la recrea desde cero; aplica esquema + seed + usuario |
| 2. `npm run db:count` | 7 horarios, 2 categorías, 6 materiales, 3 novedades, 1 nota, 1 usuario, 0 visitas, 0 consultas |
| 3. `PRAGMA foreign_key_check` | **0 violaciones** |
| 4. `npm run db:dump` | Genera `db/dump.sql` con 8 tablas y 20 inserts |
| 5. `npm run db:restore` | Tras modificar el Martes, vuelve a `16:00 – 18:00` |

La salida completa está en `09-salida-db.txt`.

## Reproducibilidad

Dos ejecuciones consecutivas de `db:count` sobre la base recién creada dan el mismo resultado. El seed usa `INSERT OR IGNORE` con identificadores fijos, así que aplicarlo dos veces no duplica filas.

## Cómo se levanta un clon limpio

```bash
cd backend
npm install
cp .env.example .env     # ajustar ADMIN_PASS y JWT_SECRET
npm run db:reset         # crea la base, aplica el esquema y siembra
npm start                # sitio + API en http://localhost:3000
```

Para restaurar una copia existente:

```bash
npm run db:dump                  # genera db/dump.sql
npm run db:restore               # restaura desde db/dump.sql
npm run db:restore otro.sql      # o desde un archivo puntual
```

## Integridad referencial

Las dos claves foráneas del DER se aplican en la base (`PRAGMA foreign_keys = ON` en cada conexión):

- `materiales_bibliograficos.id_categoria` → `categorias_coleccion.id_categoria`.
- `novedades_donaciones.id_horario` → `horarios.id_horario` (opcional).

La API valida las referencias antes de escribir y devuelve 400 con un mensaje claro cuando no existen.
