const mongoose = require("mongoose");

// payment schema
const paymentSchema = mongoose.Schema(
  {
    orderId: {
      type: String,
      required: [true, "An order must contain paymentInfo's orderId"],
    },
    successId: {
      type: String,
      required: [true, "An order must contain paymentInfo's successId"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "An Payment must contain user"],
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// payment model
module.exports = mongoose.model("Payment", paymentSchema);
