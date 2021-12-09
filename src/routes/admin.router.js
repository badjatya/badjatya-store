const router = require("express").Router();

// Admin Controller
const { adminGetAllUsers } = require("../controllers/admin.controller");

// User middleware
const { isLoggedIn, customRole } = require("../middlewares/user");

// Routes

router.route("/users").get(isLoggedIn, customRole("admin"), adminGetAllUsers);

module.exports = router;
