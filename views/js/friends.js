$(async function () {
    const searchInput = $("#search-input");
    const addbtn = $("#addUserbtn");
    searchInput.on("keyup", function () {
        const query = searchInput.val();
        searchUsers(query);
        if (query === "") {
            $(".search-results").empty();
        }
        addbtn.on("click", function (event) {
            const userCard = event.target.closest('.user-card');
            const userId = userCard.getAttribute('data-user-id');
            console.log(userId);
        })
    });

})


// Helper Functions
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
async function searchUsers(query) {
    try {
        const response = await fetch(`${USERS_URL}/search/${query}?token=${sessionStorage.token}`);
        const data = await response.json();

        if (response.ok && data.success) {
            displaySearchUsers(data.message);
        } else {
            $(".search-results").html('<p style="color: #b3b3b3; padding: 1rem;">No users found.</p>');
        }
    } catch (error) {
        console.error("Error searching users:", error);
    }
}

function displaySearchUsers(users) {
    const searchResultsContainer = $(".search-results");
    searchResultsContainer.empty();
    if (!users || users.length === 0) {
        searchResultsContainer.html('<p style="color: #b3b3b3; padding: 1rem;">No users found.</p>');
        return;
    }

    users.forEach(user => {
        const avatarStyle = user.profilepicture ? `background-image: url('${user.profilepicture}'); background-size: cover; background-position: center;` : '';

        const userCardHtml = `
            <div class="user-card" data-user-id="${user._id}">
                <div class="user-info">
                    <div class="avatar" style="${avatarStyle}"></div>
                    <div>
                        <p class="username">${user.username}</p>
                        <p class="email" style="font-size: 0.8em; color: #b3b3b3;">${user.email}</p>
                    </div>
                </div>
                <button class="action-btn add" id="addUserbtn">Add</button>
            </div>
        `;

        searchResultsContainer.append(userCardHtml);
    });
    async function addFriend(friendId) {
        try {
            let response = await fetch(`${FRIEND_URL}?token=${sessionStorage.token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ friendId: friendId })
            });
            if (response.ok) {
                let data = await response.json();
                showNotification(data.message, 'success');
            } else {
                showNotification("Failed to add friend: " + error.message, 'error');
            }


        } catch (error) {
            console.error("Error adding friend:", error);
            showNotification("Failed to add friend: " + error.message, 'error');
        }
    }
}