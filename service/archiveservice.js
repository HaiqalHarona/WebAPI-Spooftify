const mongoose = require('mongoose');
const playlist = require('../models/playlist.js');
const Playlist = require('../models/playlist.js'); 
const archived = require('../models/archivedplaylist.js');
const user = require('../models/user.js');

let archive = {
   
  async createArchive(playlistId, user) {
    try {
      const originalPlaylist = await Playlist.findOne({
        _id: playlistId,
        user: user
      });

      if (!originalPlaylist) {
        throw new Error('Playlist not found or you do not have permission to archive it');
      }

      const newArchivedPlaylist = await archived.create({
        user: user,
        originalPlaylistId: playlistId,
        name: originalPlaylist.name,
        tracks: originalPlaylist.tracks.map(track => ({
          spotifyTrackId: track.spotifyTrackId,
          name: track.name,
          artist: track.artist,
          album: track.album,
          durationMs: track.durationMs,
          albumImage: track.albumImage
        })),
        playlistpicture: originalPlaylist.playlistpicture
      });

      // Delete the original playlist
      await playlist.findByIdAndDelete(playlistId);

      return newArchivedPlaylist;
    } catch (e) {
      console.error(e.message);
      throw new Error(`Failed to archive playlist with ID ${playlistId}: ${e.message}`);
    }
  },


  async getArchivedPlaylists(user) {
    try {
      const archivedPlaylists = await archived.find({
          user: user
        })
        .sort({
          archivedAt: -1
        }); // Sort by most recently archived
      return archivedPlaylists;
    } catch (e) {
      console.error(`Error retrieving archived playlists: ${e.message}`);
      throw new Error('Could not retrieve archived playlists');
    }
  },

  async unarchivePlaylist(archivedPlaylistId, user) {
    try {
      const archivedPlaylist = await archived.findOne({
        _id: archivedPlaylistId,
        user: user
      });

      if (!archivedPlaylist) {
        throw new Error('Archived playlist not found or you do not have permission to unarchive it');
      }

      // Create a new playlist from the archived data
      const newPlaylist = await Playlist.create({
        user: user,
        name: archivedPlaylist.name,
        tracks: archivedPlaylist.tracks.map(track => ({
          spotifyTrackId: track.spotifyTrackId,
          name: track.name,
          artist: track.artist,
          album: track.album,
          durationMs: track.durationMs,
          albumImage: track.albumImage
        })),
        createdAt: new Date(),
        playlistpicture: archivedPlaylist.playlistpicture
      });

      // Delete the archived playlist
      await archived.findByIdAndDelete(archivedPlaylistId);

      return newPlaylist;
    } catch (e) {
      console.error(`Error unarchiving playlist: ${e.message}`);
      throw new Error(`Failed to unarchive playlist with ID ${archivedPlaylistId}: ${e.message}`);
    }
  }
};

module.exports = archive;