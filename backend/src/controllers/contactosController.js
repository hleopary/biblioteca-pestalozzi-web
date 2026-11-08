"use strict";

const db = require("../config/db");
const { validarCamposObligatorios, validarEmail } = require("../utils/validators");

const CAMPOS_OBLIGATORIOS = ["nombre", "email", "mensaje"];

const SELECT_CONTACTOS = `
  SELECT id_contacto AS id,
         nombre,
         email,
         telefono,
         mensaje,
         fecha_envio
  FROM contactos
`;

function crearContacto(req, res, next) {
  try {
    const { nombre, email, telefono, mensaje } = req.body;

    if (!validarCamposObligatorios(req.body, CAMPOS_OBLIGATORIOS).ok) {
      return res.status(400).json({
        ok: false,
        error: "Los campos nombre, correo y mensaje son obligatorios."
      });
    }

    const emailValido = validarEmail(email);
    if (!emailValido.ok) {
      return res.status(400).json({
        ok: false,
        error: emailValido.error
      });
    }

    const resultado = db.prepare(`
      INSERT INTO contactos (nombre, email, telefono, mensaje)
      VALUES (?, ?, ?, ?)
    `).run(
      nombre.trim(),
      email.trim(),
      telefono ? telefono.trim() : null,
      mensaje.trim()
    );

    const creado = db.prepare(`${SELECT_CONTACTOS} WHERE id_contacto = ?`).get(resultado.lastInsertRowid);

    res.status(201).json({
      ok: true,
      mensaje: "Consulta recibida correctamente. Te responderemos a la brevedad.",
      data: creado
    });
  } catch (err) {
    next(err);
  }
}

function getContactos(req, res, next) {
  try {
    const contactos = db.prepare(`${SELECT_CONTACTOS} ORDER BY fecha_envio DESC`).all();

    res.json({
      ok: true,
      data: contactos
    });
  } catch (err) {
    next(err);
  }
}

function deleteContacto(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    db.prepare("DELETE FROM contactos WHERE id_contacto = ?").run(id);

    res.json({
      ok: true,
      mensaje: "Consulta eliminada correctamente."
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  crearContacto,
  getContactos,
  deleteContacto
};
