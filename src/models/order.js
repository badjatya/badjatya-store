const mongoose = require("mongoose");

// order schema
const orderSchema = mongoose.Schema(
  {
    shippingInfo: {
      phoneNumber: {
        type: Number,
        required: [
          true,
          "An order schema must contain shippingInfo's phoneNumber",
        ],
      },
      alternatePhoneNumber: Number,
      addressLineOne: {
        type: String,
        required: [
          true,
          "An order schema must contain shippingInfo's addressLineOne",
        ],
        maxlength: [150, "An order must contain addressLineOne"],
      },
      addressLineTwo: String,
      landmark: String,
      city: {
        type: String,
        required: [true, "An order schema must contain shippingInfo's city"],
      },
      state: {
        type: String,
        required: [true, "An order schema must contain shippingInfo's state"],
      },
      country: {
        type: String,
        required: [true, "An order schema must contain shippingInfo's country"],
      },
      postalCode: {
        type: Number,
        required: [
          true,
          "An order schema must contain shippingInfo's postalCode",
        ],
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "An order must contain user"],
      ref: "User",
    },
    paymentInfo: {
      orderId: {
        type: String,
        required: [true, "An order must contain paymentInfo's orderId"],
      },
      successId: {
        type: String,
        required: [true, "An order must contain paymentInfo's successId"],
      },
    },
    orderItems: [
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
        default: "Order Created",
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
