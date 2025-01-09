// Login function
async function loginUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validation
    if (email === "" || password === "") {
        alert("Email and password are required!");
        return;
    }

    try {
        const response = await fetch('http://your_backend_url/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            // Store the email and token in localStorage
            localStorage.setItem('authToken', result.token);  // Assuming the backend returns a token
            localStorage.setItem('userEmail', email);
            alert(result.message);  // Show success message
            window.location.href = "index.html";  // Redirect to the notes page after login
        } else {
            alert(result.message);  // Show error message
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('An error occurred while logging in.');
    }
}

// Add event listener to login button
document.getElementById('login-btn').addEventListener('click', loginUser);
