const router = require("express").Router();

// product Controller
const {
  addCategory,
  addBrand,
  addProduct,
  updateProduct,
} = require("../controllers/product.controller");

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

// Product routes
router
  .route("/")
  .post(
    isLoggedIn,
    customRole("admin", "manager", "productManager"),
    addProduct
  );

router
  .route("/:id")
  .patch(
    isLoggedIn,
    customRole("admin", "manager", "productManager"),
    updateProduct
  );

module.exports = router;
