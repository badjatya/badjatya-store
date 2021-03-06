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
  getAllProductsByBrand,
  updateBrand,
  deleteBrand,
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateSingleProductDetails,
  updateSingleProductThumbnail,
  updateSingleProductImages,
  updateSingleProductCategory,
  updateSingleProductBrand,
  createProductReview,
  getAllProductReviews,
  userDeleteProductReview,
  deleteProductReview,
  deleteProduct,
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

// Getting, updating and deleting brand based on id
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

// Getting all products based on brand id
router.route("/brand/products/:id").get(isLoggedIn, getAllProductsByBrand);

// Product routes
router
  .route("/")
  .get(isLoggedIn, getAllProducts)
  .post(
    isLoggedIn,
    customRole("admin", "manager", "productManager"),
    addProduct
  );

// Getting single product
router
  .route("/:id")
  .get(isLoggedIn, getSingleProduct)
  .delete(
    isLoggedIn,
    customRole("admin", "manager", "productManager"),
    deleteProduct
  );

// Updating single product details
router
  .route("/update/details/:id")
  .patch(
    isLoggedIn,
    customRole("admin", "manager", "productManager"),
    updateSingleProductDetails
  );

// Updating single product thumbnail
router
  .route("/update/thumbnail/:id")
  .patch(
    isLoggedIn,
    customRole("admin", "manager", "productManager"),
    updateSingleProductThumbnail
  );

// Updating single product images
router
  .route("/update/images/:id")
  .patch(
    isLoggedIn,
    customRole("admin", "manager", "productManager"),
    updateSingleProductImages
  );

// Updating single product category
router
  .route("/update/category/:id")
  .patch(
    isLoggedIn,
    customRole("admin", "manager", "productManager"),
    updateSingleProductCategory
  );

// Updating single product brand
router
  .route("/update/brand/:id")
  .patch(
    isLoggedIn,
    customRole("admin", "manager", "productManager"),
    updateSingleProductBrand
  );

// Review
router
  .route("/review/:id")
  .post(isLoggedIn, createProductReview)
  .get(isLoggedIn, getAllProductReviews)
  .delete(isLoggedIn, userDeleteProductReview);

// Admin, manager or productManager can remove a review of a product
router
  .route("/review")
  .delete(
    isLoggedIn,
    customRole("admin", "manager", "productManager"),
    deleteProductReview
  );

module.exports = router;
