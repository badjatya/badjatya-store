const User = require("../models/user");

// Utils
const customError = require("../utils/customError");

// Admin get all users
exports.adminGetAllUsers = async (req, res) => {
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
exports.adminGetAllManagers = async (req, res) => {
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
