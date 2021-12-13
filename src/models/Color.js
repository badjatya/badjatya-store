const mongoose = require("mongoose");

// Color schema
const colorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A color must contain a name"],
    trim: true,
  },
  hexCode: {
    type: String,
    required: [true, "A color must have a hex code"],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, "Enter the number of quantity"],
  },
});

// Product model
module.exports = mongoose.model("Color", colorSchema);
