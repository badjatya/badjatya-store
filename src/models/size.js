const mongoose = require("mongoose");

// Size schema
const sizeSchema = new mongoose.Schema({
  sizes: [
    {
      type: String,
      required: [true, "A product must contain size"],
      lowercase: true,
      enum: {
        values: ["s", "m", "l", "xl", "xxl"],
        message: "Please enter correct size",
      },
    },
  ],
});

// Product model
module.exports = mongoose.model("Size", sizeSchema);
