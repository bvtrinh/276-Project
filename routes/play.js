
const express = require('express');
const router = express.Router();
const music = require('../scripts/music');

router.get('/', (req, res) => {
    if (req.session.username) {
      req.session.playtype = null;
      req.session.genre = null;
      res.render('pages/landing', { username: req.session.username});
    } else {
      res.redirect('/');
    }
  });


router.get('/playtype/:playtype', (req, res) => {
  if (req.session.username) {
    req.session.playtype = req.params.playtype;
    res.render('pages/playlists', {username: req.session.username});
  } else {
    res.redirect('/');
  }
});

router.get('/playlists', (req, res) => {
  if (req.session.username) {
    req.session.genre = null;
    res.render('pages/playlists');
  } else {
    res.redirect('/');
  }
});

router.get('/genre/:genre', (req, res) => {
  if (req.session.username) {
    req.session.genre = req.params.genre;
    var results = {
      username: req.session.username,
      genre: capitalize_words(req.session.genre)
    };

    // redirect to the play page passing req.session.genre as the genre variable
    res.render('pages/game_mc', results);
  } else {
    res.redirect('/');
  }
});

router.post('/get_playlist', (req, res) => {

  music.getRelatedArtists(req.session.genre, function (returnVal) {
    music.getRelatedSongs(returnVal, function (finalPlaylist) {
      console.log(finalPlaylist)
      res.send(finalPlaylist);
    })
  })
});

function capitalize_words(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

module.exports = router;