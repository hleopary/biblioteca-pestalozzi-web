"use strict";

/**
 * Validaciones puras y reutilizables.
 *
 * No dependen de Express ni de la base de datos: reciben datos y devuelven un
 * resultado. Eso permite probarlas de forma aislada (tests unitarios) y
 * reutilizarlas en los controllers y, más adelante, en el CRUD de horarios.
 */

/**
 * Indica si un valor es un texto con contenido real (no vacío ni solo espacios).
 */
function esTextoNoVacio(valor) {
  return typeof valor === "string" && valor.trim().length > 0;
}

/**
 * Indica si un campo obligatorio tiene contenido. A diferencia de
 * esTextoNoVacio, acepta valores no textuales (números, booleanos) que existen
 * en el cuerpo de la petición, y solo rechaza undefined, null, cadena vacía o
 * cadena con espacios.
 */
function tieneContenido(valor) {
  if (valor === undefined || valor === null) return false;
  if (typeof valor === "string") return valor.trim().length > 0;
  return true;
}

/**
 * Verifica que un objeto tenga todos los campos obligatorios con contenido.
 * Devuelve los nombres de los campos faltantes para poder nombrarlos en el error.
 */
function validarCamposObligatorios(objeto, campos) {
  const datos = objeto || {};
  const faltantes = campos.filter((campo) => !tieneContenido(datos[campo]));

  if (faltantes.length === 0) {
    return { ok: true, faltantes: [] };
  }

  return {
    ok: false,
    faltantes,
    error: `Faltan campos obligatorios: ${faltantes.join(", ")}.`
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida el formato de un correo electrónico.
 */
function validarEmail(email) {
  if (!esTextoNoVacio(email)) {
    return { ok: false, error: "El correo electrónico es obligatorio." };
  }

  if (!EMAIL_RE.test(email.trim())) {
    return { ok: false, error: "El correo electrónico no tiene un formato válido." };
  }

  return { ok: true };
}

// Acepta guion, guion medio (en dash), guion largo (em dash) o la letra "a".
const RANGO_RE = /^(\d{1,2}):(\d{2})\s*(?:-|–|—|a)\s*(\d{1,2}):(\d{2})$/i;

/**
 * Parsea un rango horario del tipo "16:00 – 18:00" a minutos desde las 00:00.
 * Devuelve null si el formato no coincide.
 */
function parseRangoHorario(rango) {
  if (typeof rango !== "string") return null;

  const coincidencia = RANGO_RE.exec(rango.trim());
  if (!coincidencia) return null;

  const horaInicio = Number(coincidencia[1]);
  const minutoInicio = Number(coincidencia[2]);
  const horaFin = Number(coincidencia[3]);
  const minutoFin = Number(coincidencia[4]);

  if (horaInicio > 23 || horaFin > 23 || minutoInicio > 59 || minutoFin > 59) {
    return null;
  }

  return {
    inicio: horaInicio * 60 + minutoInicio,
    fin: horaFin * 60 + minutoFin
  };
}

/**
 * Valida formato y orden de un rango horario.
 * El horario de apertura debe ser anterior al de cierre.
 */
function validarRangoHorario(rango) {
  const parseado = parseRangoHorario(rango);

  if (!parseado) {
    return {
      ok: false,
      error: "El rango horario debe tener el formato HH:MM a HH:MM (por ejemplo, 16:00 – 18:00)."
    };
  }

  if (parseado.inicio >= parseado.fin) {
    return {
      ok: false,
      error: "El horario de apertura debe ser anterior al de cierre."
    };
  }

  return { ok: true, ...parseado };
}

/**
 * Detecta si un registro repite la combinación de claves de otro.
 * Compara textos sin distinguir mayúsculas ni espacios sobrantes.
 */
function esDuplicado(registros, candidato, claves) {
  const normalizar = (valor) =>
    typeof valor === "string" ? valor.trim().toLowerCase() : valor;

  return (registros || []).some((registro) =>
    claves.every(
      (clave) => normalizar(registro[clave]) === normalizar(candidato[clave])
    )
  );
}

module.exports = {
  esTextoNoVacio,
  tieneContenido,
  validarCamposObligatorios,
  validarEmail,
  parseRangoHorario,
  validarRangoHorario,
  esDuplicado
};
