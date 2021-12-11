const User = require("../models/user");

// Lib
const cloudinary = require("cloudinary");

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

// Admin updating single user
exports.updateSingleUser = async (req, res) => {
  try {
    const role = req.body.role;

    if (!role) {
      return customError(
        res,
        400,
        "To update the role of a user, role is required"
      );
    }

    // Not allowing admin to update role of user to admin
    if (role === "admin") {
      return customError(res, 401, "Admin can not update a user to admin");
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      {
        new: true,
        runValidators: true,
      }
    );

    // If user not found
    if (!user) {
      return customError(res, 404, "User not found");
    }

    res.json({
      status: "success",
      message: "User role updated successfully",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Admin deleting single user
exports.deleteSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    // If user not found
    if (!user) {
      return customError(res, 404, "User not found");
    }

    // If user is admin than he can not remove admin
    if (user.role === "admin") {
      return customError(res, 401, "Admin can not remove a admin");
    }

    // Checking is user have photo if photo present than deleting
    if (user.photo.publicId) {
      await cloudinary.v2.uploader.destroy(user.photo.publicId);
    }

    // Removing user
    await user.remove();

    res.json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};
