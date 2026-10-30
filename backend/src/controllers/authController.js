"use strict";

const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middlewares/authMiddleware");

function login(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        ok: false,
        error: "Debe ingresar usuario y contraseña."
      });
    }

    const user = db.prepare("SELECT * FROM usuarios WHERE username = ?").get(username.trim());

    if (!user) {
      return res.status(401).json({
        ok: false,
        error: "Credenciales inválidas."
      });
    }

    const passwordMatches = bcrypt.compareSync(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({
        ok: false,
        error: "Credenciales inválidas."
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        nombre: user.nombre
      },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
    );

    res.json({
      ok: true,
      mensaje: "Inicio de sesión exitoso.",
      token,
      usuario: {
        id: user.id,
        username: user.username,
        nombre: user.nombre,
        email: user.email
      }
    });
  } catch (err) {
    next(err);
  }
}

function verify(req, res) {
  res.json({
    ok: true,
    usuario: req.user
  });
}

function updatePassword(req, res, next) {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        ok: false,
        error: "Debe indicar la contraseña actual y la nueva."
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        ok: false,
        error: "La nueva contraseña debe tener al menos 6 caracteres."
      });
    }

    const user = db.prepare("SELECT password_hash FROM usuarios WHERE id = ?").get(userId);
    if (!user || !bcrypt.compareSync(currentPassword, user.password_hash)) {
      return res.status(401).json({
        ok: false,
        error: "La contraseña actual es incorrecta."
      });
    }

    const newHash = bcrypt.hashSync(newPassword, 10);
    db.prepare("UPDATE usuarios SET password_hash = ? WHERE id = ?").run(newHash, userId);

    res.json({
      ok: true,
      mensaje: "Contraseña actualizada exitosamente."
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
  verify,
  updatePassword
};
