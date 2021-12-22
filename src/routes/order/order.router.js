const router = require("express").Router();

// Order Controller
const { createOrder } = require("../../controllers/order/order.controller");

// User middleware
const { isLoggedIn, customRole } = require("../../middlewares/user");

// * Routes

// Creating Order
router.route("/").post(isLoggedIn, createOrder);

module.exports = router;
