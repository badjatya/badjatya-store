// Model
const Discount = require("../../models/order/discount");

// Lib
const cloudinary = require("cloudinary");

// Utils
const customError = require("../../utils/customError");

// ** User

// Creating Discount
exports.addDiscount = async (req, res) => {
  try {
    // Destructuring
    const { name, description, discountPercentage, available } = req.body;

    // If order not found
    if (!name || !description || !discountPercentage || !available) {
      return customError(
        res,
        400,
        "A discount must contain name, description, discountPercentage and available."
      );
    }

    // Creating discount
    const discount = await Discount.create({
      name,
      description,
      discountPercentage,
      available,
      user: req.user._id,
    });

    // Response
    res.json({
      status: "success",
      message: "Discount created",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Getting all discounts
exports.getAllDiscounts = async (req, res) => {
  try {
    // Getting all discounts
    const discounts = await Discount.find({})
      .sort("-createdAt")
      .select(["-user", "-description", "-__v", "-updatedAt", "-createdAt"]);

    // Response
    res.json({
      status: "success",
      result: discounts.length,
      discounts,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};
