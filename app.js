const express = require("express");
require("dotenv").config({ path: "./src/config/config.env" });
const app = express();

// Exporting app
module.exports = app;
