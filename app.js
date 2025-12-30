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
let threeScene, threeCamera, threeRenderer;
let objectMeshes = [];
let raycaster, mouse;

// Initialize Three.js for 3D objects
function initThreeJS() {
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded yet, retrying...');
        setTimeout(initThreeJS, 100);
        return;
    }
    
    const canvas = document.getElementById('objectsCanvas');
    const width = window.innerWidth;
    const height = window.innerHeight;

    threeScene = new THREE.Scene();
    threeCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    threeRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    threeRenderer.setSize(width, height);
    threeRenderer.setPixelRatio(window.devicePixelRatio);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    threeScene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    threeScene.add(directionalLight);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Handle window resize
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        threeCamera.aspect = width / height;
        threeCamera.updateProjectionMatrix();
        threeRenderer.setSize(width, height);
    });

    // Handle clicks on 3D objects - only enable pointer events when hovering
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, threeCamera);
        const intersects = raycaster.intersectObjects(objectMeshes);
        
        // Only enable pointer events if hovering over an object
        canvas.style.pointerEvents = intersects.length > 0 ? 'auto' : 'none';
        canvas.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
    });
    
    canvas.addEventListener('click', onCanvasClick);
    
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if (threeRenderer && threeScene && threeCamera) {
        updateObjectPositions();
        threeRenderer.render(threeScene, threeCamera);
    }
}

function updateObjectPositions() {
    if (!viewer || !threeCamera) return;
    
    const hfov = viewer.getHfov();
    const pitch = viewer.getPitch();
    const yaw = viewer.getYaw();
    
    // Update camera to match panorama view
    threeCamera.fov = hfov;
    threeCamera.updateProjectionMatrix();
    
    // Position camera at center, looking forward
    threeCamera.position.set(0, 0, 0);
    threeCamera.rotation.set(0, 0, 0);
    
    objectMeshes.forEach((mesh) => {
        const pinData = mesh.userData.pinData;
        if (!pinData) return;
        
        // Convert panorama coordinates to 3D position (spherical coordinates)
        // Distance from center
        const distance = 2.5;
        
        // Calculate relative position based on current view
        const degToRad = THREE.MathUtils ? THREE.MathUtils.degToRad : THREE.Math.degToRad;
        const relativeYaw = degToRad(pinData.yaw - yaw);
        const relativePitch = degToRad(pinData.pitch - pitch);
        
        // Spherical to Cartesian conversion
        const x = Math.sin(relativeYaw) * Math.cos(relativePitch) * distance;
        const y = Math.sin(relativePitch) * distance;
        const z = Math.cos(relativeYaw) * Math.cos(relativePitch) * distance;
        
        mesh.position.set(x, y, z);
        
        // Make object face camera
        mesh.lookAt(threeCamera.position);
    });
}

function onCanvasClick(event) {
    if (!viewer || !raycaster) return;
    
    const rect = event.target.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(mouse, threeCamera);
    const intersects = raycaster.intersectObjects(objectMeshes);
    
    if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        const pinData = clickedMesh.userData.pinData;
        if (pinData) {
            showPinPopup({ pitch: pinData.pitch, yaw: pinData.yaw });
        }
    }
}

function loadObject(pitch, yaw) {
    // Wait for Three.js to be available
    if (typeof THREE === 'undefined') {
        console.log('Waiting for Three.js...');
        setTimeout(() => loadObject(pitch, yaw), 100);
        return;
    }
    
    // Check for OBJLoader in different possible locations
    let OBJLoaderClass = null;
    if (typeof OBJLoader !== 'undefined') {
        OBJLoaderClass = OBJLoader;
    } else if (typeof window.OBJLoader !== 'undefined') {
        OBJLoaderClass = window.OBJLoader;
    } else if (typeof THREE.OBJLoader !== 'undefined') {
        OBJLoaderClass = THREE.OBJLoader;
    }
    
    if (!OBJLoaderClass) {
        console.log('Waiting for OBJLoader...');
        setTimeout(() => loadObject(pitch, yaw), 100);
        return;
    }
    
    const loader = new OBJLoaderClass();
    loader.load(
        'objects/Bose soundslink handle.obj',
        (object) => {
            console.log('Object loaded:', object);
            
            // Calculate bounding box to center the object
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            object.position.sub(center);
            
            // Scale the object appropriately
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 0.3 / maxDim;
            object.scale.set(scale, scale, scale);
            
            // Add material
            object.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0xcccccc,
                        metalness: 0.8,
                        roughness: 0.2,
                        emissive: 0x000000
                    });
                }
            });
            
            // Store pin data
            object.userData.pinData = { pitch, yaw };
            objectMeshes.push(object);
            threeScene.add(object);
            
            console.log('Object added to scene at pitch:', pitch, 'yaw:', yaw);
        },
        (progress) => {
            console.log('Loading progress:', progress);
        },
        (error) => {
            console.error('Error loading object:', error);
        }
    );
}

function createPin(pitch, yaw) {
    // Create invisible hotspot for click detection
    viewer.addHotSpot({
        pitch, yaw,
        type: 'info',
        text: '',
        cssClass: 'invisible-hotspot',
        id: `pin-${pinCounter++}`,
        clickHandlerFunc: function(hotspot) {
            showPinPopup(hotspot);
        }
    });
    
    // Load 3D object at this location
    if (threeScene) {
        loadObject(pitch, yaw);
    }
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

    viewer.on('load', () => {
        initThreeJS();
        createPin(0, 0);
    });

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
