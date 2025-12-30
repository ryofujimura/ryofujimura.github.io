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
let threeScene = null;
let threeRenderer = null;
let threeCamera = null;
let object3D = null;
let raycaster = null;
let mouse = null;
let animationId = null;

// Fixed position on the panorama where the object is pinned
// These coordinates correspond to a specific point on the equirectangular image
const OBJECT_PIN_PITCH = 0;   // 0 = horizon level (degrees)
const OBJECT_PIN_YAW = 0;     // 0 = straight ahead (degrees)
const OBJECT_SPHERE_RADIUS = 0.99; // Slightly inside the sphere surface to ensure visibility

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

    // Wait for viewer to load, then initialize Three.js overlay
    viewer.on('load', () => {
        setTimeout(() => {
            initThreeJSScene();
            load3DObject();
            setupObjectClick();
            animate();
        }, 500);
    });

    // Sync camera when Pannellum view changes
    viewer.on('animate', () => {
        syncCamera();
    });
}

// Initialize separate Three.js scene as overlay
function initThreeJSScene() {
    if (!window.THREE) {
        console.error('Three.js not loaded yet');
        return;
    }

    const overlay = document.getElementById('threejs-overlay');
    const panoramaElement = document.getElementById('panorama');
    const rect = panoramaElement.getBoundingClientRect();

    // Create scene
    threeScene = new THREE.Scene();

    // Create camera matching Pannellum's perspective
    const hfov = viewer.getHfov();
    const aspect = rect.width / rect.height;
    threeCamera = new THREE.PerspectiveCamera(hfov, aspect, 0.1, 1000);

    // Create renderer
    threeRenderer = new THREE.WebGLRenderer({
        canvas: overlay,
        alpha: true,
        antialias: true
    });
    threeRenderer.setSize(rect.width, rect.height);
    threeRenderer.setPixelRatio(window.devicePixelRatio);

    // Initialize raycaster and mouse
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    threeScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    threeScene.add(directionalLight);

    // Handle window resize
    window.addEventListener('resize', () => {
        const rect = panoramaElement.getBoundingClientRect();
        threeCamera.aspect = rect.width / rect.height;
        threeCamera.updateProjectionMatrix();
        threeRenderer.setSize(rect.width, rect.height);
    });

    console.log('Three.js scene initialized');
}

// Sync Three.js camera with Pannellum camera
function syncCamera() {
    if (!threeCamera || !viewer) return;

    const pitch = viewer.getPitch();
    const yaw = viewer.getYaw();
    const hfov = viewer.getHfov();
    
    // Update FOV
    threeCamera.fov = hfov;
    threeCamera.updateProjectionMatrix();

    // Convert spherical coordinates to Cartesian
    const phi = (90 - pitch) * (Math.PI / 180);
    const theta = (yaw + 90) * (Math.PI / 180);

    // Camera position (looking from inside sphere outward)
    const radius = 1;
    const x = Math.sin(phi) * Math.cos(theta);
    const y = Math.cos(phi);
    const z = Math.sin(phi) * Math.sin(theta);

    threeCamera.position.set(x, y, z);
    threeCamera.lookAt(0, 0, 0);
}

// Load and position 3D object
function load3DObject() {
    if (!window.THREE || !window.OBJLoader || !threeScene) {
        console.error('Three.js or OBJLoader not available');
        setTimeout(() => load3DObject(), 100);
        return;
    }

    const loader = new window.OBJLoader();
    loader.load(
        'objects/Bose soundslink handle.obj',
        (object) => {
            // Calculate bounding box to center and scale object
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            
            // Scale to moderate size
            const scale = 0.3 / maxDim;
            object.scale.multiplyScalar(scale);
            
            // Center the object
            object.position.sub(center.multiplyScalar(scale));
            
            // Pin object to a fixed point on the panorama sphere
            // This position is fixed in world space and corresponds to a specific point on the image
            // As the camera rotates, the object will appear to move with the panorama
            const pitch = OBJECT_PIN_PITCH;
            const yaw = OBJECT_PIN_YAW;
            const radius = OBJECT_SPHERE_RADIUS;
            
            // Convert pitch/yaw to 3D position on the sphere
            // Pannellum: pitch (vertical angle, 0 = horizon), yaw (horizontal angle, 0 = forward)
            // Three.js spherical coordinates: phi (from +Y axis), theta (around Y axis)
            const phi = (90 - pitch) * (Math.PI / 180);  // Convert pitch to phi
            const theta = (yaw + 90) * (Math.PI / 180);  // Convert yaw to theta (offset by 90 for forward direction)
            
            // Calculate position on sphere surface
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.cos(phi);
            const z = radius * Math.sin(phi) * Math.sin(theta);
            
            object.position.set(x, y, z);
            
            // Orient object to face outward from sphere center (toward camera when at that point)
            // The object should face the direction from sphere center to its position
            const lookDirection = new THREE.Vector3(x, y, z).normalize();
            const lookTarget = new THREE.Vector3().addVectors(
                object.position,
                lookDirection.multiplyScalar(1)
            );
            object.lookAt(lookTarget);
            
            // Add material to make it visible
            object.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0x888888,
                        metalness: 0.7,
                        roughness: 0.3
                    });
                    child.userData.clickable = true;
                }
            });
            
            object3D = object;
            threeScene.add(object);
            
            console.log('3D object loaded and positioned');
        },
        (progress) => {
            if (progress.total > 0) {
                console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
            }
        },
        (error) => {
            console.error('Error loading OBJ file:', error);
        }
    );
}

// Setup click detection for 3D object
function setupObjectClick() {
    const panoramaElement = document.getElementById('panorama');
    const overlay = document.getElementById('threejs-overlay');
    let isOverObject = false;
    
    // Function to check if mouse is over object
    function checkObjectIntersection(event) {
        if (!object3D || !raycaster || !threeCamera) return false;
        
        const rect = panoramaElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Update raycaster
        raycaster.setFromCamera(mouse, threeCamera);
        
        // Check for intersections
        const intersects = raycaster.intersectObject(object3D, true);
        return intersects.length > 0;
    }
    
    // Check if mouse is over the object on mousemove
    panoramaElement.addEventListener('mousemove', (event) => {
        const overObject = checkObjectIntersection(event);
        
        if (overObject) {
            if (!isOverObject) {
                overlay.style.pointerEvents = 'auto';
                overlay.style.cursor = 'pointer';
                panoramaElement.style.cursor = 'pointer';
                isOverObject = true;
            }
        } else {
            if (isOverObject) {
                overlay.style.pointerEvents = 'none';
                overlay.style.cursor = 'default';
                panoramaElement.style.cursor = 'default';
                isOverObject = false;
            }
        }
    });
    
    // Handle click on the overlay when pointer events are enabled
    overlay.addEventListener('click', (event) => {
        if (!object3D || !raycaster || !threeCamera) return;
        
        const rect = overlay.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Update raycaster
        raycaster.setFromCamera(mouse, threeCamera);
        
        // Check for intersections
        const intersects = raycaster.intersectObject(object3D, true);
        
        if (intersects.length > 0) {
            event.stopPropagation();
            event.preventDefault();
            console.log('Object clicked!');
            showObjectPopup();
        }
    });
    
    // Also handle click on panorama as fallback
    panoramaElement.addEventListener('click', (event) => {
        if (checkObjectIntersection(event)) {
            event.stopPropagation();
            event.preventDefault();
            console.log('Object clicked via panorama!');
            showObjectPopup();
        }
    });
}

// Animation loop
function animate() {
    if (!threeRenderer || !threeScene || !threeCamera) return;
    
    syncCamera();
    threeRenderer.render(threeScene, threeCamera);
    animationId = requestAnimationFrame(animate);
}

// DOM Elements
const authButton = document.getElementById('authButton');
const authModal = document.getElementById('authModal');
const objectModal = document.getElementById('objectModal');
const closeModal = document.querySelector('.close');
const closeObjectModal = document.querySelector('.close-object');
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

// Reset overlay pointer events when modal is closed
function resetOverlayPointerEvents() {
    const overlay = document.getElementById('threejs-overlay');
    const panoramaElement = document.getElementById('panorama');
    
    // Reset to default state
    overlay.style.pointerEvents = 'none';
    overlay.style.cursor = 'default';
    panoramaElement.style.cursor = 'default';
    
    // Trigger a mousemove event to re-check if we're over the object
    setTimeout(() => {
        const event = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        panoramaElement.dispatchEvent(event);
    }, 10);
}

window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.classList.remove('show');
        clearError();
        clearForms();
    }
    if (e.target === objectModal) {
        objectModal.classList.remove('show');
        resetOverlayPointerEvents();
    }
});

// Object Modal
closeObjectModal.addEventListener('click', () => {
    objectModal.classList.remove('show');
    resetOverlayPointerEvents();
});

function showObjectPopup() {
    objectModal.classList.add('show');
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

// Initialize app after Three.js is loaded
window.initApp = function() {
    // Wait a bit for Three.js to be fully available
    setTimeout(() => {
        initPanorama();
    }, 100);
};

// Initialize on page load if Three.js is already loaded
if (window.THREE) {
    window.initApp();
} else {
    // Wait for Three.js to load
    window.addEventListener('DOMContentLoaded', () => {
        // threejs-loader.js will call initApp when ready
    });
}
