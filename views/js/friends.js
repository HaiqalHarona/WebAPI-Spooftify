$(async function () {
    getFriends();
    getFriendRequests();
    getSendRequests();

    const searchInput = $("#search-input");

    $(".search-results").on("click", ".action-btn.add", function (event) {
        event.preventDefault();
        const userCard = $(this).closest('.user-card');
        const userId = userCard.data('user-id');
        addFriend(userId);
    });

    searchInput.on("keyup", function () {
        const query = searchInput.val();
        searchUsers(query);
        if (query === "") {
            $(".search-results").empty();
        }
    });

    $(".friends-list").on("click", ".action-btn.remove", function (event) {
        event.preventDefault();
        const userCard = $(this).closest('.user-card');
        const userId = userCard.attr('data-user-id');
        removeFriend(userId);
    });

    $(".requests-list.incoming").on("click", ".action-btn.accept", function (event) {
        event.preventDefault();
        const userCard = $(this).closest('.user-card');
        const userId = userCard.attr('data-user-id');
        acceptFriend(userId);
    });

    $(".requests-list.incoming").on("click", ".action-btn.reject", function (event) {
        event.preventDefault();
        const userCard = $(this).closest('.user-card');
        const userId = userCard.attr('data-user-id');
        rejectFriend(userId);
    });

    $(".requests-list.sent").on("click", ".action-btn.remove", function (event) {
        event.preventDefault();
        const userCard = $(this).closest('.user-card');
        const userId = userCard.attr('data-user-id');
        removeFriend(userId);
    });

    $(".friends-list").on("click", ".action-btn.chat", function (event) {
        event.preventDefault();
        const userCard = $(this).closest('.user-card');
        const userId = userCard.attr('data-user-id');
        const username = userCard.find('.username').text();
        openChatPopup(userId, username);
        loadChat(userId);
    });

    $(".requests-list.incoming").on("click", ".action-btn.accept", function (event) {
        event.preventDefault();
        const userCard = $(this).closest('.user-card');
        const userId = userCard.attr('data-user-id');
        acceptFriend(userId);
    })
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
                <button class="action-btn add">Add</button>
            </div>
        `;

        searchResultsContainer.append(userCardHtml);
    });
}

async function addFriend(friendId) {
    try {
        let response = await fetch(`${FRIENDS_URL}?token=${sessionStorage.token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ friendId: friendId })
        });
        if (response.ok) {
            let data = await response.json();
            showNotification(data.message, 'success');
            setTimeout(() => location.reload(), 1000);
        } else {
            let data = await response.json();
            showNotification("Failed to add friend: " + (data.message || "Unknown error"), 'error');
        }
    } catch (error) {
        console.error("Error adding friend:", error);
        showNotification("Failed to add friend: " + error.message, 'error');
    }
}

async function getFriends() {
    try {
        const response = await fetch(`${USERS_URL}/friends?token=${sessionStorage.token}`);
        const data = await response.json();

        if (response.ok && data.success) {
            const friends = data.message.filter(f => f.status === 'accepted');
            displayFriends(friends);
        }
    } catch (error) {
        console.error("Error getting friends:", error);
    }
}

async function getSendRequests() {
    try {
        const response = await fetch(`${USERS_URL}/friends?token=${sessionStorage.token}`);
        const data = await response.json();

        if (response.ok && data.success) {
            const sentRequests = data.message.filter(f => f.status === 'pending');
            displaySendRequests(sentRequests);
        }
    } catch (error) {
        console.error("Error getting friends:", error);
    }
}

async function getFriendRequests() {
    try {
        const response = await fetch(`${USERS_URL}/requests?token=${sessionStorage.token}`);
        const data = await response.json();

        if (response.ok && data.success) {
            displayFriendRequests(data.message);
        }
    } catch (error) {
        console.error("Error getting friend requests:", error);
    }
}

function displayFriends(friends) {
    const friendslistContainer = $(".friends-list");

    if (!friends || friends.length === 0) {
        friendslistContainer.html('<p style="color: #b3b3b3; padding: 1rem;">No friends yet.</p>');
        return;
    }

    friends.forEach(friendship => {
        const friend = friendship.user;
        if (!friend) return;

        const avatarStyle = friend.profilepicture ? `background-image: url('${friend.profilepicture}'); background-size: cover; background-position: center;` : '';

        const friendCardHtml = `
            <div class="user-card" data-user-id="${friend._id}">
                <div class="user-info">
                    <div class="avatar" style="${avatarStyle}"></div>
                    <div>
                        <p class="username">${friend.username}</p>
                        <p class="email" style="font-size: 0.8em; color: #b3b3b3;">${friend.email}</p>
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="action-btn chat" style="margin-right: 5px;">Chat</button>
                    <button class="action-btn remove">Remove</button>
                </div>
            </div>
        `;
        friendslistContainer.append(friendCardHtml);
    });
}

function displayFriendRequests(requests) {
    const requestsContainer = $(".requests-list.incoming");
    requestsContainer.empty();

    if (!requests || requests.length === 0) {
        requestsContainer.html('<p style="color: #b3b3b3; padding: 1rem;">No pending requests.</p>');
        return;
    }

    requests.forEach(req => {
        const requester = req.user;
        if (!requester) return;

        const avatarStyle = requester.profilepicture ? `background-image: url('${requester.profilepicture}'); background-size: cover; background-position: center;` : '';

        const requestCardHtml = `
            <div class="user-card" data-user-id="${requester._id}">
                <div class="user-info">
                    <div class="avatar" style="${avatarStyle}"></div>
                    <div>
                        <p class="username">${requester.username}</p>
                        <p class="email" style="font-size: 0.8em; color: #b3b3b3;">${requester.email}</p>
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="action-btn accept">Accept</button>
                    <button class="action-btn reject">Reject</button>
                </div>
            </div>
        `;
        requestsContainer.append(requestCardHtml);
    });
}

function displaySendRequests(requests) {
    const requestsContainer = $(".requests-list.sent");
    requestsContainer.empty();

    if (!requests || requests.length === 0) {
        requestsContainer.html('<p style="color: #b3b3b3; padding: 1rem;">No sent requests.</p>');
        return;
    }

    requests.forEach(req => {
        const requester = req.user;
        if (!requester) return;

        const avatarStyle = requester.profilepicture ? `background-image: url('${requester.profilepicture}'); background-size: cover; background-position: center;` : '';

        const requestCardHtml = `
            <div class="user-card" data-user-id="${requester._id}">
                <div class="user-info">
                    <div class="avatar" style="${avatarStyle}"></div>
                    <div>
                        <p class="username">${requester.username}</p>
                        <p class="email" style="font-size: 0.8em; color: #b3b3b3;">${requester.email}</p>
                    </div>
                </div>
                <span class="pending-tag">Pending</span>
            </div>
        `;
        requestsContainer.append(requestCardHtml);
    });
}

async function acceptFriend(friendId) {
    try {
        let response = await fetch(`${FRIENDS_URL}/accept/${friendId}?token=${sessionStorage.token}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            getFriends();
            setTimeout(() => location.reload(), 1000);
        } else if (!response.ok) {
            let data = await response.json();
        }


    } catch (error) {
        console.error("Error accepting friend:", error);
    }
}

async function rejectFriend(friendId) {
    try {
        let response = await fetch(`${FRIENDS_URL}/reject/${friendId}?token=${sessionStorage.token}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            showNotification("Friend request rejected!", 'success');
            getFriendRequests();
            setTimeout(() => location.reload(), 1000);
        } else if (!response.ok) {
            let data = await response.json();
            showNotification("Failed to reject friend: " + (data.message || "Unknown error"), 'error');
        }
    } catch (error) {
        console.error("Error rejecting friend:", error);
    }
}

async function removeFriend(friendId) {
    try {
        let response = await fetch(`${FRIENDS_URL}/remove/${friendId}?token=${sessionStorage.token}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            showNotification("Friend removed successfully!", 'success');
            setTimeout(() => location.reload(), 1000);
        } else if (!response.ok) {
            let data = await response.json();
            showNotification("Failed to remove friend: " + (data.message || "Unknown error"), 'error');
        }

    } catch (error) {
        console.error("Error removing friend:", error);
    }

}

function openChatPopup(userId, username) {
    $('#chat-modal').remove();

    const modalHtml = `
        <div id="chat-modal" class="modal" tabindex="-1" style="display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1050; background-color: rgba(0,0,0,0.5); justify-content: center; align-items: center;">
            <div class="modal-dialog modal-dialog-centered" style="max-width: 500px; width: 100%;">
                <div class="modal-content" style="background-color: #1e1e1e; color: white; border-radius: 8px;">
                    <div class="modal-header" style="border-bottom: 1px solid #333; padding: 1rem; display: flex; justify-content: space-between; align-items: center;">
                        <h5 class="modal-title" style="margin: 0;">Chat with ${username}</h5>
                        <button type="button" class="btn-close close-chat-modal" aria-label="Close" style="filter: invert(1); background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
                    </div>
                    <div class="modal-body" style="height: 400px; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column;">
                        <div id="chat-history" class="chat-history" style="flex-grow: 1; display: flex; flex-direction: column;">
                            <p class="text-center text-muted" style="color: #b3b3b3; text-align: center; margin-top: 20px;">Loading chat...</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `;

    $('body').append(modalHtml);

    // Close handlers
    $('.close-chat-modal').on('click', function () {
        $('#chat-modal').remove();
    });

    $('#chat-modal').on('click', function (e) {
        if (e.target === this) {
            $(this).remove();
        }
    });
    


}
async function loadChat(user2Id) {
    try {
        const response = await fetch(`${MESSAGES_URL}/${user2Id}?token=${sessionStorage.token}`);
        const data = await response.json();
        const chatHistoryContainer = $("#chat-history");
        chatHistoryContainer.empty();

        if (response.ok && data.success && data.chat && data.chat.Messages) {
            const messages = data.chat.Messages;

            if (messages.length === 0) {
                chatHistoryContainer.html('<p style="color: #b3b3b3; padding: 1rem; text-align: center;">No messages yet.</p>');
                return;
            }

            messages.forEach(msg => {
                const isIncoming = msg.from._id === user2Id;
                const bubbleStyle = isIncoming
                    ? 'background-color: #3E3E3E; color: white; border-radius: 0px 15px 15px 15px; align-self: flex-start;'
                    : 'background-color: #1DB954; color: white; border-radius: 15px 0px 15px 15px; align-self: flex-end;';

                const time = new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                let content = msg.songurl;
                // Basic URL detection
                if (content.includes('http')) {
                     const urlRegex = /(https?:\/\/[^\s]+)/g;
                     content = content.replace(urlRegex, url => `<a href="${url}" target="_blank" style="color: inherit; text-decoration: underline;">${url}</a>`);
                }

                const msgHtml = `
                    <div class="message-bubble" style="max-width: 75%; margin-bottom: 10px; padding: 10px 15px; ${bubbleStyle} position: relative; word-wrap: break-word; box-shadow: 0 1px 2px rgba(0,0,0,0.2);">
                        <div class="message-text" style="font-size: 0.95rem;">${content}</div>
                        <div class="message-time" style="font-size: 0.7rem; text-align: right; margin-top: 4px; opacity: 0.7;">${time}</div>
                    </div>
                `;
                chatHistoryContainer.append(msgHtml);
            });

            // Scroll to bottom
            const modalBody = chatHistoryContainer.parent();
            modalBody.scrollTop(modalBody[0].scrollHeight);

        } else {
            chatHistoryContainer.html('<p style="color: #b3b3b3; padding: 1rem; text-align: center;">No chat history available.</p>');
        }
    } catch (error) {
        console.error("Error loading chat:", error);
        $("#chat-history").html('<p style="color: #b3b3b3; padding: 1rem; text-align: center;">Error loading chat.</p>');
    }

}