$(function () {
    getUserEmail();

    $('#profile-form').on('submit', function (e) {
        e.preventDefault();
        updateProfile();
    });
});

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