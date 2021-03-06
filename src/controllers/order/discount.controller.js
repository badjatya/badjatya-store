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

// Getting single discount
exports.getSingleDiscount = async (req, res) => {
  try {
    // Getting single discount
    const discount = await Discount.findById(req.params.id);

    // If discount not found
    if (!discount) {
      return customError(res, 404, "Discount not found");
    }

    // Response
    res.json({
      status: "success",
      discount,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Updating single discount
exports.updateSingleDiscount = async (req, res) => {
  try {
    // Getting single discount
    const discount = await Discount.findById(req.params.id);

    // If discount not found
    if (!discount) {
      return customError(res, 404, "Discount not found");
    }

    // Updating discount
    await Discount.findByIdAndUpdate(
      discount._id,
      {
        available: req.body.available,
        name: req.body.name,
        description: req.body.description,
        user: req.user._id,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    // Response
    res.json({
      status: "success",
      message: "Discount updated",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Deleting discount
exports.deleteSingleDiscount = async (req, res) => {
  try {
    // Getting single discount
    const discount = await Discount.findById(req.params.id);

    // If discount not found
    if (!discount) {
      return customError(res, 404, "Discount not found");
    }

    // Deleting discount
    await Discount.findByIdAndDelete(discount._id);

    // Response
    res.json({
      status: "success",
      message: "Discount deleted",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};
