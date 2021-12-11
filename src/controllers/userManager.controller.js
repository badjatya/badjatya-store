const User = require("../models/user");

// Lib
const cloudinary = require("cloudinary");

// Utils
const customError = require("../utils/customError");

// Manager get all users
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

// Manager get all managers
exports.getAllManagers = async (req, res) => {
  try {
    const managers = await User.find({
      role: { $nin: ["user", "admin", "manager"] },
    });

    res.json({
      status: "success",
      result: managers.length,
      managers,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Manager get single user
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

// Manager updating single user
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

    // Not allowing manager to update role of user to admin or manager
    if (role === "admin") {
      return customError(res, 401, "Manager can not update a user to admin");
    } else if (role === "manager") {
      return customError(res, 401, "Manager can not update a user to manager");
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

// Manager deleting single user
exports.deleteSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    // If user not found
    if (!user) {
      return customError(res, 404, "User not found");
    }

    // If user is manager than he can not remove admin or manager
    if (user.role === "admin") {
      return customError(res, 401, "Manager can not remove an admin");
    } else if (user.role === "manager") {
      return customError(res, 401, "Manager can not remove a manager");
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
