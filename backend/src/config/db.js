"use strict";

const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");
const fs = require("node:fs");
require("dotenv").config();

const dbPath = path.resolve(process.cwd(), process.env.DB_PATH || "./data/pestalozzi.db");
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new DatabaseSync(dbPath);

// Integridad referencial del DER (las FK se aplican en cada conexión)
db.exec("PRAGMA foreign_keys = ON;");

// Compatibilidad entre modelos: la rama B cambió las columnas de horarios.
// Si la base tiene el esquema anterior, se recrea vacía. Solo es seguro porque
// la base contiene datos de ejemplo; con datos reales hace falta una migración.
function esquemaAnterior() {
  const tabla = db.prepare(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'horarios'"
  ).get();
  if (!tabla) return false;

  const columnas = db.prepare("PRAGMA table_info(horarios)").all().map((c) => c.name);
  return !columnas.includes("id_horario");
}

if (esquemaAnterior()) {
  console.warn(
    "Esquema anterior detectado: se recrea la base con el modelo del DER. " +
    "Los datos existentes se pierden (son de ejemplo)."
  );
  const tablas = db.prepare(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'"
  ).all();

  db.exec("PRAGMA foreign_keys = OFF;");
  for (const { name } of tablas) {
    db.exec(`DROP TABLE IF EXISTS "${name}";`);
  }
  db.exec("PRAGMA foreign_keys = ON;");
}

// Inicializar tablas si no existen a partir del esquema versionado en db/schema.sql
const schemaPath = path.resolve(__dirname, "../../../db/schema.sql");
db.exec(fs.readFileSync(schemaPath, "utf-8"));

module.exports = db;
