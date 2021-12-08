const router = require("express").Router();

// User Controller
const {
  createUser,
  login,
  confirmEmail,
  logout,
  logoutAll,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  updateUserProfilePhoto,
  deleteUserProfilePhoto,
  confirmEmailResendToken,
  forgotPassword,
  confirmResetPassword,
  socialLogin,
} = require("../controllers/user.controller");

// User middleware
const { isLoggedIn } = require("../middlewares/user");

// Lib
const passport = require("passport");

// User route
router.route("/signup").post(createUser);
router.route("/login").post(login);
router.route("/google").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router
  .route("/google/callback")
  .get(passport.authenticate("google"), socialLogin);

router.route("/email/confirm/resend").get(isLoggedIn, confirmEmailResendToken);
router.route("/email/confirm/:token").get(confirmEmail);
router.route("/logout").get(isLoggedIn, logout);
router.route("/logout/all").get(isLoggedIn, logoutAll);
router.route("/profile").get(isLoggedIn, getUserProfile);
router.route("/profile/update").patch(isLoggedIn, updateUserProfile);
router.route("/profile/password/update").patch(isLoggedIn, updateUserPassword);
router.route("/profile/photo/update").patch(isLoggedIn, updateUserProfilePhoto);
router
  .route("/profile/photo/delete")
  .delete(isLoggedIn, deleteUserProfilePhoto);
router.route("/forgot/password").post(forgotPassword);
router.route("/password/reset/:token").post(confirmResetPassword);

module.exports = router;
