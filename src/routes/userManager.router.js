const router = require("express").Router();

// userManager Controller
const {
  getAllUsers,
  getSingleUser,
  updateSingleUser,
  deleteSingleUser,
} = require("../controllers/userManager.controller");

// User middleware
const { isLoggedIn, customRole } = require("../middlewares/user");

// * Routes

// userManager getting all users
router.route("/users").get(isLoggedIn, customRole("userManager"), getAllUsers);

// userManager getting, updating and deleting single user
router
  .route("/users/:id")
  .get(isLoggedIn, customRole("userManager"), getSingleUser)
  .patch(isLoggedIn, customRole("userManager"), updateSingleUser)
  .delete(isLoggedIn, customRole("userManager"), deleteSingleUser);

module.exports = router;
