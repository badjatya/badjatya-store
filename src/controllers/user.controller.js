// Model
const User = require("../models/user");

// Lib
const cloudinary = require("cloudinary");
const jwt = require("jsonwebtoken");

// Utils
const emailSender = require("../utils/emailSender");

// Signup
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Checking all the filed are present
    if (!(name || email || password)) {
      return res.status(400).json({
        status: "failed",
        message: "name, email and password are required",
      });
    }

    // Checking the user already exists
    const isUserAlreadyExist = await User.findOne({ email });
    if (isUserAlreadyExist) {
      return res.status(401).json({
        status: "fail",
        message: "User already exists, please login",
      });
    }

    // Checking if photo exists
    if (req.files) {
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

      // Creating User
      const user = await User.create({
        name,
        email,
        password,
        accountCreatedUsing: "local",
        photo,
      });

      const emailToken = user.getEmailVerificationToken();

      // Sending confirm email address mail
      const myUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/users/email/confirm/${emailToken}`;
      const message = `Copy paste this link in your URL and hit enter \n\n ${myUrl}`;
      emailSender({
        email,
        subject: `Badjatya Store, ${user.name} reset password`,
        message,
      });

      res.status(201).json({
        status: "success",
        message:
          "Verification email sent at ur email, please verify within 20min",
      });
    } else {
      const user = await User.create({
        name,
        email,
        password,
        accountCreatedUsing: "local",
      });

      const emailToken = user.getEmailVerificationToken();

      // Sending confirm email address mail
      const myUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/users/email/confirm/${emailToken}`;
      const message = `Copy paste this link in your URL and hit enter \n\n ${myUrl}`;
      emailSender({
        email,
        subject: `Badjatya Store, ${user.name} reset password`,
        message,
      });

      res.status(201).json({
        status: "success",
        message:
          "Verification email sent at ur email, please verify within 20min",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Checking all the filed are present
    if (!(email || password)) {
      return res.status(400).json({
        status: "failed",
        message: "email and password are required",
      });
    }

    // Checking the user exists or not
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Either email or password is incorrect",
      });
    }

    // Checking the password user entered is correct or not
    const isUserEnteredPasswordCorrect = await user.isValidPassword(password);
    if (!isUserEnteredPasswordCorrect) {
      return res.status(401).json({
        status: "fail",
        message: "Either email or password is incorrect",
      });
    }

    const token = user.getJwtToken();

    // Hiding password
    user.password = undefined;

    // Sending cookie
    res.cookie("token", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    });

    res.status(200).json({
      status: "success",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.confirmEmail = async (req, res) => {
  const token = req.params.token;
  const decodedToken = jwt.verify(
    token,
    process.env.JWT_SECRET_KEY_CONFIRM_EMAIL
  );

  const user = await User.findById(decodedToken.id);

  if (!user) {s
    return res.status(401).json({
      status: "fail",
      message: "token invalid or expired, contact admin",
    });
  }

  user.isVerifiedUser = true;
  user.save();

  res.status(200).json({
    status: "success",
    message: "Email verified, you can login",
  });
};
