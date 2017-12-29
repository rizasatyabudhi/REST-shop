const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

exports.signup = (req, res) => {
  User.find({
    email: req.body.email,
  })
    .exec()
    .then((existingUser) => {
      // we need to use length, because if mongoose can't find existingUser,
      // the length will be 0
      if (existingUser.length >= 1) {
        res.status(409).json({
          message: 'Email exists',
        });
      }
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        }
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hash,
        });
        return user
          .save()
          .then(() => {
            res.status(200).json({
              message: 'User created',
            });
          })
          .catch((error) => {
            res.status(500).json({
              error,
            });
          });
      });
    })
    .catch();
};

exports.login = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .exec()
    .then((user) => {
      // if email not found
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed',
        });
      }
      return bcrypt.compare(req.body.password, user.password, (err, result) => {
        // if password doesn't match
        if (err) {
          return res.status(401).json({
            message: 'Auth failed',
          });
        }
        if (result) {
          return res.status(200).json({
            message: 'Auth success',
          });
        }
        return res.status(401).json({
          message: 'Auth failed',
        });
      });
    })
    .catch();
};
