const router = require("express").Router();

// product Controller
const { addCategory, addBrand } = require("../controllers/product.controller");

// User middleware
const { isLoggedIn, customRole } = require("../middlewares/user");

// * Routes

// Category routes
router
  .route("/category")
  .post(
    isLoggedIn,
    customRole("admin", "manager", "productManager"),
    addCategory
  );

// Brand routes
router
  .route("/brand")
  .post(isLoggedIn, customRole("admin", "manager", "productManager"), addBrand);

module.exports = router;
