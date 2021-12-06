const mongoose = require("mongoose");

// Library
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
      trim: true,
      maxlength: [50, "Name must be less than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "A user must have a email"],
      trim: true,
      unique: [true, "A user must have a unique email"],
      lowercase: true,
      maxlength: [50, "Email must be less than 50 characters"],
      validate: validator.isEmail,
    },
    password: {
      type: String,
      trim: true,
      minlength: [7, "A password must contain at least 7 characters"],
    },
    role: {
      type: String,
      default: "user",
      enum: {
        values: ["user", "admin", "manager"],
        message: "Please select from this category",
      },
    },
    isVerifiedUser: {
      type: Boolean,
      default: false,
    },
    photo: {
      secureUrl: String,
      publicId: String,
    },
    accountCreatedUsing: {
      type: String,
      default: "local",
      required: [true, "User created account should be known"],
      enum: {
        values: ["local", "google", "facebook", "github"],
        message: "Please select from this category",
      },
    },
    google: {
      isGoogle: {
        type: Boolean,
        default: false,
      },
      googleId: String,
    },
    facebook: {
      isFacebook: {
        type: Boolean,
        default: false,
      },
      facebookId: String,
    },
    github: {
      isGithub: {
        type: Boolean,
        default: false,
      },
      githubId: String,
    },
    confirmEmailToken: String,
    resetPasswordToken: String,
    tokens: [
      {
        token: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hashing Password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Getting jwt login token
userSchema.methods.getJwtLoginToken = function () {
  const token = jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRY,
    }
  );

  this.tokens = this.tokens.concat({ token });
  return token;
};

// Checking is valid password
userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Getting jwt confirm email token
userSchema.methods.getJwtConfirmEmailToken = function () {
  const token = jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET_KEY_CONFIRM_EMAIL,
    {
      expiresIn: "20m",
    }
  );

  this.confirmEmailToken = token;
  return token;
};

// Getting jwt rest password token
userSchema.methods.getJwtResetPasswordToken = function () {
  const token = jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET_KEY_RESET_PASSWORD,
    {
      expiresIn: "20m",
    }
  );

  this.resetPasswordToken = token;
  return token;
};

// Exporting Model
module.exports = mongoose.model("User", userSchema);
