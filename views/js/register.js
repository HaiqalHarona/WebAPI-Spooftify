const registerForm = document.getElementById('register-form');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const togglePassword = document.getElementById('togglePassword');
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
const passwordError = document.getElementById('password-error');

const toggleVisibility = (input, icon) => {
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    icon.classList.toggle('fa-eye-slash');
};

togglePassword.addEventListener('click', () => toggleVisibility(passwordInput, togglePassword));
toggleConfirmPassword.addEventListener('click', () => toggleVisibility(confirmPasswordInput, toggleConfirmPassword));

const validatePasswords = () => {
    if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.setCustomValidity("Passwords do not match");
        passwordError.textContent = "Passwords do not match";
    } else {
        confirmPasswordInput.setCustomValidity("");
        passwordError.textContent = "";
    }
};

passwordInput.addEventListener('input', validatePasswords);
confirmPasswordInput.addEventListener('input', validatePasswords);

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