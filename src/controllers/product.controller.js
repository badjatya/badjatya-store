// Model
const User = require("../models/user");
const Product = require("../models/product");
const Image = require("../models/image");
const Brand = require("../models/brand");
const Category = require("../models/category");

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

// Get ALl Category
exports.getAllCategory = async (req, res) => {
  try {
    // Getting all category
    const categories = await Category.find({});

    res.status(200).json({
      status: "success",
      categories,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Get single Category
exports.getSingleCategory = async (req, res) => {
  try {
    // Getting all category
    const category = await Category.findById(req.params.id);

    // If category not found
    if (!category) {
      return customError(
        res,
        404,
        "Category your looking for not found, please try different id"
      );
    }

    res.status(200).json({
      status: "success",
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
      user: req.user._id,
      thumbnail,
      category: categoryExist._id,
      brand: brandExist._id,
      stock,
      images,
      sizes: ["s", "m", "l"],
      colors: ["#000", "#fff", "#333"],
    });

    // Response
    res.status(201).json({
      status: "success",
      message: "Product created",
      product,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    // If product not found
    if (!product) {
      return customError(res, 404, "Product not found");
    }

    // Updating product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name || product.name,
        shortDescription: req.body.shortDescription || product.shortDescription,
        longDescription: req.body.longDescription || product.longDescription,
        price: req.body.price || product.price,
        mrp: req.body.mrp || product.mrp,
        inStock: req.body.inStock || product.inStock,
        clothMaterial: req.body.clothMaterial || product.clothMaterial,
        careMethod: req.body.careMethod || product.careMethod,
        user: req.user._id,
        sizes: req.body.sizes || product.sizes,
        colors: req.body.colors || product.colors,
        stock: req.body.stock || product.stock,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    // Response
    res.json({
      status: "success",
      message: "Product updated successfully",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};
