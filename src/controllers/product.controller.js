// Model
const Product = require("../models/product");
const Image = require("../models/Image");
const Brand = require("../models/brand");
const Category = require("../models/category");
const Review = require("../models/review");

// Lib
const cloudinary = require("cloudinary");

// Utils
const customError = require("../utils/customError");
const productsQueryHandler = require("../utils/productsQueryHandler");

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
    // Getting single category
    const category = await Category.findById(req.params.id);

    // If category not found
    if (!category) {
      return customError(
        res,
        404,
        "Category your looking for not found, please try different id"
      );
    }

    // response
    res.status(200).json({
      status: "success",
      category,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Get all products by category
exports.getAllProductsByCategory = async (req, res) => {
  try {
    // Getting single category
    const category = await Category.findById(req.params.id);

    // If category not found
    if (!category) {
      return customError(
        res,
        404,
        "Category your looking for not found, please try different id"
      );
    }

    // getting all products of category
    const products = await Product.find({ category: category._id }).select([
      "-longDescription",
      "-clothMaterial",
      "-careMethod",
      "-category",
      "-brand",
      "-user",
      "-sizes",
      "-colors",
      "-images",
      "-rating",
      "-numberOfReviews",
      "-createdAt",
      "-updatedAt",
      "-__v",
      "-stock",
    ]);

    //

    // response
    res.status(200).json({
      status: "success",
      result: products.length,
      products,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    // Getting single category
    const category = await Category.findById(req.params.id);

    // If category not found
    if (!category) {
      return customError(
        res,
        404,
        "Category your looking for not found, please try different id"
      );
    }

    // Updating category
    await Category.findByIdAndUpdate(
      req.params.id,
      {
        categoryName: req.body.categoryName || category.categoryName,
        categoryType: req.body.categoryType || category.categoryType,
        gender: req.body.gender || category.gender,
        createdBy: req.user._id,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      message: "Category updated successfully",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    // Getting category
    const category = await Category.findById(req.params.id);

    // If category not found
    if (!category) {
      return customError(
        res,
        404,
        "Category your looking for not found, please try different id"
      );
    }

    // Getting all products of Category
    const products = await Product.find({ category: req.params.id });

    // Mapping products to delete images, thumbnail, reviews and product
    products.map(async (product) => {
      // Deleting thumbnail
      await cloudinary.v2.uploader.destroy(product.thumbnail.pubicId);

      for (let index = 0; index < product.images.length; index++) {
        const image = await Image.findById(product.images[index].id);

        // Deleting images
        await cloudinary.v2.uploader.destroy(image.publicId);
        await image.remove();
      }

      // Removing reviews
      const allReviewsOfThisProduct = await Review.find({
        product: product._id,
      });
      allReviewsOfThisProduct.map(async (review) => {
        await Review.findByIdAndDelete(review._id);
      });

      await product.remove();
    });

    // deleting category
    await category.remove();

    res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
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

// Get ALl Brand
exports.getAllBrand = async (req, res) => {
  try {
    // Getting all Brand
    const brands = await Brand.find({});

    res.status(200).json({
      status: "success",
      result: brands.length,
      brands,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Get single Brand
exports.getSingleBrand = async (req, res) => {
  try {
    // Getting single brand
    const brand = await Brand.findById(req.params.id);

    // If brand not found
    if (!brand) {
      return customError(
        res,
        404,
        "Brand your looking for not found, please try different id"
      );
    }

    // response
    res.status(200).json({
      status: "success",
      brand,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Get all products by brand
exports.getAllProductsByBrand = async (req, res) => {
  try {
    // Getting single brand
    const brand = await Brand.findById(req.params.id);

    // If brand not found
    if (!brand) {
      return customError(
        res,
        404,
        "Brand your looking for not found, please try different id"
      );
    }

    // getting all products of brand
    const products = await Product.find({ brand: brand._id }).select([
      "-longDescription",
      "-clothMaterial",
      "-careMethod",
      "-category",
      "-brand",
      "-user",
      "-sizes",
      "-colors",
      "-images",
      "-rating",
      "-numberOfReviews",
      "-createdAt",
      "-updatedAt",
      "-__v",
      "-stock",
    ]);

    // response
    res.status(200).json({
      status: "success",
      result: products.length,
      products,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Update Brand
exports.updateBrand = async (req, res) => {
  try {
    // Getting single brand
    const brand = await Brand.findById(req.params.id);

    // If brand not found
    if (!brand) {
      return customError(
        res,
        404,
        "Brand your looking for not found, please try different id"
      );
    }

    // Updating brand
    await Brand.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name || brand.name,
        description: req.body.description || brand.description,
        active: req.body.active || brand.active,
        createdBy: req.user._id,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      message: "Brand updated successfully",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Delete Brand
exports.deleteBrand = async (req, res) => {
  try {
    // Getting brand
    const brand = await Brand.findById(req.params.id);

    // If brand not found
    if (!brand) {
      return customError(
        res,
        404,
        "Brand your looking for not found, please try different id"
      );
    }

    // Getting all products of brands
    const products = await Product.find({ brand: req.params.id });

    // Mapping products to delete images, thumbnail, reviews and product
    products.map(async (product) => {
      // Deleting thumbnail
      await cloudinary.v2.uploader.destroy(product.thumbnail.pubicId);

      for (let index = 0; index < product.images.length; index++) {
        const image = await Image.findById(product.images[index].id);

        // Deleting images
        await cloudinary.v2.uploader.destroy(image.publicId);
        await image.remove();
      }

      // Removing reviews
      const allReviewsOfThisProduct = await Review.find({
        product: product._id,
      });
      allReviewsOfThisProduct.map(async (review) => {
        await Review.findByIdAndDelete(review._id);
      });

      await product.remove();
    });

    // deleting brand
    await brand.remove();

    res.status(200).json({
      status: "success",
      message: "Brand deleted successfully",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// ** Product

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

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    let products = new productsQueryHandler(
      Product.find().select([
        "-longDescription",
        "-clothMaterial",
        "-careMethod",
        "-category",
        "-brand",
        "-user",
        "-sizes",
        "-colors",
        "-images",
        "-rating",
        "-numberOfReviews",
        "-createdAt",
        "-updatedAt",
        "-__v",
        "-stock",
      ]),
      req.query
    )
      .search()
      .filter();
    const totalProducts = await Product.countDocuments();
    const totalProductPerPage = 6;

    products.pager(totalProductPerPage);
    products = await products.base;

    // response
    res.status(200).json({
      status: "success",
      result: products.length,
      totalProducts,
      products,
    });

    // const products = await Product.find({}).select([
    //   "-longDescription",
    //   "-clothMaterial",
    //   "-careMethod",
    //   "-category",
    //   "-brand",
    //   "-user",
    //   "-sizes",
    //   "-colors",
    //   "-images",
    //   "-rating",
    //   "-numberOfReviews",
    //   "-createdAt",
    //   "-updatedAt",
    //   "-__v",
    //   "-stock",
    // ]);
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Get single product
exports.getSingleProduct = async (req, res) => {
  try {
    // Getting single product and populating images, category and brand
    const product = await Product.findById(req.params.id)
      .populate(["images.id", "category", "brand", "reviews.id"])
      .select("-user");

    // If product not found
    if (!product) {
      return customError(
        res,
        404,
        "Product your looking for not found, please try different id"
      );
    }

    // response
    res.status(200).json({
      status: "success",
      product,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Update Product details
exports.updateSingleProductDetails = async (req, res) => {
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

// Update Product thumbnail
exports.updateSingleProductThumbnail = async (req, res) => {
  try {
    // If thumbnail not found
    if (!req.files) {
      return customError(
        res,
        401,
        "Product thumbnail updation, must contain new thumbnail"
      );
    }

    // Getting product
    const product = await Product.findById(req.params.id);

    // If product not found
    if (!product) {
      return customError(res, 404, "Product not found");
    }

    // Deleting thumbnail from cloudinary
    await cloudinary.v2.uploader.destroy(product.thumbnail.pubicId);

    // Uploading new thumbnail to cloudinary
    const result = await cloudinary.v2.uploader.upload(
      req.files.thumbnail.tempFilePath,
      {
        folder: "badjatya-store/products",
      }
    );

    // Saving thumbnail to DB
    product.thumbnail = {
      pubicId: result.public_id,
      secureUrl: result.secure_url,
    };
    await product.save();

    // Response
    res.json({
      status: "success",
      message: "Product thumbnail updated successfully",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Update Product images
exports.updateSingleProductImages = async (req, res) => {
  try {
    // If images not found
    if (!req.files) {
      return customError(
        res,
        401,
        "Product Images updation, must contain new images"
      );
    }

    // Getting product
    const product = await Product.findById(req.params.id);

    // If product not found
    if (!product) {
      return customError(res, 404, "Product not found");
    }

    // Deleting images from cloudinary and delete Image  from db
    for (let index = 0; index < product.images.length; index++) {
      const image = await Image.findById(product.images[index].id);
      // Deleting images
      await cloudinary.v2.uploader.destroy(image.publicId);
      await image.remove();
    }

    // Uploading new images to cloudinary and saving to db
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

    // Saving Image model's id to Product db
    let images = [];
    for (let index = 0; index < imageArray.length; index++) {
      const image = await Image.create({
        publicId: imageArray[index].id,
        secureUrl: imageArray[index].secureUrl,
      });
      images.push({ id: image._id });
    }

    // Saving to product db
    product.images = images;
    await product.save();

    // Response
    res.json({
      status: "success",
      message: "Product images updated successfully",
    });
  } catch (error) {
    console.log(error);
    customError(res, 500, error.message, "error");
  }
};

// Update Product category
exports.updateSingleProductCategory = async (req, res) => {
  try {
    const { categoryName, categoryType, gender } = req.body;

    // Checking all the fields
    if (!categoryName || !categoryType || !gender) {
      return customError(
        res,
        400,
        "A Product category updation must contain categoryName, categoryType and gender"
      );
    }

    // Getting product
    const product = await Product.findById(req.params.id);

    // If product not found
    if (!product) {
      return customError(res, 404, "Product not found");
    }

    // Checking is category exist
    const category = await Category.findOne({
      categoryName: categoryName.toLowerCase(),
      categoryType,
      gender,
    });
    // If category is not present in DB
    if (!category) {
      return customError(res, 401, "Category does not exists");
    }

    // saving category id
    product.category = category._id;

    // Updating product
    await product.save();

    // Response
    res.status(200).json({
      status: "success",
      message: "Product category updated",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Update Product brand
exports.updateSingleProductBrand = async (req, res) => {
  try {
    // Checking all the fields
    if (!req.body.brand) {
      return customError(
        res,
        400,
        "A Product brand updation must contain brand name"
      );
    }

    // Getting product
    const product = await Product.findById(req.params.id);

    // If product not found
    if (!product) {
      return customError(res, 404, "Product not found");
    }

    // Checking is brand exist
    const brand = await Brand.findOne({ name: req.body.brand });
    // If brand is not present in DB
    if (!brand) {
      return customError(res, 401, "brand does not exists");
    }

    // saving brand id
    product.brand = brand._id;

    // Updating product
    await product.save();

    // Response
    res.status(200).json({
      status: "success",
      message: "Product brand updated",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Create review
exports.createProductReview = async (req, res) => {
  try {
    // Getting body
    const { star, comment } = req.body;
    if (!star || !comment) {
      return customError(res, 400, "Review must contain star and comment");
    }

    // Getting single product
    const product = await Product.findById(req.params.id);

    // If product not found
    if (!product) {
      return customError(
        res,
        404,
        "Product your looking for not found, please try different id"
      );
    }

    // Checking is user already created a review on this product
    const reviewExist = await Review.findOne({
      user: req.user._id,
      product: product._id,
    });

    // if Review exist update the previous review else create new review
    if (reviewExist) {
      reviewExist.star = star;
      reviewExist.comment = comment;

      // Saving to db
      await reviewExist.save();
    } else {
      // Creating new review
      const review = await Review.create({
        user: req.user._id,
        name: req.user.name,
        product: product._id,
        star,
        comment,
      });

      // Saving to product
      product.reviews = product.reviews.push({ id: review._id });
    }

    // Getting all reviews of this product
    const allReviewsOfThisProduct = await Review.find({ product: product._id });

    // Calculating rating
    let totalRating = 0;
    allReviewsOfThisProduct.forEach(
      (review) => (totalRating = totalRating + review.star)
    );
    const totalReviews = allReviewsOfThisProduct.length;

    // Updating product
    product.numberOfReviews = totalReviews;
    product.rating = (totalRating / totalReviews).toFixed(2);

    // Saving to DB
    await product.save({ validateBeforeSave: false });

    // response
    res.status(200).json({
      status: "success",
      message: "Review created",
    });
  } catch (error) {
    console.log(error);
    customError(res, 500, error.message, "error");
  }
};

// get all product reviews of a product
exports.getAllProductReviews = async (req, res) => {
  try {
    // Getting single product
    const product = await Product.findById(req.params.id).populate(
      "reviews.id"
    );

    // If product not found
    if (!product) {
      return customError(
        res,
        404,
        "Product your looking for not found, please try different id"
      );
    }

    // response
    res.status(200).json({
      status: "success",
      reviews: product.reviews,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Delete review
exports.userDeleteProductReview = async (req, res) => {
  try {
    // Getting single product
    const product = await Product.findById(req.params.id);

    // If product not found
    if (!product) {
      return customError(
        res,
        404,
        "Product your looking for not found, please try different id"
      );
    }

    // Finding the review
    const review = await Review.findOne({
      user: req.user._id,
      product: product._id,
    });

    // If review not found
    if (!review) {
      return customError(res, 400, "Review not found");
    }

    // Deleting review in product DB
    product.reviews = product.reviews.filter(
      (r) => r.id.toString() !== review._id.toString()
    );
    // Deleting Review in DB
    await review.remove();

    // Finding all reviews on product
    const allReviewsOfThisProduct = await Review.find({ product: product._id });

    // Calculating rating
    let totalRating = 0;
    allReviewsOfThisProduct.forEach(
      (review) => (totalRating = totalRating + review.star)
    );
    const totalReviews = allReviewsOfThisProduct.length;

    // Updating product
    product.numberOfReviews = totalReviews;
    product.rating = (totalRating / totalReviews).toFixed(2);

    // Saving to DB
    await product.save({ validateBeforeSave: false });

    // response
    res.status(200).json({
      status: "success",
      message: "Review deleted successfully",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Delete review by admin, manager or product Manager
exports.deleteProductReview = async (req, res) => {
  // Getting Details
  const { productId, reviewId } = req.body;

  // If fields are missing
  if (!productId || !reviewId) {
    return customError(
      res,
      400,
      "For removing review, productId and reviewId are required"
    );
  }

  try {
    // Getting single product
    const product = await Product.findById(productId);

    // If product not found
    if (!product) {
      return customError(
        res,
        404,
        "Product your looking for not found, please try different id"
      );
    }

    // Finding the review
    const review = await Review.findById(reviewId);

    // If review not found
    if (!review) {
      return customError(res, 400, "Review not found");
    }

    // Deleting review in product DB
    product.reviews = product.reviews.filter(
      (r) => r.id.toString() !== review._id.toString()
    );
    // Deleting Review in DB
    await review.remove();

    // Finding all reviews on product
    const allReviewsOfThisProduct = await Review.find({ product: product._id });

    // Calculating rating
    let totalRating = 0;
    allReviewsOfThisProduct.forEach(
      (review) => (totalRating = totalRating + review.star)
    );
    const totalReviews = allReviewsOfThisProduct.length;

    // Updating product
    product.numberOfReviews = totalReviews;
    product.rating = (totalRating / totalReviews).toFixed(2);

    // Saving to DB
    await product.save({ validateBeforeSave: false });

    // response
    res.status(200).json({
      status: "success",
      message: "Review deleted successfully",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Deleting Product
exports.deleteProduct = async (req, res) => {
  try {
    // Getting all products of brands
    const product = await Product.findById(req.params.id);

    // If product not found
    if (!product) {
      return customError(
        res,
        404,
        "Product your looking for not found, please try different id"
      );
    }

    // Deleting thumbnail
    await cloudinary.v2.uploader.destroy(product.thumbnail.pubicId);

    // Removing product image
    for (let index = 0; index < product.images.length; index++) {
      const image = await Image.findById(product.images[index].id);

      // Deleting images
      await cloudinary.v2.uploader.destroy(image.publicId);
      await image.remove();
    }

    // Removing reviews
    const allReviewsOfThisProduct = await Review.find({ product: product._id });
    allReviewsOfThisProduct.map(async (review) => {
      await Review.findByIdAndDelete(review._id);
    });

    // Removing product
    await product.remove();

    // Response
    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};
