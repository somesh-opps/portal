// ============================================
// FORGOT_PASSWORD.JS - Forgot Password Page Scripts
// ============================================

// Load footer from external file
fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
    })
    .catch(error => console.error('Error loading footer:', error));

// Step Navigation
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const successMessage = document.getElementById('successMessage');

// Progress Indicators
const step1Indicator = document.getElementById('step1-indicator');
const step2Indicator = document.getElementById('step2-indicator');
const step3Indicator = document.getElementById('step3-indicator');
const line1 = document.getElementById('line1');
const line2 = document.getElementById('line2');

// Forms
const emailForm = document.getElementById('emailForm');
const otpForm = document.getElementById('otpForm');
const passwordForm = document.getElementById('passwordForm');

// Email Form Submit
emailForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    document.getElementById('displayEmail').textContent = email;
    
    // Move to step 2
    step1.classList.remove('step-active');
    step1.classList.add('step-hidden');
    step2.classList.remove('step-hidden');
    step2.classList.add('step-active');
    
    // Update progress indicators
    step1Indicator.classList.remove('bg-primary-yellow', 'text-navy-dark');
    step1Indicator.classList.add('bg-green-500', 'text-white');
    step1Indicator.innerHTML = '<span class="material-icons text-sm">check</span>';
    line1.classList.remove('bg-gray-300');
    line1.classList.add('bg-primary-yellow');
    step2Indicator.classList.remove('bg-gray-300', 'text-gray-600');
    step2Indicator.classList.add('bg-primary-yellow', 'text-navy-dark');
    
    // Focus first OTP input
    document.querySelector('.otp-input').focus();
});

// OTP Input Auto-focus
const otpInputs = document.querySelectorAll('.otp-input');
otpInputs.forEach((input, index) => {
    input.addEventListener('input', function() {
        if (this.value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
    });
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
            otpInputs[index - 1].focus();
        }
    });
});

// OTP Form Submit
otpForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Move to step 3
    step2.classList.remove('step-active');
    step2.classList.add('step-hidden');
    step3.classList.remove('step-hidden');
    step3.classList.add('step-active');
    
    // Update progress indicators
    step2Indicator.classList.remove('bg-primary-yellow', 'text-navy-dark');
    step2Indicator.classList.add('bg-green-500', 'text-white');
    step2Indicator.innerHTML = '<span class="material-icons text-sm">check</span>';
    line2.classList.remove('bg-gray-300');
    line2.classList.add('bg-primary-yellow');
    step3Indicator.classList.remove('bg-gray-300', 'text-gray-600');
    step3Indicator.classList.add('bg-primary-yellow', 'text-navy-dark');
});

// Password Form Submit
passwordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        document.getElementById('passwordError').classList.remove('hidden');
        return;
    }
    
    document.getElementById('passwordError').classList.add('hidden');
    
    // Show success message
    step3.classList.remove('step-active');
    step3.classList.add('step-hidden');
    successMessage.classList.remove('step-hidden');
    successMessage.classList.add('step-active');
    
    // Update final indicator
    step3Indicator.classList.remove('bg-primary-yellow', 'text-navy-dark');
    step3Indicator.classList.add('bg-green-500', 'text-white');
    step3Indicator.innerHTML = '<span class="material-icons text-sm">check</span>';
});

// Back to Email
document.getElementById('backToEmail').addEventListener('click', function() {
    step2.classList.remove('step-active');
    step2.classList.add('step-hidden');
    step1.classList.remove('step-hidden');
    step1.classList.add('step-active');
    
    // Reset progress indicators
    step1Indicator.classList.remove('bg-green-500', 'text-white');
    step1Indicator.classList.add('bg-primary-yellow', 'text-navy-dark');
    step1Indicator.innerHTML = '1';
    line1.classList.remove('bg-primary-yellow');
    line1.classList.add('bg-gray-300');
    step2Indicator.classList.remove('bg-primary-yellow', 'text-navy-dark');
    step2Indicator.classList.add('bg-gray-300', 'text-gray-600');
});

// Resend OTP
document.getElementById('resendBtn').addEventListener('click', function() {
    alert('OTP has been resent to your email.');
});

// Toggle Password Visibility
function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = 'visibility';
    } else {
        input.type = 'password';
        icon.textContent = 'visibility_off';
    }
}

// Password Validation
document.getElementById('newPassword').addEventListener('input', function() {
    const password = this.value;
    
    // Check length
    updateRequirement('req-length', password.length >= 8);
    // Check uppercase
    updateRequirement('req-upper', /[A-Z]/.test(password));
    // Check lowercase
    updateRequirement('req-lower', /[a-z]/.test(password));
    // Check number
    updateRequirement('req-number', /[0-9]/.test(password));
});

function updateRequirement(id, met) {
    const element = document.getElementById(id);
    const icon = element.querySelector('.material-icons');
    if (met) {
        icon.textContent = 'check_circle';
        icon.classList.remove('text-gray-400');
        icon.classList.add('text-green-500');
    } else {
        icon.textContent = 'radio_button_unchecked';
        icon.classList.remove('text-green-500');
        icon.classList.add('text-gray-400');
    }
}
