// ============================================
// LOGIN.JS - Login Page Scripts
// ============================================

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // In a real application, you would validate credentials here
    // For now, redirect to home.html on any login attempt
    window.location.href = 'home.html';
});

// Load footer from external file
fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
    })
    .catch(error => console.error('Error loading footer:', error));
