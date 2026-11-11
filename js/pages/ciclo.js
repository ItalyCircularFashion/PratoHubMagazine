/**
 * ciclo.js — scena 3D del ciclo del cardato: card 3D rotante
 *
 * Rappresenta il cardato come un "tornio" di 6 fasi che ruota.
 * Ogni fase è un opportune in un diamondPickerController.
 */
import * as THREE from 'three';
import { scene, camera, renderer } from '../three.js';

// --- Parametri V4 ---
const PHASES = [
  { step: 1, title: 'Cardatura', desc: 'Sfilatura dei lanoli', color: '#c81d62' },
  { step: 2, title: 'Tornitura', desc: 'Rendimento del filato', color: '#0f7f6e' },
  { step: 3, title: 'Stop', desc: 'Controllo qualità',  color: '#1b2a52' },
  { step: 4, title: 'Filato', desc: 'Spino e filo',    color: '#b06a1a' },
  { step: 5, title: 'Vegetazione', desc: 'Tenuta del filato', color: '#0f7f6e' },
  { step: 6, title: 'Pieno', desc: 'Tessitura del telaio', color: '#c81d62' },
];

// --- Radius del cerchio (scope globale) ---
const RING_RADIUS = 2.8;

// --- Canvas ---
const container = document.getElementById('ciclo-3d');
if (!container) {
  console.warn('ciclo-3d not found');
} else {
  container.appendChild(renderer.domElement);
}

// --- Camera ---
let camera2 = null;
if (container) {
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera2 = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera2.position.set(0, 0, 10);
  camera2.lookAt(0, 0, 0);
}

// --- Scena ---
let scene2 = null;
if (container) {
  const scene2_ = new THREE.Scene();
  scene2_.background = new THREE.Color(0x0f1528);
  scene2 = scene2_;
}

// --- Cerchio delle fasi (glitch-like) ---
function buildPhases() {
  const radius = 2.8;
  const group = new THREE.Group();

  PHASES.forEach((phase, i) => {
    const angle = (i / PHASES.length) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    // Card 3D (box con text-tooltip)
    const cardGeo = new THREE.BoxGeometry(0.9, 1.4, 0.3);
    const cardMat = new THREE.MeshStandardMaterial({
      color: phase.color,
      roughness: 0.35,
      metalness: 0.4,
      emissive: phase.color,
      emissiveIntensity: 0.15,
    });
    const card = new THREE.Mesh(cardGeo, cardMat);
    card.position.set(x, y, 0);
    card.rotation.y = angle;
    card.rotation.x = -0.15;
    card.rotation.z = 0.1;
    group.add(card);

    // Label
    const labelGeo = new THREE.PlaneGeometry(0.85, 0.3);
    const labelMat = new THREE.MeshStandardMaterial({
      map: createLabelTexture(phase.title),
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.set(x, y, 0.35);
    label.rotation.y = angle;
    group.add(label);

    // Binde
    card.userData = { angle, phase };
  });

  return group;
}

function createLabelTexture(text) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0f1528';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#c81d62';
  ctx.font = '28px "Bricolage Grotesque", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const maxLen = 8;
  const shortText = text.length > maxLen ? text.slice(0, maxLen) + '…' : text;
  ctx.fillText(shortText, size / 2, size / 2 + 8);
  return new THREE.CanvasTexture(canvas);
}

// --- Cerchio animato ---
const ringGroup = new THREE.Group();
if (scene2) scene2.add(ringGroup);

// Reticolo (griglia di riferimento)
const gridHelper = new THREE.GridHelper(6, 12, 0x1b2a52, 0x273a6b);
gridHelper.position.y = -0.2;
if (scene2) scene2.add(gridHelper);

// --- Animazione ---
function animate() {
  requestAnimationFrame(animate);

  // Ruota il gruppo delle fasi
  ringGroup.rotation.y += 0.012;

  // Le fasi cambiano colore (effetto pulse)
  PHASES.forEach((phase, i) => {
    const angle = (i / PHASES.length) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const mesh = ringGroup.children.find(c => {
      return c.position.x === x && c.position.y === y;
    });
    if (mesh) {
      mesh.material.color.set(phase.color);
      mesh.material.emissive.set(phase.color).multiplyScalar(0.15);
      mesh.rotation.x += 0.005;
    }
  });

  if (scene2 && camera2) {
    renderer.render(scene2, camera2);
  }
}

// --- Inizializza ---
const phasesGroup = buildPhases();
if (scene2) scene2.add(phasesGroup);
if (container) animate();

// --- Resize ---
window.addEventListener('resize', () => {
  if (!container) return;
  const w2 = container.clientWidth;
  const h2 = container.clientHeight;
  if (camera2) {
    camera2.aspect = w2 / h2;
    camera2.updateProjectionMatrix();
  }
  if (container && renderer) {
    renderer.setSize(w2, h2);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
  }
});
