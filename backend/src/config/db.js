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

// Inicializar tablas si no existen a partir del esquema versionado en db/schema.sql
const schemaPath = path.resolve(__dirname, "../../../db/schema.sql");
db.exec(fs.readFileSync(schemaPath, "utf-8"));

module.exports = db;
