const router = require("express").Router();

// User Controller
const {
  createUser,
  login,
  confirmEmail,
} = require("../controllers/user.controller");

router.route("/signup").post(createUser);
router.route("/login").post(login);
router.route("/email/confirm/:token").get(confirmEmail);

module.exports = router;
