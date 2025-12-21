

        const DEFAULT_TRACK_ID = '2YZa0dsV3xXGZ61XFYiRt8';
        let embedController = null;
        let isPlaying = false;

        const trackData = [
            { id: DEFAULT_TRACK_ID, name: "Sunset Drive", artist: "Cosmograph, LEVEL NINE", album: "Top Hits 2024", durationMs: 194594 },
            { id: DEFAULT_TRACK_ID, name: "City Lights", artist: "Aurora Bloom", album: "Neon Echoes", durationMs: 210123 },
            { id: DEFAULT_TRACK_ID, name: "Midnight Rain", artist: "The Synthetics", album: "Rainy Day Mixtape", durationMs: 185000 },
            { id: DEFAULT_TRACK_ID, name: "Electric Dream", artist: "Cosmograph", album: "Dreamscape", durationMs: 220000 },
            { id: DEFAULT_TRACK_ID, name: "Ocean Waves", artist: "LEVEL NINE", album: "Acoustic Retreat", durationMs: 170000 },
        ];


        function formatDuration(ms) {
            const totalSeconds = Math.floor(ms / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }


        function updateMainPlayButton(newIsPlaying) {
            const btn = $('#main-play-btn');
            const icon = btn.find('i');
            if (icon.length === 0) return;

            isPlaying = newIsPlaying;
            icon.attr('class', isPlaying ? 'bi bi-pause-fill h4 mb-0' : 'bi bi-play-fill h4 mb-0');
        }

        function loadNewTrack(trackId) {
            if (embedController) {
                const trackUri = `spotify:track:${trackId}`;
                embedController.loadUri(trackUri).then(() => {
                    // Start playing immediately after loading
                    embedController.togglePlay();
                    updateMainPlayButton(true);
                    console.log(`Loaded and started playing track: ${trackId}`);
                });
            } else {
                console.error("Player controller not yet initialized.");
            }
        }


        function renderPlaylist(tracks) {
            const container = $('#playlist-container');
            if (container.length === 0) {
                console.error("Error: Playlist container element not found.");
                return;
            }

            container.html(tracks.map((track, index) => {
                const escapedTrackName = track.name.replace(/'/g, "\\'");

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


        window.onSpotifyIframeApiReady = (IFrameAPI) => {
            const element = $('#spotify-player-container')[0];
            if (!element) return;

            // Options for the single, compact player in the bottom bar
            const options = {
                width: '100%',
                height: '96', // Matches the parent container height
                uri: `spotify:track:${DEFAULT_TRACK_ID}` // Initial track
            };

            const callback = (Controller) => {
                embedController = Controller;
                console.log("Spotify Embed Controller initialized.");

                // Hook up the main play button to the controller
                $('#main-play-btn').on('click', () => {
                    Controller.togglePlay().then(() => {
                        // The togglePlay command is asynchronous; we update the UI immediately
                        updateMainPlayButton(!isPlaying);
                    });
                });


            };

            IFrameAPI.createController(element, options, callback);
        };

        // Initialize UI components
        $(function () {
            renderFullPlaylist();
            // Initialize main play button to 'Play' state
            updateMainPlayButton(false);

            // Event delegation for song rows
            $('#playlist-container').on('click', '.song-row', function () {
                loadNewTrack($(this).data('id'));
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
