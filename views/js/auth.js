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
    $("#registerform").on("submit", register);

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
async function register(e) {
    e.preventDefault();
    let data = new FormData(e.target);
    let registerEntries = Object.fromEntries(data.entries());

    // Verify that passwords match
    if (registerEntries.password !== registerEntries["confirm-password"]) {
        $("#register-error").text("Passwords do not match");
        return;
    }

    delete registerEntries["confirm-password"];

    console.log("Register Payload:", registerEntries);

    try {
        let response = await fetch(REGISTER_URL, {
            method: 'POST',
            body: JSON.stringify(registerEntries),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            let data = await response.json();
            location.href = "login.html";
        } else {
            let err = await response.json();
            $("#register-error").text(err.message);
        }
    } catch (error) {
        console.error("Registration error:", error);
        $("#register-error").text("An error occurred. Please try again.");
    }
}
