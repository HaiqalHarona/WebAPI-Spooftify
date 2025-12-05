const mongoose = require('mongoose');
const playlist = require('./playlist.js');
const user = require('./user.js');

const archivedPlaylistSchema = new mongoose.Schema({
  // Relationship to user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  // Store the ID of the original playlist
  originalPlaylistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'playlists',
    required: true
  },
  // Copy the data from the original playlist
  name: { type: String, required: true },
  tracks: [{
    spotifyTrackId: { type: String, required: true },
    name: { type: String, required: true },
    artist: { type: String, required: true }
  }],
  archivedAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('ArchivedPlaylist', archivedPlaylistSchema);