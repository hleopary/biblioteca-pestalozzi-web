"use strict";

const express = require("express");
const router = express.Router();
const novedadesController = require("../controllers/novedadesController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Ruta pública para la landing
router.get("/", novedadesController.getNovedadesPublicas);

// Rutas protegidas para administración de novedades
router.get("/admin", authenticateToken, novedadesController.getNovedadesAdmin);
router.post("/", authenticateToken, novedadesController.crearNovedad);
router.put("/:id", authenticateToken, novedadesController.updateNovedad);
router.delete("/:id", authenticateToken, novedadesController.deleteNovedad);

module.exports = router;
