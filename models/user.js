const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    username: String,
    token: String,
    createdAt: { type: Date, default: Date.now },
    userpicture: String,
    friends: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'blocked'],
            default: 'pending'
        }
    }],
    requests: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
    }]

})
module.exports = mongoose.model('users', userSchema);