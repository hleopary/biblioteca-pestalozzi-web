"use strict";

const express = require("express");
const router = express.Router();
const visitasController = require("../controllers/visitasController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Ruta pública de envío desde el formulario
router.post("/", visitasController.crearVisita);

// Rutas protegidas para administración de solicitudes
router.get("/", authenticateToken, visitasController.getVisitas);
router.patch("/:id/estado", authenticateToken, visitasController.updateEstado);
router.delete("/:id", authenticateToken, visitasController.deleteVisita);

module.exports = router;
