# Evidencia de pruebas — issue #13

**Fecha:** 07/11/2026
**Rama:** `dev-07nov2026B` (modelo del DER)
**Node:** v24.7.0
**Comando principal:** `npm test` (desde `backend/`)

## Resumen

| Suite | Archivo | Pruebas | Resultado |
|---|---|---:|---|
| Unitaria | `backend/tests/validators.test.js` | 12 | 12 en verde |
| Integración | `backend/tests/api.test.js` | 12 | 12 en verde |
| **Total** | | **24** | **24 en verde** |

Además se ejecutó el suite end-to-end anterior (`npm run test:smoke`): **13 de 13 en verde**, con la expectativa de horarios actualizada a 7 días.

## Pruebas unitarias (12)

Validan funciones puras de `backend/src/utils/validators.js`, sin base de datos ni red.

| # | Prueba | Qué verifica |
|---|---|---|
| 1 | `esTextoNoVacio` | Distingue contenido real de vacío, espacios, null y no-texto |
| 2 | `validarCamposObligatorios` acepta | Devuelve `ok` cuando todos los campos tienen contenido |
| 3 | `validarCamposObligatorios` rechaza | Nombra cada campo faltante en el resultado y en el mensaje |
| 4 | `validarCamposObligatorios` numéricos | Un número (`alumnos_cant`) cuenta como campo presente |
| 5 | `validarEmail` | Acepta `docente@escuela12.edu.ar` y rechaza 6 formatos inválidos |
| 6 | `parseRangoHorario` | Convierte `16:00 – 18:00` a minutos y devuelve null para "Cerrado" |
| 7 | `validarRangoHorario` acepta | Acepta un rango bien formado con apertura anterior al cierre |
| 8 | `validarRangoHorario` invertido | Rechaza `18:00 - 16:00` con mensaje explicativo |
| 9 | `validarRangoHorario` inválido | Rechaza formatos incorrectos y horas fuera de rango |
| 10 | `esDuplicado` detecta | Detecta la misma combinación ignorando mayúsculas y espacios |
| 11 | `esDuplicado` otro cuatrimestre | El mismo rango en otro cuatrimestre no es duplicado |
| 12 | `esDuplicado` lista vacía | Devuelve false sin registros |

## Pruebas de integración (12)

Levantan Express en un puerto efímero y usan una base SQLite temporal en `os.tmpdir()`. No tocan la base de desarrollo ni la de producción.

| # | Prueba | Qué verifica |
|---|---|---|
| 1 | `GET /api/health` | Responde 200 con `estado: activo` |
| 2 | `POST /api/auth/login` correcto | Entrega un token JWT con las credenciales del seed |
| 3 | `POST /api/auth/login` incorrecto | Responde 401 |
| 4 | CRUD de novedades | Crear → leer en la vista pública → actualizar → eliminar → ya no aparece |
| 5 | Lectura pública refleja escritura | Un `PATCH` autenticado a horarios se ve en el `GET` público; luego se restaura |
| 6 | Visitas sin campos | Responde 400 con mensaje de campos obligatorios |
| 7 | Visitas con email inválido | Responde 400 nombrando el correo |
| 8 | Alta de consulta (`CONTACTOS`) | Crea una consulta, la lista para el panel y la elimina |
| 9 | Consulta sin mensaje | Responde 400 |
| 10 | `GET /api/catalogos/categorias` | Devuelve las categorías con sus materiales |
| 11 | Catálogo: crear y proteger | Crea categoría y material; la categoría con materiales no se puede borrar; vacía sí |
| 12 | Novedad con `id_horario` inexistente | Responde 400 (clave foránea validada en la API) |

## Determinismo

Se ejecutó `npm test` dos veces consecutivas con el mismo resultado:

```
CORRIDA 1: tests 24 · pass 24 · fail 0
CORRIDA 2: tests 24 · pass 24 · fail 0
```

La salida completa de ambas corridas está en `13-salida-tests.txt` y la del suite end-to-end en `13-salida-smoke.txt`.

## Cambios respecto de la rama A

La rama B implementa el modelo del DER: las tablas `horarios`, `solicitudes_visita` y `novedades_donaciones` usan las columnas del diagrama, y se agregan `contactos`, `categorias_coleccion` y `materiales_bibliograficos` con sus claves foráneas. Los controllers traducen esos nombres al contrato que ya usaba el frontend, por eso las pruebas existentes siguen pasando sin cambios.

## Cómo reproducir

```bash
cd backend
npm install
npm test              # suite completa (unitaria + integración)
npm run test:unit     # solo unitarias
npm run test:integration
npm run test:smoke    # suite end-to-end anterior
```

La suite no requiere variables de entorno: define `DB_PATH`, `JWT_SECRET` y las credenciales del seed antes de importar el servidor, y usa una base temporal que elimina al terminar.
