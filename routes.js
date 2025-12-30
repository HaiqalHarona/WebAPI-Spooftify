const express = require('express');
const router = express.Router();
const db = require('./service/dbservice.js');
const spotify = require('./service/spotifyservice.js');
const archive = require('./service/archiveservice.js');
const lyrics = require('./service/lyricsservice.js');
const user = require('./service/userservice.js');
const playlist = require('./service/playlistservice.js');
const likedSongs = require('./service/likedsongservice.js');
const crypto = require('crypto');
const cors = require('cors');


db.connect().then(function (response) {
  console.log(response);
}).catch(function (error) {
  console.log(error.message);
})
router.use(express.urlencoded({
  extended: true
}));
router.use(express.json());
router.use(cors());

router.use('/api', authenticate);

//Spotify Search Function
router.get('/api/search', async function (req, res) {
  const query = req.query.q;
  if (!query) {
    return res.status(400).send({ message: 'Search query parameter "q" is required.' });
  }
  const result = await spotify.searchTracks(query);
  res.send(result);
});

//Get Track Details from Spotify
router.get('/api/tracks/:id', async function (req, res) {
  try {
    const trackId = req.params.id;
    const result = await spotify.getTrackDetails(trackId);
    if (!result) {
      return res.status(404).send({ message: 'Track not found.' });
    }
    res.send(result);
  } catch (error) {
    console.error('Error in /tracks/:id route:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get lyrics for a track
router.get('/api/tracks/:trackId/lyrics', async function (req, res) {
  try {
    const { trackId } = req.params;

    // 1. Get track details from Spotify to find the name and artist
    const trackDetails = await spotify.getTrackDetails(trackId);
    if (!trackDetails) {
      return res.status(404).send({ message: 'Track not found.' });
    }

    const trackName = trackDetails.name;
    const artistName = trackDetails.artist;

    // 3. Get lyrics (checks cache first, then API)
    const result = await lyrics.getLyrics(trackId, trackName, artistName);

    // 4. Send response
    res.json({
      success: true,
      trackId: trackId,
      trackName: result.trackName,
      artistName: result.artistName,
      lyrics: result.lyrics
    });

  } catch (error) {
    console.error('Error in lyrics route:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching lyrics.'
    });
  }
});

// Authentication Middleware
async function authenticate(req, res, next) {
  let token = req.query.token || req.body.token || req.headers['x-access-token'];

  if (!token) {
    return res.status(401).json({ "message": "Authentication failed: Token not provided" });
  }

  try {
    const foundUser = await user.checkToken(token);
    if (foundUser) {
      res.locals.userId = foundUser._id; // Store user ID for subsequent handlers
      next();
    } else {
      res.status(401).json({ "message": "Authentication failed: Invalid token" });
    }
  } catch (error) {
    console.error('Error in authenticate middleware:', error.message);
    res.status(500).json({ "message": "Authentication error: " + error.message });
  }
};

// User Login Route
router.post('/users/login', async function (req, res) {
  let { email, password } = req.body;

  try {
    const foundUser = await user.userlogin(email, password);

    if (!foundUser) {
      return res.status(401).json({ "message": "Invalid email or password" });
    }

    // Generate a new token
    let strToHash = foundUser.email + Date.now();
    let token = crypto.createHash('sha512').update(strToHash).digest('hex');

    await user.updateToken(foundUser._id, token);

    res.status(200).json({
      message: 'Login Successful',
      token: token,

    });

  } catch (error) {
    console.error('Error in user login route:', error.message);
    res.status(500).json({ "message": "Login failed: " + error.message });
  }
});

// Logout
router.get('/users/logout', authenticate, async function (req, res) {
  let userId = res.locals.userId;

  try {
    await user.removeToken(userId);
    res.status(200).json({ "message": 'Logout Successful' });
  } catch (error) {
    console.error('Error in user logout route:', error.message);
    res.status(500).json({ "message": "Logout failed: " + error.message });
  }
});

// Create User
router.post('/users/create', function (req, res) {
  let { email, password, username } = req.body;

  user.createUser(email, password, username).then(function (result) {
    res.status(200).json({ "message": "User created successfully" });
  }).catch(function (error) {
    console.error('Error in user creation route:', error.message);
    res.status(500).json({ "message": "User creation failed: " + error.message });
  });
});

// Create Playlist
router.post('/api/playlists/create', async function (req, res) {
  try {
    const { name, tracks } = req.body;
    const userId = res.locals.userId;

    // Validate input
    if (!name) {
      return res.status(400).json({ message: "Playlist name is required" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Create the playlist with the current user's ID
    const result = await playlist.createPlaylist(userId, name, tracks || [], new Date());

    // Return success response
    res.status(201).json({
      success: true,
      message: result
    });
  } catch (error) {
    console.error('Error in create playlist route:', error.message);
    res.status(500).json({ message: "Failed to create playlist: " + error.message });
  }
});

// Delete Playlist
router.delete('/api/playlists/:id', async function (req, res) {
  try {
    const playlistId = req.params.id;
    const userId = res.locals.userId;

    const result = await playlist.deletePlaylist(playlistId, userId);

    // Return success response
    res.status(200).json({
      success: true,
      message: result
    });
  } catch (error) {
    console.error('Error in delete playlist route:', error.message);
    res.status(500).json({ message: "Failed to delete playlist: " + error.message });
  }
})

// Get All Playlists for a User
router.get('/api/playlists', async function (req, res) {
  try {
    const userId = res.locals.userId;
    const playlists = await playlist.getPlaylist(userId);

    res.status(200).json({
      success: true,
      count: playlists.length,
      playlists: playlists
    });

  } catch (error) {
    console.error('Error getting playlists:', error.message);
    res.status(500).json({ message: "Failed to retrieve playlists: " + error.message });
  }
});

// Add Track to Playlist
router.post('/api/playlists/:id/add', async function (req, res) {
  try {
    const playlistId = req.params.id;
    const userId = res.locals.userId; // Get userId from authenticated middleware
    const { spotifyTrackId } = req.body;

    // Validate input
    if (!spotifyTrackId) {
      return res.status(400).json({
        message: "Track must include spotifyTrackId"
      });
    }

    // Get track details from Spotify
    const trackDetails = await spotify.getTrackDetails(spotifyTrackId);

    if (!trackDetails) {
      return res.status(404).json({
        message: "Track not found on Spotify"
      });
    }

    // Add the track to the playlist
    const result = await playlist.addToPlaylist(playlistId, userId, trackDetails);

    // Return success response
    res.status(200).json({
      success: true,
      message: result,
      track: trackDetails
    });
  } catch (error) {
    console.error('Error in add to playlist route:', error.message);
    res.status(500).json({ message: "Failed to add track to playlist: " + error.message });
  }
});

// Remove Track from Playlist
router.delete('/api/playlists/:id/tracks/:trackId', async function (req, res) {
  try {
    const playlistId = req.params.id;
    const trackId = req.params.trackId;
    const userId = res.locals.userId;

    // Remove the track from the playlist
    const result = await playlist.removeFromPlaylist(playlistId, userId, trackId);

    // Return success response
    res.status(200).json({
      success: true,
      message: result
    });
  } catch (error) {
    console.error('Error in remove from playlist route:', error.message);
    res.status(500).json({ message: "Failed to remove track from playlist: " + error.message });
  }
});

// Get All Tracks from a Playlist
router.get('/api/playlists/:id/tracks', async function (req, res) {
  try {
    const playlistId = req.params.id;
    const userId = res.locals.userId;

    // Get all tracks from the playlist
    const tracks = await playlist.getPlaylistSongs(playlistId, userId);

    // Return success response
    res.status(200).json({
      success: true,
      count: tracks.length,
      tracks: tracks
    });
  } catch (error) {
    console.error('Error in get playlist songs route:', error.message);
    res.status(500).json({ message: "Failed to get playlist songs: " + error.message });
  }
});

// Archive a Playlist
router.post('/api/playlists/:id/archive', async function (req, res) {
  try {
    const playlistId = req.params.id;
    const userId = res.locals.userId;

    const archivedPlaylist = await archive.createArchive(playlistId, userId);

    res.status(200).json({
      success: true,
      message: `Playlist ${archivedPlaylist.name} archived successfully.`,
      archivedPlaylist: archivedPlaylist
    });
  } catch (error) {
    console.error('Error in archive playlist route:', error.message);
    // Includes Search for SubString that has the word "not found" in the error message
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to archive playlist: " + error.message });
  }
});

// Get All Archived Playlists for a User
router.get('/api/archives', async function (req, res) {
  try {
    const userId = res.locals.userId;
    const archivedPlaylists = await archive.getArchivedPlaylists(userId);

    res.status(200).json({
      success: true,
      count: archivedPlaylists.length,
      archivedPlaylists: archivedPlaylists
    });
  } catch (error) {
    console.error('Error getting archived playlists:', error.message);
    res.status(500).json({ message: "Failed to retrieve archived playlists: " + error.message });
  }
});

// Unarchive a Playlist
router.post('/api/archives/:id/unarchive', async function (req, res) {
  try {
    const archivedPlaylistId = req.params.id;
    const userId = res.locals.userId;

    const newPlaylist = await archive.unarchivePlaylist(archivedPlaylistId, userId);

    res.status(200).json({ success: true, message: `Playlist "${newPlaylist.name}" has been restored.`, playlist: newPlaylist });
  } catch (error) {
    console.error('Error in unarchive playlist route:', error.message);
    res.status(500).json({ message: "Failed to unarchive playlist: " + error.message });
  }
});

// Add a song to user's liked songs
router.post('/api/liked-songs', async function (req, res) {
  try {
    const userId = res.locals.userId;
    const { spotifyTrackId } = req.body;

    // Validate input
    if (!spotifyTrackId) {
      return res.status(400).json({
        message: "Track ID is required"
      });
    }

    // Add the track to liked songs
    const result = await likedSongs.addLikedSong(userId, spotifyTrackId);

    if (result.success) {
      res.status(201).json({
        success: true,
        message: result.message,
        track: result.track
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Error in add liked song route:', error.message);
    res.status(500).json({ message: "Failed to add track to liked songs: " + error.message });
  }
});

// Remove a song from user's liked songs
router.delete('/api/liked-songs/:trackId', async function (req, res) {
  try {
    const userId = res.locals.userId;
    const trackId = req.params.trackId;

    // Remove the track from liked songs
    const result = await likedSongs.removeLikedSong(userId, trackId);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        track: result.track
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Error in remove liked song route:', error.message);
    res.status(500).json({ message: "Failed to remove track from liked songs: " + error.message });
  }
});

// Get user's liked songs
router.get('/api/liked-songs', async function (req, res) {
  try {
    const userId = res.locals.userId;

    // Find user's liked songs
    const userLikedSongs = await require('./models/likedsongs.js').findOne({ user: userId });

    if (!userLikedSongs) {
      return res.status(200).json({
        success: true,
        message: "No liked songs found",
        tracks: []
      });
    }

    res.status(200).json({
      success: true,
      count: userLikedSongs.tracks.length,
      tracks: userLikedSongs.tracks
    });
  } catch (error) {
    console.error('Error in get liked songs route:', error.message);
    res.status(500).json({ message: "Failed to retrieve liked songs: " + error.message });
  }
});

// Get User Information
router.get('/api/users', async function (req, res) {
  try {
    const userId = res.locals.userId;
    const userData = await user.getUserById(userId);
    
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({
      success: true,
      email: userData.email,
      username: userData.username,
      userpicture: userData.userpicture
    });
  } catch (error) {
    console.error('Error getting user information:', error.message);
    res.status(500).json({ message: "Failed to get user information: " + error.message });
  }
});

// Update User
router.put('/api/users', async function (req, res) {
  try {
    let userId = res.locals.userId;
    let data = req.body;
    let updateData = {};

    if (data.username) updateData.username = data.username;
    if (data.password) updateData.password = data.password;

    await user.UpdateUser(userId, updateData)
      .then(function (response) {
        if (!response) {
          res.status(200).json({ "message": "User not found" });
        } else {
          res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: response
          });
        }
      })
      .catch(function (error) {
        res.status(500).json({ "message": error.message });
      });
  } catch (error) {
    res.status(500).json({ "message": error.message });
  }
});


module.exports = router;
