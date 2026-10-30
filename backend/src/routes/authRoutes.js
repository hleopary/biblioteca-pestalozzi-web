"use strict";

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.post("/login", authController.login);
router.get("/verify", authenticateToken, authController.verify);
router.put("/password", authenticateToken, authController.updatePassword);

module.exports = router;
