const mongoose = require("mongoose");

// order schema
const orderSchema = mongoose.Schema(
  {
    shippingInfo: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "An order must contain shippingInfo"],
      ref: "Shipping",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "An order must contain user"],
      ref: "User",
    },
    paymentInfo: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "An order must contain paymentInfo"],
      ref: "Payment",
    },
    orderItems: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "An order must contain orderItem"],
          ref: "OrderItem",
        },
      },
    ],
    taxAmount: {
      type: Number,
      required: [true, "An order must contain taxAmount"],
    },
    shippingAmount: {
      type: Number,
      required: [true, "An order must contain shippingAmount"],
    },
    orderStatus: {
      status: {
        type: String,
        lowercase: true,
        default: "order created",
        required: [true, "An order schema must contain orderStatus's status"],
        enum: {
          values: [
            "order created",
            "order arriving",
            "order dispatched",
            "out for delivery",
            "delivered",
          ],
          message: "Select from the category",
        },
      },
      deliveredAt: {
        type: Date,
      },
      isDelivered: {
        type: Boolean,
        default: false,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// order model
module.exports = mongoose.model("Order", orderSchema);
