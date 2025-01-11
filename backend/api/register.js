// register.js
async function registerUser() {
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();

    if (!email || !password) {
        alert('Email and password are required!');
        return;
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Registration successful! Please log in.'); 
            window.location.href = 'login.html'; // Redirect to login page after successful registration
        } else {
            alert(result.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        alert('An error occurred. Please check your connection.');
    }
}
