"use strict";

const db = require("../config/db");

function getNovedadesPublicas(req, res, next) {
  try {
    const novedades = db.prepare(`
      SELECT * FROM novedades
      WHERE activa = 1
      ORDER BY orden ASC, created_at DESC
      LIMIT 3
    `).all();

    res.json({
      ok: true,
      data: novedades
    });
  } catch (err) {
    next(err);
  }
}

function getNovedadesAdmin(req, res, next) {
  try {
    const novedades = db.prepare("SELECT * FROM novedades ORDER BY orden ASC, created_at DESC").all();
    res.json({
      ok: true,
      data: novedades
    });
  } catch (err) {
    next(err);
  }
}

function crearNovedad(req, res, next) {
  try {
    const { categoria, categoria_color, fecha_texto, titulo, descripcion, orden } = req.body;

    if (!categoria || !titulo || !descripcion) {
      return res.status(400).json({
        ok: false,
        error: "Los campos categoría, título y descripción son obligatorios."
      });
    }

    const result = db.prepare(`
      INSERT INTO novedades (orden, categoria, categoria_color, fecha_texto, titulo, descripcion, activa)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `).run(
      parseInt(orden, 10) || 1,
      categoria.trim(),
      categoria_color || "#8b5e2b",
      fecha_texto ? fecha_texto.trim() : "Actualidad",
      titulo.trim(),
      descripcion.trim()
    );

    const nueva = db.prepare("SELECT * FROM novedades WHERE id = ?").get(result.lastInsertRowid);

    res.status(201).json({
      ok: true,
      mensaje: "Novedad publicada correctamente.",
      data: nueva
    });
  } catch (err) {
    next(err);
  }
}

function updateNovedad(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const { categoria, categoria_color, fecha_texto, titulo, descripcion, orden, activa } = req.body;

    const existente = db.prepare("SELECT * FROM novedades WHERE id = ?").get(id);
    if (!existente) {
      return res.status(404).json({
        ok: false,
        error: "Novedad no encontrada."
      });
    }

    db.prepare(`
      UPDATE novedades
      SET categoria = ?,
          categoria_color = ?,
          fecha_texto = ?,
          titulo = ?,
          descripcion = ?,
          orden = ?,
          activa = ?
      WHERE id = ?
    `).run(
      categoria ? categoria.trim() : existente.categoria,
      categoria_color || existente.categoria_color,
      fecha_texto ? fecha_texto.trim() : existente.fecha_texto,
      titulo ? titulo.trim() : existente.titulo,
      descripcion ? descripcion.trim() : existente.descripcion,
      typeof orden === "number" ? orden : existente.orden,
      typeof activa === "number" || typeof activa === "boolean" ? (activa ? 1 : 0) : existente.activa,
      id
    );

    const actualizada = db.prepare("SELECT * FROM novedades WHERE id = ?").get(id);

    res.json({
      ok: true,
      mensaje: "Novedad actualizada correctamente.",
      data: actualizada
    });
  } catch (err) {
    next(err);
  }
}

function deleteNovedad(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    db.prepare("DELETE FROM novedades WHERE id = ?").run(id);

    res.json({
      ok: true,
      mensaje: "Novedad eliminada correctamente."
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getNovedadesPublicas,
  getNovedadesAdmin,
  crearNovedad,
  updateNovedad,
  deleteNovedad
};
