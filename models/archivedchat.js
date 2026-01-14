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
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
    }]
});

module.exports = mongoose.model('archivedChat', archivedChat);