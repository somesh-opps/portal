// ============================================
// SUBMISSION_CERTIFICATE.JS - Certificate Page Scripts
// ============================================

// Load header from external file
fetch('header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-placeholder').innerHTML = data;
    })
    .catch(error => console.error('Error loading header:', error));

// Load footer from external file
fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
    })
    .catch(error => console.error('Error loading footer:', error));

// ============================================
// LOAD APPLICATION DATA FROM LOCALSTORAGE
// ============================================

// Load and display application data from localStorage
function loadApplicationData() {
    const savedData = localStorage.getItem('patentApplicationData');
    
    if (savedData) {
        const data = JSON.parse(savedData);
        populateCertificate(data);
        
        // Clear the form data from localStorage after loading
        // This resets the form for new applications
        localStorage.removeItem('patentApplicationData');
    }
    
    // Set current date/time for generation timestamp
    const now = new Date();
    document.getElementById('generatedAt').textContent = `Generated on: ${now.toLocaleDateString('en-IN', { 
        month: 'long', day: 'numeric', year: 'numeric' 
    })} at ${now.toLocaleTimeString('en-IN', { 
        hour: 'numeric', minute: '2-digit', hour12: true 
    })}`;
}

// Populate certificate with data from form
function populateCertificate(data) {
    // Helper function to set text or show "Not provided"
    const setFieldValue = (elementId, value, fallback = 'Not provided') => {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value && value.trim() ? value : fallback;
            // Add styling for "Not provided" text
            if (!value || !value.trim()) {
                element.classList.add('text-gray-400', 'italic');
            }
        }
    };
    
    // Check if this is a student application
    const isStudentApplication = data.reimbursementType === 'student';
    
    // Applicant Name - show student name if applying for student, otherwise full name
    if (isStudentApplication && data.studentName) {
        setFieldValue('applicantName', data.studentName);
        
        // Show supervisor section with teacher's details
        const supervisorSection = document.getElementById('supervisorSection');
        supervisorSection.classList.remove('hidden');
        
        setFieldValue('supervisorName', data.fullName);
        setFieldValue('supervisorDepartment', data.departmentName);
    } else {
        setFieldValue('applicantName', data.fullName);
    }
    
    // Application ID
    if (data.applicationId) {
        document.getElementById('applicationId').textContent = '#' + data.applicationId;
    } else {
        setFieldValue('applicationId', null, '#Not generated');
    }
    
    // Article/Patent Title
    setFieldValue('patentTitle', data.articleTitle);
    
    // Article Type (Journal, Conference, Book, Book Chapter)
    setFieldValue('patentType', data.articleTypeName);
    
    // Indexing (SCI, SCIE, Scopus, etc.)
    setFieldValue('patentDomain', data.articleIndexingName);
    
    // Department - show student department if applying for student
    if (isStudentApplication && data.studentDepartmentName) {
        setFieldValue('department', data.studentDepartmentName);
    } else {
        setFieldValue('department', data.departmentName);
    }
    
    // Submission Date
    if (data.submissionDate) {
        document.getElementById('submissionDate').textContent = new Date(data.submissionDate).toLocaleDateString('en-IN', {
            month: 'long', day: 'numeric', year: 'numeric'
        });
    } else {
        setFieldValue('submissionDate', null);
    }
    
    // Verification Code
    if (data.verificationCode) {
        document.getElementById('verificationCode').textContent = data.verificationCode;
    } else {
        setFieldValue('verificationCode', null, 'Not generated');
    }
}

// Download as PDF
async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const certificate = document.getElementById('certificate');
    
    // Show loading
    const btn = event.target.closest('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="material-symbols-outlined animate-spin">refresh</span> Generating...';
    btn.disabled = true;

    try {
        const canvas = await html2canvas(certificate, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#FFFEF8'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 10;

        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        
        const applicationId = document.getElementById('applicationId').textContent.replace('#', '');
        pdf.save(`Patent_Certificate_${applicationId}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try printing instead.');
    }

    // Restore button
    btn.innerHTML = originalText;
    btn.disabled = false;
}

// Initialize
document.addEventListener('DOMContentLoaded', loadApplicationData);
