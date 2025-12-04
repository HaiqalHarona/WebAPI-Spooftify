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
