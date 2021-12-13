// Model
const User = require("../models/user");
const Product = require("../models/product");
const Image = require("../models/image");
const Brand = require("../models/brand");
const Category = require("../models/category");
const Size = require("../models/size");
const Color = require("../models/color");

// Lib
const cloudinary = require("cloudinary");

// Utils
const customError = require("../utils/customError");

// Creating category
exports.createCategory = async (req, res) => {
  try {
    const { categoryName, categoryType, gender } = req.body;

    // Checking all the fields
    if (!categoryName || !categoryType || !gender) {
      return customError(
        res,
        400,
        "A category must contain categoryName, categoryType adn gender"
      );
    }

    // Checking is category already exist
    const categoryExist = await Category.findOne({
      categoryName,
      categoryType,
      gender,
    });
    console.log(categoryExist === null);

    // If category already present in DB
    if (categoryExist) {
      return customError(res, 401, "Category already exists");
    }

    // Creating new category
    const category = await Category.create({
      categoryName,
      categoryType,
      gender,
    });

    res.status(201).json({
      status: "success",
      message: "Category created",
      category,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};
