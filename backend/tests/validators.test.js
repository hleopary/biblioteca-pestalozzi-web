"use strict";

/**
 * Pruebas unitarias de las validaciones puras.
 *
 * Cubren las tres reglas que pide la issue #13: campos obligatorios,
 * duplicados y formato/orden del rango horario. No tocan la base ni la red.
 */

const { test } = require("node:test");
const assert = require("node:assert/strict");

const {
  esTextoNoVacio,
  validarCamposObligatorios,
  validarEmail,
  parseRangoHorario,
  validarRangoHorario,
  esDuplicado
} = require("../src/utils/validators");

test("esTextoNoVacio: distingue contenido real de vacío o solo espacios", () => {
  assert.equal(esTextoNoVacio("Hola"), true);
  assert.equal(esTextoNoVacio("  "), false);
  assert.equal(esTextoNoVacio(""), false);
  assert.equal(esTextoNoVacio(null), false);
  assert.equal(esTextoNoVacio(123), false);
});

test("validarCamposObligatorios: acepta cuando todos los campos tienen contenido", () => {
  const resultado = validarCamposObligatorios(
    { categoria: "Donación", titulo: "Libros nuevos", descripcion: "Detalle" },
    ["categoria", "titulo", "descripcion"]
  );

  assert.equal(resultado.ok, true);
  assert.deepEqual(resultado.faltantes, []);
});

test("validarCamposObligatorios: rechaza vacíos y nombra cada campo faltante", () => {
  const resultado = validarCamposObligatorios(
    { categoria: "   ", titulo: "Libros nuevos" },
    ["categoria", "titulo", "descripcion"]
  );

  assert.equal(resultado.ok, false);
  assert.deepEqual(resultado.faltantes, ["categoria", "descripcion"]);
  assert.match(resultado.error, /categoria/);
  assert.match(resultado.error, /descripcion/);
});

test("validarCamposObligatorios: acepta valores numéricos como campo presente", () => {
  const resultado = validarCamposObligatorios(
    { institucion: "Escuela", alumnos_cant: 28 },
    ["institucion", "alumnos_cant"]
  );

  assert.equal(resultado.ok, true);
  assert.deepEqual(resultado.faltantes, []);
});

test("validarEmail: acepta formatos válidos y rechaza los inválidos", () => {
  assert.equal(validarEmail("docente@escuela12.edu.ar").ok, true);

  for (const invalido of ["", "   ", "sin-arroba", "a@b", "a@b.", "@b.com"]) {
    assert.equal(validarEmail(invalido).ok, false, `debería rechazar: ${invalido}`);
  }
});

test("parseRangoHorario: convierte el rango a minutos desde las 00:00", () => {
  assert.deepEqual(parseRangoHorario("16:00 – 18:00"), { inicio: 960, fin: 1080 });
  assert.deepEqual(parseRangoHorario("09:30-11:00"), { inicio: 570, fin: 660 });
  assert.deepEqual(parseRangoHorario("10:00 a 12:00"), { inicio: 600, fin: 720 });
  assert.equal(parseRangoHorario("Cerrado"), null);
});

test("validarRangoHorario: acepta rangos bien formados y con apertura anterior al cierre", () => {
  const resultado = validarRangoHorario("16:00 – 18:00");

  assert.equal(resultado.ok, true);
  assert.equal(resultado.inicio, 960);
  assert.equal(resultado.fin, 1080);
});

test("validarRangoHorario: rechaza un rango invertido con un mensaje explicativo", () => {
  const resultado = validarRangoHorario("18:00 - 16:00");

  assert.equal(resultado.ok, false);
  assert.match(resultado.error, /anterior al de cierre/);
});

test("validarRangoHorario: rechaza formatos inválidos y horas fuera de rango", () => {
  for (const invalido of ["16 a 18", "16:00", "", "Cerrado", "25:00 - 26:00", "16:70 - 18:00"]) {
    const resultado = validarRangoHorario(invalido);
    assert.equal(resultado.ok, false, `debería rechazar: ${invalido}`);
    assert.match(resultado.error, /formato HH:MM/);
  }
});

test("esDuplicado: detecta la misma combinación ignorando mayúsculas y espacios", () => {
  const registros = [
    { dia: "Martes", rango: "16:00 – 18:00", cuatrimestre: "2026-2" }
  ];

  assert.equal(
    esDuplicado(
      registros,
      { dia: " martes ", rango: "16:00 – 18:00", cuatrimestre: "2026-2" },
      ["dia", "rango", "cuatrimestre"]
    ),
    true
  );
});

test("esDuplicado: acepta el mismo rango en otro cuatrimestre", () => {
  const registros = [
    { dia: "Martes", rango: "16:00 – 18:00", cuatrimestre: "2026-2" }
  ];

  assert.equal(
    esDuplicado(
      registros,
      { dia: "Martes", rango: "16:00 – 18:00", cuatrimestre: "2026-1" },
      ["dia", "rango", "cuatrimestre"]
    ),
    false
  );
});

test("esDuplicado: devuelve false con una lista vacía", () => {
  assert.equal(esDuplicado([], { dia: "Lunes" }, ["dia"]), false);
});
