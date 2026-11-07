# Evidencia de scripts de base — issue #9

**Fecha:** 07/11/2026
**Rama:** `dev-07nov2026A`
**Base usada:** archivo temporal `./data/evidencia-db.sqlite` (eliminado al terminar)

## Qué se agregó

| Pieza | Ubicación | Función |
|---|---|---|
| Esquema | `db/schema.sql` | Fuente única de las 5 tablas; lo aplica el servidor y `db:migrate` |
| Seed | `db/seed.sql` | Contenido publicado: 7 horarios, 3 novedades y la nota vacía |
| Script | `backend/scripts/db.js` | Comandos `migrate`, `seed`, `reset`, `dump`, `restore`, `count` |
| Scripts npm | `backend/package.json` | `db:migrate`, `db:seed`, `db:reset`, `db:dump`, `db:restore`, `db:count` |

El usuario administrador no se incluye en el seed SQL porque su contraseña se hashea con bcrypt en `seeder.js`, leyendo `ADMIN_USER`, `ADMIN_PASS` y `ADMIN_EMAIL`.

El dump se genera en `db/dump.sql` y **no se versiona** (está en `.gitignore`) porque contiene los datos de la base, incluido el hash de la contraseña.

## Ejecución de punta a punta

| Paso | Resultado |
|---|---|
| 1. `npm run db:reset` | Borra la base y la recrea desde cero; aplica esquema + seed + usuario |
| 2. `npm run db:count` | `horarios 7`, `notas 1`, `novedades 3`, `usuarios 1`, `visitas 0` |
| 3. `npm run db:dump` | Genera `db/dump.sql` con 5 tablas y 12 inserts |
| 4. Modificación manual | El Martes pasa a `20:00 - 22:00` |
| 5. `npm run db:restore` | El Martes vuelve a `16:00 – 18:00` y sigue habiendo 1 usuario |
| 6. `npm run db:count` | Mismos valores que el paso 2 |

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

## Relación con el DER

El esquema implementado tiene 5 tablas y no usa claves foráneas. La correspondencia con el DER de Etapa 2 y las entidades que no se implementaron están documentadas en el ADR-0012 y en `docs/der/der-implementado.puml`.
