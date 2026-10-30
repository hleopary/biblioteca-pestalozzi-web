"use strict";

const express = require("express");
const cors = require("cors");
const path = require("node:path");
require("dotenv").config();

// Inicialización de base de datos y seeder
const seedDatabase = require("./src/config/seeder");
seedDatabase();

// Rutas
const authRoutes = require("./src/routes/authRoutes");
const horariosRoutes = require("./src/routes/horariosRoutes");
const visitasRoutes = require("./src/routes/visitasRoutes");
const novedadesRoutes = require("./src/routes/novedadesRoutes");
const notasRoutes = require("./src/routes/notasRoutes");
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint de verificación de salud
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    servicio: "Biblioteca Pestalozzi API REST",
    estado: "activo",
    timestamp: new Date().toISOString()
  });
});

// Enrutamiento de la API REST
app.use("/api/auth", authRoutes);
app.use("/api/horarios", horariosRoutes);
app.use("/api/visitas", visitasRoutes);
app.use("/api/novedades", novedadesRoutes);
app.use("/api/notas", notasRoutes);

// Servir archivos estáticos del frontend (landing + admin) para desarrollo o despliegue conjunto
const frontendPath = path.resolve(__dirname, "..");
app.use(express.static(frontendPath));

// Manejo centralizado de errores
app.use(errorHandler);

// Iniciar servidor solo si se ejecuta directamente
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  Biblioteca Popular Pestalozzi - Servidor Activo`);
    console.log(`  API disponible en: http://localhost:${PORT}/api/health`);
    console.log(`  Sitio web público: http://localhost:${PORT}/index.html`);
    console.log(`  Panel Betsabé:     http://localhost:${PORT}/admin.html`);
    console.log(`====================================================`);
  });
}

module.exports = app;
