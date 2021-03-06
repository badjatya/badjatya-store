const router = require("express").Router();

// Order Controller
const {
  createOrder,
  userGettingAllOrders,
  userGettingDetailsOfSingleOrder,
  userTrackingSingleOrder,
  getAllOrders,
  getDetailsOfSingleOrder,
  updateSingleOrder,
  deleteSingleOrder,
} = require("../../controllers/order/order.controller");

// User middleware
const { isLoggedIn, customRole } = require("../../middlewares/user");

// * User

// Creating Order
router.route("/").post(isLoggedIn, createOrder);

// Getting all orders Order
router.route("/myOrders").get(isLoggedIn, userGettingAllOrders);

// Getting single order details
router.route("/myOrders/:id").get(isLoggedIn, userGettingDetailsOfSingleOrder);

// Tracking single order
router.route("/myOrders/track/:id").get(isLoggedIn, userTrackingSingleOrder);

// ** Admin, manager or orderManager

// Getting all orders Order
router
  .route("/")
  .get(
    isLoggedIn,
    customRole("admin", "manager", "orderManager"),
    getAllOrders
  );

// Getting single Order details
router
  .route("/:id")
  .get(
    isLoggedIn,
    customRole("admin", "manager", "orderManager"),
    getDetailsOfSingleOrder
  )
  .patch(
    isLoggedIn,
    customRole("admin", "manager", "orderManager"),
    updateSingleOrder
  )
  .delete(
    isLoggedIn,
    customRole("admin", "manager", "orderManager"),
    deleteSingleOrder
  );

module.exports = router;
