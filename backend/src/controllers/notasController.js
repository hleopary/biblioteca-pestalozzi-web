"use strict";

const db = require("../config/db");

function getNotas(req, res, next) {
  try {
    const nota = db.prepare("SELECT contenido, updated_at FROM notas WHERE id = 1").get();
    res.json({
      ok: true,
      data: nota || { contenido: "", updated_at: null }
    });
  } catch (err) {
    next(err);
  }
}

function updateNotas(req, res, next) {
  try {
    const { contenido } = req.body;
    const texto = typeof contenido === "string" ? contenido : "";

    db.prepare(`
      UPDATE notas
      SET contenido = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `).run(texto);

    const notaActualizada = db.prepare("SELECT contenido, updated_at FROM notas WHERE id = 1").get();

    res.json({
      ok: true,
      mensaje: "Notas guardadas correctamente.",
      data: notaActualizada
    });
  } catch (err) {
    next(err);
  }
}

function deleteNotaById(req, res, next) {
  try {
    const id = req.params.id;
    db.prepare("DELETE FROM notas WHERE id = ?").run(id);
    res.json({
      ok: true,
      mensaje: "Notas eliminadas correctamente."
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getNotas,
  updateNotas,
  deleteNotaById
};
