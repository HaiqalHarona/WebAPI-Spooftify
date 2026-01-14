const mongoose = require('mongoose');


archivedChat = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true

    },

    Messages: [{
        sender: [{
            sendee: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
                required: true
            },
            songurl: String,

        }],
        receiver: [{
            recievee: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
                required: true
            },
            songurl: String,

        }]
    }],
});

module.exports = mongoose.model('archivedChat', archivedChat);