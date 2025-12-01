const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    username: String,
    createdAt: new Date()

})
module.exports = mongoose.model('users', userSchema);