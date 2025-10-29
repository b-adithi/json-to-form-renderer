const express = require("express");
const responses = require("../models/responses");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   - name: Responses
 *     description: Operations related to form responses
 * /responses:
 *   get:
 *     tags: [Responses]
 *     summary: Get all responses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of responses
 *   post:
 *     tags: [Responses]
 *     summary: Submit a response
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user123"
 *               formId:
 *                 type: string
 *                 example: "653f1a2b8c1e4a2d9c8e4b1a"
 *               responses:
 *                 type: object
 *                 example: {"Name": "John Doe", "Email": "john@example.com"}
 *     responses:
 *       200:
 *         description: Created response
 */
router.get("/responses", authenticateToken, async (req, res) =>
  res.json(await responses.getAll())
);
router.post("/responses", authenticateToken, async (req, res) =>
  res.json(await responses.create(req.body))
);

/**
 * @swagger
 * /responses/{id}:
 *   get:
 *     tags: [Responses]
 *     summary: Get a response by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Response object
 */
router.get("/responses/:id", authenticateToken, async (req, res) =>
  res.json(await responses.get(req.params.id))
);

// Get responses for a specific form
router.get("/forms/:formId/responses", authenticateToken, async (req, res) =>
  res.json(await responses.getByFormId(req.params.formId))
);

module.exports = router;
