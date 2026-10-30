"use strict";

const db = require("./db");
const bcrypt = require("bcryptjs");
require("dotenv").config();

function seedDatabase() {
  console.log("Iniciando sembrado de datos en la base de datos Pestalozzi...");

  // 1. Usuario Administrador (Betsabé)
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

    console.log(`✓ Usuario admin inicial creado: "${adminUser}" con contraseña por defecto.`);
  }

  // 2. Horarios Iniciales
  const horariosCount = db.prepare("SELECT COUNT(*) as count FROM horarios").get().count;
  if (horariosCount === 0) {
    const defaultHorarios = [
      { orden: 1, dia: "Lunes", horario: "Cerrado", activo: 0 },
      { orden: 2, dia: "Martes", horario: "16:00 – 18:00", activo: 1 },
      { orden: 3, dia: "Miércoles", horario: "10:00 – 12:00", activo: 1 },
      { orden: 4, dia: "Jueves", horario: "Cerrado", activo: 0 },
      { orden: 5, dia: "Viernes", horario: "Cerrado", activo: 0 },
      { orden: 6, dia: "Sábado", horario: "Cerrado", activo: 0 }
    ];

    const insertHorario = db.prepare(`
      INSERT INTO horarios (dia_orden, dia_nombre, horario_texto, activo)
      VALUES (?, ?, ?, ?)
    `);

    for (const h of defaultHorarios) {
      insertHorario.run(h.orden, h.dia, h.horario, h.activo);
    }
    console.log("✓ Grilla de horarios inicial cargada con éxito.");
  }

  // 3. Novedades Iniciales
  const novedadesCount = db.prepare("SELECT COUNT(*) as count FROM novedades").get().count;
  if (novedadesCount === 0) {
    const defaultNovedades = [
      {
        orden: 1,
        categoria: "Donación provincial",
        categoria_color: "#8b5e2b",
        fecha: "Agosto 2025",
        titulo: "85 nuevos títulos de literatura argentina",
        descripcion: "El Ministerio de Educación de la Provincia de Buenos Aires donó una colección de 85 libros de autores nacionales, incluyendo obras de narrativa, poesía y ensayo.",
        activa: 1
      },
      {
        orden: 2,
        categoria: "Recomendación de la semana",
        categoria_color: "#6b1d2b",
        fecha: "Septiembre 2025",
        titulo: "“El Eternauta” – H.G. Oesterheld",
        descripcion: "Clásico imprescindible de la historieta argentina. Disponible en nuestra sala de lectura para consulta en el local.",
        activa: 1
      },
      {
        orden: 3,
        categoria: "Donación de socios",
        categoria_color: "#3d5a3e",
        fecha: "Octubre 2025",
        titulo: "Fondo de colectividades: 40 nuevas incorporaciones",
        descripcion: "Gracias a la generosidad de familias de la comunidad italiana y española de Berisso, incorporamos nuevos materiales a la colección de colectividades de inmigrantes.",
        activa: 1
      }
    ];

    const insertNovedad = db.prepare(`
      INSERT INTO novedades (orden, categoria, categoria_color, fecha_texto, titulo, descripcion, activa)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const n of defaultNovedades) {
      insertNovedad.run(n.orden, n.categoria, n.categoria_color, n.fecha, n.titulo, n.descripcion, n.activa);
    }
    console.log("✓ Novedades iniciales de la biblioteca cargadas.");
  }

  console.log("Base de datos lista y sincronizada.");
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
