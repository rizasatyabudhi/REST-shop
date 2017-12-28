const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.addOrder = (req, res) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        res.status(404).json({
          message: 'Product not found',
        });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then((result) => {
      res.status(201).json({
        message: 'Order Stored',
        createdOrder: {
          _id: result.id,
          product: result.product,
          quantity: result.quantity,
        },
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.getOrders = (req, res) => {
  Order
    .find()
    .select('product quantity _id')
    .exec()
    .then((orders) => {
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
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
