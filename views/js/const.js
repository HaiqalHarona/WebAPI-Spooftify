const BASE_URL = "http://localhost:3000/api/";
const USER_BASE_URL = "http://localhost:3000/users/";

// Spotify Search
const SEARCH_URL = BASE_URL + "search";

// Tracks & Lyrics
const TRACKS_URL = BASE_URL + "tracks/";
const TRACK_BY_ID = BASE_URL + "tracks/:id";
const TRACK_LYRICS = BASE_URL + "tracks/:trackId/lyrics";

// User Authentication
const LOGIN_URL = USER_BASE_URL + "login";
const REGISTER_URL = USER_BASE_URL + "create";
const LOGOUT_URL = USER_BASE_URL + "logout";

// Playlists
const PLAYLISTS_URL = BASE_URL + "playlists";
const PLAYLIST_CREATE_URL = PLAYLISTS_URL + "/create";
const PLAYLIST_BY_ID = BASE_URL + "playlists/:id";
const PLAYLIST_TRACKS = BASE_URL + "playlists/:id/tracks";
const PLAYLIST_ADD_TRACK = BASE_URL + "playlists/:id/add";
const PLAYLIST_REMOVE_TRACK = BASE_URL + "playlists/:id/tracks/:trackId";
const PLAYLIST_ARCHIVE = BASE_URL + "playlists/:id/archive";

// Archives
const ARCHIVES_URL = BASE_URL + "archives";
const ARCHIVE_UNARCHIVE = BASE_URL + "archives/:id/unarchive";

// Liked Songs
const LIKED_SONGS_URL = BASE_URL + "liked-songs";
const LIKED_SONG_BY_ID = BASE_URL + "liked-songs/:trackId";