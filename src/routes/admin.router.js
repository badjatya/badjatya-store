const router = require("express").Router();

// Admin Controller
const {
  adminGetAllUsers,
  adminGetAllManagers,
} = require("../controllers/admin.controller");

// User middleware
const { isLoggedIn, customRole } = require("../middlewares/user");

// Routes

router.route("/users").get(isLoggedIn, customRole("admin"), adminGetAllUsers);
router
  .route("/users/managers")
  .get(isLoggedIn, customRole("admin"), adminGetAllManagers);

module.exports = router;
