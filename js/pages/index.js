/**
 * index.js — scena 3D del hero: tessuto "woven" in trejs
 *
 * Crea un piano 3D con texture "maglia" e lo fa ruotare lentamente.
 * Usa i colori V4: magenta #c81d62, verde #0f7f6e, nero #14213d.
 */
import * as THREE from 'three';
import { scene, camera, renderer, r } from '../three.js';

// --- Canvas texture: maglia ---
function createWeaveTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const dye = [200, 29, 98]; // #c81d62
  const up = [15, 127, 110]; // #0f7f6e
  const ink = [20, 33, 61];  // #14213d
  const paper = [246, 247, 248]; // #f6f7f8
  const line = [197, 203, 212];  // #c5cbd4

  // Fondo matrice
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const ux = x / size;
      const uy = y / size;
      // Griglia base
      const grid = (Math.floor(x / 64) + Math.floor(y / 64)) % 2 === 0 ? 0 : 1;
      ctx.fillStyle = `rgb(${paper[0]},${paper[1]},${paper[2]})`;
      ctx.fillRect(x, y, 1, 1);
      // Tratti verticali
      if (x % 4 === 0) {
        ctx.fillStyle = `rgb(${line[0]},${line[1]},${line[2]})`;
        ctx.fillRect(x, 0, 1, size);
      }
      // Tratti orizzontali alternati
      if (y % 4 === 0) {
        ctx.fillStyle = `rgb(${line[0]},${line[1]},${line[2]})`;
        ctx.fillRect(0, y, size, 1);
      }
      // Maglia (intreccio rosso/verde)
      if ((x + y) % 8 === 0) {
        ctx.fillStyle = `rgb(${dye[0]},${dye[1]},${dye[2]})`;
        ctx.fillRect(x, y, 1, 1);
      } else if ((x + y) % 8 === 4) {
        ctx.fillStyle = `rgb(${up[0]},${up[1]},${up[2]})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  return new THREE.CanvasTexture(canvas);
}

// --- Costruisci la scena ---
function buildScene() {
  const texture = createWeaveTexture();
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  texture.anisotropy = 4;

  // Piano 3D
  const geometry = new THREE.PlaneGeometry(4, 4);
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.4,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, 0);
  mesh.rotation.x = -Math.PI / 3.5;
  mesh.updateMatrix();
  scene.add(mesh);

  // Binde per rotazione
  mesh.userData = { angle: 0 };

  // Leva di riferimento (punti sbiaditi)
  const dotGeo = new THREE.SphereGeometry(0.04, 12, 12);
  const dotMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.3 });
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const dot = new THREE.Mesh(dotGeo, dotMat.clone());
      const u = (i + 0.5) / 6;
      const v = (j + 0.5) / 6;
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      dot.position.set(x, y, 0.02);
      dot.rotation.x = -Math.PI / 3.5;
      scene.add(dot);
    }
  }
}

// --- Animazione ---
function animate() {
  requestAnimationFrame(animate);
  const mesh = scene.children.find(c => c.type === 'Mesh');
  if (mesh) {
    mesh.rotation.y += 0.004;
    mesh.rotation.x = -Math.PI / 3.5;
  }
  renderer.render(scene, camera);
}

// --- Setup ---
function init() {
  buildScene();
  animate();
}

init();
