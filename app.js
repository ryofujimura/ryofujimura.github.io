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

// Initialize Pannellum Viewer
let viewer;
let pinCounter = 0;
const objectScenes = new Map(); // Store Three.js scenes for each object
let currentObjectData = null; // Store current object for popup

// Create 3D object renderer
function createObjectRenderer(containerId, objPath, options = {}) {
    const { width = 200, height = 200, autoRotate = false, interactive = false } = options;
    const container = document.getElementById(containerId);
    if (!container || typeof THREE === 'undefined' || typeof OBJLoader === 'undefined') {
        console.warn('Three.js not loaded yet, retrying...');
        setTimeout(() => createObjectRenderer(containerId, objPath, options), 200);
        return null;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    let objectGroup = null;
    let objectCenter = new THREE.Vector3(0, 0, 0);
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    // Camera orbit parameters (for interactive mode)
    let cameraDistance = 3;
    let cameraAngleX = 0;
    let cameraAngleY = 0;

    // Load OBJ
    const OBJLoaderClass = window.OBJLoader || OBJLoader;
    const loader = new OBJLoaderClass();
    loader.load(
        objPath,
        (object) => {
            // Calculate bounding box to center and scale
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            
            // Scale to fit in view
            const scale = 2.0 / maxDim;
            
            // Center object at origin by moving it
            object.position.sub(center);
            object.scale.set(scale, scale, scale);
            
            // Object is now centered at origin (0, 0, 0)
            objectCenter.set(0, 0, 0);
            
            // Add directly to scene (centered at origin)
            scene.add(object);
            objectGroup = object;
            
            // Initialize camera angles for good starting view
            cameraAngleY = 0;
            cameraAngleX = 0;
            
            // Camera positioned to view centered object
            updateCameraPosition();
        },
        (progress) => {
            if (progress.lengthComputable) {
                console.log('Loading:', (progress.loaded / progress.total * 100) + '%');
            }
        },
        (error) => console.error('Error loading OBJ:', error)
    );

    // Update camera position (orbits around object center using spherical coordinates)
    function updateCameraPosition() {
        // Spherical coordinates: theta (horizontal), phi (vertical)
        const theta = cameraAngleY; // Horizontal rotation
        const phi = Math.PI / 2 + cameraAngleX; // Vertical rotation (0 to PI)
        
        // Calculate camera position in spherical coordinates
        const x = objectCenter.x + cameraDistance * Math.sin(phi) * Math.cos(theta);
        const y = objectCenter.y + cameraDistance * Math.cos(phi);
        const z = objectCenter.z + cameraDistance * Math.sin(phi) * Math.sin(theta);
        
        camera.position.set(x, y, z);
        camera.lookAt(objectCenter);
        camera.updateProjectionMatrix();
    }

    // Mouse controls for interactive mode
    if (interactive) {
        const canvas = renderer.domElement;
        
        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
            canvas.style.cursor = 'grabbing';
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;
            
            // Rotate camera around object center
            cameraAngleY += deltaX * 0.01; // Horizontal rotation
            cameraAngleX -= deltaY * 0.01; // Vertical rotation (inverted for natural feel)
            
            // Limit vertical rotation to prevent flipping
            cameraAngleX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, cameraAngleX));
            
            updateCameraPosition();
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        canvas.addEventListener('mouseup', () => {
            isDragging = false;
            canvas.style.cursor = 'grab';
        });

        canvas.addEventListener('mouseleave', () => {
            isDragging = false;
            canvas.style.cursor = 'grab';
        });

        canvas.style.cursor = 'grab';
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    return { scene, camera, renderer, objectGroup, objectCenter };
}

function createPin(pitch, yaw) {
    const pinId = `pin-${pinCounter++}`;
    const containerId = `obj-container-${pinId}`;
    
    // Create custom hotspot with 3D object container
    viewer.addHotSpot({
        pitch, yaw,
        type: 'custom',
        id: pinId,
        createTooltipFunc: function(hotspotDiv, hotspot) {
            const container = document.createElement('div');
            container.id = containerId;
            container.className = 'obj-3d-container';
            hotspotDiv.appendChild(container);
            
            // Store container reference for animation
            container.dataset.pinId = pinId;
            
            // Load and render 3D object
            setTimeout(() => {
                const rendererData = createObjectRenderer(containerId, 'objects/Bose soundslink handle.obj');
                if (rendererData) {
                    objectScenes.set(pinId, { container, rendererData, hotspotDiv });
                }
            }, 100);
        },
        clickHandlerFunc: function(hotspot) {
            showPinPopup(hotspot);
        }
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

    // Handle hotspot click - backup handler
    viewer.on('hotspotclick', (hotspot) => {
        showPinPopup(hotspot);
    });

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

    // Disable right-click context menu (but allow left clicks on pins)
    const panoramaElement = document.getElementById('panorama');
    panoramaElement.addEventListener('contextmenu', (e) => {
        // Only prevent if not clicking on a pin/hotspot
        if (!e.target.closest('.custom-pin') && !e.target.closest('.pnlm-hotspot')) {
            e.preventDefault();
            return false;
        }
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
    const pinModalContent = document.querySelector('#pinModal .modal-content');
    const pitch = hotspot?.pitch || 0;
    const yaw = hotspot?.yaw || 0;
    
    // Find the hotspot container for animation
    const pinId = hotspot.id || Object.keys(objectScenes)[0];
    const objectData = objectScenes.get(pinId);
    
    // Create popup content with 3D object
    pinContent.innerHTML = `
        <div id="popup-obj-container" class="popup-obj-container"></div>
        <div class="pin-info">
            <p><strong>Pin Location:</strong></p>
            <p>Pitch: ${pitch.toFixed(2)}°</p>
            <p>Yaw: ${yaw.toFixed(2)}°</p>
            <p style="margin-top: 15px; color: #666; font-size: 14px;">
                💡 Tip: Hold Ctrl (or Cmd on Mac) and click anywhere on the panorama to add more pins.
            </p>
        </div>
    `;
    
    // Animate transition
    if (objectData) {
        animateToPopup(objectData.container, pinModalContent);
    }
    
    // Load object in popup with interactive controls
    setTimeout(() => {
        createObjectRenderer('popup-obj-container', 'objects/Bose soundslink handle.obj', { 
            width: 300, 
            height: 300,
            autoRotate: false,
            interactive: true  // Enable drag controls
        });
    }, 300);
    
    pinModal.classList.add('show');
}

// Animate object from hotspot to popup
function animateToPopup(sourceContainer, targetModal) {
    if (!sourceContainer) return;
    
    const canvas = sourceContainer.querySelector('canvas');
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const targetRect = targetModal.getBoundingClientRect();
    
    // Create clone for animation
    const clone = canvas.cloneNode(true);
    clone.style.position = 'fixed';
    clone.style.left = rect.left + 'px';
    clone.style.top = rect.top + 'px';
    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';
    clone.style.zIndex = '10000';
    clone.style.pointerEvents = 'none';
    clone.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    document.body.appendChild(clone);
    
    // Trigger animation
    requestAnimationFrame(() => {
        clone.style.left = (targetRect.left + targetRect.width / 2 - 150) + 'px';
        clone.style.top = (targetRect.top + 60) + 'px';
        clone.style.width = '300px';
        clone.style.height = '300px';
        clone.style.opacity = '0.8';
    });
    
    // Remove clone after animation
    setTimeout(() => {
        clone.remove();
    }, 500);
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
