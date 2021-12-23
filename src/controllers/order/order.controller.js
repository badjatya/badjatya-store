// Model
const Product = require("../../models/product");
const Order = require("../../models/order/order");
const OrderItem = require("../../models/order/orderItem");
const Payment = require("../../models/order/payment");
const Shipping = require("../../models/order/shipping");

// Lib
const cloudinary = require("cloudinary");

// Utils
const customError = require("../../utils/customError");

// ** User

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

// User getting all orders
exports.userGettingAllOrders = async (req, res) => {
  try {
    // Getting all orders created by user
    const orders = await Order.find({ user: req.user._id })
      .sort("-createdAt")
      .select([
        "-shippingInfo",
        "-user",
        "-paymentInfo",
        "-taxAmount",
        "-shippingAmount",
        "-updatedAt",
        "-__v",
      ])
      .populate("orderItems.id", [
        "productName",
        "price",
        "quantity",
        "thumbnail",
      ]);

    // Response
    res.json({
      status: "success",
      result: orders.length,
      orders,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// User getting details of single order
exports.userGettingDetailsOfSingleOrder = async (req, res) => {
  try {
    // Getting single order created by user
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate(["orderItems.id", "shippingInfo", "paymentInfo"]);

    // If order not found
    if (!order) {
      return customError(res, 404, "Order not found");
    }

    // Response
    res.json({
      status: "success",
      order,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// User tracking single order
exports.userTrackingSingleOrder = async (req, res) => {
  try {
    // Getting single order created by user
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).select(["orderStatus", "_id"]);

    // If order not found
    if (!order) {
      return customError(res, 404, "Order not found");
    }

    // Response
    res.json({
      status: "success",
      order,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// ** Admin, manager or orderManager

// Admin, manager or orderManager can get all orders
exports.getAllOrders = async (req, res) => {
  try {
    // Getting all orders created by user
    const orders = await Order.find({})
      .sort("-createdAt")
      .select([
        "-shippingInfo",
        "-user",
        "-paymentInfo",
        "-taxAmount",
        "-shippingAmount",
        "-updatedAt",
        "-__v",
      ])
      .populate("orderItems.id", [
        "productName",
        "price",
        "quantity",
        "thumbnail",
      ]);

    // Response
    res.json({
      status: "success",
      result: orders.length,
      orders,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Admin, manager or orderManager can get details of single order
exports.getDetailsOfSingleOrder = async (req, res) => {
  try {
    // Getting single order
    const order = await Order.findById(req.params.id).populate([
      "orderItems.id",
      "shippingInfo",
      "paymentInfo",
      "user",
    ]);

    // If order not found
    if (!order) {
      return customError(res, 404, "Order not found");
    }

    // Response
    res.json({
      status: "success",
      order,
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Admin, manager or orderManager can update single order
exports.updateSingleOrder = async (req, res) => {
  try {
    // Getting single order
    const order = await Order.findById(req.params.id);

    // If order not found
    if (!order) {
      return customError(res, 404, "Order not found");
    }

    // If orderStatus not found
    if (!req.body.orderStatus) {
      return customError(res, 400, "orderStatus is required to update");
    }

    // Destructuring body
    const orderStatus = req.body.orderStatus;

    // Restricting if order already delivered can not be revered
    if (order.orderStatus.status === "delivered") {
      return customError(res, 401, "Order already delivered");
    }

    // Updating order status if the order is delivered
    if (orderStatus === "delivered") {
      order.orderStatus.isDelivered = true;
      order.orderStatus.deliveredAt = Date.now();
    }

    // Updating the order status
    order.orderStatus.status = orderStatus;

    // Saving the order
    await order.save();

    // Response
    res.json({
      status: "success",
      message: "Order updated successfully",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};

// Admin, manager or orderManager can delete single order
exports.deleteSingleOrder = async (req, res) => {
  try {
    // Getting single order
    const order = await Order.findById(req.params.id);

    // If order not found
    if (!order) {
      return customError(res, 404, "Order not found");
    }

    // Removing shippingInfo and payment
    await Shipping.findByIdAndDelete(order.shippingInfo);
    await Payment.findByIdAndDelete(order.paymentInfo);

    // Removing OrderItems
    const orderItems = order.orderItems;
    for (let index = 0; index < orderItems.length; index++) {
      const orderItem = await OrderItem.findById(orderItems[index].id);
      const product = await Product.findById(orderItem.product);

      // Updating the product quantity
      product.stock = product.stock + orderItem.quantity;
      product.inStock = true;

      // Saving Product
      await product.save();

      // Removing orderItem
      await orderItem.remove();
    }

    // Removing order
    await order.remove();

    // Response
    res.json({
      status: "success",
      message: "Order Deleted successfully",
    });
  } catch (error) {
    customError(res, 500, error.message, "error");
  }
};
