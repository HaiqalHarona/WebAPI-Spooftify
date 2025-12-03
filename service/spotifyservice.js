require('dotenv').config();
const axios = require('axios');

const spotifyService = {
  // Search for tracks on Spotify
  searchTracks: async function(query, limit = 10) {
    try {
      // Spotify Search API endpoint (public, no auth needed for search)
      const response = await axios.get(
        `https://api.spotify.com/v1/search`,
        {
          params: {
            q: query,
            type: 'track',
            limit: limit,
            market: 'US' // Required for preview URLs
          }
        }
      );

      // Format the results
      const tracks = response.data.tracks.items.map(function(track) {
        return {
          spotifyTrackId: track.id,
          name: track.name,
          artist: track.artists.map(function(artist) {
            return artist.name;
          }).join(', '),
          album: track.album.name,
          previewUrl: track.preview_url, // 30-second preview
          durationMs: track.duration_ms,
          albumImage: track.album.images[0] ? track.album.images[0].url : null,
          popularity: track.popularity,
          externalUrl: track.external_urls.spotify
        };
      });

      return {
        success: true,
        query: query,
        totalResults: response.data.tracks.total,
        tracks: tracks
      };

    } catch (error) {
      console.error('Spotify API Error:', error.message);
      return {
        success: false,
        error: 'Failed to search Spotify',
        tracks: []
      };
    }
  },

  // Get specific track details
  getTrackDetails: async function(trackId) {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/tracks/${trackId}`
      );

      const track = response.data;
      return {
        spotifyTrackId: track.id,
        name: track.name,
        artist: track.artists.map(function(artist) {
          return artist.name;
        }).join(', '),
        album: track.album.name,
        previewUrl: track.preview_url,
        durationMs: track.duration_ms,
        albumImage: track.album.images[0] ? track.album.images[0].url : null
      };

    } catch (error) {
      console.error('Spotify API Error:', error.message);
      return null;
    }
  }
};

module.exports = spotifyService;