/**
 * territorio.js — scena 3D del territorio: mappa 3D dei 7 comuni
 *
 * Circle of 7 communities around Prato (distretto tessile).
 * Each community is a 3D sphere with data label.
 */
import * as THREE from 'three';
import { scene, camera, renderer } from '../three.js';

// --- I 7 comuni del distretto ---
const COMUNI = [
  { name: 'Prato',    pop: '211.95'  , role: 'centro',       color: '#c81d62' },
  { name: 'Gambettola',pop:'25.84'   , role: 'bottega',      color: '#0f7f6e' },
  { name: 'San Piero a Ponti',pop:'22.98', role: 'archeologia', color: '#1b2a52' },
  { name: 'Belmonte', pop: '20.17'  , role: 'medievale',    color: '#b06a1a' },
  { name: 'Alto Reno',pop:'12.54'   , role: 'conca',        color: '#0f7f6e' },
  { name: 'Paraco',   pop:'6.71'    , role: 'valle',        color: '#b06a1a' },
  { name: 'Laghè',    pop:'5.03'    , role: 'riserva',      color: '#c81d62' },
];

// --- Helper: texture per label ---
function createLabelTexture(name, pop) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0f1528';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#c81d62';
  ctx.font = '24px "Bricolage Grotesque", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const shortName = name.length > 14 ? name.slice(0, 14) + '…' : name;
  ctx.fillText(shortName, size / 2, size / 2 - 8);
  ctx.fillStyle = '#e0e5ee';
  ctx.font = '18px "Source Serif 4", serif';
  ctx.fillText('pop. ' + pop, size / 2, size / 2 + 32);
  return new THREE.CanvasTexture(canvas);
}

// --- Build ---
function buildScene() {
  // Canvas
  const container = document.getElementById('territorio-3d');
  if (!container) { console.warn('territorio-3d not found'); return; }
  container.appendChild(renderer.domElement);

  // Camera
  const w = container.clientWidth;
  const h = container.clientHeight;
  const camera2 = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera2.position.set(0, 0, 16);
  camera2.lookAt(0, 0, 0);

  // Scena
  const scene2 = new THREE.Scene();
  scene2.background = new THREE.Color(0x0f1528);

  // Cerchio dei comuni (layer)
  const radius = 5.5;
  const group = new THREE.Group();

  COMUNI.forEach((c, i) => {
    const angle = (i / COMUNI.length) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    // Sedia 3D (terrara)
    const geo = new THREE.SphereGeometry(0.7, 20, 20);
    const mat = new THREE.MeshStandardMaterial({
      color: c.color,
      roughness: 0.4,
      metalness: 0.2,
      emissive: c.color,
      emissiveIntensity: 0.08,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, 0, z);
    mesh.rotation.y = angle;
    group.add(mesh);

    // Label (tessuto 2D)
    const labelGeo = new THREE.PlaneGeometry(1.1, 0.32);
    const labelMat = new THREE.MeshStandardMaterial({
      map: createLabelTexture(c.name, c.pop),
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
    });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.set(x, 0.8, z);
    label.rotation.y = angle;
    group.add(label);

    // Binde
    mesh.userData = { comune: c, angle, x, z };
  });

  scene2.add(group);

  // Reticolo
  const gridHelper = new THREE.GridHelper(12, 24, 0x1b2a52, 0x273a6b);
  gridHelper.position.y = -0.2;
  scene2.add(gridHelper);

  // Flamme di riferimento (nuvola di punti)
  function makePointCloud() {
    const geo = new THREE.BufferGeometry();
    const count = 200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const rad = 1.5 + Math.random() * 3.5;
      positions[i * 3] = Math.cos(angle) * rad;
      positions[i * 3 + 1] = Math.random() * 0.6;
      positions[i * 3 + 2] = Math.sin(angle) * rad;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xc81d62,
      size: 0.04,
      transparent: true,
      opacity: 0.4,
    });
    return new THREE.Points(geo, mat);
  }
  scene2.add(makePointCloud());

  // Animazione
  function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += 0.008;
    renderer.render(scene2, camera2);
  }
  animate();

  // Resize
  window.addEventListener('resize', () => {
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

  return { scene2, camera2 };
}

const result = buildScene();
