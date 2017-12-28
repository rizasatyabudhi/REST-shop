const express = require('express');

const router = express.Router();
const ordersController = require('../controller/ordersController');

router.get('/', ordersController.getOrders);
router.get('/:orderId', ordersController.getOneOrder);
router.post('/', ordersController.addOrder);
router.delete('/:orderId', ordersController.removeOrder);


module.exports = router;
