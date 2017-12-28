const express = require('express');

const router = express.Router();
const ordersController = require('../controller/ordersController');

router.get('/', ordersController.getOrders);
router.post('/', ordersController.addOrder);

router.put('/', (req, res) => {
  res.status(200).json({
    message: 'PUT request from /orders',
  });
});

router.delete('/', (req, res) => {
  res.status(200).json({
    message: 'DELETE request from /orders',
  });
});

router.get('/:orderId', (req, res) => {
  res.status(200).json({
    orderId: req.params.orderId,
  });
});

module.exports = router;
