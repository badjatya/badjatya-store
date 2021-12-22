const mongoose = require("mongoose");

// orderItem schema
const orderItemSchema = mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "An orderItem must contain productName"],
    },
    quantity: {
      type: Number,
      required: [true, "An orderItem must contain quantity"],
    },
    thumbnail: {
      type: String,
      required: [true, "An orderItem must contain thumbnail"],
    },
    price: {
      type: Number,
      required: [true, "An orderItem must contain price"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "An order must contain product"],
      ref: "Product",
    },
  },
  {
    timestamps: true,
  }
);

// orderItem model
module.exports = mongoose.model("OrderItem", orderItemSchema);
