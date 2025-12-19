$(function () {
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
    $("#search-results").on("click", ".btn-like", function (e) {
        e.stopPropagation();
        const trackId = $(this).closest(".track-card").data("track-id");

    });

    $("#search-results").on("click", ".btn-add-playlist", function (e) {
        e.stopPropagation();
        const trackId = $(this).closest(".track-card").data("track-id");
        openPlaylistModal(trackId);
    });

    $("body").on("click", ".close-modal", () => $("#playlist-modal").hide());
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
                            <button type="button" class="btn-close close-modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div id="modal-playlists-list" class="list-group">
                                <button type="button" class="list-group-item list-group-item-action">My Favorites</button>
                                <button type="button" class="list-group-item list-group-item-action">Chill Vibes</button>
                                <button type="button" class="list-group-item list-group-item-action">Workout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
        modal = $("#playlist-modal");
    }

    modal.show();
}
