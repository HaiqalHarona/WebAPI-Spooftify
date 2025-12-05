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


db.connect().then(function (response) {
  console.log(response);
}).catch(function (error) {
  console.log(error.message);
})
router.use(express.urlencoded({
  extended: true
}));
router.use(express.json()); // Add this to parse JSON request bodies


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
  let token = req.query.token;

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

router.get('/users/logout', authenticate, async function (req, res) {
  let userId = res.locals.userId; // Get userId from authenticated middleware

  try {
    await user.removeToken(userId);
    res.status(200).json({ "message": 'Logout Successful' });
  } catch (error) {
    console.error('Error in user logout route:', error.message);
    res.status(500).json({ "message": "Logout failed: " + error.message });
  }
});

router.post('/users/create',function (req, res) {
  let { email, password, username } = req.body;

  user.createUser(email, password, username).then(function (result) {
    res.status(200).json({"message": "User created successfully"});
  }).catch(function (error) {
    console.error('Error in user creation route:', error.message);
    res.status(500).json({ "message": "User creation failed: " + error.message });
  });
});


module.exports = router;
