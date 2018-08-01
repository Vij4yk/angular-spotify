const express = require('express');
const router = express.Router();
var keys = require('../config/keys');
var SpotifyApi = require('node-spotify-api');
var spotify = new SpotifyApi(keys);

router.post('/search', (req, res) => {
  const { search } = req.body;
  const params = { type: 'artist', query: search, limit: 10 };

  if (search) {
    spotify.search(params, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
      res.json(data.artists.items);
    });
  }
});
//6spJzoBNMT8KSiMhaiOj2W
router.post('/artist', (req, res) => {
  const { artistId } = req.body;
  const params = { type: 'artist', query: artistId, limit: 1 };

  spotify
    .request('https://api.spotify.com/v1/artists/' + artistId)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
