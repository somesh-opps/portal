// ============================================
// WELCOME.JS - Welcome/Landing Page Scripts
// ============================================

// Load footer from external file
fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
    })
    .catch(error => console.error('Error loading footer:', error));
