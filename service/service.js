const mongoose = require('mongoose');
const user = require('./models/user.js');
const playlist = require('./models/playlist.js');
const archived = require('./models/archivedplaylist.js');

let db = {
    async connect() {
        try {
            await mongoose.connect('mongodb://localhost:27017/Spooftfy');
            return "Connected to Spooftify";
        } catch(e){
            console.log(e);
            throw new Error("Could not connect to Spooftify");
        }
    }
}