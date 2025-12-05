const mongoose = require('mongoose');
const user = require('./user.js');

const playlistSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    name: { type: String, required: true },
    description: String,
    tracks: [{
        spotifyTrackId: { type: String, required: true, unique: true},
        name: { type: String, required: true },
        artist: { type: String, required: true },
        durationMs: Number,
        albumImage: String 
    }],
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('playlists', playlistSchema);