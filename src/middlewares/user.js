// Model
const User = require("../models/user");

// Library
const jwt = require("jsonwebtoken");

// Utils
const customError = require("../utils/customError");

exports.isLoggedIn = async (req, res, next) => {
  try {
    let token = req.cookies.token || req.body.token;

    // If token is not present
    if (!token) {
      if (req.header("Authorization")) {
        token = req.header("Authorization").replace("Bearer ", "");
      } else {
        return customError(res, 400, "Token not found");
      }
    }

    // Verifying token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Finding user based on token
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return customError(
        res,
        401,
        "Either token expired or invalid, please authenticate"
      );
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};
