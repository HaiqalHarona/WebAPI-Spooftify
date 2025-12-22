        const urlParams = new URLSearchParams(window.location.search);
        const playlistId = urlParams.get('id');
        // console.log("Debug - URL Search:", window.location.search);
        // console.log("Debug - Playlist ID:", playlistId);

        let embedController = null;
        let isPlaying = false;
        let trackData = [];
        let iFrameAPI = null;

        function formatDuration(ms) {
            const totalSeconds = Math.floor(ms / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        function renderPlaylist(tracks) {
            const container = $('#playlist-container');
            if (container.length === 0) {
                console.error("Error: Playlist container element not found.");
                return;
            }

            container.html(tracks.map((track, index) => {

                return `
                    <div 
                        data-id="${track.id}"
                        class="song-row row mx-0 align-items-center py-2 rounded-lg cursor-pointer"
                    >
                        <div class="col-1 text-center text-secondary track-index">
                            <span>${index + 1}</span>
                            <div class="track-play-btn text-success h5 mb-0">
                                <i class="bi bi-play-circle-fill"></i>
                            </div>
                        </div>
                        
                        <div class="col-6 d-flex flex-column min-w-0 pr-4">
                            <p class="mb-0 text-white fw-semibold text-truncate">${track.name}</p>
                            <p class="mb-0 small text-secondary">${track.artist}</p>
                        </div>

                        <div class="col-4 d-none d-sm-block small text-secondary text-truncate">
                            ${track.album}
                        </div>

                        <div class="col-1 small text-secondary text-end">
                            ${formatDuration(track.durationMs)}
                        </div>
                    </div>
                `;
            }).join(''));
        }

        function renderFullPlaylist() {
            renderPlaylist(trackData);
        }

        function initSpotifyPlayer(firstTrackId) {
            const element = $('#spotify-player-container')[0];
            if (!element || !iFrameAPI) return;

            const options = {
                width: '100%',
                height: '96',
                uri: `spotify:track:${firstTrackId}`
            };

            const callback = (Controller) => {
                embedController = Controller;
                // console.log("Spotify Embed Controller initialized.");
            };

            iFrameAPI.createController(element, options, callback);
        }

        function loadNewTrack(trackId) {
            // console.log("Debug - Clicked Track ID:", trackId);
            // if (!trackId || trackId === 'undefined') {
            console.error("Error: Invalid Track ID");
            //     return;
            // }
            if (embedController) {
                const trackUri = `spotify:track:${trackId}`;
                // console.log("Debug - Loading URI:", trackUri);
                embedController.loadUri(trackUri).then(() => {
                    // Start playing immediately after loading
                    embedController.togglePlay();
                    // console.log(`Loaded and started playing track: ${trackId}`);
                }).catch(error => {
                    console.error("Error loading track in Spotify player:", error);
                });
            } else {
                console.error("Player controller not yet initialized.");
            }
        }

        window.onSpotifyIframeApiReady = (IFrameAPI) => {
            iFrameAPI = IFrameAPI;
            // Initialize player if tracks are already loaded
            if (trackData.length > 0 && !embedController) {
                initSpotifyPlayer(trackData[0].id);
            }
        };

        // Initialize UI components
        $(function () {
            // if (playlistId) {
            //     console.log(`Playlist ID passed: ${playlistId}`);
            // }

            $('#playlist-container').on('click', '.song-row', function () {
                const trackId = $(this).attr('data-id');
                loadNewTrack(trackId);
            });

            const searchBar = $('#search-bar');
            searchBar.on('input', function () {
                const searchTerm = $(this).val().toLowerCase();
                if (searchTerm === '') {
                    renderFullPlaylist();
                    return;
                }
                const filteredTracks = trackData.filter(track => {
                    return track.name.toLowerCase().includes(searchTerm) ||
                        track.artist.toLowerCase().includes(searchTerm) ||
                        track.album.toLowerCase().includes(searchTerm);
                });
                renderPlaylist(filteredTracks);
            });
        });

        $(async function () {
            if (!playlistId) {
                $('#playlist-container').html('<p class="text-white">Error: No Playlist ID provided.</p>');
                return;
            }

            // Fetch playlist details to get the name
            try {
                const response = await fetch(`${PLAYLISTS_URL}?token=${sessionStorage.token}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.playlists) {
                        const playlist = data.playlists.find(p => p._id === playlistId);
                        if (playlist) {
                            $('#playlistname').text(playlist.name);
                            // console.log("Debug - Playlist Name:", playlist.name);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to load playlist details:', error);
            }

            const url = `${PLAYLISTS_URL}/${playlistId}/tracks?token=${sessionStorage.token}`;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Error fetching playlist: ${response.statusText}`);
                }

                const data = await response.json();
                if (data.success && data.tracks) {
                    trackData = data.tracks.map(track => ({
                        id: track.spotifyTrackId,
                        name: track.name,
                        artist: track.artist,
                        album: track.album,
                        durationMs: track.durationMs
                    }));
                    renderPlaylist(trackData);
                    // Initialize player with the first track if API is ready
                    if (iFrameAPI && !embedController && trackData.length > 0) {
                        initSpotifyPlayer(trackData[0].id);
                    }
                } else {
                    throw new Error(data.message || 'Could not retrieve tracks for the playlist.');
                }
            } catch (error) {
                console.error('Failed to load playlist:', error);
                $('#playlist-container').html(`<p class="text-danger">Error: ${error.message}</p>`);
            }
        });
