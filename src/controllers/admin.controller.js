const User = require("../models/user");

exports.adminGetAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ["user", "manager"] } });

    res.json({
      status: "success",
      result: users.length,
      users,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};
