const mongoose = require('mongoose');
const playlist = require('../models/playlist.js');
const user = require('../models/user.js');

let playlistService = {
    createPlaylist: async function(playlistData) {
        try {
            const newPlaylist = await playlist.create(playlistData);
            return newPlaylist;
        } catch (error) {
            throw error;
        }
    },

    getPlaylistsByUserId: async function(userId) {
        try {
            const foundPlaylists = await playlist.find({ user: userId });
            return foundPlaylists;
        } catch (error) {
            throw error;
        }
    },

    updatePlaylist: async function(playlistId, playlistData) {
        try {
            const updatedPlaylist = await playlist.findByIdAndUpdate(playlistId, playlistData, { new: true });
            return updatedPlaylist;
        } catch (error) {
            throw error;
        }
    },

    deletePlaylist: async function(playlistId) {
        try {
            const deletedPlaylist = await playlist.findByIdAndDelete(playlistId);
            return deletedPlaylist;
        } catch (error) {
            throw error;
        }
    }
}