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
exports.addCategory = async (req, res) => {
  try {
    const { categoryName, categoryType, gender } = req.body;

    // Checking all the fields
    if (!categoryName || !categoryType || !gender) {
      return customError(
        res,
        400,
        "A category must contain categoryName, categoryType and gender"
      );
    }

    // Checking is category already exist
    const categoryExist = await Category.findOne({
      categoryName: categoryName.toLowerCase(),
      categoryType,
      gender,
    });

    // If category already present in DB
    if (categoryExist) {
      return customError(res, 401, "Category already exists");
    }

    // Creating new category
    const category = await Category.create({
      categoryName,
      categoryType,
      gender,
      createdBy: req.user._id,
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

// Creating Brand
exports.addBrand = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Checking all the fields
    if (!name || !description) {
      return customError(res, 400, "A brand must contain name and description");
    }

    // Checking is brand already exist
    const brandExist = await Brand.findOne({ name });

    // If brand already present in DB
    if (brandExist) {
      return customError(res, 401, "Brand already exists");
    }

    // Creating new brand
    const brand = await Brand.create({
      name: name.toLowerCase(),
      description,
      createdBy: req.user._id,
    });

    res.status(201).json({
      status: "success",
      message: "Brand created",
      brand,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};
