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

exports.getOneOrder = (req, res) => {
  Order.findById(req.params.orderId)
    .select('quantity productId _id')
    .exec()
    .then((order) => {
      if (order) {
        res.status(200).json(order);
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};


exports.getOneProduct = (req, res) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id')
    .exec()
    .then((product) => {
      if (product) {
        res.status(200).json({
          product,
          request: {
            type: 'GET',
            description: 'Get all products',
            url: 'http://localhost:3000/products',
          },
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.removeOrder = (req, res) => {
  const id = req.params.orderId;
  Order.findByIdAndRemove(id)
    .exec()
    .then(() => {
      res.status(200).json({
        message: 'Order removed',
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
