// ============================================
// APPLICATION_PG2.JS - Application Form Page 2 Scripts
// ============================================

// Load header from external file
fetch('header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-placeholder').innerHTML = data;
    })
    .catch(error => console.error('Error loading header:', error));

// Generate unique application ID
function generateApplicationId() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PAT-${year}-${random}`;
}

// Generate verification code
function generateVerificationCode(appId) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `UEM-${appId}-${code}`;
}

// Submit application and navigate to certificate
function submitApplication() {
    const articleTitle = document.getElementById('articleTitle');
    const articleIndexing = document.getElementById('articleIndexing');
    
    // Get existing data from page 1
    let formData = JSON.parse(localStorage.getItem('patentApplicationData') || '{}');
    
    // Get indexing text - only if value is selected
    const indexingText = articleIndexing.value ? articleIndexing.options[articleIndexing.selectedIndex]?.text : '';
    
    // Add page 2 data
    formData.articleTitle = articleTitle.value;
    formData.articleIndexing = articleIndexing.value;
    formData.articleIndexingName = indexingText;
    
    // Generate application ID and verification code
    const applicationId = generateApplicationId();
    formData.applicationId = applicationId;
    formData.verificationCode = generateVerificationCode(applicationId);
    formData.submissionDate = new Date().toISOString();
    
    // Save complete data
    localStorage.setItem('patentApplicationData', JSON.stringify(formData));
    
    // Navigate to certificate page
    window.location.href = 'submission_certificate.html';
}

// Load saved data on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedData = localStorage.getItem('patentApplicationData');
    if (savedData) {
        const data = JSON.parse(savedData);
        if (data.articleTitle) document.getElementById('articleTitle').value = data.articleTitle;
        if (data.articleIndexing) document.getElementById('articleIndexing').value = data.articleIndexing;
    }
});
