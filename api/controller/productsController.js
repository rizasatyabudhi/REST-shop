const mongoose = require('mongoose');
const multer = require('multer');


const Product = require('../models/product');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads/');
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

exports.upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
});

exports.getProducts = (req, res) => {
  Product.find()
    .select('name price _id productImage')
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map(doc => ({
          name: doc.name,
          price: doc.price,
          _id: doc.id,
          productImage: doc.productImage,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${doc.id}`,
          },
        })),
      };
      res.status(200).json(response);
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
    .select('name price _id productImage')
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          product: doc,
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

exports.addProduct = (req, res) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  product
    .save()
    .then((result) => {
      res.status(201).json({
        message: 'Product was created',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          productImage: result.productImage,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${result.id}`,
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.deleteProduct = (req, res) => {
  const id = req.params.productId;
  Product.findByIdAndRemove(id)
    .exec()
    .then(() => {
      res.status(200).json({
        message: 'Product deleted',
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.updateProduct = (req, res) => {
  Product.findOneAndUpdate({
    _id: req.params.productId,
  }, req.body, {
    new: true,
  })
    .exec()
    .then(() => {
      res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'GET',
          url: `http://localhost:3000/products/${req.params.productId}`,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
