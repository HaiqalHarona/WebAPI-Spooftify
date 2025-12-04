# Spooftify - Music Web Player

---

## Key Features

This application is a full-stack music web player that provides core user and product management features.

### [span_1](start_span)Mandatory Features[span_1](end_span)

* **Register, Login, and Logout**: For user authentication and session management.
* **Search for music**: This acts as the mandatory "Search products" feature.
* **Create, Retrieve, Update, and Delete** song/music data (the 'products').

### [span_2](start_span)Advanced Features[span_2](end_span)

* **Displaying Song Lyrics**: Displaying lyrics for songs accessed via an external API.
* **Archiving Playlist**: Allows users to archive playlists they no longer actively use (one of the two additional relevant features).

---

## [span_3](start_span)External APIs[span_3](end_span)

[span_4](start_span)The application will integrate two relevant external APIs using only **HTTP GET requests**[span_4](end_span).

| API Name | Purpose | How it will be Used |
| :--- | :--- | :--- |
| **Spotify Web API** | To access a large, diverse music database. | Used to search and retrieve song information (e.g., song title, artist, album) to fulfill the mandatory "Search" feature. |
| **Lyrics.ovh API** | To retrieve lyrics for specific songs. | Used in conjunction with the Spotify data to fetch and display song lyrics, supporting an Advanced Feature. |

---

## [span_5](start_span)External Node Modules[span_5](end_span)

[span_6](start_span)Two relevant node modules, not covered in the curriculum, will be utilized[span_6](end_span).

| Module Name | Purpose | How it will be Used |
| :--- | :--- | :--- |
| **Axios** | A promise-based HTTP client. | Will be used to make clean, structured, and efficient **API calls** to the Spotify and Lyrics.ovh external APIs. |
| **Dotenv** | A zero-dependency module that loads environment variables. | Used to securely load and store sensitive configuration details, such as the Spotify API Key and Client Secret, from a `.env` file. |

---

## [span_7](start_span)References[span_7](end_span)

This section will contain all relevant links used in the project, including the external API documentation and the final published Postman documentation link.

* Spotify API: https://developer.spotify.com/documentation/web-api
* Lyrics.ovh API: https://lyricsovh.docs.apiary.io/#reference
* [span_8](start_span)[API Documentation Link (Add the published Postman documentation link here as part of the submission)[span_8](end_span)]

---
Spooftify - Music Web Player

A full-stack music web player application with user authentication, music management, and external API integrations.

---

Key Features

Mandatory Features

· Register, Login, and Logout: User authentication and session management
· Search for music: Search functionality for music products
· CRUD Operations: Create, Retrieve, Update, and Delete song/music data

Advanced Features

· Displaying Song Lyrics: Display lyrics for songs using an external API
· Archiving Playlist: Archive playlists users no longer actively use

---

External APIs

The application integrates two external APIs using HTTP GET requests only.

Spotify Web API

Purpose: Access to a large, diverse music database
Usage: Search and retrieve song information (title, artist, album) for the mandatory search feature

```javascript
// Example API call to Spotify
const searchSpotify = async (query) => {
  const response = await axios.get('https://api.spotify.com/v1/search', {
    params: {
      q: query,
      type: 'track',
      limit: 10
    },
    headers: {
      'Authorization': `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`
    }
  });
  return response.data;
};
```

Lyrics.ovh API

Purpose: Retrieve lyrics for specific songs
Usage: Fetch and display song lyrics for the advanced feature

```javascript
// Example API call to Lyrics.ovh
const getLyrics = async (artist, title) => {
  const response = await axios.get(
    `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
  );
  return response.data.lyrics || 'Lyrics not found';
};
```

---

External Node Modules

Two relevant node modules, not covered in the curriculum, are utilized.

Axios

Purpose: Promise-based HTTP client for making API requests
Usage: Clean, structured, and efficient API calls to external services

```javascript
// Installation and basic setup
const axios = require('axios');

// Example configuration
const spotifyApi = axios.create({
  baseURL: 'https://api.spotify.com/v1',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

Dotenv

Purpose: Load environment variables from a .env file
Usage: Securely store sensitive configuration like API keys

```javascript
// Installation and usage
require('dotenv').config();

// .env file structure
// SPOTIFY_CLIENT_ID=your_client_id_here
// SPOTIFY_CLIENT_SECRET=your_client_secret_here
// SPOTIFY_ACCESS_TOKEN=your_access_token_here
// SESSION_SECRET=your_session_secret_here

// Accessing environment variables
const spotifyCredentials = {
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
};
```

---

References

· Spotify API Documentation: https://developer.spotify.com/documentation/web-api
· Lyrics.ovh API Documentation: https://lyricsovh.docs.apiary.io/#
· API Documentation Link: [Add the published Postman documentation link here as part of the submission]

---

Project Structure

```
spooftify/
├── .env                    # Environment variables
├── .gitignore
├── package.json
├── README.md
├── server/
│   ├── server.js          # Main server file
│   ├── routes/
│   │   ├── auth.js        # Authentication routes
│   │   ├── songs.js       # Song CRUD operations
│   │   └── api.js         # External API integrations
│   ├── middleware/
│   │   └── auth.js        # Authentication middleware
│   └── models/
│       └── user.js        # User model
└── public/
    ├── index.html         # Main application page
    ├── css/
    │   └── styles.css     # Application styles
    └── js/
        └── app.js         # Frontend JavaScript
```

---

API Endpoints

Authentication

· POST /register - Register a new user
· POST /login - Login existing user
· POST /logout - Logout user

Songs Management

· GET /songs - Get all songs
· POST /songs - Create a new song
· GET /songs/:id - Get a specific song
· PUT /songs/:id - Update a song
· DELETE /songs/:id - Delete a song

External APIs

· GET /api/search/:query - Search songs using Spotify API
· GET /api/lyrics/:artist/:title - Get lyrics using Lyrics.ovh API

---

License

MIT