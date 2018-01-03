const express = require('express');

const router = express.Router();
const ordersController = require('../controller/ordersController');
const checkAuth = require('../middleware/check-auth');

router.get('/', checkAuth, ordersController.getOrders);
router.get('/:orderId', checkAuth, ordersController.getOneOrder);
router.post('/', checkAuth, ordersController.addOrder);
router.delete('/:orderId', checkAuth, ordersController.removeOrder);


module.exports = router;
