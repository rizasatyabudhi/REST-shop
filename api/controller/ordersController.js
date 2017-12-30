const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');


exports.getOrders = async (req, res) => {
  try {
    const orders = await Order
      .find()
      .select('product quantity _id')
      // 1st param = field name of "product" in Order model
      // 2nd param = what to take from Product model
      .populate('product', 'name')
      .exec();

    res.status(200).json({
      count: orders.length,
      orders: orders.map(order => ({
        _id: order.id,
        product: order.product,
        quantity: order.quantity,
        request: {
          type: 'GET',
          url: `http://localhost:3000/orders/${order.id}`,
        },
      })),

    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

exports.getOneOrder = async (req, res) => {
  const order = await Order.findById(req.params.orderId)
    .select('quantity productId _id')
    .populate('product', 'name')
    .exec();

  // if order not found
  if (!order) {
    res.status(404).json({
      message: 'Order Not Found',
    });
  }

  // if order is found
  res.status(200).json(order);
};

exports.addOrder = async (req, res) => {
  const product = await Product.findById(req.body.productId);
  if (!product) {
    res.status(404).json({
      message: 'Product not found',
    });
  }

  const order = await new Order({
    _id: new mongoose.Types.ObjectId(),
    quantity: req.body.quantity,
    product: req.body.productId,
  }).save();

  res.status(201).json({
    message: 'Order Stored',
    createdOrder: {
      _id: order.id,
      product: order.product,
      quantity: order.quantity,
    },
  });
};

// exports.addOrder = (req, res) => {
//   Product.findById(req.body.productId)
//     .then((product) => {
//       if (!product) {
//         res.status(404).json({
//           message: 'Product not found',
//         });
//       }
//       const order = new Order({
//         _id: new mongoose.Types.ObjectId(),
//         quantity: req.body.quantity,
//         product: req.body.productId,
//       });
//       return order.save();
//     })
//     .then((result) => {
//       res.status(201).json({
//         message: 'Order Stored',
//         createdOrder: {
//           _id: result.id,
//           product: result.product,
//           quantity: result.quantity,
//         },
//       });
//     });
// };


exports.removeOrder = async (req, res) => {
  const id = req.params.orderId;
  const order = await Order.findByIdAndRemove(id).exec();
  // if order is not found
  if (!order) {
    res.status(404).json({
      message: 'Order Not Found',
    });
  }

  // if order is found
  res.status(200).json({
    message: 'Order was removed',
  });
};
