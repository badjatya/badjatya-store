// Model
const User = require("../models/user");

// Library
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");

// Utils
const emailSender = require("../utils/emailSender");
const customError = require("../utils/customError");

// Creating a new user - signup
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Checking all the fields are present
  if (!name || !email || !password) {
    return customError(res, 400, "Name, email and password are required");
  }

  try {
    // Checking user already exist or not
    const isUserExit = await User.findOne({ email });
    if (isUserExit !== null) {
      return customError(res, 401, "User already exists, please login");
    }

    // If user has uploaded an image
    if (req.files) {
      // Uploading image to cloudinary
      const result = await cloudinary.v2.uploader.upload(
        req.files.photo.tempFilePath,
        {
          folder: "badjatya-store/users",
          width: 150,
          crop: "scale",
        }
      );
      const photo = {
        secureUrl: result.secure_url,
        publicId: result.public_id,
      };

      // Creating new user
      const user = await User.create({ name, email, password, photo });

      // confirm email token (valid for 20min)
      const confirmEmailToken = await user.getJwtConfirmEmailToken();

      // Url for token
      const tokenUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/users/email/confirm/${confirmEmailToken}`;

      emailSender({
        email,
        subject: `Confirm email mail to ${name}`,
        text: "Click on the button to confirm email",
        html: `
      <p style="margin-bottom: 20px">Hey ${name}, Click below button to confirm email </p>
      <a style="display:block; text-align:center; padding:20px; background-color: black; color: white; border-radius: 30px; text-decoration:none " href=${tokenUrl}>Confirm email</a>
      `,
      });

      res.json({
        status: "success",
        message: "Email sent successfully, confirm email",
      });
    } else {
      // Creating new user
      const user = await User.create({ name, email, password });

      // confirm email token (valid for 20min)
      const confirmEmailToken = await user.getJwtConfirmEmailToken();

      // Url for token
      const tokenUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/users/email/confirm/${confirmEmailToken}`;

      emailSender({
        email,
        subject: `Confirm email mail to ${name}`,
        text: "Click on the button to confirm email",
        html: `
          <p style="margin-bottom: 20px">Hey ${name}, Click below button to confirm email </p>
          <a style="display:block; text-align:center; padding:20px; background-color: black; color: white; border-radius: 30px; text-decoration:none " href=${tokenUrl}>Confirm email</a>
          `,
      });

      res.json({
        status: "success",
        message: "Email sent successfully, confirm email",
      });
    }
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Logging a user - sign in
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Checking all the fields are present
  if (!email || !password) {
    return customError(res, 400, "Email and password are required");
  }

  try {
    const user = await User.findOne({ email });

    // Checking is valid email
    if (!user) {
      return customError(res, 401, "Either email or password is incorrect");
    }

    const isPasswordMatch = await user.isValidPassword(password);
    if (!isPasswordMatch) {
      return customError(res, 401, "Either email or password is incorrect");
    }

    // Valid user, creating jwt token valid for 2days
    const token = await user.getJwtLoginToken();

    // Sending a cookie valid for 2days
    res.cookie("token", token, {
      expires: new Date(
        Date.now() * process.env.COOKIE_TIME * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    });

    // Sending response
    res.json({
      status: "success",
      token,
      isVerifiedUser: user.isVerifiedUser,
      user,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// User confirms email address
exports.confirmEmail = async (req, res) => {
  try {
    // Getting token from param
    const token = req.params.token;

    // Verifying token
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY_CONFIRM_EMAIL
    );

    // Getting user from the token
    const user = await User.findById(decodedToken.id);

    // If token is expired or invalid token
    if (!user) {
      return customError(res, 401, "Either token expired or invalid");
    }

    // Checking is the right token that is stored in DB
    if (token !== user.confirmEmailToken) {
      return customError(res, 400, "Either token invalid");
    }

    // All good, making user verified
    user.confirmEmailToken = undefined;
    user.isVerifiedUser = true;

    // Saving to DB
    await user.save();

    res.json({
      status: "success",
      message: "User verified, you can login",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Logged in user can logout
exports.logout = async (req, res) => {
  try {
    // Removing token from tokens array
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );

    // Saving to Database
    await req.user.save();

    // Clearing cookies
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.json({
      status: "success",
      message: "User logged out successfully",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Logged in user can logout all instances
exports.logoutAll = async (req, res) => {
  try {
    // Removing tokens
    req.user.tokens = [];

    // Saving to Database
    await req.user.save();

    // Clearing cookies
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.json({
      status: "success",
      message: "User logged out all successful",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};
