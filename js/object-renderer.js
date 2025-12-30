// 3D Object Renderer Module
const objectScenes = new Map(); // Store Three.js scenes for each object

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
            object.scale.set(scale, scale, scale);
            
            // Store object center (after scaling)
            objectCenter.set(0, 0, 0); // Object is centered at origin
            
            // Center object at origin
            object.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
            
            // Rotate object (adjust these values as needed)
            object.rotation.x = 0; // Rotate around X axis (in radians)
            object.rotation.y = 0; // Rotate around Y axis (in radians)
            object.rotation.z = 0; // Rotate around Z axis (in radians)
            
            // Add directly to scene (centered at origin)
            scene.add(object);
            objectGroup = object;
            
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

    // Update camera position (orbits around object center)
    function updateCameraPosition() {
        const x = objectCenter.x + cameraDistance * Math.sin(cameraAngleY) * Math.cos(cameraAngleX);
        const y = objectCenter.y + cameraDistance * Math.sin(cameraAngleX);
        const z = objectCenter.z + cameraDistance * Math.cos(cameraAngleY) * Math.cos(cameraAngleX);
        
        camera.position.set(x, y, z);
        camera.lookAt(objectCenter);
    }

    // Mouse and touch controls for interactive mode
    if (interactive) {
        const canvas = renderer.domElement;
        
        // Prevent context menu on right-click
        canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Mouse controls
        canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
            canvas.style.cursor = 'grabbing';
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;
            
            // Rotate camera around object
            cameraAngleY += deltaX * 0.01;
            cameraAngleX += deltaY * 0.01;
            
            // Limit vertical rotation
            cameraAngleX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraAngleX));
            
            updateCameraPosition();
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        canvas.addEventListener('mouseup', (e) => {
            e.preventDefault();
            isDragging = false;
            canvas.style.cursor = 'grab';
        });

        canvas.addEventListener('mouseleave', () => {
            isDragging = false;
            canvas.style.cursor = 'grab';
        });

        // Touch controls for mobile devices
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (e.touches.length === 1) {
                isDragging = true;
                previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        });

        canvas.addEventListener('touchmove', (e) => {
            if (!isDragging || e.touches.length !== 1) return;
            e.preventDefault();
            
            const deltaX = e.touches[0].clientX - previousMousePosition.x;
            const deltaY = e.touches[0].clientY - previousMousePosition.y;
            
            // Rotate camera around object
            cameraAngleY += deltaX * 0.01;
            cameraAngleX += deltaY * 0.01;
            
            // Limit vertical rotation
            cameraAngleX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraAngleX));
            
            updateCameraPosition();
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            isDragging = false;
        });

        canvas.addEventListener('touchcancel', () => {
            isDragging = false;
        });

        // Set initial cursor style
        canvas.style.cursor = 'grab';
        canvas.style.touchAction = 'none'; // Prevent default touch behaviors
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    return { scene, camera, renderer, objectGroup, objectCenter };
}

// Get object scenes map (for external access)
function getObjectScenes() {
    return objectScenes;
}
