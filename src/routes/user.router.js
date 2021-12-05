const router = require("express").Router();

// User Controller
const { createUser } = require("../controllers/user.controller");

router.route("/signup").post(createUser);

module.exports = router;
