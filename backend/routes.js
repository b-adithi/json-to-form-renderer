const express = require("express");
const formsRoutes = require("./routes/forms");
const responsesRoutes = require("./routes/responses");
const usersRoutes = require("./routes/users");

const router = express.Router();

router.use(formsRoutes);
router.use(responsesRoutes);
router.use(usersRoutes);

module.exports = router;
