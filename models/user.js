const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    username: String,
    createdAt: { type: Date, default: Date.now }

})
module.exports = mongoose.model('users', userSchema);