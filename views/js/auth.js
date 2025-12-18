$(function () {
    const currentPage = window.location.pathname.split("/").pop();
    if (!sessionStorage.token && currentPage !== "login.html" && currentPage !== "register.html") {
        window.location.href = "login.html";
        alert("Please Login First. Redirecting to login.");

    } else if (sessionStorage.token && (currentPage === "login.html" || currentPage === "register.html")) {
        window.location.href = "index.html";
        alert("Please Logout First. Redirecting to home.");

    }

    $("#loginform").on("submit", login);
    $("#logoutbutton").on("click", logout);

})
async function login(e) {
    e.preventDefault();
    let data = new FormData(e.target);
    let loginEntries = Object.fromEntries(data.entries());
    console.log("Login Payload:", loginEntries);
    try {
        let response = await fetch(LOGIN_URL, {
            method: 'POST',
            body: JSON.stringify(loginEntries),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (response.ok) {
            let data = await response.json();
            sessionStorage.token = data.token;
            window.location.href = 'index.html';
        } else {
            let err = await response.json();
            $("#login-error").text(err.message);
        }
    } catch (error) {
        console.error("Login error:", error);
        $("#login-error").text("An error occurred. Please try again.");
    }
}
async function logout() {
    try {
        await fetch(LOGOUT_URL, {
            method: 'GET',
            headers: {
                'x-access-token': sessionStorage.token
            }
        });
    } catch (error) {
        console.error("Logout error:", error);
    }
    sessionStorage.removeItem('token');
    window.location.href = "login.html";
}