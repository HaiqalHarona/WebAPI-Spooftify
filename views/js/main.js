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


    // FAB Design
    $(function () {
        const $fab = $('#fabButton');
        const $menu = $('#fabOptions');

        // Toggle menu
        $fab.click(function (e) {
            e.stopPropagation();
            $(this).toggleClass('active');
            $menu.toggleClass('active');
        });

        // Close when clicking outside
        $(document).click(function () {
            $fab.removeClass('active');
            $menu.removeClass('active');
        });

        // Don't close when clicking inside menu
        $menu.click(function (e) {
            e.stopPropagation();
        });
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

    $("body").on("click", ".close-modal", () => {
        $("#playlist-modal").hide();
        $("#create-playlist-modal").hide();
    });

    $("#addoption").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        openCreatePlaylistModal();
    });

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
function showNotification(message, type = 'success', duration = 3000) {
    // Remove existing notification if any
    $('#notification').remove();

    // Create notification
    $('body').append(`
        <div id="notification" class="${type}">
            <span id="notification-text">${message}</span>
        </div>
    `);

    // Show with animation
    $('#notification').css('display', 'block');
    setTimeout(() => {
        $('#notification').addClass('show');
    }, 10);

    // Auto hide
    setTimeout(() => {
        $('#notification').removeClass('show');
        setTimeout(() => {
            $('#notification').remove();
        }, 300);
    }, duration);

    // Optional: Click to dismiss
    $('#notification').on('click', function () {
        $(this).removeClass('show');
        setTimeout(() => $(this).remove(), 300);
    });
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
            <div id="playlist-modal" class="modal" tabindex="-1" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1050; background-color: rgba(0,0,0,0.5); justify-content: center; align-items: center;">
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

    const playlistContainer = $("#modal-playlists-list");
    playlistContainer.html("<p class='text-white'>Loading...</p>");

    try {
        const response = await fetch(PLAYLISTS_URL + "?token=" + sessionStorage.token);
        if (response.ok) {
            const data = await response.json();
            playlistContainer.empty();
            if (data.success && data.playlists && data.playlists.length > 0) {
                data.playlists.forEach(playlist => {
                    const ListItemBtn = $(`<button type="button" class="list-group-item list-group-item-action">${playlist.name}</button>`);
                    ListItemBtn.on("click", async function () {
                        await addTrackToPlaylist(trackId, playlist._id);
                        modal.hide();
                    });

                    playlistContainer.append(ListItemBtn);

                })
            } else {
                playlistContainer.append("<p>No playlists found.</p>");
            }


        } else {
            playlistContainer.html("<p>Failed loading playlists.</p>");
        }

    } catch (error) {
        console.error("Error loading playlists:", error);
        playlistContainer.html("<p>Error loading playlists.</p>");

    }
}

async function addTrackToPlaylist(trackId, playlistId) {

    try {
        const response = await fetch(`${PLAYLISTS_URL}/${playlistId}/add?token=${sessionStorage.token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ spotifyTrackId: trackId })
        });
        const data = await response.json();
        console.log(data);
        if (response.ok && data.success) {
            showNotification(data.message, 'success');

        } else {
            showNotification(data.message || "Failed to add track to playlist", 'error');
        }
    } catch (error) {
        console.error("Error adding track to playlist:", error);
        showNotification("Error adding track to playlist", 'error');
    }

}

function displayPlaylists(playlists) {
    const container = $("#user-playlists-container");

    // Clear existing playlists except the liked songs card
    container.find(".playlist-card").remove();

    if (playlists.length === 0) {
        return;
    }

    playlists.forEach(function (playlist) {
        let image = playlist.playlistpicture;
        if (!image && playlist.tracks && playlist.tracks.length > 0) {
            image = playlist.tracks[0].albumImage;
        }
        image = image || "./assets/default-album.png";

        const card = $(`
            <a href="playlist.html?id=${playlist._id}" class="card playlist-card" style="width: 200px;">
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

function openCreatePlaylistModal() {
    let modal = $("#create-playlist-modal");

    if (modal.length === 0) {
        $("body").append(`
            <div id="create-playlist-modal" class="modal" tabindex="-1" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1050; background-color: rgba(0,0,0,0.5); justify-content: center; align-items: center;">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Create Playlist</h5>
                            <button type="button" class="btn-close close-modal" aria-label="Close" style="border: none; background: none; font-size: 1.5rem;">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form id="create-playlist-form">
                                <div class="mb-3">
                                    <label for="playlist-name" class="form-label">Playlist Name</label>
                                    <input type="text" class="form-control" id="playlist-name" required>
                                </div>
                                <button type="submit" class="btn btn-primary">Create</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `);
        modal = $("#create-playlist-modal");

        $("#create-playlist-form").on("submit", async function (e) {
            e.preventDefault();
            const playlistName = $("#playlist-name").val();
            if (playlistName) {
                await createPlaylist(playlistName);
                $("#playlist-name").val("");
                modal.hide();
            }
        });
    }

    modal.css("display", "flex");
}

async function createPlaylist(name) {
    try {
        const response = await fetch(PLAYLISTS_URL + '/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name, token: sessionStorage.token })
        });

        if (response.ok) {
            let response = await fetch(PLAYLISTS_URL + "?token=" + sessionStorage.token);
            if (response.ok) {
                let data = await response.json();
                if (data.success) {
                    displayPlaylists(data.playlists);
                }
            }
        } else {
            console.error("Failed to create playlist:", await response.json());
        }
    } catch (error) {
        console.error("Error creating playlist:", error);
    }
}
