"use strict";

function errorHandler(err, req, res, next) {
  console.error("Error en la aplicación:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Error interno del servidor";

  res.status(statusCode).json({
    ok: false,
    error: message
  });
}

module.exports = errorHandler;
