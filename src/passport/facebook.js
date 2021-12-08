// Lib
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

// Model
const User = require("../models/user");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_AUTH_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_AUTH_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/v1/users/facebook/callback",
    },
    function (accessToken, refreshToken, profile, next) {
      User.findOne({ email: profile._json.email }).then((user) => {
        if (user) {
          next(null, user);
        } else {
          User.create({
            name: profile.displayName,
            email: profile._json.email,
            isVerifiedUser: true,
            accountCreatedUsing: "facebook",
            facebook: {
              isFacebook: true,
              facebookId: profile.id,
            },
          })
            .then((user) => {
              next(null, user);
            })
            .catch((err) => console.log(err));
        }
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
