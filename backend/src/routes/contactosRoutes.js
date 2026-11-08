"use strict";

const express = require("express");
const router = express.Router();
const contactosController = require("../controllers/contactosController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// El alta es pública (formulario de consulta); la lectura y el borrado son del panel.
router.post("/", contactosController.crearContacto);
router.get("/", authenticateToken, contactosController.getContactos);
router.delete("/:id", authenticateToken, contactosController.deleteContacto);

module.exports = router;
