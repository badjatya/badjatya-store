// Model
const User = require("../models/user");
const Product = require("../models/product");
const Image = require("../models/image");
const Brand = require("../models/brand");
const Category = require("../models/category");
const Size = require("../models/size");

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

// Creating Product
exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      shortDescription,
      longDescription,
      price,
      mrp,
      clothMaterial,
      careMethod,
      brand,
      stock,
      categoryName,
      categoryType,
      gender,
    } = req.body;

    // Checking all the fields
    if (
      !name ||
      !shortDescription ||
      !longDescription ||
      !price ||
      !mrp ||
      !clothMaterial ||
      !careMethod ||
      !brand ||
      !stock ||
      !categoryName ||
      !categoryType ||
      !gender
    ) {
      return customError(
        res,
        400,
        "A Product must contain name, shortDescription, longDescription, price, mrp, thumbnail, clothMaterial, careMethod, brand,stock, images and category"
      );
    }

    // Checking thumbnail and images are present
    if (!req.files.thumbnail || !req.files.images) {
      return customError(res, 400, "A Product must thumbnail and images");
    }

    // Checking is brand exist
    const brandExist = await Brand.findOne({ name: brand });
    // If brand is not present in DB
    if (!brandExist) {
      return customError(res, 401, "Brand does not exists");
    }

    // Checking is category exist
    const categoryExist = await Category.findOne({
      categoryName: categoryName.toLowerCase(),
      categoryType,
      gender,
    });
    // If category is not present in DB
    if (!categoryExist) {
      return customError(res, 401, "Category does not exists");
    }

    // Saving Photos
    let imageArray = [];
    // Uploading image based on single image or multiple image
    if (req.files.images.length !== undefined) {
      for (let index = 0; index < req.files.images.length; index++) {
        let result = await cloudinary.v2.uploader.upload(
          req.files.images[index].tempFilePath,
          {
            folder: "badjatya-store/products",
          }
        );

        imageArray.push({
          id: result.public_id,
          secureUrl: result.secure_url,
        });
      }
    } else {
      let result = await cloudinary.v2.uploader.upload(
        req.files.images.tempFilePath,
        {
          folder: "badjatya-store/products",
        }
      );

      imageArray.push({
        id: result.public_id,
        secureUrl: result.secure_url,
      });
    }

    // Saving to db
    const images = [];
    imageArray.map(async (img) => {
      const image = await Image.create({
        publicId: img.id,
        secureUrl: img.secureUrl,
      });
      images.push({ id: image._id });
    });

    // Saving thumbnail
    const result = await cloudinary.v2.uploader.upload(
      req.files.thumbnail.tempFilePath,
      {
        folder: "badjatya-store/products",
      }
    );

    const thumbnail = {
      pubicId: result.public_id,
      secureUrl: result.secure_url,
    };

    // Creating Product
    const product = await Product.create({
      name,
      shortDescription,
      longDescription,
      price,
      mrp,
      clothMaterial,
      careMethod,
      thumbnail,
      category: categoryExist._id,
      brand: brandExist._id,
      stock,
      images,
    });

    res.status(201).json({
      status: "success",
      message: "Product created",
      product,
    });
  } catch (error) {
    console.log(error);
    customError(res, 500, error.message, "error");
  }
};
