const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Song = require('../models/songs');

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

      res.json({
        success: true,
        msg: 'User registered',
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email
        }
      });
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByEmail(email, (err, user) => {
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
          token,
          user: {
            _id: user._id,
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
    res.json(req.user);
  }
);

router.post('/save', (req, res) => {
  const { userId, song } = req.body;
  // const SongToSave = new Song(song);

  // checks if the song has been saved by anyone or not
  Song.find({ spotifyId: song.spotifyId })
    .then(result => {
      if (result.length) {
        User.update(
          { _id: userId },
          { $addToSet: { savedSongs: result._id } },
          { new: true }
        )
          .then(savedRes => {
            if (savedRes.nModified === 1) res.json({ success: 'Song saved' });
            else res.json({ success: 'Song already saved' });
          })
          .catch(err => res.json({ error: err }));
      } else {
        Song.create(song)
          .then(result => {
            User.update(
              { _id: userId },
              { $addToSet: { savedSongs: result._id } },
              { new: true }
            )
              .then(savedRes => {
                if (savedRes.nModified === 1)
                  res.json({ success: 'Song saved' });
                else res.json({ success: 'Song already saved' });
              })
              .catch(err => res.json({ error: err }));
          })
          .catch(err => res.json({ error: err }));
      }
    })
    .catch(err => console.log(err));
});

module.exports = router;
