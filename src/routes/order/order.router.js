const router = require("express").Router();

// Order Controller
const {
  createOrder,
  userGettingAllOrders,
  userGettingDetailsOfSingleOrder,
  userTrackingSingleOrder,
} = require("../../controllers/order/order.controller");

// User middleware
const { isLoggedIn, customRole } = require("../../middlewares/user");

// * Routes

// Creating Order
router.route("/").post(isLoggedIn, createOrder);

// Getting all orders Order
router.route("/myOrders").get(isLoggedIn, userGettingAllOrders);

// Getting single order details
router.route("/myOrders/:id").get(isLoggedIn, userGettingDetailsOfSingleOrder);

// Tracking single order
router.route("/myOrders/track/:id").get(isLoggedIn, userTrackingSingleOrder);

module.exports = router;
