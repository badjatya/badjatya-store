const express = require("express");
require("dotenv").config({ path: "./src/config/config.env" });
const app = express();

// Library
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

// API DOCS Swagger
const swaggerDocument = YAML.load("./src/docs/swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/users", require("./src/routes/user.router"));

// Exporting app
module.exports = app;
