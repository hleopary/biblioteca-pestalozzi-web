"use strict";

const express = require("express");
const router = express.Router();
const catalogosController = require("../controllers/catalogosController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Lectura pública: el sitio muestra las colecciones y sus materiales.
router.get("/categorias", catalogosController.getCategorias);
router.get("/materiales", catalogosController.getMateriales);

// Escritura: solo desde el panel.
router.post("/categorias", authenticateToken, catalogosController.crearCategoria);
router.put("/categorias/:id", authenticateToken, catalogosController.actualizarCategoria);
router.delete("/categorias/:id", authenticateToken, catalogosController.eliminarCategoria);

router.post("/materiales", authenticateToken, catalogosController.crearMaterial);
router.put("/materiales/:id", authenticateToken, catalogosController.actualizarMaterial);
router.delete("/materiales/:id", authenticateToken, catalogosController.eliminarMaterial);

module.exports = router;
