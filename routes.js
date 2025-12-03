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

module.exports = router;