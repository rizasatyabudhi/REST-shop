const mongoose = require('mongoose');
const Order = require('../models/order');

exports.addOrder = (req, res) => {
  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    quantity: req.body.quantity,
    product: req.body.productId,
  });
  order
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.getOrders = (req, res) => {
  Order
    .find()
    .exec()
    .then((orders) => {
      res.status(200).json(orders);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
