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
  },
  {
    timestamps: true,
  }
);

// Hashing password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Generating json web token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

// Comparing passwords
userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// creating email verification token
userSchema.methods.getEmailVerificationToken = function () {
  this.confirmEmailToken = jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET_KEY_CONFIRM_EMAIL,
    {
      expiresIn: "20m",
    }
  );

  return this.confirmEmailToken;
};

// Exporting Model
module.exports = mongoose.model("User", userSchema);
