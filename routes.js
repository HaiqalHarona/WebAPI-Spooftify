const express = require('express');
const router = express.Router();
const db = require('./service/dbservice.js');
const spotify = require('./service/spotifyservice.js');
const archive = require('./service/archiveservice.js');
const lyrics = require('./service/lyricsservice.js');
const user = require('./service/userservice.js');
const playlist = require('./service/playlistservice.js');
const likedSongs = require('./service/likedsongservice.js');
const crypto = require('crypto');


db.connect().then(function(response){
    console.log(response);
}).catch(function(error){
    console.log(error.message);
})
router.use(express.urlencoded({
    extended: true
}));

//Spotify Search Function
router.get('/search', async function (req, res) {
    const query = req.query.q;
    if (!query) {
        return res.status(400).send({ message: 'Search query parameter "q" is required.' });
    }
    const result = await spotify.searchTracks(query);
    res.send(result);
});

//Get Track Details from Spotify
router.get('/tracks/:id', async function (req, res) {
    const trackId = req.params.id;
    const result = await spotify.getTrackDetails(trackId);
    if (!result) {
        return res.status(404).send({ message: 'Track not found.' });
    }
    res.send(result);
});

// Get lyrics for a track
router.get('/tracks/:trackId/lyrics', async function(req, res) {
  try {
    const { trackId } = req.params;
    const { trackName, artistName } = req.query;
    
    // Check if required parameters are provided
    if (!trackName || !artistName) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'Both trackName and artistName query parameters are required'
      });
    }
    
    // Get lyrics (checks cache first, then API)
    const result = await lyrics.getLyrics(trackId, trackName, artistName);
    
    res.json({
      success: true,
      trackId: trackId,
      trackName: result.trackName,
      artistName: result.artistName,
      lyrics: result.lyrics,
      cachedAt: result.cachedAt
    });
    
  } catch (error) {
    console.error('Error in lyrics route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});
module.exports = router;