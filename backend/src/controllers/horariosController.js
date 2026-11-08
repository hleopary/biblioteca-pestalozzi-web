"use strict";

const db = require("../config/db");

// La base usa el modelo del DER (dias_atencion, rango_horario, cuatrimestre).
// La API mantiene el contrato que ya consume el frontend y agrega cuatrimestre.
const SELECT_HORARIOS = `
  SELECT id_horario AS id,
         dia_orden,
         dias_atencion AS dia_nombre,
         rango_horario AS horario_texto,
         cuatrimestre,
         CASE WHEN lower(trim(rango_horario)) = 'cerrado' THEN 0 ELSE 1 END AS activo
  FROM horarios
`;

function listarHorarios() {
  return db.prepare(`${SELECT_HORARIOS} ORDER BY dia_orden ASC`).all();
}

function getHorarios(req, res, next) {
  try {
    res.json({
      ok: true,
      data: listarHorarios()
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
      SET rango_horario = ?, updated_at = CURRENT_TIMESTAMP
      WHERE dia_orden = ?
    `);

    for (const h of horarios) {
      if (typeof h.dia_orden === "number") {
        const rango = h.activo ? (h.horario_texto || "Abierto") : "Cerrado";
        updateStmt.run(rango, h.dia_orden);
      }
    }

    res.json({
      ok: true,
      mensaje: "Cartelera de horarios actualizada con éxito.",
      data: listarHorarios()
    });
  } catch (err) {
    next(err);
  }
}

function updateDiaIndividual(req, res, next) {
  try {
    const diaOrden = parseInt(req.params.diaOrden, 10);
    const { horario_texto, activo } = req.body;

    if (isNaN(diaOrden)) {
      return res.status(400).json({
        ok: false,
        error: "Día inválido: se esperaba un número."
      });
    }

    const existe = db.prepare("SELECT 1 AS existe FROM horarios WHERE dia_orden = ?").get(diaOrden);
    if (!existe) {
      return res.status(400).json({
        ok: false,
        error: "Día inválido: no existe en la cartelera."
      });
    }

    const rango = activo ? (horario_texto || "Abierto") : "Cerrado";

    db.prepare(`
      UPDATE horarios
      SET rango_horario = ?, updated_at = CURRENT_TIMESTAMP
      WHERE dia_orden = ?
    `).run(rango, diaOrden);

    const horarioActualizado = db.prepare(`${SELECT_HORARIOS} WHERE dia_orden = ?`).get(diaOrden);

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
