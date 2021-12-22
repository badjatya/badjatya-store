const router = require("express").Router();

// Order Controller
const {
  createOrder,
  userGettingAllOrders,
  userGettingDetailsOfSingleOrder,
} = require("../../controllers/order/order.controller");

// User middleware
const { isLoggedIn, customRole } = require("../../middlewares/user");

// * Routes

// Creating Order and getting all orders
router
  .route("/")
  .post(isLoggedIn, createOrder)
  .get(isLoggedIn, userGettingAllOrders);

// Getting single order
router.route("/:id").get(isLoggedIn, userGettingDetailsOfSingleOrder);

module.exports = router;
