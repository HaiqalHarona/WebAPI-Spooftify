const mongoose = require('mongoose');

const archivedChatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }],
    Messages: [{
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        songurl: {
            type: String,
            required: true
        },
        sentAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

archivedChatSchema.index({ participants: 1 });

module.exports = mongoose.model('archivedChat', archivedChatSchema);