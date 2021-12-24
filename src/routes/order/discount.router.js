const router = require("express").Router();

// Discount Controller
const {
  addDiscount,
  getAllDiscounts,
  getSingleDiscount,
} = require("../../controllers/order/discount.controller");

// User middleware
const { isLoggedIn, customRole } = require("../../middlewares/user");

// Creating discount
router
  .route("/")
  .post(isLoggedIn, customRole("admin", "manager", "orderManager"), addDiscount)
  .get(
    isLoggedIn,
    customRole("admin", "manager", "orderManager"),
    getAllDiscounts
  );

// Getting, updating and deleting single discount
router
  .route("/:id")
  .get(
    isLoggedIn,
    customRole("admin", "manager", "orderManager"),
    getSingleDiscount
  );

module.exports = router;
