"use strict";

const db = require("../config/db");
const { validarCamposObligatorios } = require("../utils/validators");

// La tabla sigue el DER (NOVEDADES_DONACIONES); la API mantiene los nombres
// que consume el frontend y agrega id_horario como vínculo opcional.
const SELECT_NOVEDADES = `
  SELECT id_novedad AS id,
         titulo,
         contenido AS descripcion,
         fecha_publicacion AS fecha_texto,
         id_horario,
         orden,
         categoria,
         categoria_color,
         activa,
         created_at
  FROM novedades_donaciones
`;

function horarioExiste(idHorario) {
  if (idHorario === null || idHorario === undefined || idHorario === "") return true;
  const fila = db.prepare("SELECT 1 AS existe FROM horarios WHERE id_horario = ?").get(Number(idHorario));
  return Boolean(fila);
}

function getNovedadesPublicas(req, res, next) {
  try {
    const novedades = db.prepare(`${SELECT_NOVEDADES} WHERE activa = 1 ORDER BY orden ASC, created_at DESC`).all();

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
    const novedades = db.prepare(`${SELECT_NOVEDADES} ORDER BY orden ASC, created_at DESC`).all();
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
    const { categoria, categoria_color, fecha_texto, titulo, descripcion, orden, id_horario } = req.body;

    if (!validarCamposObligatorios(req.body, ["categoria", "titulo", "descripcion"]).ok) {
      return res.status(400).json({
        ok: false,
        error: "Los campos categoría, título y descripción son obligatorios."
      });
    }

    if (!horarioExiste(id_horario)) {
      return res.status(400).json({
        ok: false,
        error: "El día de atención indicado no existe."
      });
    }

    const result = db.prepare(`
      INSERT INTO novedades_donaciones
        (titulo, contenido, fecha_publicacion, id_horario, orden, categoria, categoria_color, activa)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `).run(
      titulo.trim(),
      descripcion.trim(),
      fecha_texto ? fecha_texto.trim() : "Actualidad",
      id_horario ? Number(id_horario) : null,
      parseInt(orden, 10) || 1,
      categoria.trim(),
      categoria_color || "#8b5e2b"
    );

    const nueva = db.prepare(`${SELECT_NOVEDADES} WHERE id_novedad = ?`).get(result.lastInsertRowid);

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
    const { categoria, categoria_color, fecha_texto, titulo, descripcion, orden, activa, id_horario } = req.body;

    const existente = db.prepare(`${SELECT_NOVEDADES} WHERE id_novedad = ?`).get(id);
    if (!existente) {
      return res.status(404).json({
        ok: false,
        error: "Novedad no encontrada."
      });
    }

    if (!horarioExiste(id_horario)) {
      return res.status(400).json({
        ok: false,
        error: "El día de atención indicado no existe."
      });
    }

    db.prepare(`
      UPDATE novedades_donaciones
      SET titulo = ?,
          contenido = ?,
          fecha_publicacion = ?,
          id_horario = ?,
          categoria = ?,
          categoria_color = ?,
          orden = ?,
          activa = ?
      WHERE id_novedad = ?
    `).run(
      titulo ? titulo.trim() : existente.titulo,
      descripcion ? descripcion.trim() : existente.descripcion,
      fecha_texto ? fecha_texto.trim() : existente.fecha_texto,
      id_horario !== undefined ? (id_horario ? Number(id_horario) : null) : existente.id_horario,
      categoria ? categoria.trim() : existente.categoria,
      categoria_color || existente.categoria_color,
      typeof orden === "number" ? orden : existente.orden,
      typeof activa === "number" || typeof activa === "boolean" ? (activa ? 1 : 0) : existente.activa,
      id
    );

    const actualizada = db.prepare(`${SELECT_NOVEDADES} WHERE id_novedad = ?`).get(id);

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
    db.prepare("DELETE FROM novedades_donaciones WHERE id_novedad = ?").run(id);

    res.json({
      ok: true,
      mensaje: "Novedad eliminada correctamente."
    });
  } catch (err) {
    next(err);
  }
}

function reordenarNovedades(req, res, next) {
  try {
    const { ordenIds } = req.body;
    if (!Array.isArray(ordenIds) || ordenIds.length === 0) {
      return res.status(400).json({
        ok: false,
        error: "Se requiere un array 'ordenIds' con los identificadores en el nuevo orden."
      });
    }

    const stmt = db.prepare("UPDATE novedades_donaciones SET orden = ? WHERE id_novedad = ?");
    ordenIds.forEach((id, index) => {
      stmt.run(index + 1, parseInt(id, 10));
    });

    const novedadesActualizadas = db.prepare(`${SELECT_NOVEDADES} ORDER BY orden ASC, created_at DESC`).all();

    res.json({
      ok: true,
      mensaje: "Novedades reordenadas exitosamente.",
      data: novedadesActualizadas
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
  reordenarNovedades,
  deleteNovedad
};
