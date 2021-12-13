const mongoose = require("mongoose");

// category schema
const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: [true, "A category must contain a name"],
    trim: true,
    maxlength: [150, "category name must be less than 150 characters"],
  },
  categoryType: {
    type: String,
    required: [true, "A category must contain a type"],
    enum: {
      values: [
        "Top wear",
        "Bottom wear",
        "Accessories",
        "Ethnic Fusion Wear",
        "Regional",
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
});

// Product model
module.exports = mongoose.model("Category", categorySchema);
