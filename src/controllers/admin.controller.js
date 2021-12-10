const User = require("../models/user");

// Utils
const customError = require("../utils/customError");

// Admin get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });

    res.json({
      status: "success",
      result: users.length,
      users,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Admin get all managers
exports.getAllManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: "manager" });

    res.json({
      status: "success",
      result: managers.length,
      managers,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Admin get single user
exports.getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return customError(res, 404, "User not found");
    }

    res.json({
      status: "success",
      user,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};
