const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = registerForm.username.value;
    const email = registerForm.email.value;
    const password = registerForm.password.value;

    const response = await fetch('/users/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            email,
            password
        })
    });

    if (response.ok) {
        window.location.href = 'login.html';
    } else {
        const data = await response.json();
        alert(data.message);
    }
});