$(function () {
    const currentPage = window.location.pathname.split("/").pop();
    if (!sessionStorage.token && currentPage !== "login.html" && currentPage !== "register.html") {
        window.location.href = "login.html";

    } else if (sessionStorage.token && (currentPage === "login.html" || currentPage === "register.html")) {
        window.location.href = "index.html";

    }

    const logoutButton = document.getElementById('logoutbutton');
    if(logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
})

async function logout() {
    try {
        let response = await fetch(LOGOUT_URL + "?token=" + sessionStorage.token);

        sessionStorage.removeItem("token");

        if (response.ok) {
            location.href = "login.html";
        } else {
            let err = await response.json();
            console.log(err.message);
            location.href = "login.html";
        }
    } catch (error) {
        console.error("Error during logout:", error);
        sessionStorage.removeItem("token");
        location.href = "login.html";
    }
}
