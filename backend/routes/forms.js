const express = require("express");
const forms = require("../models/forms");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   - name: Forms
 *     description: Operations related to forms
 * /forms:
 *   get:
 *     tags: [Forms]
 *     summary: Get all forms
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of forms
 *   post:
 *     tags: [Forms]
 *     summary: Create a new form
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Contact Form"
 *               status:
 *                 type: string
 *                 example: "published"
 *               url:
 *                 type: string
 *                 example: "https://example.com/form/contact"
 *               schema:
 *                 type: object
 *                 example: {"title": "Contact", "fields": [{"type": "text", "label": "Name"}]}
 *     responses:
 *       200:
 *         description: Created form
 */
router.get("/forms", authenticateToken, async (req, res) => {
  try {
    res.json(await forms.getAll());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/forms", authenticateToken, async (req, res) => {
  try {
    const form = await forms.create(req.body);
    res.status(201).json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /forms/{id}:
 *   get:
 *     tags: [Forms]
 *     summary: Get a form by ID
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
 *         description: Form object
 *   put:
 *     tags: [Forms]
 *     summary: Update a form by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Contact Form"
 *               status:
 *                 type: string
 *                 example: "published"
 *               schema:
 *                 type: object
 *                 example: {"title": "Contact", "fields": [{"type": "text", "label": "Name"}]}
 *     responses:
 *       200:
 *         description: Updated form
 *   delete:
 *     tags: [Forms]
 *     summary: Delete a form by ID
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
 *         description: Delete result
 */
router.get("/forms/:id", authenticateToken, async (req, res) => {
  try {
    res.json(await forms.get(req.params.id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put("/forms/:id", authenticateToken, async (req, res) => {
  try {
    res.json(await forms.update(req.params.id, req.body));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.delete("/forms/:id", authenticateToken, async (req, res) => {
  try {
    res.json(await forms.remove(req.params.id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Public endpoint for form submissions (no authentication required)
/**
 * @swagger
 * /forms/{id}/submit:
 *   post:
 *     tags: [Forms]
 *     summary: Submit a response to a published form (public endpoint)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Form ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user@example.com"
 *               userFullName:
 *                 type: string
 *                 example: "John Doe"
 *               responses:
 *                 type: object
 *                 example: {"Name": "John Doe", "Email": "john@example.com"}
 *     responses:
 *       200:
 *         description: Response submitted successfully
 *       404:
 *         description: Form not found or not published
 */
router.post("/forms/:id/submit", async (req, res) => {
  try {
    const responses = require("../models/responses");
    const formId = req.params.id;

    // Verify form exists and is published
    const form = await forms.get(formId);
    if (!form || form.status !== "published") {
      return res.status(404).json({ error: "Form not found or not published" });
    }

    // Create response with form ID
    const responseData = {
      ...req.body,
      formId: formId,
    };

    const response = await responses.create(responseData);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
