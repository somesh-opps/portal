// ============================================
// APPLICATION_PG1.JS - Application Form Page 1 Scripts
// ============================================

// Load header from external file
fetch('header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-placeholder').innerHTML = data;
    })
    .catch(error => console.error('Error loading header:', error));

// Save form data to localStorage and navigate to next page
function saveAndNavigate() {
    const institutionSelect = document.getElementById('institutionSelect');
    const departmentSelect = document.getElementById('departmentSelect');
    const fullName = document.getElementById('fullName');
    const reimbursementSelect = document.getElementById('reimbursementSelect');
    const articleType = document.querySelector('input[name="article_type"]:checked');
    
    // Get selected text (not value) for display purposes
    const institutionText = institutionSelect.options[institutionSelect.selectedIndex]?.text || '';
    const departmentText = departmentSelect.options[departmentSelect.selectedIndex]?.text || '';
    
    const formData = {
        institution: institutionSelect.value,
        institutionName: institutionText,
        department: departmentSelect.value,
        departmentName: departmentText,
        fullName: fullName.value,
        reimbursementType: reimbursementSelect.value,
        articleType: articleType ? articleType.value : '',
        articleTypeName: articleType ? getArticleTypeName(articleType.value) : ''
    };
    
    // If applying for student, save student details
    if (reimbursementSelect.value === 'student') {
        const studentName = document.getElementById('studentName');
        const studentDepartment = document.getElementById('studentDepartment');
        const studentEnrollment = document.getElementById('studentEnrollment');
        const studentDeptText = studentDepartment.options[studentDepartment.selectedIndex]?.text || '';
        
        formData.studentName = studentName.value;
        formData.studentDepartment = studentDepartment.value;
        formData.studentDepartmentName = studentDeptText;
        formData.studentEnrollment = studentEnrollment.value;
    }
    
    // Save to localStorage
    localStorage.setItem('patentApplicationData', JSON.stringify(formData));
    
    // Navigate to next page
    window.location.href = 'application_pg2.html';
}

// Helper function to get article type display name
function getArticleTypeName(value) {
    const types = {
        'journal': 'Journal',
        'conference': 'Conference',
        'book': 'Book',
        'chapter': 'Book Chapter'
    };
    return types[value] || value;
}

// Load saved data if exists (for back navigation)
document.addEventListener('DOMContentLoaded', function() {
    const savedData = localStorage.getItem('patentApplicationData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        if (data.institution) document.getElementById('institutionSelect').value = data.institution;
        if (data.department) document.getElementById('departmentSelect').value = data.department;
        if (data.fullName) document.getElementById('fullName').value = data.fullName;
        if (data.reimbursementType) {
            document.getElementById('reimbursementSelect').value = data.reimbursementType;
            // Trigger change event to show student fields if needed
            document.getElementById('reimbursementSelect').dispatchEvent(new Event('change'));
        }
        if (data.articleType) {
            const radioBtn = document.querySelector(`input[name="article_type"][value="${data.articleType}"]`);
            if (radioBtn) radioBtn.checked = true;
        }
        
        // Load student data if exists
        if (data.studentName) document.getElementById('studentName').value = data.studentName;
        if (data.studentDepartment) document.getElementById('studentDepartment').value = data.studentDepartment;
        if (data.studentEnrollment) document.getElementById('studentEnrollment').value = data.studentEnrollment;
    }
});

// Toggle Student Information Section
document.getElementById('reimbursementSelect').addEventListener('change', function() {
    const studentInfoSection = document.getElementById('studentInfoSection');
    const studentName = document.getElementById('studentName');
    const studentDepartment = document.getElementById('studentDepartment');
    const studentEnrollment = document.getElementById('studentEnrollment');
    
    if (this.value === 'student') {
        studentInfoSection.classList.remove('hidden');
        studentInfoSection.classList.add('animate-fadeIn');
        // Make fields required
        studentName.required = true;
        studentDepartment.required = true;
        studentEnrollment.required = true;
    } else {
        studentInfoSection.classList.add('hidden');
        // Remove required and clear values
        studentName.required = false;
        studentDepartment.required = false;
        studentEnrollment.required = false;
        studentName.value = '';
        studentDepartment.value = '';
        studentEnrollment.value = '';
    }
});
