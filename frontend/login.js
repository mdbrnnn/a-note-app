async function loginUser() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Email and password are required!');
        return;
    }

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('userEmail', email);
            window.location.href = 'index.html'; // Redirect to main page
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('An error occurred during login.');
    }
}
