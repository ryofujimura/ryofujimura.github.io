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
let object3D = null;
let raycaster = null;
let mouse = new THREE.Vector2();

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

    // Wait for viewer to load, then add 3D object
    viewer.on('load', () => {
        setTimeout(() => {
            load3DObject();
            setupObjectClick();
        }, 500);
    });
}

// Load and position 3D object
function load3DObject() {
    console.log('Attempting to load 3D object...');
    console.log('Viewer object:', viewer);
    
    // Try different ways to access Pannellum's Three.js scene
    let renderer, scene, camera;
    
    // Method 1: Direct property access
    if (viewer.renderer) {
        renderer = viewer.renderer;
        scene = viewer.scene;
        camera = viewer.camera;
        console.log('Found renderer/scene via direct properties');
    }
    // Method 2: Access through data property
    else if (viewer.data && viewer.data.renderer) {
        renderer = viewer.data.renderer;
        scene = viewer.data.scene;
        camera = viewer.data.camera;
        console.log('Found renderer/scene via data property');
    }
    // Method 3: Access through viewer's internal structure
    else if (viewer._renderer) {
        renderer = viewer._renderer;
        scene = viewer._scene;
        camera = viewer._camera;
        console.log('Found renderer/scene via underscore properties');
    }
    // Method 4: Try to get from the panorama container
    else {
        const panoramaEl = document.getElementById('panorama');
        const canvas = panoramaEl.querySelector('canvas');
        if (canvas && canvas.__threeRenderer) {
            renderer = canvas.__threeRenderer;
            console.log('Found renderer via canvas');
        }
    }
    
    if (!renderer || !scene) {
        console.error('Could not access Pannellum renderer or scene');
        console.log('Available viewer properties:', Object.keys(viewer));
        // Try creating overlay approach instead
        createOverlay3DObject();
        return;
    }

    console.log('Renderer and scene found, loading OBJ...');

    // Initialize raycaster for click detection
    raycaster = new THREE.Raycaster();

    // Check if OBJLoader is available
    if (typeof OBJLoader === 'undefined') {
        console.error('OBJLoader is not defined. Check if the script is loaded correctly.');
        return;
    }

    // Load OBJ file
    const loader = new OBJLoader();
    console.log('OBJLoader created, starting to load file...');
    loader.load(
        'objects/Bose soundslink handle.obj',
        (object) => {
            console.log('OBJ file loaded successfully');
            // Calculate bounding box to center and scale object
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            
            console.log('Object dimensions:', size, 'Max dimension:', maxDim);
            
            // Scale to moderate size (adjust scale factor as needed)
            const scale = 0.3 / maxDim;
            object.scale.multiplyScalar(scale);
            
            // Center the object
            object.position.sub(center.multiplyScalar(scale));
            
            // Position in front of camera (center of view)
            // In spherical coordinates: radius, theta (horizontal), phi (vertical)
            // Position at center: radius = 1.5, theta = 0 (straight ahead), phi = 0 (eye level)
            const radius = 1.5;
            object.position.set(radius, 0, 0);
            
            console.log('Object positioned at:', object.position);
            
            // Add material to make it visible
            object.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0x888888,
                        metalness: 0.7,
                        roughness: 0.3
                    });
                    // Make object clickable
                    child.userData.clickable = true;
                }
            });
            
            object3D = object;
            scene.add(object);
            
            // Add lighting for better visibility
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(1, 1, 1);
            scene.add(directionalLight);
            
            console.log('3D object loaded and positioned in scene');
        },
        (progress) => {
            if (progress.lengthComputable) {
                console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
            }
        },
        (error) => {
            console.error('Error loading OBJ file:', error);
        }
    );
}

// Fallback: Create overlay Three.js scene
function createOverlay3DObject() {
    console.log('Creating overlay 3D scene...');
    
    const panoramaEl = document.getElementById('panorama');
    
    // Create separate Three.js scene as overlay
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.pointerEvents = 'auto';
    renderer.domElement.style.zIndex = '100';
    panoramaEl.appendChild(renderer.domElement);
    
    // Position camera to match Pannellum's view
    camera.position.set(0, 0, 0);
    
    // Initialize raycaster
    raycaster = new THREE.Raycaster();
    
    // Load OBJ file
    const loader = new OBJLoader();
    loader.load(
        'objects/Bose soundslink handle.obj',
        (object) => {
            console.log('OBJ file loaded in overlay scene');
            // Calculate bounding box to center and scale object
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            
            // Scale to moderate size
            const scale = 0.3 / maxDim;
            object.scale.multiplyScalar(scale);
            object.position.sub(center.multiplyScalar(scale));
            
            // Position in front of camera
            object.position.set(0, 0, -1.5);
            
            // Add material
            object.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0x888888,
                        metalness: 0.7,
                        roughness: 0.3
                    });
                }
            });
            
            object3D = object;
            scene.add(object);
            
            // Add lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(1, 1, 1);
            scene.add(directionalLight);
            
            // Store references for click detection
            overlayCamera = camera;
            overlayRenderer = renderer;
            
            // Sync camera with Pannellum view
            function syncCamera() {
                if (viewer) {
                    const pitch = viewer.getPitch();
                    const yaw = viewer.getYaw();
                    const hfov = viewer.getHfov();
                    
                    // Convert to Three.js camera rotation
                    camera.rotation.order = 'YXZ';
                    camera.rotation.y = (yaw * Math.PI) / 180;
                    camera.rotation.x = (-pitch * Math.PI) / 180;
                }
                renderer.render(scene, camera);
                requestAnimationFrame(syncCamera);
            }
            
            // Listen to Pannellum view changes
            viewer.on('animate', syncCamera);
            syncCamera();
            
            console.log('Overlay 3D scene created and rendering');
        },
        undefined,
        (error) => {
            console.error('Error loading OBJ file:', error);
        }
    );
}

// Setup click detection for 3D object
let overlayCamera = null;
let overlayRenderer = null;

function setupObjectClick() {
    const panoramaElement = document.getElementById('panorama');
    
    panoramaElement.addEventListener('click', (event) => {
        if (!object3D || !raycaster) return;
        
        // Try to get camera from overlay or viewer
        let camera = overlayCamera;
        if (!camera) {
            // Try to get from viewer
            camera = viewer.camera || viewer._camera || (viewer.data && viewer.data.camera);
        }
        
        if (!camera) {
            console.log('No camera available for raycasting');
            return;
        }
        
        // Get mouse position in normalized device coordinates
        const rect = panoramaElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Update raycaster with current camera
        raycaster.setFromCamera(mouse, camera);
        
        // Check for intersections with the object
        const intersects = raycaster.intersectObject(object3D, true);
        
        if (intersects.length > 0) {
            console.log('Object clicked!');
            showObjectPopup();
        }
    });
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

window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.classList.remove('show');
        clearError();
        clearForms();
    }
    if (e.target === objectModal) {
        objectModal.classList.remove('show');
    }
});

// Object Modal
closeObjectModal.addEventListener('click', () => {
    objectModal.classList.remove('show');
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

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    initPanorama();
});
