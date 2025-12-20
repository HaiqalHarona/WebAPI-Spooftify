$(async function () {
    // Search functionality
    const searchInput = $("#search-input");

    let searchTimeout;
    searchInput.on("input", function () {
        const query = $(this).val().trim();

        clearTimeout(searchTimeout);

        // Set a new timeout to avoid too many API calls
        searchTimeout = setTimeout(() => {
            if (query) {
                searchTracks(query);
            } else {
                $("#search-results").empty();
            }
        }, 300);
    });

    // Event listeners for track actions

    if ($("#search-results").length) {
        $("#search-results").on("click", ".btn-add-playlist", function (e) {
            e.preventDefault();
            e.stopPropagation();
            // console.log("Add to playlist button clicked!"); Debug
            const trackId = $(this).closest(".track-card").data("track-id");
            // console.log("Track ID from data attribute:", trackId);  Debug
            openPlaylistModal(trackId);
        });
    } else {
        console.error("#search-results element not found!");
    }

    $("body").on("click", ".close-modal", () => $("#playlist-modal").hide());

    let response = await fetch(PLAYLISTS_URL + "?token=" + sessionStorage.token);
    if (response.ok) {
        let data = await response.json();
        if (data.success) {
            displayPlaylists(data.playlists);
        }
    }
});

async function searchTracks(query) {
    try {
        const response = await fetch(SEARCH_URL + "?q=" + query + "&token=" + sessionStorage.token, {
            method: "GET"
        });

        if (response.ok) {
            const data = await response.json();
            displaySearchResults(data.tracks);
        } else {
            console.error("Search failed:", await response.json());
            $("#search-results").html("<p>Search failed. Please try again.</p>");
        }
    } catch (error) {
        console.error("Error during search:", error);
        $("#search-results").html("<p>An error occurred. Please try again.</p>");
    }
}

// Function to display search results
function displaySearchResults(tracks) {
    const searchResults = $("#search-results");
    searchResults.empty();

    if (tracks.length === 0) {
        searchResults.html("<p>No results found.</p>");
        return;
    }

    tracks.forEach(track => {
        const albumImage = track.albumImage ? track.albumImage : "./assets/default-album.png";
        const artists = track.artist;

        const trackCard = $(`
            <div class="card track-card" data-track-id="${track.spotifyTrackId}">
                <div class="card-image" style="background-image: url('${albumImage}'); background-size: cover; background-position: center;"></div>
                <div class="card-info">
                    <p class="card-title">${track.name}</p>
                    <p class="card-subtitle">${artists}</p>
                </div>
                <div class="card-actions d-flex justify-content-around p-2">
                    <button class="btn btn-outline-danger btn-sm rounded-circle btn-like" title="Like"><i class="fa fa-heart"></i></button>
                    <button class="btn btn-outline-primary btn-sm rounded-circle btn-add-playlist" title="Add to Playlist"><i class="fa fa-plus"></i></button>
                </div>
            </div>
        `);

        searchResults.append(trackCard);
    });
}


async function openPlaylistModal(trackId) {
    let modal = $("#playlist-modal");


    if (modal.length === 0) {
        $("body").append(`
            <div id="playlist-modal" class="modal" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Select Playlist</h5>
                            <button type="button" class="btn-close close-modal" aria-label="Close" style="border: none; background: none; font-size: 1.5rem;">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div id="modal-playlists-list" class="list-group">
                                <button type="button" class="list-group-item list-group-item-action">Placeholder One</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
        modal = $("#playlist-modal");
    }

    modal.css("display", "flex");
}

function displayPlaylists(playlists) {
    const container = $("#user-playlists-container");

    if (playlists.length === 0) {
        return;
    }

    playlists.forEach(function(playlist) {
        let image = playlist.playlistpicture;
        if (!image && playlist.tracks && playlist.tracks.length > 0) {
            image = playlist.tracks[0].albumImage;
        }
        image = image || "./assets/default-album.png";

        const card = $(`
            <a href="playlist.html?id=${playlist._id}" class="card playlist-card">
                <div class="card-image" style="background-image: url('${image}'); background-size: cover; background-position: center;"></div>
                <div class="card-info">
                    <p class="card-title">${playlist.name}</p>
                    <p class="card-subtitle">${playlist.tracks ? playlist.tracks.length : 0} Tracks</p>
                </div>
            </a>
        `);
        container.append(card);
    });
}
