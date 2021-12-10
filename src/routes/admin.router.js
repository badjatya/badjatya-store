const router = require("express").Router();

// Admin Controller
const {
  getAllUsers,
  getAllManagers,
  getSingleUser,
} = require("../controllers/admin.controller");

// User middleware
const { isLoggedIn, customRole } = require("../middlewares/user");

// Routes

router.route("/users").get(isLoggedIn, customRole("admin"), getAllUsers);
router
  .route("/users/managers")
  .get(isLoggedIn, customRole("admin"), getAllManagers);

router.route("/users/:id").get(isLoggedIn, customRole("admin"), getSingleUser);

module.exports = router;
