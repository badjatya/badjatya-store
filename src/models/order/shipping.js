const mongoose = require("mongoose");

// shipping schema
const shippingSchema = mongoose.Schema(
  {
    phoneNumber: {
      type: Number,
      required: [
        true,
        "An order schema must contain shippingInfo's phoneNumber",
      ],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "An order must contain user"],
      ref: "User",
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
  {
    timestamps: true,
  }
);

// order model
module.exports = mongoose.model("Shipping", shippingSchema);
