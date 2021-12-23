const mongoose = require("mongoose");

// Discount schema
const discountSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A discount must contain name"],
    },
    description: {
      type: String,
      required: [true, "A discount must contain description"],
    },
    discountPercentage: {
      type: Number,
      required: [true, "A discount must contain discountPercentage"],
    },
    available: {
      type: Boolean,
      default: false,
      required: [true, "A discount must contain available"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "A Discount must contain a user who created discount"],
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Discount model
module.exports = mongoose.model("Discount", discountSchema);
