const express = require('express');

const router = express.Router();
const productController = require('../controller/productsController');
const checkAuth = require('../middleware/check-auth');

router.get('/', productController.getProducts);
router.post('/', checkAuth, productController.upload.single('productImage'), productController.addProduct);
router.get('/:productId', productController.getOneProduct);
router.delete('/:productId', checkAuth, productController.deleteProduct);
router.patch('/:productId', checkAuth, productController.updateProduct);

module.exports = router;
