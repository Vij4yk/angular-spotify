const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Registers a user
router.post('/register', (req, res, next) => {
  // sets up the data
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  // attempts to create the user
  User.addUser(newUser, (err, user) => {
    // sends err if there is one
    if (err) {
      res.json({ success: false, msg: 'Failed to register user' });
    } else {
      // creates a token to send back to the client
      const token = jwt.sign({ data: user }, 'secretkey', {
        expiresIn: 604800 // 1 week
      });
      // delete operator didn't work to remove the password.
      // made new userObj instead
      const userObj = {};
      userObj._id = user._id;
      userObj.email = user.email;
      userObj.username = user.username;
      res.json({
        success: true,
        msg: 'User registered',
        token,
        user: userObj
      });
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: 'User not found' });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign({ data: user }, 'secretkey', {
          expiresIn: 604800 // 1 week
        });
        res.json({
          success: true,
          token: token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        return res.json({ success: false, msg: 'Wrong password' });
      }
    });
  });
});

// Profile
router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    res.json({ user: req.user });
  }
);

module.exports = router;
