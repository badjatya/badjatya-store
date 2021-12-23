const router = require("express").Router();

// Discount Controller
const {
  addDiscount,
  getAllDiscounts,
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

module.exports = router;
