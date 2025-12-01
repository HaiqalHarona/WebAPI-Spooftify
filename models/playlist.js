const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({

    _id: ObjectId,
    userId: ObjectId,
    name: String,
    tracks: [{
        spotifyTrackId: String, // Reference to Spotify's database
        name: String,
        artist: String,
    }],
    createdAt: new Date()


})