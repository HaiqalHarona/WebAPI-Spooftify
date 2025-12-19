$(function() {
    // Search functionality
    const searchInput = $("#search-input");
    
    let searchTimeout;
    searchInput.on("input", function() {
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
});

async function searchTracks(query) {
    try {
        const response = await fetch(SEARCH_URL+"?q="+query+"&token="+sessionStorage.token, {
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
            </div>
        `);
        
        searchResults.append(trackCard);
    });
}
