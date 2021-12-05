// Model
const User = require("../models/user");

//** */ Controllers

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

    const photo = {};
    if (req.files) {
    }

    const user = await User.create({
      name,
      email,
      password,
      accountCreatedUsing: "local",
    });

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

    res.status(201).json({
      status: "success",
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
