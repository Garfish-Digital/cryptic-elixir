// src/scripts/webgl-scene.js
// This file will contain your Three.js/WebGL setup and animation logic.
// It's a separate module to keep your Astro components clean.

// Example: Basic Three.js setup (you'll expand this significantly)
 // You'll need to `npm install three` later
import * as THREE from 'three';

export function initWebGLScene(container) {
  console.log('WebGL Scene: Initializing...');

  // Basic scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true for transparent background
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Add a simple cube
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  }

  // Handle window resize
  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  window.addEventListener('resize', onWindowResize);

  animate(); // Start the animation loop
  console.log('WebGL Scene: Initialized.');
}

// You can add other WebGL/Three.js related functions here

// You'll need to install Three.js separately: npm install three