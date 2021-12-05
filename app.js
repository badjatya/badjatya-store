const express = require("express");
require("dotenv").config({ path: "./src/config/config.env" });
const app = express();

// Library
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

// API DOCS Swagger
const swaggerDocument = YAML.load("./src/docs/swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const user = {
  name: "Archit",
  email: "email1@dev.com",
  password: "1234567",
  accountCreatedUsing: "local",
};

const User = require("./src/models/user");

// (async () => {
//   const userNew = await User.create(user);
//   console.log(userNew);
// })();

// Exporting app
module.exports = app;
