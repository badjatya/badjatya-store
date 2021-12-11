const router = require("express").Router();

// Admin Controller
const {
  getAllUsers,
  getAllManagers,
  getSingleUser,
  updateSingleUser,
  deleteSingleUser,
} = require("../controllers/manager.controller");

// User middleware
const { isLoggedIn, customRole } = require("../middlewares/user");

// * Routes

// Manager getting all users
router.route("/users").get(isLoggedIn, customRole("manager"), getAllUsers);

// Manager getting all managers
router
  .route("/managers")
  .get(isLoggedIn, customRole("manager"), getAllManagers);

// Manager getting, updating and deleting single user
router
  .route("/users/:id")
  .get(isLoggedIn, customRole("manager"), getSingleUser)
  .patch(isLoggedIn, customRole("manager"), updateSingleUser)
  .delete(isLoggedIn, customRole("manager"), deleteSingleUser);

module.exports = router;
