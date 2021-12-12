const User = require("../models/user");

// Lib
const cloudinary = require("cloudinary");

// Utils
const customError = require("../utils/customError");

// userManager get all users
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

// userManager get single user
exports.getSingleUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, role: "user" });

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

// userManager updating single user
exports.updateSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    // If user not found
    if (!user) {
      return customError(res, 404, "User not found");
    }

    // Updating user
    await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name || user.name,
        email: req.body.email || user.email,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      status: "success",
      message: "User updated successfully",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// userManager deleting single user
exports.deleteSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    // If user not found
    if (!user) {
      return customError(res, 404, "User not found");
    }

    // userManager can only remove a user
    if (user.role === "user") {
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
    } else {
      return customError(
        res,
        401,
        "userManager can not remove an admin or manager"
      );
    }
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};
