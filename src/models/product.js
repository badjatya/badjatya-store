const mongoose = require("mongoose");

// product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A product must contain a name"],
    trim: true,
    maxlength: [150, "product name must be less than 150 characters"],
  },
  shortDescription: {
    type: String,
    required: [true, "A product must contain a short description"],
    trim: true,
    maxlength: [
      250,
      "A product short description must be less than 250 characters",
    ],
  },
  longDescription: {
    type: String,
    required: [true, "A product must contain a long description"],
    trim: true,
    maxlength: [
      500,
      "A product long description must be less than 500 characters",
    ],
  },
  regularPrice: {
    type: Number,
    required: [true, "A product must contain a price"],
    min: 0,
  },
  discountedPrice: {
    type: Number,
    default: 0,
    min: 0,
  },
  mrp: {
    type: Number,
    required: [true, "A product must contain a mrp"],
    min: 0,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  thumbnail: {
    pubicId: {
      type: String,
      required: [true, "A product must contain a thumbnail"],
    },
    secureUrl: {
      type: String,
      required: [true, "A product must contain a thumbnail"],
    },
  },
  clothMaterial: {
    type: String,
    required: [true, "A product must contain the name of material used"],
    trim: true,
    maxlength: [
      150,
      "A product material name must be less than 150 characters",
    ],
  },
  careMethod: {
    type: String,
    required: [true, "A product must contain a care method"],
    trim: true,
    maxlength: [150, "A product care method must be less than 150 characters"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },
});

// Product model
module.exports = mongoose.model("Product", productSchema);
