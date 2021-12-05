// Model
const User = require("../models/user");

//** */ Controllers

// Signup
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!(name || email || password)) {
    return res.status(400).json({
      status: "failed",
      message: "name, email and password are required",
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    accountCreatedUsing: "local",
  });

  res.status(201).json({
    status: "success",
    user,
  });
};
