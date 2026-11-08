"use strict";

const fs = require("node:fs");
const path = require("node:path");
const bcrypt = require("bcryptjs");
const db = require("./db");
require("dotenv").config();

const seedPath = path.resolve(__dirname, "../../../db/seed.sql");

/**
 * Siembra el contenido inicial (horarios, novedades y nota) desde
 * db/seed.sql y crea el usuario administrador si todavía no existe.
 *
 * El seed SQL es idempotente, pero solo se aplica cuando la base está vacía:
 * así una novedad u horario borrado a propósito desde el panel no reaparece
 * en el siguiente arranque.
 */
function seedDatabase() {
  console.log("Iniciando sembrado de datos en la base de datos Pestalozzi...");

  const horariosCount = db.prepare("SELECT COUNT(*) as count FROM horarios").get().count;
  const novedadesCount = db.prepare("SELECT COUNT(*) as count FROM novedades_donaciones").get().count;

  if (horariosCount === 0 || novedadesCount === 0) {
    const seedSql = fs.readFileSync(seedPath, "utf-8");
    db.exec(seedSql);
    console.log("✓ Contenido inicial cargado desde db/seed.sql.");
  } else {
    // La nota es una fila única que el panel espera encontrar siempre.
    db.exec("INSERT OR IGNORE INTO notas (id, contenido) VALUES (1, '');");
  }

  // Usuario Administrador (Betsabé)
  const userCount = db.prepare("SELECT COUNT(*) as count FROM usuarios").get().count;

  if (userCount === 0) {
    const adminUser = process.env.ADMIN_USER || "betsabe";
    const adminPass = process.env.ADMIN_PASS || "pestalozzi2026";
    const adminEmail = process.env.ADMIN_EMAIL || "bibliotecapestalozzi.berisso@gmail.com";
    const hash = bcrypt.hashSync(adminPass, 10);

    db.prepare(`
      INSERT INTO usuarios (username, password_hash, nombre, email)
      VALUES (?, ?, ?, ?)
    `).run(adminUser, hash, "Betsabé Cruz (Bibliotecaria)", adminEmail);

    console.log(`✓ Usuario admin inicial creado: "${adminUser}".`);
  }

  console.log("Base de datos lista y sincronizada.");
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
