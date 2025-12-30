// Load Three.js modules and make them globally available
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

// Make Three.js and OBJLoader globally available
window.THREE = THREE;
window.OBJLoader = OBJLoader;

// Initialize the main app after Three.js is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.initApp) {
            window.initApp();
        }
    });
} else {
    if (window.initApp) {
        window.initApp();
    }
}
