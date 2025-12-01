const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    _id: ObjectId,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    displayName: String,
    createdAt: new Date()

})