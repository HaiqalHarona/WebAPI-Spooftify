require('dotenv').config();
const mongoose = require('mongoose');
const playlist = require('../models/playlist.js');
const archived = require('../models/archivedplaylist.js');
const lyrics = require('../models/cachedLyrics.js');
const user = require('../models/user.js');

// Environment variables from .env file
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
