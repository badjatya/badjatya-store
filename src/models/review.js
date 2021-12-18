const mongoose = require("mongoose");

// review schema
const reviewSchema = new mongoose.Schema({
  user: {
    type: String,
    required: [true, "An review must contain a user"],
    ref: "User",
  },
  name: {
    type: String,
    required: [true, "An review must contain a name of the user"],
    trim: true,
    maxlength: [50, "Name must be less than 50 characters"],
  },
  star: {
    type: Number,
    required: [true, "An review must contain a star"],
    trim: true,
    min: [1, "Star must be between 1 to 5"],
    max: [5, "Star must be between 1 to 5"],
  },
  comment: {
    type: String,
    required: [true, "An review must contain a comment"],
    trim: true,
    maxlength: [200, "Name must be less than 200 characters"],
  },
});

// Product model
module.exports = mongoose.model("Review", reviewSchema);
