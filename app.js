const express = require('express');

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

const mlab = `mongodb://${process.env.MLAB_USERNAME}:${
  process.env.MLAB_PASSWORD
}@ds133627.mlab.com:33627/rest-shop-api`;

mongoose.connect(mlab, {
  useMongoClient: true,
});

mongoose.Promise = global.Promise;

// morgan for log request
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

// PREVENT CORS ERRORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  return next();
});

// ROUTES
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// ERROR HANDLER
// for not found routes
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// for other error like mongodb error
app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
