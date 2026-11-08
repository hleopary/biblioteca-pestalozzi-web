"use strict";

const db = require("../config/db");
const { validarCamposObligatorios } = require("../utils/validators");

const SELECT_MATERIALES = `
  SELECT m.id_material AS id,
         m.titulo,
         m.autor,
         m.link_koha,
         m.link_greenstone,
         m.id_categoria,
         c.nombre AS categoria
  FROM materiales_bibliograficos m
  JOIN categorias_coleccion c ON c.id_categoria = m.id_categoria
`;

function getCategorias(req, res, next) {
  try {
    const categorias = db.prepare(`
      SELECT id_categoria AS id, nombre, descripcion
      FROM categorias_coleccion
      ORDER BY nombre ASC
    `).all();

    const materiales = db.prepare(`${SELECT_MATERIALES} ORDER BY m.titulo ASC`).all();

    const data = categorias.map((categoria) => ({
      ...categoria,
      materiales: materiales.filter((material) => material.id_categoria === categoria.id)
    }));

    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

function getMateriales(req, res, next) {
  try {
    const materiales = db.prepare(`${SELECT_MATERIALES} ORDER BY m.id_categoria ASC, m.titulo ASC`).all();
    res.json({ ok: true, data: materiales });
  } catch (err) {
    next(err);
  }
}

function crearCategoria(req, res, next) {
  try {
    const { nombre, descripcion } = req.body;

    if (!validarCamposObligatorios(req.body, ["nombre"]).ok) {
      return res.status(400).json({ ok: false, error: "El nombre de la categoría es obligatorio." });
    }

    const resultado = db.prepare(`
      INSERT INTO categorias_coleccion (nombre, descripcion) VALUES (?, ?)
    `).run(nombre.trim(), descripcion ? descripcion.trim() : null);

    const creada = db.prepare("SELECT id_categoria AS id, nombre, descripcion FROM categorias_coleccion WHERE id_categoria = ?")
      .get(resultado.lastInsertRowid);

    res.status(201).json({ ok: true, mensaje: "Categoría creada correctamente.", data: creada });
  } catch (err) {
    if (String(err.message).includes("UNIQUE")) {
      return res.status(400).json({ ok: false, error: "Ya existe una categoría con ese nombre." });
    }
    next(err);
  }
}

function actualizarCategoria(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const { nombre, descripcion } = req.body;

    const existente = db.prepare("SELECT id_categoria AS id, nombre, descripcion FROM categorias_coleccion WHERE id_categoria = ?").get(id);
    if (!existente) {
      return res.status(404).json({ ok: false, error: "Categoría no encontrada." });
    }

    db.prepare("UPDATE categorias_coleccion SET nombre = ?, descripcion = ? WHERE id_categoria = ?").run(
      nombre ? nombre.trim() : existente.nombre,
      descripcion !== undefined ? (descripcion ? descripcion.trim() : null) : existente.descripcion,
      id
    );

    const actualizada = db.prepare("SELECT id_categoria AS id, nombre, descripcion FROM categorias_coleccion WHERE id_categoria = ?").get(id);
    res.json({ ok: true, mensaje: "Categoría actualizada correctamente.", data: actualizada });
  } catch (err) {
    if (String(err.message).includes("UNIQUE")) {
      return res.status(400).json({ ok: false, error: "Ya existe una categoría con ese nombre." });
    }
    next(err);
  }
}

function eliminarCategoria(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);

    const tieneMateriales = db.prepare("SELECT COUNT(*) AS c FROM materiales_bibliograficos WHERE id_categoria = ?").get(id).c;
    if (tieneMateriales > 0) {
      return res.status(400).json({
        ok: false,
        error: "No se puede eliminar la categoría porque tiene materiales asociados."
      });
    }

    db.prepare("DELETE FROM categorias_coleccion WHERE id_categoria = ?").run(id);
    res.json({ ok: true, mensaje: "Categoría eliminada correctamente." });
  } catch (err) {
    next(err);
  }
}

function crearMaterial(req, res, next) {
  try {
    const { titulo, autor, link_koha, link_greenstone, id_categoria } = req.body;

    if (!validarCamposObligatorios(req.body, ["titulo", "id_categoria"]).ok) {
      return res.status(400).json({ ok: false, error: "El título y la categoría son obligatorios." });
    }

    const categoria = db.prepare("SELECT 1 AS existe FROM categorias_coleccion WHERE id_categoria = ?").get(Number(id_categoria));
    if (!categoria) {
      return res.status(400).json({ ok: false, error: "La categoría indicada no existe." });
    }

    const resultado = db.prepare(`
      INSERT INTO materiales_bibliograficos (titulo, autor, link_koha, link_greenstone, id_categoria)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      titulo.trim(),
      autor ? autor.trim() : null,
      link_koha ? link_koha.trim() : "",
      link_greenstone ? link_greenstone.trim() : "",
      Number(id_categoria)
    );

    const creado = db.prepare(`${SELECT_MATERIALES} WHERE m.id_material = ?`).get(resultado.lastInsertRowid);
    res.status(201).json({ ok: true, mensaje: "Material creado correctamente.", data: creado });
  } catch (err) {
    next(err);
  }
}

function actualizarMaterial(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const { titulo, autor, link_koha, link_greenstone, id_categoria } = req.body;

    const existente = db.prepare(`${SELECT_MATERIALES} WHERE m.id_material = ?`).get(id);
    if (!existente) {
      return res.status(404).json({ ok: false, error: "Material no encontrado." });
    }

    if (id_categoria !== undefined) {
      const categoria = db.prepare("SELECT 1 AS existe FROM categorias_coleccion WHERE id_categoria = ?").get(Number(id_categoria));
      if (!categoria) {
        return res.status(400).json({ ok: false, error: "La categoría indicada no existe." });
      }
    }

    db.prepare(`
      UPDATE materiales_bibliograficos
      SET titulo = ?, autor = ?, link_koha = ?, link_greenstone = ?, id_categoria = ?
      WHERE id_material = ?
    `).run(
      titulo ? titulo.trim() : existente.titulo,
      autor !== undefined ? (autor ? autor.trim() : null) : existente.autor,
      link_koha !== undefined ? (link_koha || "") : existente.link_koha,
      link_greenstone !== undefined ? (link_greenstone || "") : existente.link_greenstone,
      id_categoria !== undefined ? Number(id_categoria) : existente.id_categoria,
      id
    );

    const actualizado = db.prepare(`${SELECT_MATERIALES} WHERE m.id_material = ?`).get(id);
    res.json({ ok: true, mensaje: "Material actualizado correctamente.", data: actualizado });
  } catch (err) {
    next(err);
  }
}

function eliminarMaterial(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    db.prepare("DELETE FROM materiales_bibliograficos WHERE id_material = ?").run(id);
    res.json({ ok: true, mensaje: "Material eliminado correctamente." });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCategorias,
  getMateriales,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  crearMaterial,
  actualizarMaterial,
  eliminarMaterial
};
