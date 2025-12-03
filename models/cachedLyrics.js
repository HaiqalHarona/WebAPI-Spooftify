const mongoose = require('mongoose');

const cachedLyricsSchema = new mongoose.Schema({
  spotifyTrackId: { type: String, required: true, unique: true },
  lyrics: String,
  cachedAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('CachedLyrics', cachedLyricsSchema);