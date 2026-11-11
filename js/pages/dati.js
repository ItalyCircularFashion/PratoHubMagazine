/**
 * dati.js — scena 3D del grafico: barre 3D interattive
 *
 * Rappresenta la traiettoria dei numeri del distretto
 * (imprese, addetti, export) in 3D.
 */
import * as THREE from 'three';
import { scene, camera, renderer } from '../three.js';

// --- Dati (da data.js / redazione) ---
const DATA = {
  years: ['2017', '2019', '2021', '2023'],
  imprese: [7463, 7253, 7193, 7018],
  addetti: [46481, 46540, 46481, null],
  export: [1050, 1240, 1168, null],
};

const METRIC = 'imprese'; // 'imprese' | 'addetti' | 'export'
const COLORS = {
  imprese: '#c81d62',
  addetti: '#0f7f6e',
  export:  '#1b2a52',
};

// --- Helper: texture per label ---
function createLabelTexture(value, metric) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0f1528';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#c81d62';
  ctx.font = '22px "Bricolage Grotesque", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const label = metric === 'export' ? (value / 1000).toFixed(1) + ' mrd €' : value.toLocaleString();
  ctx.fillText(label, size / 2, size / 2 + 4);
  return new THREE.CanvasTexture(canvas);
}

// --- Build ---
function buildScene() {
  // Canvas
  const container = document.getElementById('dati-3d');
  if (!container) { console.warn('dati-3d not found'); return null; }
  container.appendChild(renderer.domElement);

  // Camera
  const w = container.clientWidth;
  const h = container.clientHeight;
  const camera2 = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera2.position.set(0, 0, 14);
  camera2.lookAt(0, 0, 0);

  // Scena
  const scene2 = new THREE.Scene();
  scene2.background = new THREE.Color(0x0f1528);

  // Gruppo per le barre
  const group = new THREE.Group();
  scene2.add(group);

  const barWidth = 0.8;
  const gap = 2.2;
  const maxVal = 8000;
  const baseY = -0.2;

  // --- Costruisci le barre ---
  const vals = DATA[METRIC];
  const color = COLORS[METRIC];

  vals.forEach((v, i) => {
    const barHeight = (v / maxVal) * 4;
    // Base
    const baseGeo = new THREE.BoxGeometry(barWidth, 0.15, 1.6);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1b2a52 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(i * gap - 1.5, baseY - 0.075, 0);
    group.add(base);

    // Barra
    const barGeo = new THREE.BoxGeometry(barWidth, barHeight, 1.4);
    const barMat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.3,
      metalness: 0.25,
      emissive: color,
      emissiveIntensity: 0.1,
    });
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.position.set(i * gap - 1.5, baseY + barHeight / 2, 0);
    bar.userData = { height: barHeight, value: v, metric };
    barGroup.add(bar);

    // Label (cima)
    const labelGeo = new THREE.PlaneGeometry(barWidth * 0.7, 0.2);
    const labelMat = new THREE.MeshStandardMaterial({
      map: createLabelTexture(v, METRIC),
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.set(i * gap - 1.5, baseY + barHeight + 0.15, 0);
    group.add(label);
  });

  // --- Animazione ---
  function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += 0.004;
    renderer.render(scene2, camera2);
  }
  animate();

  // --- Resize ---
  window.addEventListener('resize', () => {
    if (!container) return;
    const w2 = container.clientWidth;
    const h2 = container.clientHeight;
    camera2.aspect = w2 / h2;
    camera2.updateProjectionMatrix();
    renderer.setSize(w2, h2);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
  });

  return { scene2, camera2 };
}

const result = buildScene();
