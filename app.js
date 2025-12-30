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

// Global function for hotspot click handler (needed for Pannellum)
window.handleHotspotClick = function(hotspot) {
    showPinPopup(hotspot);
};

// Initialize Pannellum Viewer
let viewer;
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

    // Add pin/hotspot after panorama loads
    let pinCounter = 0;
    viewer.on('load', function() {
        viewer.addHotSpot({
            pitch: 0,
            yaw: 0,
            type: 'info',
            text: 'Click to view',
            cssClass: 'custom-pin',
            id: 'pin-' + pinCounter++,
            clickHandlerFunc: 'handleHotspotClick'
        });
    });

    // Handle hotspot click - show popup (backup handler)
    viewer.on('hotspotclick', function(hotspot) {
        showPinPopup(hotspot);
    });

    // Allow clicking on panorama to add new pins (Ctrl+Click or Cmd+Click)
    let isDragging = false;
    let mouseDownTime = 0;
    let mouseDownPos = null;
    
    viewer.on('mousedown', function(event) {
        isDragging = false;
        mouseDownTime = Date.now();
        mouseDownPos = { x: event.clientX, y: event.clientY };
    });

    viewer.on('mousemove', function(event) {
        if (mouseDownPos) {
            const dx = Math.abs(event.clientX - mouseDownPos.x);
            const dy = Math.abs(event.clientY - mouseDownPos.y);
            if (dx > 5 || dy > 5) {
                isDragging = true;
            }
        }
    });

    viewer.on('mouseup', function(event) {
        // Only add pin if it was a quick click (not a drag) and modifier key is pressed
        const isModifierPressed = event.ctrlKey || event.metaKey;
        const clickDuration = Date.now() - mouseDownTime;
        
        if (!isDragging && clickDuration < 300 && isModifierPressed) {
            const coords = viewer.mouseEventToCoords(event);
            if (coords) {
                const pitch = coords.pitch;
                const yaw = coords.yaw;
                
                // Add new pin at clicked location
                viewer.addHotSpot({
                    pitch: pitch,
                    yaw: yaw,
                    type: 'info',
                    text: 'Click to view',
                    cssClass: 'custom-pin',
                    id: 'pin-' + pinCounter++,
                    clickHandlerFunc: 'handleHotspotClick'
                });
            }
        }
        isDragging = false;
        mouseDownTime = 0;
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
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
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
    if (user) {
        authButton.textContent = 'Logout';
        authButton.classList.add('logged-in');
    } else {
        authButton.textContent = 'Login';
        authButton.classList.remove('logged-in');
    }
});

// Open Modal
authButton.addEventListener('click', () => {
    const user = auth.currentUser;
    if (user) {
        // Logout
        auth.signOut().then(() => {
            console.log('User signed out');
        }).catch((error) => {
            showError('Error signing out: ' + error.message);
        });
    } else {
        // Show login form
        showLoginForm();
        authModal.classList.add('show');
    }
});

// Close Modal
closeModal.addEventListener('click', () => {
    authModal.classList.remove('show');
    clearError();
    clearForms();
});

window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.classList.remove('show');
        clearError();
        clearForms();
    }
    if (e.target === pinModal) {
        pinModal.classList.remove('show');
    }
});

// Pin Modal handlers
closePinModal.addEventListener('click', () => {
    pinModal.classList.remove('show');
});

function showPinPopup(hotspot) {
    // Update popup content with pin location if available
    const pinContent = document.getElementById('pinContent');
    if (hotspot && pinContent) {
        const pitch = hotspot.pitch || 0;
        const yaw = hotspot.yaw || 0;
        pinContent.innerHTML = `
            <p><strong>Pin Location:</strong></p>
            <p>Pitch: ${pitch.toFixed(2)}°</p>
            <p>Yaw: ${yaw.toFixed(2)}°</p>
            <p style="margin-top: 15px; color: #666; font-size: 14px;">
                💡 Tip: Hold Ctrl (or Cmd on Mac) and click anywhere on the panorama to add more pins.
            </p>
        `;
    } else if (pinContent) {
        pinContent.innerHTML = `
            <p>This is a clickable pin on the panorama.</p>
            <p>You can add more information here.</p>
            <p style="margin-top: 15px; color: #666; font-size: 14px;">
                💡 Tip: Hold Ctrl (or Cmd on Mac) and click anywhere on the panorama to add more pins.
            </p>
        `;
    }
    pinModal.classList.add('show');
}

// Switch between Login and Signup
switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    showSignupForm();
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});

function showLoginForm() {
    loginForm.style.display = 'flex';
    signupForm.style.display = 'none';
    modalTitle.textContent = 'Login';
    clearError();
}

function showSignupForm() {
    loginForm.style.display = 'none';
    signupForm.style.display = 'flex';
    modalTitle.textContent = 'Sign Up';
    clearError();
}

// Login
loginSubmit.addEventListener('click', async () => {
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    loginSubmit.disabled = true;
    loginSubmit.textContent = 'Logging in...';
    clearError();

    try {
        await auth.signInWithEmailAndPassword(email, password);
        authModal.classList.remove('show');
        clearForms();
    } catch (error) {
        showError(getErrorMessage(error));
    } finally {
        loginSubmit.disabled = false;
        loginSubmit.textContent = 'Login';
    }
});

// Signup
signupSubmit.addEventListener('click', async () => {
    const email = signupEmail.value.trim();
    const password = signupPassword.value;
    const passwordConfirm = signupPasswordConfirm.value;

    if (!email || !password || !passwordConfirm) {
        showError('Please fill in all fields');
        return;
    }

    if (password !== passwordConfirm) {
        showError('Passwords do not match');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }

    signupSubmit.disabled = true;
    signupSubmit.textContent = 'Signing up...';
    clearError();

    try {
        await auth.createUserWithEmailAndPassword(email, password);
        authModal.classList.remove('show');
        clearForms();
    } catch (error) {
        showError(getErrorMessage(error));
    } finally {
        signupSubmit.disabled = false;
        signupSubmit.textContent = 'Sign Up';
    }
});

// Enter key support
[loginEmail, loginPassword].forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loginSubmit.click();
        }
    });
});

[signupEmail, signupPassword, signupPasswordConfirm].forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            signupSubmit.click();
        }
    });
});

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
    switch (error.code) {
        case 'auth/user-not-found':
            return 'No account found with this email';
        case 'auth/wrong-password':
            return 'Incorrect password';
        case 'auth/email-already-in-use':
            return 'Email already in use';
        case 'auth/invalid-email':
            return 'Invalid email address';
        case 'auth/weak-password':
            return 'Password is too weak';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection';
        default:
            return error.message || 'An error occurred';
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    initPanorama();
});
