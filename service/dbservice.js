const mongoose = require('mongoose');
const playlist = require('../models/playlist.js');
const archived = require('../models/archivedplaylist.js');
const lyrics = require('../models/cachedLyrics.js');
const user = require('../models/user.js');
const likedSongs = require('../models/likedsongs.js');
const archivedChat = require('../models/archivedchat.js')


let db = {
    async connect() {
        try {
            await mongoose.connect('mongodb://localhost:27017/Spooftify');
            return "Connected to Spooftify";
        } catch (e) {
            console.log(e);
            throw new Error("Could not connect to Spooftify");
        }
    }
}

module.exports = db;