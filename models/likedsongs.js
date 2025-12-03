const mongoose = require('mongoose');
const user = require('./user.js');


const likedSongsSchema = new mongoose.Schema({
    spotifyTrackId: { type: String, required: true, unique: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }


});

module.exports = mongoose.model('likedSongs', likedSongsSchema);