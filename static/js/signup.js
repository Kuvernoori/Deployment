document.querySelector('.signup-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const messageContainer = document.getElementById('message-container');

    clearErrors();
    messageContainer.innerHTML = '';

    let isValid = true;

    isValid = validateField(username) && isValid;
    isValid = validateEmailField(email) && isValid;
    isValid = validatePasswordField(password) && isValid;
    isValid = validateConfirmPasswordField(confirmPassword, password.value) && isValid;

    if (!isValid) {
        clearInvalidFields(username, email, password, confirmPassword);
        return;
    }

    const usernameExists = await checkUsername(username.value.trim());
    if (usernameExists) {
        username.placeholder = 'This username is already taken.';
        username.classList.add('error');
        clearInvalidFields(username);
        return;
    }

    const emailExists = await checkEmail(email.value.trim());
    if (emailExists) {
        email.placeholder = 'This email is already registered.';
        email.classList.add('error');
        clearInvalidFields(email);
        return;
    }

    const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username.value.trim(),
            email: email.value.trim(),
            password: password.value.trim(),
            password_confirm: confirmPassword.value.trim(),
        })
    });

    if (response.ok) {
        showMessage('Registration successful! Redirecting to login...', 'success');
        setTimeout(() => {
            window.location.href = "/authentication/login.html";
        }, 2000);
    } else {
        const errorData = await response.json();
        alert(errorData.message || 'Registration failed. Try again.');
    }
});

async function checkEmail(email) {
    const response = await fetch(`/check-email?email=${encodeURIComponent(email)}`);
    const data = await response.json();
    return data.exists;
}

async function checkUsername(username) {
    const response = await fetch(`/check-username?username=${encodeURIComponent(username)}`);
    const data = await response.json();
    return data.exists;
}

function showMessage(message, type) {
    const messageContainer = document.getElementById('message-container');
    messageContainer.innerHTML = `<p class="${type}">${message}</p>`;
}


document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        document.querySelector('.signup-form').dispatchEvent(new Event('submit'));
    } else if (event.key === 'Escape') {
        clearFields();
    }
});

document.getElementById('name').addEventListener('input', function () {
    validateField(this);
});

document.getElementById('email').addEventListener('input', function () {
    validateEmailField(this);
});

document.getElementById('password').addEventListener('input', function () {
    validatePasswordField(this);
});

document.getElementById('confirm-password').addEventListener('input', function () {
    const passwordValue = document.getElementById('password').value.trim();
    validateConfirmPasswordField(this, passwordValue);
});


function validateField(field) {
    const latinRegex = /^[A-Za-z0-9\s]+$/;
    if (field.value.trim() === '') {
        field.placeholder = "Please enter your nickname.";
        field.classList.add('error');
        return false;
    } else if (!latinRegex.test(field.value.trim())) {
        field.placeholder = "Please enter your nickname in Latin characters only.";
        field.classList.add('error');
        return false;
    } else {
        field.placeholder = '';
        field.classList.remove('error');
        return true;
    }
}

function validateEmailField(email) {
    const latinRegex = /^[A-Za-z0-9@.\s]+$/;
    if (email.value.trim() === '') {
        email.placeholder = 'Please enter your email.';
        email.classList.add('error');
        return false;
    } else if (!validateEmail(email.value.trim())) {
        email.placeholder = 'Please enter a valid email address. (example@domain.tld)';
        email.classList.add('error');
        return false;
    } else if (!latinRegex.test(email.value.trim())) {
        email.placeholder = 'Email must contain only Latin characters.';
        email.classList.add('error');
        return false;
    } else {
        email.placeholder = '';
        email.classList.remove('error');
        return true;
    }
}

function validatePasswordField(password) {
    const hasNumber = /\d/;
    const latinRegex = /^[A-Za-z0-9\s]+$/;
    if (password.value.trim() === '') {
        password.placeholder = 'Please enter your password.';
        password.classList.add('error');
        return false;
    }
    if (password.value.includes(' ')) {
        password.placeholder = 'Password must not contain spaces.';
        password.classList.add('error');
        return false;
    } else if (password.value.length < 6) {
        password.placeholder = 'Password must be at least 6 characters long.';
        password.classList.add('error');
        return false;
    } else if (!hasNumber.test(password.value)) {
        password.placeholder = 'Password must contain at least one number.';
        password.classList.add('error');
        return false;
    } else if (!latinRegex.test(password.value.trim())) {
        password.placeholder = 'Password must contain only Latin characters.';
        password.classList.add('error');
        return false;
    } else {
        password.placeholder = '';
        password.classList.remove('error');
        return true;
    }
}

function validateConfirmPasswordField(confirmPassword, passwordValue) {
    const trimmedConfirm = confirmPassword.value.trim();
    const trimmedPassword = passwordValue.trim();

    if (trimmedConfirm === '') {
        confirmPassword.placeholder = 'Please confirm your password.';
        confirmPassword.classList.add('error');
        return false;
    } else if (trimmedConfirm !== trimmedPassword) {
        confirmPassword.placeholder = 'Passwords do not match.';
        confirmPassword.classList.add('error');
        return false;
    } else {
        confirmPassword.placeholder = '';
        confirmPassword.classList.remove('error');
        return true;
    }
}


function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function clearErrors() {
    const fields = [document.getElementById('name'), document.getElementById('email'),
        document.getElementById('password'), document.getElementById('confirm-password')];
    fields.forEach(field => {
        field.classList.remove('error');
    });
}

function clearInvalidFields(username, email, password, confirmPassword) {
    if (username.classList.contains('error')) {
        username.value = '';
    }
    if (email.classList.contains('error')) {
        email.value = '';
    }
    if (password.classList.contains('error')) {
        password.value = '';
    }
    if (confirmPassword.classList.contains('error')) {
        confirmPassword.value = '';
    }
}

function clearFields() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirm-password').value = '';
}



