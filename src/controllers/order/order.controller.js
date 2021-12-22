// Model
const Product = require("../../models/product");
const Image = require("../../models/Image");
const Brand = require("../../models/brand");
const Category = require("../../models/category");
const Review = require("../../models/review");

const Order = require("../../models/order/order");
const OrderItem = require("../../models/order/orderItem");
const Payment = require("../../models/order/payment");
const Shipping = require("../../models/order/shipping");

// Lib
const cloudinary = require("cloudinary");

// Utils
const customError = require("../../utils/customError");

// Creating Order
exports.createOrder = async (req, res) => {
  try {
    // Destructuring order
    const {
      shippingInfo,
      paymentInfo,
      orderItems,
      taxAmount,
      shippingAmount,
      totalAmount,
    } = req.body;

    // Checking all the fields
    if (
      !shippingInfo ||
      !paymentInfo ||
      !orderItems ||
      !taxAmount ||
      !shippingAmount ||
      !totalAmount
    ) {
      return customError(
        res,
        400,
        "An Order must contain shippingInfo, paymentInfo, orderItems, taxAmount, totalAmount and shippingAmount."
      );
    }

    // * Shipping
    // Destructuring shippingInfo
    const { phoneNumber, addressLineOne, city, state, country, postalCode } =
      req.body.shippingInfo;

    // Checking all the fields of shippingInfo
    if (
      !phoneNumber ||
      !addressLineOne ||
      !city ||
      !state ||
      !country ||
      !postalCode
    ) {
      return customError(
        res,
        401,
        "An Order must contain Shipping Info like, phoneNumber, addressLineOne, city, state, country, postalCode"
      );
    }

    // Creating shipping if new added or at same
    let shipping = await Shipping.findOne({
      user: req.user._id,
      phoneNumber,
      addressLineOne,
    });

    // Shipping does not exist creating shipping
    if (!shipping) {
      shipping = await Shipping.create({
        ...req.body.shippingInfo,
        user: req.user._id,
      });
    }

    // * Payment
    // Destructuring Payment
    const { orderId, successId } = req.body.paymentInfo;

    // Checking all the fields of Payment
    if (!orderId || !successId) {
      return customError(
        res,
        400,
        "An Order must contain Payment Info like, orderId and successId."
      );
    }

    // Saving payment
    const payment = await Payment.create({
      ...req.body.paymentInfo,
      user: req.user._id,
    });

    // * OrderItem
    // Destructuring OrderItem
    const { product, quantity } = req.body.orderItems[0];

    // Checking all the fields of OrderItem
    if (!product || !quantity) {
      // Removing payment
      await payment.remove();

      return customError(
        res,
        400,
        "An Order must contain Order item like, product and quantity."
      );
    }

    // Saving orders
    let orders = [];
    for (let index = 0; index < orderItems.length; index++) {
      const productOrdered = await Product.findOne({
        _id: orderItems[index].product,
        inStock: true,
      });

      // If product does not exists
      if (
        !productOrdered ||
        productOrdered.stock < orderItems[index].quantity
      ) {
        await payment.remove();
        return customError(
          res,
          401,
          "Product ordered does not exists or out of stock"
        );
      }

      // Creating order item
      const order = await OrderItem.create({
        productName: productOrdered.name,
        quantity: orderItems[index].quantity,
        thumbnail: productOrdered.thumbnail.secureUrl,
        price: productOrdered.price,
        product: productOrdered._id,
      });

      // pushing to array
      orders.push({ id: order._id });

      // Updating product stock
      productOrdered.stock = productOrdered.stock - orderItems[index].quantity;
      if (productOrdered.stock === 0) {
        productOrdered.inStock = false;
      }

      // Saving updated product
      await productOrdered.save();
    }

    // * Order
    // Creating order
    const order = await Order.create({
      shippingInfo: shipping._id,
      user: req.user._id,
      paymentInfo: payment._id,
      orderItems: orders,
      taxAmount,
      totalAmount,
      shippingAmount,
    });

    res.status(201).json({
      status: "success",
      message: "Order created",
      order,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};
