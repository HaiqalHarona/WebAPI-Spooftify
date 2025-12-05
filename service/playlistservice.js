const mongoose = require('mongoose');
const playlist = require('../models/playlist.js');
const user = require('../models/user.js');

let playlistService = {
    async createPlaylist(user, name, tracks, createdAt) {
        try {
            await playlist.create({
                user: user,
                name: name,
                tracks: tracks,
                createdAt: createdAt

            });
            return `Playlist ${name} created successfully.`;
        } catch (e) {
            console.error(e.message);
            throw new Error(`Failed to create playlist ${name}: ${e.message}`);
        }
    },

    async addToPlaylist(playlistId, userId, track) {
        try {
            // Find the playlist and verify it belongs to the user
            const foundPlaylist = await playlist.findOne({
                _id: playlistId,
                user: userId
            });

            if (!foundPlaylist) {
                throw new Error('Playlist not found or you don\'t have permission to modify it');
            }

            // Check if the track already exists in the playlist
            const trackExists = foundPlaylist.tracks.some(
                t => t.spotifyTrackId === track.spotifyTrackId
            );

            if (trackExists) {
                throw new Error('Track already exists in the playlist');
            }

            // Add the track to the playlist
            foundPlaylist.tracks.push(track);
            await foundPlaylist.save();

            return `Track "${track.name}" added to playlist successfully.`;
        } catch (e) {
            console.error(e.message);
            throw new Error(`Failed to add track to playlist: ${e.message}`);
        }
    },
    async getPlaylist(user) {
        try {
            const playlists = await playlist.find({
                user: user
            })
                .sort({
                    createdAt: -1
                }); // Sort by most recently archived
            return playlists;
        } catch (e) {
            console.error(`Error retrieving playlists: ${e.message}`);
            throw new Error('Could not retrieve playlists');
        }
    },
    async deletePlaylist(playlistId, user) {
        try {
            const deletedPlaylist = await playlist.findOneAndDelete({
                _id: playlistId,
                user: user
            });
            if (!deletedPlaylist) {
                throw new Error('Playlist not found or you do not have permission to delete it');
            }
            return `Playlist with ID ${playlistId} deleted successfully.`;
        } catch (e) {
            console.error(e.message);
        }
    }

}
module.exports = playlistService;