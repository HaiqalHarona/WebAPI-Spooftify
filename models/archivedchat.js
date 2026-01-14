const mongoose = require('mongoose');


archivedChat  = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true

    }
});

module.exports = mongoose.model('archivedChat', archivedChat);