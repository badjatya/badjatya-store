const router = require("express").Router();

// product Controller
const {
  addCategory,
  addBrand,
  getAllCategory,
  getSingleCategory,
  getAllProductsByCategory,
  updateCategory,
  deleteCategory,
  getAllBrand,
  getSingleBrand,
  updateBrand,
  deleteBrand,
  addProduct,
  updateProduct,
} = require("../controllers/product.controller");

// User middleware
const { isLoggedIn, customRole } = require("../middlewares/user");

// * Routes

// Category routes
router
  .route("/category")
  .get(isLoggedIn, getAllCategory)
  .post(
    isLoggedIn,
    customRole("admin", "manager", "productManager"),
    addCategory
  );

// Getting, updating and deleting category based on id
router
  .route("/category/:id")
  .get(isLoggedIn, getSingleCategory)
  .patch(
    isLoggedIn,
    customRole("admin", "manager", "productManager"),
    updateCategory
  )
  .delete(
    isLoggedIn,
    customRole("admin", "manager", "productManager"),
    deleteCategory
  );

// Getting all products based on category id
router
  .route("/category/products/:id")
  .get(isLoggedIn, getAllProductsByCategory);

// Brand routes
router
  .route("/brand")
  .get(isLoggedIn, getAllBrand)
  .post(isLoggedIn, customRole("admin", "manager", "productManager"), addBrand);

router
  .route("/brand/:id")
  .get(isLoggedIn, getSingleBrand)
  .patch(
    isLoggedIn,
    customRole("admin", "manager", "productManager"),
    updateBrand
  )
  .delete(
    isLoggedIn,
    customRole("admin", "manager", "productManager"),
    deleteBrand
  );

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
