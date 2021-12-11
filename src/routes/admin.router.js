const router = require("express").Router();

// Admin Controller
const {
  getAllUsers,
  getAllManagers,
  getSingleUser,
  updateSingleUser,
  deleteSingleUser,
} = require("../controllers/admin.controller");

// User middleware
const { isLoggedIn, customRole } = require("../middlewares/user");

// Routes

// Admin getting all users
router.route("/users").get(isLoggedIn, customRole("admin"), getAllUsers);
// Admin getting all managers
router
  .route("/users/managers")
  .get(isLoggedIn, customRole("admin"), getAllManagers);

// Admin getting, updating and deleting single user
router
  .route("/users/:id")
  .get(isLoggedIn, customRole("admin"), getSingleUser)
  .patch(isLoggedIn, customRole("admin"), updateSingleUser)
  .delete(isLoggedIn, customRole("admin"), deleteSingleUser);

module.exports = router;
