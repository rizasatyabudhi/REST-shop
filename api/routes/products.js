const express = require('express');

const router = express.Router();

const productController = require('../controller/productsController');


router.post('/', productController.addProduct);
router.get('/', productController.getProducts);
router.get('/:productId', productController.getOneProduct);
router.delete('/:productId', productController.deleteProduct);
router.patch('/:productId', productController.updateProduct);

module.exports = router;
