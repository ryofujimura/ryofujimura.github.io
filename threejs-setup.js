// Load Three.js and OBJLoader as ES modules and make them globally available
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

// Make THREE and OBJLoader globally available for non-module code
window.THREE = THREE;
window.OBJLoader = OBJLoader;

// Export for module use
export { THREE, OBJLoader };
