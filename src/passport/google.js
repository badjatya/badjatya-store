// Lib
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Model
const User = require("../models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/v1/users/google/callback",
    },
    function (accessToken, refreshToken, profile, next) {
      User.findOne({ socialLoginId: profile.id }).then((user) => {
        if (user) {
          next(null, user);
        } else {
          User.create({
            name: profile.displayName,
            email: profile._json.email,
            isVerifiedUser: true,
            accountCreatedUsing: "google",
            socialLoginId: profile.id,
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
