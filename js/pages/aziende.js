/**
 * aziende.js — scena 3D delle aziende: cards 3D con tilt
 *
 * Ogni azienda è un cube 3D che ruota/tilta quando passi sopra.
 * I colori sono randomicamente assegnati dagli indici aziendali.
 */
import * as THREE from 'three';
import { scene, camera, renderer } from '../three.js';

// --- I 9 nitti (sample) ---
const AZIENDE = [
  { name: 'Piatti', sector: 'cuoio', founded: '1952', city: 'Prato' },
  { name: 'San Martino', sector: 'telaio', founded: '1948', city: 'Prato' },
  { name: 'Rinascente', sector: 'macellazione', founded: '1880', city: 'Prato' },
  { name: 'Crocetti', sector: 'salume', founded: '1889', city: 'Prato' },
  { name: 'Cantucci', sector: 'panificazione', founded: '1925', city: 'Prato' },
  { name: 'Dolci', sector: 'cuoio', founded: '1912', city: 'Prato' },
  { name: 'Musei', sector: 'cuoio', founded: '1960', city: 'Prato' },
  { name: 'Lana', sector: 'telaio', founded: '1975', city: 'Prato' },
  { name: 'Vetri', sector: 'vetro', founded: '1930', city: 'Prato' },
];

// --- Build ---
function build() {
  // Canvas
  const container = document.getElementById('aziende-3d');
  if (!container) { console.warn('aziende-3d not found'); return; }
  container.appendChild(renderer.domElement);

  // Camera
  const w = container.clientWidth;
  const h = container.clientHeight;
  const camera2 = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera2.position.set(0, 0, 10);
  camera2.lookAt(0, 0, 0);

  // Scena
  const scene2 = new THREE.Scene();
  scene2.background = new THREE.Color(0x0f1528);

  // Cards 3D
  const cards = [];
  const group = new THREE.Group();
  scene2.add(group);

  const colors = [
    0xc81d62, 0x0f7f6e, 0x1b2a52, 0xb06a1a,
    0x0f7f6e, 0xc81d62, 0x1b2a52, 0xb06a1a, 0xc81d62,
  ];

  AZIENDE.forEach((azienda, i) => {
    const angle = (i / AZIENDE.length) * Math.PI * 2 - Math.PI / 2;
    const radius = 2.8;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    // Base (piano)
    const baseGeo = new THREE.BoxGeometry(0.9, 0.15, 0.9);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1b2a52,
      roughness: 0.6,
      metalness: 0.1,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(x, 0, z);
    group.add(base);

    // Parallelepipedo (il cubo 3D)
    const boxGeo = new THREE.BoxGeometry(0.75, 1.2, 0.7);
    const boxMat = new THREE.MeshStandardMaterial({
      color: colors[i],
      roughness: 0.35,
      metalness: 0.4,
      emissive: colors[i],
      emissiveIntensity: 0.12,
    });
    const mesh = new THREE.Mesh(boxGeo, boxMat);
    mesh.position.set(x, 0.7, z);
    mesh.rotation.y = angle;
    mesh.rotation.x = 0.15;
    mesh.userData = { azienda, angle, x, z };
    group.add(mesh);

    // Label su una faccia
    const labelGeo = new THREE.PlaneGeometry(0.7, 0.35);
    const labelMat = new THREE.MeshStandardMaterial({
      map: createLabelTexture(azienda.name, azienda.sector),
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.set(x, 1.2, z + 0.35);
    label.rotation.y = angle;
    group.add(label);

    cards.push({ mesh, label, base, azienda, angle, x, z, radius });
  });

  // --- Label 2D per i nomi ---
  function createLabelTexture(name, sector) {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f1528';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#c81d62';
    ctx.font = '26px "Bricolage Grotesque", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const shortName = name.length > 12 ? name.slice(0, 12) + '…' : name;
    ctx.fillText(shortName, size / 2, size / 2 - 8);
    ctx.fillStyle = '#e0e5ee';
    ctx.font = '18px "Source Serif 4", serif';
    ctx.fillText(sector, size / 2, size / 2 + 30);
    return new THREE.CanvasTexture(canvas);
  }

  // --- Animazione ---
  function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += 0.006;
    renderer.render(scene2, camera2);
  }

  // --- Resize ---
  window.addEventListener('resize', () => {
    const w2 = container.clientWidth;
    const h2 = container.clientHeight;
    camera2.aspect = w2 / h2;
    camera2.updateProjectionMatrix();
    renderer.setSize(w2, h2);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
  });

  // --- Start ---
  animate();
  return { scene2, camera2 };
}

const result = build();
