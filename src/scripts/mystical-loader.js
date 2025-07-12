// Mystical WebGL Loading System
// High-end particle system with custom shaders for immersive loading experience

import * as THREE from 'three';

export class MysticalLoader {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    
    // Performance scaling based on device capabilities
    this.performanceLevel = this.detectPerformanceLevel();
    this.particleCount = this.getParticleCount();
    
    // Animation timeline
    this.timeline = {
      vaporPhase: 0,
      formationPhase: 0,
      textPhase: 0,
      dispersalPhase: 0
    };
    
    // Text formation data
    this.textPositions = this.generateTextPositions();
    this.particles = null;
    this.vaporMaterial = null;
    this.volumetricMaterial = null;
    
    this.init();
  }
  
  detectPerformanceLevel() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) return 'low';
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
    
    // Simple performance detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = renderer.toLowerCase().includes('intel') || isMobile;
    
    if (isLowEnd) return 'low';
    if (renderer.toLowerCase().includes('nvidia') || renderer.toLowerCase().includes('amd')) return 'high';
    return 'medium';
  }
  
  getParticleCount() {
    const counts = {
      'low': 2000,
      'medium': 5000,
      'high': 10000
    };
    return counts[this.performanceLevel];
  }
  
  init() {
    this.setupRenderer();
    this.setupCamera();
    this.createParticleSystem();
    this.createVolumetricFog();
    this.setupLighting();
    this.startAnimation();
  }
  
  setupRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x1E1B2E, 1);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    this.container.appendChild(this.renderer.domElement);
  }
  
  setupCamera() {
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(0, 0, 0);
  }
  
  createParticleSystem() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    const sizes = new Float32Array(this.particleCount);
    const velocities = new Float32Array(this.particleCount * 3);
    const life = new Float32Array(this.particleCount);
    
    // Initialize particle positions and properties
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions in sphere
      const radius = Math.random() * 6 + 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Golden particle colors with variation
      const goldIntensity = 0.8 + Math.random() * 0.2;
      colors[i3] = goldIntensity * 0.83; // R
      colors[i3 + 1] = goldIntensity * 0.65; // G
      colors[i3 + 2] = goldIntensity * 0.45; // B
      
      sizes[i] = Math.random() * 0.1 + 0.05;
      
      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
      
      life[i] = Math.random();
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute('life', new THREE.BufferAttribute(life, 1));
    
    // Custom particle shader material
    this.vaporMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        formationPhase: { value: 0 },
        textPhase: { value: 0 },
        dispersalPhase: { value: 0 },
        opacity: { value: 1.0 }
      },
      vertexShader: this.getVertexShader(),
      fragmentShader: this.getFragmentShader(),
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      vertexColors: true
    });
    
    this.particles = new THREE.Points(geometry, this.vaporMaterial);
    this.scene.add(this.particles);
  }
  
  createVolumetricFog() {
    const fogGeometry = new THREE.PlaneGeometry(15, 15);
    
    this.volumetricMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        intensity: { value: 0.3 },
        color: { value: new THREE.Color(0x2F3349) }
      },
      vertexShader: this.getVolumetricVertexShader(),
      fragmentShader: this.getVolumetricFragmentShader(),
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    
    const fogMesh = new THREE.Mesh(fogGeometry, this.volumetricMaterial);
    fogMesh.position.z = -2;
    this.scene.add(fogMesh);
  }
  
  setupLighting() {
    // Ambient mystical lighting
    const ambientLight = new THREE.AmbientLight(0x2F3349, 0.6);
    this.scene.add(ambientLight);
    
    // Golden accent light
    const pointLight = new THREE.PointLight(0xD4A574, 1, 100);
    pointLight.position.set(0, 0, 3);
    this.scene.add(pointLight);
    
    // Mystical rim lighting
    const rimLight = new THREE.DirectionalLight(0x5a4b41, 0.8);
    rimLight.position.set(-1, 1, 1);
    this.scene.add(rimLight);
  }
  
  generateTextPositions() {
    // Generate positions for "CRYPTIC ELIXIR" text
    const textData = [
      // C
      { x: -4, y: 0.5, positions: this.generateLetterC() },
      // R
      { x: -3, y: 0.5, positions: this.generateLetterR() },
      // Y
      { x: -2, y: 0.5, positions: this.generateLetterY() },
      // P
      { x: -1, y: 0.5, positions: this.generateLetterP() },
      // T
      { x: 0, y: 0.5, positions: this.generateLetterT() },
      // I
      { x: 1, y: 0.5, positions: this.generateLetterI() },
      // C
      { x: 2, y: 0.5, positions: this.generateLetterC() },
      
      // E
      { x: -2.5, y: -0.5, positions: this.generateLetterE() },
      // L
      { x: -1.5, y: -0.5, positions: this.generateLetterL() },
      // I
      { x: -0.5, y: -0.5, positions: this.generateLetterI() },
      // X
      { x: 0.5, y: -0.5, positions: this.generateLetterX() },
      // I
      { x: 1.5, y: -0.5, positions: this.generateLetterI() },
      // R
      { x: 2.5, y: -0.5, positions: this.generateLetterR() }
    ];
    
    // Flatten all positions into a single array
    const allPositions = [];
    textData.forEach(letter => {
      letter.positions.forEach(pos => {
        allPositions.push({
          x: pos.x + letter.x,
          y: pos.y + letter.y,
          z: pos.z || 0
        });
      });
    });
    
    return allPositions;
  }
  
  // Letter generation functions (simplified dot matrix style)
  generateLetterC() {
    const positions = [];
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI + Math.PI * 0.25;
      positions.push({
        x: Math.cos(angle) * 0.3,
        y: Math.sin(angle) * 0.4,
        z: 0
      });
    }
    return positions;
  }
  
  generateLetterR() {
    const positions = [];
    // Vertical line
    for (let i = 0; i < 10; i++) {
      positions.push({ x: -0.2, y: (i / 10) * 0.8 - 0.4, z: 0 });
    }
    // Top horizontal
    for (let i = 0; i < 5; i++) {
      positions.push({ x: -0.2 + (i / 5) * 0.3, y: 0.4, z: 0 });
    }
    // Middle horizontal
    for (let i = 0; i < 5; i++) {
      positions.push({ x: -0.2 + (i / 5) * 0.3, y: 0, z: 0 });
    }
    // Diagonal
    for (let i = 0; i < 5; i++) {
      positions.push({ 
        x: -0.2 + (i / 5) * 0.3, 
        y: 0 - (i / 5) * 0.4, 
        z: 0 
      });
    }
    return positions;
  }
  
  generateLetterY() {
    const positions = [];
    // Left diagonal
    for (let i = 0; i < 5; i++) {
      positions.push({ 
        x: -0.2 + (i / 5) * 0.2, 
        y: 0.4 - (i / 5) * 0.4, 
        z: 0 
      });
    }
    // Right diagonal
    for (let i = 0; i < 5; i++) {
      positions.push({ 
        x: 0.2 - (i / 5) * 0.2, 
        y: 0.4 - (i / 5) * 0.4, 
        z: 0 
      });
    }
    // Vertical line
    for (let i = 0; i < 5; i++) {
      positions.push({ x: 0, y: 0 - (i / 5) * 0.4, z: 0 });
    }
    return positions;
  }
  
  generateLetterP() {
    const positions = [];
    // Vertical line
    for (let i = 0; i < 10; i++) {
      positions.push({ x: -0.2, y: (i / 10) * 0.8 - 0.4, z: 0 });
    }
    // Top horizontal
    for (let i = 0; i < 5; i++) {
      positions.push({ x: -0.2 + (i / 5) * 0.3, y: 0.4, z: 0 });
    }
    // Middle horizontal
    for (let i = 0; i < 5; i++) {
      positions.push({ x: -0.2 + (i / 5) * 0.3, y: 0, z: 0 });
    }
    // Right vertical (top half)
    for (let i = 0; i < 5; i++) {
      positions.push({ x: 0.1, y: 0.4 - (i / 5) * 0.4, z: 0 });
    }
    return positions;
  }
  
  generateLetterT() {
    const positions = [];
    // Horizontal line
    for (let i = 0; i < 7; i++) {
      positions.push({ x: -0.3 + (i / 7) * 0.6, y: 0.4, z: 0 });
    }
    // Vertical line
    for (let i = 0; i < 10; i++) {
      positions.push({ x: 0, y: 0.4 - (i / 10) * 0.8, z: 0 });
    }
    return positions;
  }
  
  generateLetterI() {
    const positions = [];
    // Vertical line
    for (let i = 0; i < 10; i++) {
      positions.push({ x: 0, y: (i / 10) * 0.8 - 0.4, z: 0 });
    }
    // Top horizontal
    for (let i = 0; i < 5; i++) {
      positions.push({ x: -0.2 + (i / 5) * 0.4, y: 0.4, z: 0 });
    }
    // Bottom horizontal
    for (let i = 0; i < 5; i++) {
      positions.push({ x: -0.2 + (i / 5) * 0.4, y: -0.4, z: 0 });
    }
    return positions;
  }
  
  generateLetterE() {
    const positions = [];
    // Vertical line
    for (let i = 0; i < 10; i++) {
      positions.push({ x: -0.2, y: (i / 10) * 0.8 - 0.4, z: 0 });
    }
    // Top horizontal
    for (let i = 0; i < 5; i++) {
      positions.push({ x: -0.2 + (i / 5) * 0.4, y: 0.4, z: 0 });
    }
    // Middle horizontal
    for (let i = 0; i < 4; i++) {
      positions.push({ x: -0.2 + (i / 4) * 0.3, y: 0, z: 0 });
    }
    // Bottom horizontal
    for (let i = 0; i < 5; i++) {
      positions.push({ x: -0.2 + (i / 5) * 0.4, y: -0.4, z: 0 });
    }
    return positions;
  }
  
  generateLetterL() {
    const positions = [];
    // Vertical line
    for (let i = 0; i < 10; i++) {
      positions.push({ x: -0.2, y: (i / 10) * 0.8 - 0.4, z: 0 });
    }
    // Bottom horizontal
    for (let i = 0; i < 5; i++) {
      positions.push({ x: -0.2 + (i / 5) * 0.4, y: -0.4, z: 0 });
    }
    return positions;
  }
  
  generateLetterX() {
    const positions = [];
    // Left diagonal
    for (let i = 0; i < 8; i++) {
      positions.push({ 
        x: -0.3 + (i / 8) * 0.6, 
        y: 0.4 - (i / 8) * 0.8, 
        z: 0 
      });
    }
    // Right diagonal
    for (let i = 0; i < 8; i++) {
      positions.push({ 
        x: 0.3 - (i / 8) * 0.6, 
        y: 0.4 - (i / 8) * 0.8, 
        z: 0 
      });
    }
    return positions;
  }
  
  getVertexShader() {
    return `
      attribute float size;
      attribute vec3 velocity;
      attribute float life;
      
      uniform float time;
      uniform float formationPhase;
      uniform float textPhase;
      uniform float dispersalPhase;
      
      varying vec3 vColor;
      varying float vLife;
      varying float vOpacity;
      
      void main() {
        vColor = color;
        vLife = life;
        
        vec3 pos = position;
        
        // Slower vapor phase - reduced time multiplier for gentler movement
        float vaporTime = time * 0.15; // Much slower swirling motion
        float vaporIntensity = 1.0 - formationPhase; // Fade vapor movement during formation
        
        pos.x += sin(vaporTime + position.y * 1.5) * 0.2 * vaporIntensity;
        pos.y += cos(vaporTime + position.x * 1.5) * 0.15 * vaporIntensity;
        pos.z += sin(vaporTime + position.x + position.y) * 0.08 * vaporIntensity;
        
        // Add subtle floating motion during vapor phase
        pos.y += sin(time * 0.3 + life * 6.28) * 0.1 * vaporIntensity;
        
        // Formation phase - move toward text positions
        // This would be calculated based on nearest text position
        pos = mix(pos, position * 0.3, formationPhase);
        
        // Dispersal phase
        pos += velocity * dispersalPhase * 10.0;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // Size based on distance and phase
        float dist = length(mvPosition.xyz);
        gl_PointSize = size * 300.0 / dist;
        
        // Opacity based on phases - fade vapors during formation
        vOpacity = mix(0.8, 0.2, dispersalPhase);
        vOpacity *= mix(0.7, 1.0, formationPhase);
        
        // Fade vapor particles as formation begins
        float vaporFade = 1.0 - (formationPhase * 0.6);
        vOpacity *= vaporFade;
        
        // Subtle breathing effect during vapor phase
        vOpacity *= (0.6 + 0.4 * sin(life * 8.0 + time * 1.5));
      }
    `;
  }
  
  getFragmentShader() {
    return `
      varying vec3 vColor;
      varying float vLife;
      varying float vOpacity;
      
      void main() {
        // Circular particle shape
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        
        // Soft edge falloff
        float alpha = smoothstep(0.5, 0.0, dist);
        
        // Glowing effect
        float glow = 1.0 - smoothstep(0.0, 0.3, dist);
        
        vec3 finalColor = vColor * (1.0 + glow * 0.5);
        
        gl_FragColor = vec4(finalColor, alpha * vOpacity);
      }
    `;
  }
  
  getVolumetricVertexShader() {
    return `
      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
  }
  
  getVolumetricFragmentShader() {
    return `
      uniform float time;
      uniform float intensity;
      uniform vec3 color;
      
      varying vec2 vUv;
      
      // Noise function for volumetric fog
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        for (int i = 0; i < 4; i++) {
          value += amplitude * noise(p * frequency);
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        
        return value;
      }
      
      void main() {
        vec2 uv = vUv;
        
        // Animated noise for fog movement
        float fogNoise = fbm(uv * 3.0 + time * 0.1);
        fogNoise += fbm(uv * 6.0 - time * 0.15) * 0.5;
        
        // Radial falloff from center
        float dist = length(uv - 0.5);
        float radialFalloff = smoothstep(0.7, 0.0, dist);
        
        float alpha = fogNoise * intensity * radialFalloff;
        
        gl_FragColor = vec4(color, alpha);
      }
    `;
  }
  
  startAnimation() {
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  animate() {
    const elapsed = performance.now() * 0.001;
    
    // Update timeline based on elapsed time
    this.updateTimeline(elapsed);
    
    // Update shader uniforms
    if (this.vaporMaterial) {
      this.vaporMaterial.uniforms.time.value = elapsed;
      this.vaporMaterial.uniforms.formationPhase.value = this.timeline.formationPhase;
      this.vaporMaterial.uniforms.textPhase.value = this.timeline.textPhase;
      this.vaporMaterial.uniforms.dispersalPhase.value = this.timeline.dispersalPhase;
    }
    
    if (this.volumetricMaterial) {
      this.volumetricMaterial.uniforms.time.value = elapsed;
      
      // Fade volumetric fog during formation phase
      const baseIntensity = 0.3;
      const formationFade = 1.0 - (this.timeline.formationPhase * 0.4);
      const dispersalFade = 1.0 - this.timeline.dispersalPhase;
      
      this.volumetricMaterial.uniforms.intensity.value = baseIntensity * formationFade * dispersalFade;
    }
    
    // Rotate particle system slightly
    if (this.particles) {
      this.particles.rotation.y += 0.001;
    }
    
    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  updateTimeline(elapsed) {
    // Animation phases (total ~10 seconds)
    if (elapsed < 4.0) {
      // Extended vapor phase (0-4 seconds)
      this.timeline.vaporPhase = Math.min(elapsed / 4.0, 1.0);
    } else if (elapsed < 7.5) {
      // Much slower formation phase (4-7.5 seconds) - very gradual transition
      const progress = (elapsed - 4.0) / 3.5;
      // Use even smoother easing for ultra-gradual transition
      this.timeline.formationPhase = this.easeInOutQuart(progress);
    } else if (elapsed < 8.5) {
      // Text phase (7.5-8.5 seconds)
      this.timeline.textPhase = Math.min((elapsed - 7.5) / 1.0, 1.0);
    } else if (elapsed < 10.0) {
      // Slower dispersal phase (8.5-10 seconds)
      this.timeline.dispersalPhase = Math.min((elapsed - 8.5) / 1.5, 1.0);
    } else {
      // Animation complete
      this.timeline.dispersalPhase = 1.0;
      this.onComplete();
    }
  }
  
  // Smooth easing functions for gradual transitions
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  // Even smoother easing for ultra-gradual transitions
  easeInOutQuart(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  }
  
  onComplete() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    // Fade out the entire loading screen
    this.container.style.opacity = '0';
    this.container.style.transition = 'opacity 0.5s ease-out';
    
    setTimeout(() => {
      this.cleanup();
    }, 500);
  }
  
  cleanup() {
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove();
    }
    
    if (this.vaporMaterial) {
      this.vaporMaterial.dispose();
    }
    
    if (this.volumetricMaterial) {
      this.volumetricMaterial.dispose();
    }
    
    if (this.particles && this.particles.geometry) {
      this.particles.geometry.dispose();
    }
    
    // Trigger main content reveal
    const event = new CustomEvent('mysticalLoadingComplete');
    document.dispatchEvent(event);
  }
  
  handleResize() {
    if (this.camera && this.renderer) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }
}

// Initialize the mystical loader
export function initMysticalLoader(container) {
  const loader = new MysticalLoader(container);
  
  // Handle window resize
  window.addEventListener('resize', () => loader.handleResize());
  
  return loader;
}