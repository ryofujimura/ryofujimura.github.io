// 3D Object Renderer Module using model-viewer
const objectScenes = new Map(); // Store model-viewer elements for each object

// Create 3D object renderer using model-viewer
function createObjectRenderer(containerId, modelPath, options = {}) {
    const { 
        width = 200, 
        height = 200, 
        autoRotate = false, 
        interactive = true,
        alt = '3D Model',
        environmentImage = '',
        poster = '',
        shadowIntensity = 1,
        cameraControls = true,
        touchAction = 'pan-y'
    } = options;
    
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn('Container not found:', containerId);
        return null;
    }

    // Check if model-viewer is loaded
    if (typeof customElements === 'undefined' || !customElements.get('model-viewer')) {
        console.warn('model-viewer not loaded yet, retrying...');
        setTimeout(() => createObjectRenderer(containerId, modelPath, options), 200);
        return null;
    }

    // Create model-viewer element
    const modelViewer = document.createElement('model-viewer');
    modelViewer.src = modelPath;
    modelViewer.alt = alt;
    modelViewer.style.width = width + 'px';
    modelViewer.style.height = height + 'px';
    modelViewer.style.display = 'block';
    
    // Set attributes
    if (environmentImage) {
        modelViewer.setAttribute('environment-image', environmentImage);
    }
    if (poster) {
        modelViewer.setAttribute('poster', poster);
    }
    if (shadowIntensity !== undefined) {
        modelViewer.setAttribute('shadow-intensity', shadowIntensity);
    }
    if (cameraControls) {
        modelViewer.setAttribute('camera-controls', '');
    }
    if (touchAction) {
        modelViewer.setAttribute('touch-action', touchAction);
    }
    if (autoRotate) {
        modelViewer.setAttribute('auto-rotate', '');
    }

    // Add to container
    container.appendChild(modelViewer);

    return { modelViewer, container };
}

// Get object scenes map (for external access)
function getObjectScenes() {
    return objectScenes;
}
