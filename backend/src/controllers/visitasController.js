"use strict";

const db = require("../config/db");
const { notificarNuevaVisita } = require("../services/emailService");

function crearVisita(req, res, next) {
  try {
    const {
      institucion,
      responsable,
      telefono,
      email,
      nivel,
      alumnos_cant,
      fecha_preferida,
      turno,
      observaciones
    } = req.body;

    // Validación de campos obligatorios
    if (
      !institucion ||
      !responsable ||
      !telefono ||
      !email ||
      !nivel ||
      !alumnos_cant ||
      !fecha_preferida ||
      !turno
    ) {
      return res.status(400).json({
        ok: false,
        error: "Todos los campos principales del formulario son obligatorios."
      });
    }

    const cantidad = parseInt(alumnos_cant, 10);
    if (isNaN(cantidad) || cantidad <= 0) {
      return res.status(400).json({
        ok: false,
        error: "La cantidad de alumnos debe ser un número entero positivo."
      });
    }

    const result = db.prepare(`
      INSERT INTO visitas (
        institucion, responsable, telefono, email, nivel,
        alumnos_cant, fecha_preferida, turno, observaciones, estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendiente')
    `).run(
      institucion.trim(),
      responsable.trim(),
      telefono.trim(),
      email.trim(),
      nivel.trim(),
      cantidad,
      fecha_preferida.trim(),
      turno.trim(),
      observaciones ? observaciones.trim() : ""
    );

    const nuevaVisita = db.prepare("SELECT * FROM visitas WHERE id = ?").get(result.lastInsertRowid);

    // Disparar notificación por email asíncrona
    notificarNuevaVisita(nuevaVisita).catch((err) => {
      console.error("Error no bloqueante en notificación de visita:", err.message);
    });

    res.status(201).json({
      ok: true,
      mensaje: "Solicitud de visita escolar recibida correctamente. Nos contactaremos a la brevedad.",
      data: nuevaVisita
    });
  } catch (err) {
    next(err);
  }
}

function getVisitas(req, res, next) {
  try {
    const { estado } = req.query;
    let query = "SELECT * FROM visitas";
    const params = [];

    if (estado) {
      query += " WHERE estado = ?";
      params.push(estado);
    }

    query += " ORDER BY created_at DESC";

    const visitas = db.prepare(query).all(...params);

    res.json({
      ok: true,
      data: visitas
    });
  } catch (err) {
    next(err);
  }
}

function updateEstado(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const { estado } = req.body;

    const estadosValidos = ["pendiente", "confirmada", "rechazada", "realizada"];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        ok: false,
        error: `Estado inválido. Opciones válidas: ${estadosValidos.join(", ")}`
      });
    }

    db.prepare("UPDATE visitas SET estado = ? WHERE id = ?").run(estado, id);

    const visitaActualizada = db.prepare("SELECT * FROM visitas WHERE id = ?").get(id);

    if (!visitaActualizada) {
      return res.status(404).json({
        ok: false,
        error: "Solicitud de visita no encontrada."
      });
    }

    res.json({
      ok: true,
      mensaje: `Estado de la visita escolar actualizado a '${estado}'.`,
      data: visitaActualizada
    });
  } catch (err) {
    next(err);
  }
}

function deleteVisita(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    db.prepare("DELETE FROM visitas WHERE id = ?").run(id);

    res.json({
      ok: true,
      mensaje: "Solicitud eliminada con éxito."
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  crearVisita,
  getVisitas,
  updateEstado,
  deleteVisita
};
