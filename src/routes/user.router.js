const router = require("express").Router();

// User Controller
const { createUser, login } = require("../controllers/user.controller");

router.route("/signup").post(createUser);
router.route("/login").post(login);

module.exports = router;
