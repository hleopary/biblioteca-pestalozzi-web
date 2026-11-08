"use strict";

const express = require("express");
const router = express.Router();
const horariosController = require("../controllers/horariosController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Ruta pública para la landing
router.get("/", horariosController.getHorarios);

// Rutas protegidas para administración de horarios
router.put("/", authenticateToken, horariosController.updateHorarios);
router.patch("/:diaOrden", authenticateToken, horariosController.updateDiaIndividual);

module.exports = router;
