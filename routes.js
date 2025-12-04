const express = require('express');
const router = express.Router();
const db = require('./service/dbservice.js');
const spotify = require('./service/spotifyservice.js');
const archive = require('./service/archiveservice.js');
const lyrics = require('./service/lyricsservice.js');
const user = require('./service/userservice.js');
const playlist = require('./service/playlistservice.js');
const likedSongs = require('./service/likedsongservice.js')
const crypto = require('crypto');


db.connect().then(function(response){
    console.log(response);
}).catch(function(error){
    console.log(error.message);
})
router.use(express.urlencoded({
    extended: true
}));

router.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).send({ message: 'Search query parameter "q" is required.' });
    }
    const result = await spotify.searchTracks(query);
    res.send(result);
});

router.get('/tracks/:id', async (req, res) => {
    const trackId = req.params.id;
    const result = await spotify.getTrackDetails(trackId);
    if (!result) {
        return res.status(404).send({ message: 'Track not found.' });
    }
    res.send(result);
});

module.exports = router;