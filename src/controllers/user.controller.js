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
      message: "User logged out of all instances successfully",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Getting user profile
exports.getUserProfile = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: req.user,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// updating user profile not password and image
exports.updateUserProfile = async (req, res) => {
  try {
    // Destructuring
    const { name, email } = req.body;

    // updating user profile
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name ? name : req.user.name,
        email: email ? email : req.user.email,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      status: "success",
      message: "User profile updated",
      user,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// updating user password
exports.updateUserPassword = async (req, res) => {
  try {
    // Destructuring
    const { oldPassword, newPassword } = req.body;

    // Checking all the fields are present
    if (!oldPassword || !newPassword) {
      return customError(res, 400, "oldPassword and newPassword are required");
    }

    // Checking is old Password is correct
    const isCorrectPassword = await req.user.isValidPassword(oldPassword);

    // If oldPassword is incorrect
    if (!isCorrectPassword) {
      return customError(res, 401, "Password is incorrect or invalid");
    }

    // updating new password
    req.user.password = newPassword;
    await req.user.save();

    res.json({
      status: "success",
      message: "Updated user's password",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// updating user's profile photo
exports.updateUserProfilePhoto = async (req, res) => {
  try {
    // Checking file is present
    if (!req.files) {
      return customError(res, 400, "For updating profile, photo is required");
    }

    // deleting previous photo if photo is there
    if (req.user.photo.publicId) {
      await cloudinary.v2.uploader.destroy(req.user.photo.publicId);
    }

    // Uploading new photo
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

    // updating DB with new photo
    req.user.photo = photo;
    await req.user.save();

    res.json({
      status: "success",
      message: "Updated user's profile photo",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// updating user's profile photo
exports.deleteUserProfilePhoto = async (req, res) => {
  try {
    // deleting previous photo if photo is there
    if (!req.user.photo.publicId) {
      return customError(res, 400, "No profile photo found for deleting");
    }
    await cloudinary.v2.uploader.destroy(req.user.photo.publicId);

    // updating DB with no photo
    req.user.photo = {};
    await req.user.save();

    res.json({
      status: "success",
      message: "Deleted user's profile photo",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Creating a new user - signup
exports.confirmEmailResendToken = async (req, res) => {
  try {
    // confirm email token (valid for 20min)
    const confirmEmailToken = await req.user.getJwtConfirmEmailToken();

    // Url for token
    const tokenUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/email/confirm/${confirmEmailToken}`;

    emailSender({
      email: req.user.email,
      subject: `Confirm email mail to ${req.user.name}`,
      text: "Click on the button to confirm email",
      html: `
          <p style="margin-bottom: 20px">Hey ${req.user.name}, Click below button to confirm email </p>
          <a style="display:block; text-align:center; padding:20px; background-color: black; color: white; border-radius: 30px; text-decoration:none " href=${tokenUrl}>Confirm email</a>
          `,
    });

    res.json({
      status: "success",
      message: "Confirm email resent successfully ",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    // checking email is present
    const { email } = req.body;

    // If email is not present
    if (!email) {
      return customError(res, 404, "Email is required for forgot password");
    }

    const user = await User.findOne({ email });

    // Checking is valid email
    if (!user) {
      return customError(res, 401, "Either email is incorrect or invalid");
    }

    const resetPasswordToken = await user.getJwtResetPasswordToken();

    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/password/reset/${resetPasswordToken}`;

    emailSender({
      email,
      subject: "Badjatya Store | Forgot password email",
      text: `Forgot password mail, copy the link and open in browser valid for only 20 min /n/n ${resetPasswordUrl}`,
      html: `
      <p style="margin-bottom: 20px">Hey ${email}, Click below button to create new password for login at Badjatya Store </p>
      <a style="display:block; text-align:center; padding:20px; background-color: black; color: white; border-radius: 30px; text-decoration:none " href=${resetPasswordUrl}>Confirm forgot password</a>
      <p>${resetPasswordUrl}</p>
      `,
    });

    res.json({
      status: "success",
      message: "Forgot password email sent successfully, valid for only 20 min",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

exports.confirmResetPassword = async (req, res) => {
  try {
    // Destructuring
    const { password, confirmPassword } = req.body;

    // Checking password and confirmPassword are present
    if (!password || !confirmPassword) {
      return customError(res, 400, "password and confirmPassword are required");
    }

    // Matching password and confirmPassword
    if (password !== confirmPassword) {
      return customError(
        res,
        400,
        "password and confirmPassword are not matching"
      );
    }

    const token = req.params.token;
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY_RESET_PASSWORD
    );

    // Checking the token is valid
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return customError(res, 401, "Token is either invalid or expired");
    }

    // Cross checking the token
    if (token !== user.resetPasswordToken) {
      return customError(res, 401, "Token is either invalid or expired");
    }

    // Saving password to DB
    user.password = password;
    user.resetPasswordToken = undefined;
    await user.save();

    res.json({
      status: "success",
      message:
        "The user's password is update, you can login with new credentials",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};
