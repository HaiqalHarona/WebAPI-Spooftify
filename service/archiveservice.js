const mongoose = require('mongoose');
const playlist = require('../models/playlist.js');
const archived = require('../models/archivedplaylist.js');
const user = require('../models/user.js');

let archive = {
  /**
   * Archives a playlist for a given user.
   * It copies the playlist data to the archived collection and deletes the original.
   * @param {string} playlistId - The ID of the playlist to archive.
   * @param {string} userId - The ID of the user performing the action.
   * @returns {Promise<Object>} The newly created archived playlist document.
   */
  async createArchive(playlistId, userId) {
    try {
      const originalPlaylist = await playlist.findOne({
        _id: playlistId,
        user: userId
      });

      if (!originalPlaylist) {
        throw new Error('Playlist not found or you do not have permission to archive it.');
      }

      // Create the archived version in a single step
      const newArchivedPlaylist = await archived.create({
        user: userId,
        playlist: playlistId, // Reference to the original playlist ID
        name: originalPlaylist.name,
        tracks: originalPlaylist.tracks.map(track => ({
          trackId: track.spotifyTrackId,
          name: track.name,
          artist: track.artist
          // Note: previewUrl is not in the original playlist model, so it will be undefined.
          // This is okay if the source 'track' object doesn't have it.
        }))
      });

      // Delete the original playlist
      await playlist.findByIdAndDelete(playlistId);

      return newArchivedPlaylist;
    } catch (e) {
      console.error(e.message);
      throw new Error(`Failed to archive playlist with ID: ${playlistId}.`);
    }
  },

  /**
   * Retrieves all archived playlists for a specific user.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<Array<Object>>} A list of archived playlists.
   */
  async getArchivedPlaylists(userId) {
    try {
      const archivedPlaylists = await archived.find({
          user: userId
        })
        .sort({
          archivedAt: -1
        }); // Sort by most recently archived
      return archivedPlaylists;
    } catch (e) {
      console.error(e.message);
      throw new Error('Could not retrieve archived playlists.');
    }
  }
};

module.exports = archive;