const { swaggerUi, swaggerSpec } = require("./swagger");
// Swagger UI

const routes = require("./routes");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const connectDB = require("./models/db");
const seedDemoUser = require("./models/seedDemoUser");
connectDB();
// Seed demo user after DB connection
setTimeout(() => {
  seedDemoUser().catch(console.error);
}, 1000);

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/", routes);

// Only start server if not in test environment
if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
}

module.exports = app;
