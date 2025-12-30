// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDjfmsodqZW5VknlN98QPNA71yg8bCKlM0",
    authDomain: "ryofujimura-181bc.firebaseapp.com",
    projectId: "ryofujimura-181bc",
    storageBucket: "ryofujimura-181bc.firebasestorage.app",
    messagingSenderId: "347833216953",
    appId: "1:347833216953:web:25ad6906b865110c969068",
    measurementId: "G-PL472TJC9Z"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Global function for hotspot click handler
window.handleHotspotClick = (hotspot) => showPinPopup(hotspot);

// Initialize Pannellum Viewer
let viewer;
let pinCounter = 0;

function createPin(pitch, yaw) {
    viewer.addHotSpot({
        pitch, yaw,
        type: 'info',
        text: 'Click to view',
        cssClass: 'custom-pin',
        id: `pin-${pinCounter++}`,
        clickHandlerFunc: 'handleHotspotClick'
    });
}

function initPanorama() {
    viewer = pannellum.viewer('panorama', {
        type: 'equirectangular',
        panorama: 'images/room-360.jpg',
        autoLoad: true,
        autoRotate: 0,
        compass: false,
        showControls: true,
        hfov: 100,
        minHfov: 50,
        maxHfov: 120,
        mouseZoom: true
    });

    viewer.on('load', () => createPin(0, 0));

    // Add pin on Ctrl/Cmd+Click
    let isDragging = false;
    let mouseDownPos = null;
    
    viewer.on('mousedown', (e) => {
        isDragging = false;
        mouseDownPos = { x: e.clientX, y: e.clientY };
    });

    viewer.on('mousemove', (e) => {
        if (mouseDownPos) {
            const dx = Math.abs(e.clientX - mouseDownPos.x);
            const dy = Math.abs(e.clientY - mouseDownPos.y);
            if (dx > 5 || dy > 5) isDragging = true;
        }
    });

    viewer.on('mouseup', (e) => {
        if (!isDragging && (e.ctrlKey || e.metaKey)) {
            const coords = viewer.mouseEventToCoords(e);
            if (coords) createPin(coords.pitch, coords.yaw);
        }
        isDragging = false;
        mouseDownPos = null;
    });
}

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

// Pin Popup
function showPinPopup(hotspot) {
    const pinContent = document.getElementById('pinContent');
    const pitch = hotspot?.pitch || 0;
    const yaw = hotspot?.yaw || 0;
    
    pinContent.innerHTML = `
        <p><strong>Pin Location:</strong></p>
        <p>Pitch: ${pitch.toFixed(2)}°</p>
        <p>Yaw: ${yaw.toFixed(2)}°</p>
        <p style="margin-top: 15px; color: #666; font-size: 14px;">
            💡 Tip: Hold Ctrl (or Cmd on Mac) and click anywhere on the panorama to add more pins.
        </p>
    `;
    pinModal.classList.add('show');
}

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

// Initialize
window.addEventListener('DOMContentLoaded', initPanorama);
