// Authentication JavaScript for Login Page

// Demo credentials
const DEMO_CREDENTIALS = {
    email: 'demo@shopeasy.com',
    password: 'Demo@123'
};

// Login attempts tracking
let loginAttempts = parseInt(localStorage.getItem('loginAttempts')) || 0;
const MAX_ATTEMPTS = 3;
let lockoutTime = parseInt(localStorage.getItem('lockoutTime')) || 0;

// Initialize login form
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const warningDiv = document.getElementById('wrongAttemptWarning');
    const successDiv = document.getElementById('successMessage');
    
    if (!loginForm) return;
    
    // Check if user is locked out
    checkLockout();
    
    // Toggle password visibility
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
        });
    }
    
    // Real-time validation
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);
    
    // Form submission
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        
        if (isEmailValid && isPasswordValid) {
            attemptLogin();
        }
        
        loginForm.classList.add('was-validated');
    });
    
    // Auto-fill demo credentials on click
    const demoAlert = document.querySelector('.alert-info');
    if (demoAlert) {
        demoAlert.addEventListener('click', function() {
            emailInput.value = DEMO_CREDENTIALS.email;
            passwordInput.value = DEMO_CREDENTIALS.password;
            
            // Trigger validation
            validateEmail();
            validatePassword();
            
            showToast('Demo credentials filled!', 'info');
        });
    }
});

// Validate email
function validateEmail() {
    const emailInput = document.getElementById('email');
    const feedback = document.getElementById('emailFeedback');
    
    if (!emailInput) return false;
    
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email === '') {
        emailInput.classList.remove('is-valid');
        emailInput.classList.add('is-invalid');
        if (feedback) feedback.textContent = 'Email address is required.';
        return false;
    } else if (!emailRegex.test(email)) {
        emailInput.classList.remove('is-valid');
        emailInput.classList.add('is-invalid');
        if (feedback) feedback.textContent = 'Please enter a valid email address (e.g., user@example.com).';
        return false;
    } else {
        emailInput.classList.remove('is-invalid');
        emailInput.classList.add('is-valid');
        return true;
    }
}

// Validate password
function validatePassword() {
    const passwordInput = document.getElementById('password');
    const feedback = document.getElementById('passwordFeedback');
    
    if (!passwordInput) return false;
    
    const password = passwordInput.value;
    
    if (password === '') {
        passwordInput.classList.remove('is-valid');
        passwordInput.classList.add('is-invalid');
        if (feedback) feedback.textContent = 'Password is required.';
        return false;
    } else if (password.length < 6) {
        passwordInput.classList.remove('is-valid');
        passwordInput.classList.add('is-invalid');
        if (feedback) feedback.textContent = 'Password must be at least 6 characters long.';
        return false;
    } else {
        passwordInput.classList.remove('is-invalid');
        passwordInput.classList.add('is-valid');
        return true;
    }
}

// Attempt login
function attemptLogin() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const warningDiv = document.getElementById('wrongAttemptWarning');
    const successDiv = document.getElementById('successMessage');
    const attemptCountSpan = document.getElementById('attemptCount');
    const warningMessageSpan = document.getElementById('warningMessage');
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Check if user is locked out
    if (isLockedOut()) {
        showLockoutWarning();
        return;
    }
    
    // Check credentials
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        // Successful login
        loginAttempts = 0;
        localStorage.setItem('loginAttempts', loginAttempts);
        localStorage.removeItem('lockoutTime');
        
        // Show success message
        if (successDiv) {
            successDiv.classList.remove('d-none');
            warningDiv.classList.add('d-none');
        }
        
        // Simulate redirect
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        
        showToast('Login successful! Welcome back!', 'success');
    } else {
        // Failed login
        loginAttempts++;
        localStorage.setItem('loginAttempts', loginAttempts);
        
        // Show warning message
        if (warningDiv && warningMessageSpan && attemptCountSpan) {
            warningDiv.classList.remove('d-none');
            successDiv.classList.add('d-none');
            
            const remainingAttempts = MAX_ATTEMPTS - loginAttempts;
            
            if (remainingAttempts > 0) {
                warningMessageSpan.textContent = 'Invalid credentials. ';
                attemptCountSpan.textContent = `${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining.`;
            } else {
                // Lock the account
                lockoutTime = Date.now() + (5 * 60 * 1000); // 5 minutes lockout
                localStorage.setItem('lockoutTime', lockoutTime);
                showLockoutWarning();
            }
        }
        
        // Shake form for wrong credentials
        const loginForm = document.getElementById('loginForm');
        loginForm.classList.add('shake');
        setTimeout(() => {
            loginForm.classList.remove('shake');
        }, 500);
        
        showToast('Invalid email or password!', 'danger');
    }
}

// Check if user is locked out
function isLockedOut() {
    if (lockoutTime === 0) return false;
    
    const currentTime = Date.now();
    return currentTime < lockoutTime;
}

// Show lockout warning
function showLockoutWarning() {
    const warningDiv = document.getElementById('wrongAttemptWarning');
    const warningMessageSpan = document.getElementById('warningMessage');
    const attemptCountSpan = document.getElementById('attemptCount');
    
    if (!warningDiv || !warningMessageSpan) return;
    
    const timeLeft = Math.ceil((lockoutTime - Date.now()) / 1000 / 60); // in minutes
    
    warningDiv.classList.remove('d-none');
    warningMessageSpan.textContent = 'Account locked due to too many failed attempts. ';
    attemptCountSpan.textContent = `Try again in ${timeLeft} minute${timeLeft > 1 ? 's' : ''}.`;
    
    // Disable form inputs
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = document.querySelector('#loginForm button[type="submit"]');
    
    if (emailInput) emailInput.disabled = true;
    if (passwordInput) passwordInput.disabled = true;
    if (submitButton) submitButton.disabled = true;
    
    // Update countdown every minute
    const countdownInterval = setInterval(() => {
        const currentTimeLeft = Math.ceil((lockoutTime - Date.now()) / 1000 / 60);
        
        if (currentTimeLeft <= 0) {
            clearInterval(countdownInterval);
            
            // Unlock the account
            localStorage.removeItem('lockoutTime');
            localStorage.setItem('loginAttempts', 0);
            loginAttempts = 0;
            lockoutTime = 0;
            
            // Re-enable form
            if (emailInput) emailInput.disabled = false;
            if (passwordInput) passwordInput.disabled = false;
            if (submitButton) submitButton.disabled = false;
            
            warningDiv.classList.add('d-none');
            showToast('Account unlocked. You can try logging in again.', 'info');
        } else {
            attemptCountSpan.textContent = `Try again in ${currentTimeLeft} minute${currentTimeLeft > 1 ? 's' : ''}.`;
        }
    }, 60000); // Update every minute
}

// Check lockout status on page load
function checkLockout() {
    if (isLockedOut()) {
        showLockoutWarning();
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${type} border-0`;
    toast.id = toastId;
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Show toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    .shake {
        animation: shake 0.5s;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);
