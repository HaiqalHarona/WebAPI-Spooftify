$(async function () {
    const searchInput = $("#search-input");
    searchInput.on("keyup", function () {
        const query = searchInput.val();
        searchUsers(query);
        if(query === "") {
            $(".search-results").empty();
        }
    });

})


// Helper Functions
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
                <button class="action-btn add">Add</button>
            </div>
        `;

        searchResultsContainer.append(userCardHtml);
    });
}