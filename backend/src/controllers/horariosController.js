"use strict";

const db = require("../config/db");

function getHorarios(req, res, next) {
  try {
    const horarios = db.prepare("SELECT * FROM horarios ORDER BY dia_orden ASC").all();
    res.json({
      ok: true,
      data: horarios
    });
  } catch (err) {
    next(err);
  }
}

function updateHorarios(req, res, next) {
  try {
    const { horarios } = req.body;

    if (!Array.isArray(horarios)) {
      return res.status(400).json({
        ok: false,
        error: "Se esperaba un array de horarios con formato válido."
      });
    }

    const updateStmt = db.prepare(`
      UPDATE horarios
      SET horario_texto = ?, activo = ?, updated_at = CURRENT_TIMESTAMP
      WHERE dia_orden = ?
    `);

    for (const h of horarios) {
      if (typeof h.dia_orden === "number") {
        updateStmt.run(
          h.horario_texto || (h.activo ? "Abierto" : "Cerrado"),
          h.activo ? 1 : 0,
          h.dia_orden
        );
      }
    }

    const actualizados = db.prepare("SELECT * FROM horarios ORDER BY dia_orden ASC").all();

    res.json({
      ok: true,
      mensaje: "Cartelera de horarios actualizada con éxito.",
      data: actualizados
    });
  } catch (err) {
    next(err);
  }
}

function updateDiaIndividual(req, res, next) {
  try {
    const diaOrden = parseInt(req.params.diaOrden, 10);
    const { horario_texto, activo } = req.body;

    if (isNaN(diaOrden) || diaOrden < 1 || diaOrden > 6) {
      return res.status(400).json({
        ok: false,
        error: "Día inválido (debe ser entre 1 y 6)."
      });
    }

    db.prepare(`
      UPDATE horarios
      SET horario_texto = ?, activo = ?, updated_at = CURRENT_TIMESTAMP
      WHERE dia_orden = ?
    `).run(
      horario_texto || (activo ? "Abierto" : "Cerrado"),
      activo ? 1 : 0,
      diaOrden
    );

    const horarioActualizado = db.prepare("SELECT * FROM horarios WHERE dia_orden = ?").get(diaOrden);

    res.json({
      ok: true,
      mensaje: `Horario del día ${horarioActualizado.dia_nombre} actualizado.`,
      data: horarioActualizado
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getHorarios,
  updateHorarios,
  updateDiaIndividual
};
