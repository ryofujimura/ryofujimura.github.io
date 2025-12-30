// Panorama Viewer and Pin Management Module
let viewer;
let pinCounter = 0;

function createPin(pitch, yaw) {
    const pinId = `pin-${pinCounter++}`;
    const containerId = `obj-container-${pinId}`;
    const objectScenes = getObjectScenes();
    
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

// Pin Popup
function showPinPopup(hotspot) {
    const pinContent = document.getElementById('pinContent');
    const pinModalContent = document.querySelector('#pinModal .modal-content');
    const pitch = hotspot?.pitch || 0;
    const yaw = hotspot?.yaw || 0;
    const objectScenes = getObjectScenes();
    
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
    
    const pinModal = document.getElementById('pinModal');
    pinModal.classList.add('show');
}
