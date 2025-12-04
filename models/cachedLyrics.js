const mongoose = require('mongoose');

const cachedLyricsSchema = new mongoose.Schema({
  spotifyTrackId: { type: String, required: true, unique: true },
  trackName: String,
  artistName: String,
  lyrics: String,
  cachedAt: String,
});

module.exports = mongoose.model('CachedLyrics', cachedLyricsSchema);