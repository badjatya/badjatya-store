const mongoose = require("mongoose");

// category schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A product must contain a name"],
    trim: true,
    maxlength: [150, "product name must be less than 150 characters"],
  },
});

// Product model
module.exports = mongoose.model("Category", categorySchema);
