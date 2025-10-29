const express = require("express");
const users = require("../models/users");
const router = express.Router();
const { SECRET } = require("../middleware/auth");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Operations related to users
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "user123"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Created user
 */
router.post("/users", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await users.create({ username, password });
    if (result.error) return res.status(409).json({ error: result.error });
    const token = jwt.sign({ username: result.username }, SECRET, {
      expiresIn: "1h",
    });
    res.json({ username: result.username, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Users]
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "user123"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login result
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await users.login({ username, password });
    if (!result.success) return res.status(401).json({ error: result.error });
    const token = jwt.sign({ username }, SECRET, {
      expiresIn: "1h",
    });
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
