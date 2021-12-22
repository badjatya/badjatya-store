const router = require("express").Router();

// Order Controller
const { createOrder } = require("../controllers/order.controller");

// User middleware
const { isLoggedIn, customRole } = require("../middlewares/user");

// * Routes

// Creating Order
// router.route("/").post(isLoggedIn, getAllUsers);

module.exports = router;
