# Spooftify - Music Web Player

A full-stack music web player application with user authentication, music management, and external API integrations.

---

## Key Features

### Mandatory Features

*   **Register, Login, and Logout**: User authentication and session management
*   **Search for music**: Search functionality for music products
*   **CRUD Operations**: Create, Retrieve, Update, and Delete song, playlist and user data

### Advanced Features

*   **Displaying Song Lyrics**: Display lyrics for songs using an external API
*   **Archiving Playlist**: Archive playlists users no longer actively use
*   **Liked Songs**: Users can like songs and view their liked songs


---

## External APIs

The application integrates two external APIs using HTTP GET requests only.

### Spotify Web API

*   **Purpose**: Access to a large, diverse music database
*   **Usage**: Search and retrieve song information (title, artist, album) for the mandatory search feature

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

### Lyrics.ovh API

*   **Purpose**: Retrieve lyrics for specific songs
*   **Usage**: Fetch and display song lyrics for the advanced feature

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

## External Node Modules

Two relevant node modules, not covered in the curriculum, are utilized.

### Axios

*   **Purpose**: Promise-based HTTP client for making API requests
*   **Usage**: Clean, structured, and efficient API calls to external services

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

### Dotenv

*   **Purpose**: Load environment variables from a .env file
*   **Usage**: Securely store sensitive configuration like API keys

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
### Spotify Web Api Node

*   **Purpose**: To handle access Tokens and refresh them automatically, to make requests to the Spotify API
*   [View the documentation](SpotifyWebAPINode.md)

---

## API Endpoints

### Authentication

*   **POST /register** - Register a new user
*   **POST /login** - Login existing user
*   **POST /logout** - Logout user

### Songs Management

*   **GET /songs** - Get all songs
*   **POST /songs** - Create a new song
*   **GET /songs/:id** - Get a specific song
*   **PUT /songs/:id** - Update a song
*   **DELETE /songs/:id** - Delete a song

### External APIs

*   **GET /api/search/:query** - Search songs using Spotify API
*   **GET /api/lyrics/:artist/:title** - Get lyrics using Lyrics.ovh API

---

## References

*   [Spotify API Documentation](https://developer.spotify.com/documentation/web-api)
*   [Lyrics.ovh API Documentation](https://lyricsovh.docs.apiary.io/)
*   [Axios Documentation](https://axios-http.com/docs/intro)
*   [Dotenv Documentation](https://www.npmjs.com/package/dotenv)
*   [Video Refrence While Creating This](https://www.youtube.com/watch?v=TN1uvgAyxE0&t=130s)
