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
    creator: String,
    tracks: [{
        spotifyTrackId: { type: String, required: true },
        name: { type: String, required: true },
        artist: { type: String, required: true },
        previewUrl: String, 
        durationMs: Number,
        albumImage: String 
    }],
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('playlists', playlistSchema);