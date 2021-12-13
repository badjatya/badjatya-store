const mongoose = require("mongoose");

// image schema
const imageSchema = new mongoose.Schema({
  publicId: {
    type: String,
    required: [true, "An image must contain a public id"],
    trim: true,
  },
  secureUrl: {
    type: String,
    required: [true, "An image must contain a secure url"],
    trim: true,
  },
});

// Product model
module.exports = mongoose.model("Image", imageSchema);
