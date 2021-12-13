const mongoose = require("mongoose");

// category schema
const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, "A category must contain a name"],
      lowercase: true,
      trim: true,
      maxlength: [50, "category name must be less than 50 characters"],
    },
    categoryType: {
      type: String,
      required: [true, "A category must contain a type"],
      lowercase: true,
      enum: {
        values: [
          "top wear",
          "bottom wear",
          "accessories",
          "ethnic fusion wear",
          "regional",
        ],
        message: "Please select from above category type",
      },
    },
    gender: {
      type: String,
      required: [true, "A category must contain a gender"],
      enum: {
        values: ["Men", "Women", "Boy", "Girl"],
        message: "Please select the correct gender",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Created by is required"],
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Product model
module.exports = mongoose.model("Category", categorySchema);
