const mongoose = require("mongoose");

// Brand schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      lowercase: true,
      required: [true, "A brand must contain a name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "A brand must have a description"],
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
      required: true,
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
module.exports = mongoose.model("Brand", brandSchema);
