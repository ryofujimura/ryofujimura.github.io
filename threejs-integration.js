// Three.js Scene Setup
let scene, camera, renderer, object3D;
let raycaster, mouse;
let isObjectLoaded = false;

// Object position in spherical coordinates (relative to panorama center)
const objectPosition = {
    yaw: 0,      // Horizontal angle in degrees (0-360)
    pitch: 0,    // Vertical angle in degrees (-90 to 90)
    distance: 2  // Distance from center
};

function initThreeJS() {
    const canvas = document.getElementById('threejs-canvas');
    const container = document.getElementById('panorama');
    
    // Scene
    scene = new THREE.Scene();
    
    // Camera (will sync with Pannellum)
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    
    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Raycaster for click detection
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Load 3D object
    loadObject();
    
    // Event listeners
    window.addEventListener('resize', onWindowResize);
    canvas.addEventListener('click', onCanvasClick);
    
    // Start animation loop
    animate();
}

function loadObject() {
    const loader = new OBJLoader();
    
    loader.load(
        'objects/Bose soundslink handle.obj',
        (object) => {
            // Center and scale the object
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 0.5 / maxDim;
            
            object.scale.multiplyScalar(scale);
            object.position.sub(center.multiplyScalar(scale));
            
            // Position object in 3D space based on spherical coordinates
            updateObjectPosition(object);
            
            // Add wireframe for better visibility
            object.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0x888888,
                        wireframe: false,
                        metalness: 0.3,
                        roughness: 0.7
                    });
                }
            });
            
            object3D = object;
            scene.add(object);
            isObjectLoaded = true;
            
            console.log('3D object loaded successfully');
        },
        (progress) => {
            console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
        },
        (error) => {
            console.error('Error loading object:', error);
        }
    );
}

function updateObjectPosition(object) {
    if (!object) return;
    
    // Convert spherical coordinates to Cartesian
    const phi = (90 - objectPosition.pitch) * (Math.PI / 180);
    const theta = (objectPosition.yaw + 90) * (Math.PI / 180);
    
    object.position.x = objectPosition.distance * Math.sin(phi) * Math.cos(theta);
    object.position.y = objectPosition.distance * Math.cos(phi);
    object.position.z = objectPosition.distance * Math.sin(phi) * Math.sin(theta);
    
    // Make object face the center
    object.lookAt(0, 0, 0);
}

function syncCameraWithPannellum() {
    if (!window.viewer) return;
    
    const pitch = viewer.getPitch();
    const yaw = viewer.getYaw();
    const hfov = viewer.getHfov();
    
    // Convert Pannellum camera to Three.js camera
    const fov = hfov;
    camera.fov = fov;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    // Convert spherical coordinates to camera rotation
    const phi = (90 - pitch) * (Math.PI / 180);
    const theta = (yaw + 90) * (Math.PI / 180);
    
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 0;
    
    camera.rotation.order = 'YXZ';
    camera.rotation.y = -theta;
    camera.rotation.x = phi - Math.PI / 2;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onCanvasClick(event) {
    if (!isObjectLoaded || !object3D) return;
    
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update raycaster
    raycaster.setFromCamera(mouse, camera);
    
    // Check for intersections with the object
    const intersects = raycaster.intersectObject(object3D, true);
    
    if (intersects.length > 0) {
        showObjectPopup();
    }
}

function showObjectPopup() {
    const objectModal = document.getElementById('objectModal');
    objectModal.classList.add('show');
}

function hideObjectPopup() {
    const objectModal = document.getElementById('objectModal');
    objectModal.classList.remove('show');
}

function animate() {
    requestAnimationFrame(animate);
    
    // Sync camera with Pannellum
    syncCameraWithPannellum();
    
    // Render
    renderer.render(scene, camera);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for Pannellum to initialize
        setTimeout(initThreeJS, 500);
    });
} else {
    setTimeout(initThreeJS, 500);
}

// Close object popup handlers
document.addEventListener('DOMContentLoaded', () => {
    const closeObjectBtn = document.querySelector('.close-object');
    const objectModal = document.getElementById('objectModal');
    
    if (closeObjectBtn) {
        closeObjectBtn.addEventListener('click', hideObjectPopup);
    }
    
    if (objectModal) {
        objectModal.addEventListener('click', (e) => {
            if (e.target === objectModal) {
                hideObjectPopup();
            }
        });
    }
});

// Export for global access
window.hideObjectPopup = hideObjectPopup;
