const mongoose = require('mongoose');
const user = require('./user.js');


const likedSongsSchema = new mongoose.Schema({
     tracks: [{
        spotifyTrackId: { type: String, required: true },
        name: { type: String, required: true },
        artist: { type: String, required: true },
        album: String,
        durationMs: Number,
        albumImage: String 
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }


});

module.exports = mongoose.model('likedSongs', likedSongsSchema);