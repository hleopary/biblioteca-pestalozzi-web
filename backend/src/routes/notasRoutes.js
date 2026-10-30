"use strict";

const express = require("express");
const router = express.Router();
const notasController = require("../controllers/notasController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Rutas protegidas para el bloc de notas de Betsabé
router.get("/", authenticateToken, notasController.getNotas);
router.put("/", authenticateToken, notasController.updateNotas);
router.delete("/", authenticateToken, notasController.deleteNotaById);

module.exports = router;
