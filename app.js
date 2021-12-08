const express = require("express");
require("dotenv").config({ path: "./src/config/config.env" });
const app = express();

// Library
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const passport = require("passport");

// API DOCS Swagger
const swaggerDocument = YAML.load("./src/docs/swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
if (process.env.ENVIRONMENT === "development") {
  app.use(morgan("dev"));
}
const GoogleStrategy = require("./src/passport/google");
const FacebookStrategy = require("./src/passport/facebook");
app.use(passport.initialize());

// Template engine
app.set("view engine", "ejs");
app.set("views", "./src/views");

// Routes
app.use("/", require("./src/routes/home.router"));
app.use("/api/v1/users", require("./src/routes/user.router"));

// Exporting app
module.exports = app;
