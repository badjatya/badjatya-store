// Model
const User = require("../models/user");

// Utils
const emailSender = require("../utils/emailSender");
const customError = require("../utils/customError");

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

    // Creating new user
    const user = await User.create({ name, email, password });

    // confirm email token (valid for 20min)
    const confirmEmailToken = user.getJwtConfirmEmailToken();

    // Url for token
    const tokenUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/email/confirm/${confirmEmailToken}`;

    emailSender({
      email,
      subject: `Confirm email mail to ${name}`,
      text: "Click on the button to confirm email",
      html: `
      <p style="margin-bottom: 20px">Click below button to confirm email </p>
      <a style="display:block; text-align:center; padding:20px; background-color: black; color: white; border-radius: 30px; text-decoration:none " href=${tokenUrl}>Confirm email</a>
      `,
    });

    res.json({
      status: "success",
      message: "Email sent successfully, confirm email",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};
