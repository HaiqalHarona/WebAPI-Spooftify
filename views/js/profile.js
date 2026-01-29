$(function () {
    getUserEmail();
    checkSpotifyConnection();
    $('#connect-spotify-btn').on('click', getAuthURL);



    $('#profile-form').on('submit', function (e) {
        e.preventDefault();
        updateProfile();
    });
});

// Get Auth URL to connect to Spotify for user login
async function getAuthURL(e) {
    e.preventDefault();
    try {
        const response = await fetch(`${SPOTIFY_LOGGED_IN}/connect?token=${sessionStorage.token}`);
        const data = await response.json()
        if (response.ok) {
            window.location.href = data.url;
        }
        else {
            console.error(data.message);
            showMessage(data.message, 'error');

        }
    } catch (error) {
        console.error('Error connecting to Spotify:', error);
        showMessage('Error connecting to Spotify', 'error');
    }
}

// Check if user is connected to Spotify and display stats if connected
async function checkSpotifyConnection() {
    try {
        const response = await fetch(`${SPOTIFY_LOGGED_IN}/stats?token=${sessionStorage.token}`);
        const data = await response.json();

        if (data.connected && data.success) {
            $('#spotify-connect-section').hide();
            $('#spotify-stats-section').show();
            displayStats(data.stats);
        } else {
            $('#spotify-connect-section').show();
            $('#spotify-stats-section').hide();
        }
    } catch (error) {
        console.log("Not connected or error fetching stats");
    }
}

// Format display user's stats
function displayStats(stats) {
    // Render Top Tracks
    const tracksList = stats.topTracks.map((track, index) =>
        `<li style="margin-bottom: 8px;">
            ${index + 1}. <strong style="color:white;">${track.name}</strong> - ${track.artists[0].name}
         </li>`
    ).join('');
    $('#top-tracks-list').html(tracksList);

    // Render Top Artists
    const artistsList = stats.topArtists.map((artist, index) =>
        `<li style="margin-bottom: 8px;">
            ${index + 1}. <strong style="color:white;">${artist.name}</strong>
         </li>`
    ).join('');
    $('#top-artists-list').html(artistsList);
}



// Function to get user email
async function getUserEmail() {
    try {
        // First, let's get the user ID using the token
        const userResponse = await fetch(`${BASE_URL}/api/users?token=${sessionStorage.token}`);

        if (!userResponse.ok) {
            throw new Error('Failed to fetch user information');
        }

        const userData = await userResponse.json();

        $('#email').val(userData.email);
        $('#username').val(userData.username || '');

    } catch (error) {
        console.error('Error fetching user email:', error);
    }
}

// Function to update user profile
async function updateProfile() {
    const username = $('#username').val().trim();
    const password = $('#password').val();
    const confirmPassword = $('#confirm-password').val();

    // Validate input
    if (!username) {
        showMessage('Username is required', 'error');
        return;
    }

    if (password && password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }

    try {
        const updateData = { username };

        // Only include password if it's provided
        if (password) {
            updateData.password = password;
        }

        const response = await fetch(`${BASE_URL}/api/users?token=${sessionStorage.token}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        const result = await response.json();

        if (response.ok) {
            showMessage('Profile updated successfully!', 'success');
            // Clear password fields
            $('#password').val('');
            $('#confirm-password').val('');
        } else {
            showMessage(result.message || 'Failed to update profile', 'error');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showMessage('Error updating profile', 'error');
    }
}


function showMessage(message, type) {
    const messageArea = $('#message-area');
    messageArea.text(message);
    messageArea.removeClass('success error');
    messageArea.addClass(type);

    // Clear message after 5 seconds
    setTimeout(() => {
        messageArea.text('');
        messageArea.removeClass('success error');
    }, 5000);
}