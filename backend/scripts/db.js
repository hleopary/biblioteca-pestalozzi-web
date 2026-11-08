"use strict";

/**
 * Utilidades de base de datos para el proyecto.
 *
 *   node scripts/db.js migrate   aplica db/schema.sql
 *   node scripts/db.js seed      aplica db/seed.sql y crea el usuario admin
 *   node scripts/db.js reset     borra la base y la recrea desde cero
 *   node scripts/db.js dump      genera db/dump.sql con esquema y datos
 *   node scripts/db.js restore   restaura desde db/dump.sql (o un archivo dado)
 *
 * La ruta de la base sale de DB_PATH (backend/.env) y, si no está definida,
 * usa ./data/pestalozzi.db relativo al directorio actual.
 */

const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");
require("dotenv").config();

const RAIZ = path.resolve(__dirname, "../..");
const schemaPath = path.join(RAIZ, "db/schema.sql");
const seedPath = path.join(RAIZ, "db/seed.sql");
const dumpPath = path.join(RAIZ, "db/dump.sql");

function rutaBase() {
  return path.resolve(process.cwd(), process.env.DB_PATH || "./data/pestalozzi.db");
}

function borrarArchivosDeBase() {
  const base = rutaBase();
  for (const archivo of [base, `${base}-journal`, `${base}-wal`, `${base}-shm`]) {
    fs.rmSync(archivo, { force: true });
  }
}

function abrirBase() {
  const base = rutaBase();
  fs.mkdirSync(path.dirname(base), { recursive: true });
  return new DatabaseSync(base);
}

function migrar() {
  const db = abrirBase();
  db.exec(fs.readFileSync(schemaPath, "utf-8"));
  db.close();
  console.log(`✓ Esquema aplicado desde ${path.relative(RAIZ, schemaPath)}`);
}

function sembrar() {
  // El seeder aplica el esquema, el seed y crea el usuario administrador.
  const seedDatabase = require("../src/config/seeder");
  seedDatabase();
}

function valorSql(valor) {
  if (valor === null || valor === undefined) return "NULL";
  if (typeof valor === "bigint") return valor.toString();
  if (typeof valor === "number") return Number.isFinite(valor) ? String(valor) : "NULL";
  if (valor instanceof Uint8Array) return `X'${Buffer.from(valor).toString("hex")}'`;
  return `'${String(valor).replace(/'/g, "''")}'`;
}

function generarDump() {
  migrar();

  const db = abrirBase();
  const tablas = db
    .prepare("SELECT name, sql FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
    .all();

  const lineas = [
    "-- Dump generado por backend/scripts/db.js",
    `-- Fecha: ${new Date().toISOString()}`,
    "PRAGMA foreign_keys=OFF;",
    "BEGIN TRANSACTION;"
  ];

  for (const tabla of tablas) {
    lineas.push(`DROP TABLE IF EXISTS "${tabla.name}";`);
    lineas.push(`${tabla.sql};`);
  }

  for (const tabla of tablas) {
    const filas = db.prepare(`SELECT * FROM "${tabla.name}"`).all();
    for (const fila of filas) {
      const columnas = Object.keys(fila);
      const valores = columnas.map((columna) => valorSql(fila[columna]));
      lineas.push(
        `INSERT INTO "${tabla.name}" (${columnas.map((c) => `"${c}"`).join(", ")}) VALUES (${valores.join(", ")});`
      );
    }
  }

  lineas.push("COMMIT;", "");
  db.close();

  fs.writeFileSync(dumpPath, lineas.join("\n"), "utf-8");
  console.log(`✓ Dump generado en ${path.relative(RAIZ, dumpPath)} (${tablas.length} tablas)`);
}

function restaurar(archivo) {
  const origen = archivo ? path.resolve(process.cwd(), archivo) : dumpPath;

  if (!fs.existsSync(origen)) {
    console.error(`✗ No existe el archivo a restaurar: ${origen}`);
    console.error("  Generá uno primero con: npm run db:dump");
    process.exitCode = 1;
    return;
  }

  borrarArchivosDeBase();

  const db = abrirBase();
  db.exec(fs.readFileSync(origen, "utf-8"));
  db.close();

  console.log(`✓ Base restaurada desde ${path.relative(RAIZ, origen) || origen}`);
}

function reiniciar() {
  borrarArchivosDeBase();
  console.log("✓ Archivos de base eliminados");
  sembrar();
}

function contarFilas() {
  const db = abrirBase();
  const tablas = db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
    .all();

  for (const tabla of tablas) {
    const total = db.prepare(`SELECT COUNT(*) AS c FROM "${tabla.name}"`).get().c;
    console.log(`  ${tabla.name.padEnd(12)} ${total}`);
  }

  db.close();
}

const comando = process.argv[2];

switch (comando) {
  case "migrate":
    migrar();
    break;
  case "seed":
    sembrar();
    break;
  case "reset":
    reiniciar();
    break;
  case "dump":
    generarDump();
    break;
  case "restore":
    restaurar(process.argv[3]);
    break;
  case "count":
    contarFilas();
    break;
  default:
    console.log(`Uso: node scripts/db.js <comando>

Comandos:
  migrate            aplica db/schema.sql
  seed               aplica db/seed.sql y crea el usuario administrador
  reset              borra la base y la recrea desde cero
  dump               genera db/dump.sql con esquema y datos
  restore [archivo]  restaura desde db/dump.sql o desde el archivo indicado
  count              muestra la cantidad de filas por tabla`);
    if (!comando) process.exitCode = 1;
}
