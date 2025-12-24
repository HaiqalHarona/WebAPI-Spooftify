const CachedLyrics = require('../models/cachedLyrics.js');
const axios = require('axios');

const lyricsService = {
    // Main function to get lyrics for a track
    async getLyrics(trackId, trackName, artistName) {
        try {
            // 1. Check if lyrics exist in cache
            const cachedLyrics = await CachedLyrics.findOne({
                spotifyTrackId: trackId
            });

            if (cachedLyrics) {
                console.log(`Found lyrics in cache for track: ${trackId}`);
                return {
                    lyrics: cachedLyrics.lyrics,
                    trackName: cachedLyrics.trackName,
                    artistName: cachedLyrics.artistName,
                    source: 'cache',
                    cachedAt: new Date(cachedLyrics.cachedAt).toLocaleString()
                };
            }

            console.log(`No cache found for track: ${trackId}, fetching from API...`);

            // 2. If not in cache, fetch from Lyrics.ovh API
            const apiLyrics = await this.fetchFromLyricsAPI(trackName, artistName);

            // 3. Only cache if the API returned actual lyrics (not an error message)
            if (apiLyrics && !apiLyrics.includes("not found") && !apiLyrics.includes("timeout") && !apiLyrics.includes("unavailable")) {
                const newCache = new CachedLyrics({
                    spotifyTrackId: trackId,
                    trackName: trackName,
                    artistName: artistName,
                    lyrics: apiLyrics,
                    cachedAt: new Date().toLocaleString()
                });

                await newCache.save();

                // 4. Return the lyrics with cache info
                return {
                    lyrics: apiLyrics,
                    trackName: trackName,
                    artistName: artistName,
                    cachedAt: new Date(newCache.cachedAt).toLocaleString()
                };
            } else {
                // Return the lyrics without caching
                return {
                    lyrics: apiLyrics,
                    trackName: trackName,
                    artistName: artistName
                };
            }

        } catch (error) {
            console.error('Error in getLyrics function:', error.message);
            return {
                lyrics: "Lyrics not available at this time.",
                trackName: trackName,
                artistName: artistName,
                error: error.message
            };
        }
    },

    // Helper function to fetch from Lyrics.ovh API
    async fetchFromLyricsAPI(trackName, artistName) {
        try {
            // Encode the artist and track name for URL
            const encodedArtist = encodeURIComponent(artistName);
            const encodedTrack = encodeURIComponent(trackName);

            const response = await axios.get(
                `https://api.lyrics.ovh/v1/${encodedArtist}/${encodedTrack}`,
                {
                    timeout: 10000 // 10 second timeout
                }
            );

            if (response.data && response.data.lyrics) {
                return response.data.lyrics;
            } else {
                return "Lyrics not found for this track.";
            }

        } catch (error) {
            console.error('Lyrics API Error:', error.message);

            // Return different messages based on error type
            if (error.code === 'ECONNABORTED') {
                return "Lyrics service timeout. Please try again.";
            } else if (error.response && error.response.status === 404) {
                return "Lyrics not found for this track.";
            } else {
                return "Could not fetch lyrics at this time. Service may be unavailable.";
            }
        }
    }
};

module.exports = lyricsService;