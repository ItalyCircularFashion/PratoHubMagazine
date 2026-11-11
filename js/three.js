/**
 * three.js — bootstrap per il sito PratoHub V2
 *
 * Import map + ES modules (CDN).
 * Crea scena, camera, renderer e animazione per ogni pagina.
 */
import * as THREE from 'three';

// --- Config renderer ---
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});

// --- Config camera ---
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 6);

// --- Config scene ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f1528);

// --- Renderer ---
const container = document.getElementById('hero-3d');
if (container) {
  container.appendChild(renderer.domElement);
}

// --- Fullscreen resize ---
function resize() {
  const width = container.clientWidth;
  const height = container.clientHeight;
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
resize();

// --- Export for page modules ---
export { scene, camera, renderer, renderer as r };
