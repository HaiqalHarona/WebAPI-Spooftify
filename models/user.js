const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    _id: ObjectId,
    email: String,
    password: String,
    displayName: String,
    createdAt: Date

})