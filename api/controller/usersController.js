const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const jwt = require('jsonwebtoken');


exports.signup = async (req, res) => {
  const existingUser = await User.find({
    email: req.body.email,
  }).exec();

  // we need to use length, because if mongoose can't find existingUser,
  // the length will be 0
  if (existingUser.length >= 1) {
    res.status(409).json({
      message: 'Email exists',
    });
  }

  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    // if there is an error
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }

    // if there is NO error
    try {
      const user = await new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hash,
      }).save();

      res.status(200).json({
        message: 'User created',
      });
    } catch (error) {
      res.status(500).json({
        message: error.errors.email.message,
      });
    }
  });
};


exports.login = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  }).exec();

  // if email is not found
  if (!user) {
    return res.status(401).json({
      message: 'Auth failed ',
    });
  }

  // if email is found

  // compare the password from the request body with the database (user)
  return bcrypt.compare(req.body.password, user.password, (err, result) => {
    // // if password doesn't match
    // if (err) {
    //   return res.status(401).json({
    //     message: 'Auth failed ASU',
    //   });
    // }
    if (result) {
      const token = jwt.sign({
        email: user.email,
        userId: user._id,
      }, process.env.JWT_KEY, {
        expiresIn: '1h',
      });
      return res.status(200).json({
        message: 'Auth success',
        token,
      });
    }
    if (err) {
      return res.status(401).json({
        message: 'Auth failed ASU',
      });
    }
  });
};
