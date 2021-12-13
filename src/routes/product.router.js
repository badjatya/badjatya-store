const router = require("express").Router();

// product Controller
const { createCategory } = require("../controllers/product.controller");

// User middleware
const { isLoggedIn, customRole } = require("../middlewares/user");

// * Routes

// Category routes
router.route("/category").post(isLoggedIn, customRole("admin"), createCategory);

module.exports = router;
