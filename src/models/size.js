const mongoose = require("mongoose");

// Size schema
const sizeSchema = new mongoose.Schema({
  size: {
    type: String,
    required: [true, "A product must contain a size"],
    trim: true,
  },
  //   quantity: {
  //     type: Number,
  //     required: [true, "Enter the number of quantity"],
  //   },
  colors: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Color",
      },
    },
  ],
});

// Product model
module.exports = mongoose.model("Size", sizeSchema);
