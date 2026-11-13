"use strict";

// Prueba de regresión del renderizado seguro de solicitudes de visita (ADR-0015).
//
// No necesita DOM ni dependencias externas: verifica sobre el código fuente que
// el panel de visitas no vuelva a interpolar datos de origen público en
// `innerHTML`, y comprueba el comportamiento del filtro de correo evaluando la
// expresión regular real que usa el panel.

const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const RUTA_ADMIN = path.join(__dirname, "..", "..", "js", "admin.js");
const FUENTE = fs.readFileSync(RUTA_ADMIN, "utf-8");

/**
 * Devuelve el cuerpo de una función declarada dentro del DOMContentLoaded,
 * desde su firma hasta la firma de la función siguiente.
 */
function extraerFuncion(nombre, siguiente) {
  const inicio = FUENTE.indexOf(`function ${nombre}(`);
  const fin = FUENTE.indexOf(`function ${siguiente}(`);
  assert.ok(inicio !== -1, `No se encontró la función ${nombre} en admin.js`);
  assert.ok(fin !== -1 && fin > inicio, `No se encontró el límite de ${nombre} en admin.js`);
  return FUENTE.slice(inicio, fin);
}

/**
 * Busca asignaciones a innerHTML que contengan interpolación `${...}`.
 * Las asignaciones vacías o con texto fijo están permitidas.
 */
function interpolacionesEnInnerHtml(cuerpo) {
  const patron = /innerHTML\s*=\s*(`[\s\S]*?`|"[^"]*"|'[^']*')/g;
  const hallazgos = [];
  let coincidencia;
  while ((coincidencia = patron.exec(cuerpo)) !== null) {
    if (coincidencia[1].includes("${")) {
      const linea = cuerpo.slice(0, coincidencia.index).split("\n").length;
      hallazgos.push(`innerHTML con interpolación cerca de la línea ${linea}: ${coincidencia[1].slice(0, 60)}`);
    }
  }
  return hallazgos;
}

test("el render de la tabla de visitas no interpola datos en innerHTML", () => {
  const cuerpo = extraerFuncion("renderVisitas", "abrirModalDetalleVisita");
  const hallazgos = interpolacionesEnInnerHtml(cuerpo);
  assert.deepStrictEqual(
    hallazgos,
    [],
    "El render de visitas volvió a interpolar datos en innerHTML:\n" + hallazgos.join("\n")
  );
});

test("el modal de detalle de visita no interpola datos en innerHTML", () => {
  const cuerpo = extraerFuncion("abrirModalDetalleVisita", "cerrarModalDetalleVisita");
  const hallazgos = interpolacionesEnInnerHtml(cuerpo);
  assert.deepStrictEqual(
    hallazgos,
    [],
    "El modal de detalle volvió a interpolar datos en innerHTML:\n" + hallazgos.join("\n")
  );
});

test("el render de visitas construye el contenido con textContent", () => {
  const cuerpo = extraerFuncion("renderVisitas", "abrirModalDetalleVisita");
  assert.ok(
    cuerpo.includes("textContent"),
    "El render de visitas debería asignar los datos con textContent"
  );
  assert.ok(
    cuerpo.includes("createElement"),
    "El render de visitas debería construir las filas con createElement"
  );
});

test("el filtro de correo solo acepta direcciones simples", () => {
  const coincidencia = FUENTE.match(/\/\^\[\^[^\]]+\]\+@\[\^[^\]]+\]\+\\\.\[\^[^\]]+\]\+\$\/[a-z]*/);
  assert.ok(coincidencia, "No se encontró la expresión regular de validación de correo en admin.js");

  const expresion = coincidencia[0];
  const patron = eval(expresion); // eslint-disable-line no-eval

  const aceptadas = ["docente@escuela.edu.ar", "visitas@biblioteca.org"];
  const rechazadas = [
    "docente@escuela.edu.ar?asunto=hola",
    "docente@escuela.edu.ar#ancla",
    "docente&x@escuela.edu.ar",
    "javascript:alert(1)",
    "sin-arroba.example.com"
  ];

  for (const correo of aceptadas) {
    assert.ok(patron.test(correo), `Debería aceptar el correo simple: ${correo}`);
  }
  for (const correo of rechazadas) {
    assert.ok(!patron.test(correo), `Debería rechazar el correo no simple: ${correo}`);
  }
});

test("el ADR del renderizado seguro está documentado e indexado", () => {
  const raiz = path.join(__dirname, "..", "..");
  const adr = path.join(raiz, "adr", "0015-renderizado-seguro-de-solicitudes.md");
  const indice = fs.readFileSync(path.join(raiz, "adr", "README.md"), "utf-8");

  assert.ok(fs.existsSync(adr), "Falta el ADR-0015 del renderizado seguro");
  assert.ok(
    indice.includes("0015-renderizado-seguro-de-solicitudes.md"),
    "El ADR-0015 no figura en el índice de adr/README.md"
  );
});
