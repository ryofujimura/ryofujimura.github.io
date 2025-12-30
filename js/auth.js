// Authentication Module
// Note: auth is imported from firebase-config.js (must be loaded first)

// DOM Elements
const authButton = document.getElementById('authButton');
const authModal = document.getElementById('authModal');
const pinModal = document.getElementById('pinModal');
const closeModal = document.querySelector('.close');
const closePinModal = document.querySelector('.close-pin');
const modalTitle = document.getElementById('modalTitle');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const signupPasswordConfirm = document.getElementById('signupPasswordConfirm');
const loginSubmit = document.getElementById('loginSubmit');
const signupSubmit = document.getElementById('signupSubmit');
const authError = document.getElementById('authError');

// Auth State Management
auth.onAuthStateChanged((user) => {
    authButton.textContent = user ? 'Logout' : 'Login';
    authButton.classList.toggle('logged-in', !!user);
});

// Auth Button
authButton.addEventListener('click', () => {
    if (auth.currentUser) {
        auth.signOut().catch(e => showError('Error signing out: ' + e.message));
    } else {
        showLoginForm();
        authModal.classList.add('show');
    }
});

// Modal Close Handlers
const closeModalHandler = (modal) => {
    modal.classList.remove('show');
    if (modal === authModal) {
        clearError();
        clearForms();
    }
};

closeModal.addEventListener('click', () => closeModalHandler(authModal));
closePinModal.addEventListener('click', () => closeModalHandler(pinModal));

window.addEventListener('click', (e) => {
    if (e.target === authModal || e.target === pinModal) {
        closeModalHandler(e.target);
    }
});

// Form Switching
document.getElementById('switchToSignup').addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'flex';
    modalTitle.textContent = 'Sign Up';
    clearError();
});

document.getElementById('switchToLogin').addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'flex';
    signupForm.style.display = 'none';
    modalTitle.textContent = 'Login';
    clearError();
});

function showLoginForm() {
    loginForm.style.display = 'flex';
    signupForm.style.display = 'none';
    modalTitle.textContent = 'Login';
    clearError();
}

// Auth Form Submission
async function handleAuth(action, email, password, passwordConfirm = null) {
    if (!email || !password || (passwordConfirm !== null && !passwordConfirm)) {
        showError('Please fill in all fields');
        return;
    }

    if (passwordConfirm !== null && password !== passwordConfirm) {
        showError('Passwords do not match');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }

    const submitButton = action === 'login' ? loginSubmit : signupSubmit;
    const originalText = submitButton.textContent;
    
    submitButton.disabled = true;
    submitButton.textContent = action === 'login' ? 'Logging in...' : 'Signing up...';
    clearError();

    try {
        if (action === 'login') {
            await auth.signInWithEmailAndPassword(email, password);
        } else {
            await auth.createUserWithEmailAndPassword(email, password);
        }
        authModal.classList.remove('show');
        clearForms();
    } catch (error) {
        showError(getErrorMessage(error));
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
}

loginSubmit.addEventListener('click', () => {
    handleAuth('login', loginEmail.value.trim(), loginPassword.value);
});

signupSubmit.addEventListener('click', () => {
    handleAuth('signup', signupEmail.value.trim(), signupPassword.value, signupPasswordConfirm.value);
});

// Enter key support
const handleEnterKey = (inputs, submitButton) => {
    inputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submitButton.click();
        });
    });
};

handleEnterKey([loginEmail, loginPassword], loginSubmit);
handleEnterKey([signupEmail, signupPassword, signupPasswordConfirm], signupSubmit);

// Helper Functions
function showError(message) {
    authError.textContent = message;
}

function clearError() {
    authError.textContent = '';
}

function clearForms() {
    loginEmail.value = '';
    loginPassword.value = '';
    signupEmail.value = '';
    signupPassword.value = '';
    signupPasswordConfirm.value = '';
}

function getErrorMessage(error) {
    const messages = {
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/email-already-in-use': 'Email already in use',
        'auth/invalid-email': 'Invalid email address',
        'auth/weak-password': 'Password is too weak',
        'auth/network-request-failed': 'Network error. Please check your connection'
    };
    return messages[error.code] || error.message || 'An error occurred';
}
