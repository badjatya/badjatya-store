const mongoose = require("mongoose");

// Brand schema
const brandSchema = new mongoose.Schema({
  name: {
    type: String,
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
    default: false,
    required: true,
  },
});

// Product model
module.exports = mongoose.model("Brand", brandSchema);
